/*
 * RemoteSwitch library v2.3.0 DEV made by Randy Simons http://randysimons.nl/
 * See RemoteReceiver.h for details.
 *
 * License: GPLv3. See license.txt
 */

/*#ifndef PinChangeInt_h
        #include "../PinChangeInt/PinChangeInt.h"
#endif/**/
#include "RemoteReceiver.h"
#include "../../shieldlib/arduPi.h"


/************
* RemoteReceiver
************/

unsigned short RemoteReceiver::_interrupt;
volatile unsigned short RemoteReceiver::_state;
unsigned short RemoteReceiver::_minRepeats;
RemoteReceiverCallBack RemoteReceiver::_callback;
bool RemoteReceiver::_inCallback = false;
bool RemoteReceiver::_enabled = false;

double get_time()
{
    struct timeval t;
    gettimeofday(&t, NULL);
    double d = t.tv_sec + (double) t.tv_usec/1000000;
    ////printf("time %f \n",d);
    return d;
}


void RemoteReceiver::init(short interrupt, unsigned short minRepeats, RemoteReceiverCallBack callback) {
	//printf("init \n");
	_interrupt = interrupt;
	_minRepeats = minRepeats;
	_callback = callback;

	enable();
	if (_interrupt >= 0) {
		pinMode(_interrupt, INPUT);
		//digitalWrite(_interrupt, HIGH);
		/*PCintPort::/**/attachInterrupt(_interrupt, &interruptHandler, BOTH);
	}
}

void RemoteReceiver::enable() {
	//printf("enable \n");
	_state = -1;
	_enabled = true;
}

void RemoteReceiver::disable() {
	//printf("disable \n");
	_enabled = false;
}

void RemoteReceiver::deinit() {
//printf("deinit \n");
	_enabled = false;
	if (_interrupt >= 0) {
		/*PCintPort::/**/detachInterrupt(_interrupt);
	}
}

void RemoteReceiver::interruptHandler() {
////printf("interruptHandler \n");

	if (!_enabled) {
		return;
	}
//printf("S%d ",(int)_state);
	static  double period;				// Calculated duration of 1 period
	static unsigned short receivedBit;		// Contains "bit" currently receiving
	static unsigned long receivedCode;		// Contains received code
	static unsigned long previousCode;		// Contains previous received code
	static unsigned short repeats = 0;		// The number of times the an identical code is received in a row.
//	static unsigned long edgeTimeStamp[3] = {0, };	// Timestamp of edges
	static  double edgeTimeStamp[3] = {0,0, };	// Timestamp of edges
	static  double min1Period, max1Period, min3Period, max3Period;
	static bool skip;

	// Filter out too short pulses. This method works as a low pass filter.
	edgeTimeStamp[1] = edgeTimeStamp[2];
//	edgeTimeStamp[2] = micros();
	edgeTimeStamp[2] = (get_time());
////printf("edge %f\n",edgeTimeStamp[2]);
	if (skip) {
		skip = false;
		return;
//printf("skip \n");
	}

	if (_state >= 0 && ((edgeTimeStamp[2]-edgeTimeStamp[1])) < min1Period) {
		// Last edge was too s1hort.
		// Skip this edge, and the next too.
		skip = true;
		return;
	}

	long double duration = (edgeTimeStamp[1] - edgeTimeStamp[0]);
////printf(" duration %f %f %f ",edgeTimeStamp[1],edgeTimeStamp[0],duration);
	edgeTimeStamp[0] = edgeTimeStamp[1];
////printf(" edgeTimeStamp 0 %f",edgeTimeStamp[0]);
	if(edgeTimeStamp[1]==duration)
	{
		//printf("edgeTimeStamp[1]==duration");
		return;
	}

	// Note that if state>=0, duration is always >= 1 period.
////printf("_state %x", (int)_state);
	if (_state==0xFFFF) { // Waiting for sync-signal
	////printf(" state == -1 ");
		if (duration>0.003720&&duration<0.1) { // =31*120 minimal time between two edges before decoding starts.
			// Sync signal received.. Preparing for decoding
			period=duration/31;
			receivedCode=previousCode=repeats=0;
////printf("period %d, duration %d ",period,duration);
			// Allow for large error-margin. ElCheapo-hardware :(
			min1Period=period*0.4; // Avoid floating point math; saves memory.
			max1Period=period*1.6;
			min3Period=period*2.3;
			max3Period=period*3.7;

		}
		else {
			//printf("return ");
			return;
		}
	} else if (_state < 48) { // Decoding message
		////printf(" state<48 ");

		receivedBit <<= 1;

		// bit part durations can ONLY be 1 or 3 periods.
		if (duration>=min1Period &&duration<=max1Period) {
			receivedBit &= 0x0E; // Clear LSB of receivedBit
			////printf(" clear lsb ");
		}
		else if (duration>=min3Period && duration<=max3Period) {
			////printf(" set lsb ");
			receivedBit |= 1; // Set LSB of receivedBit
		}
		else { // Otherwise the entire sequence is invalid
			_state=-1;
			////printf(" state to -1 ");
			return;
		}

		if ((_state%4)==3) { // Last bit part?
			// Shift
			receivedCode*=3;
			// Only 4 LSB's are used; trim the rest.
			////printf(" switch %x ",(receivedBit & 0x0f));
			switch (receivedBit & 0x0F) {
				case 0x05: // short long short long == B0101
					// bit "0" received
					receivedCode+=0; // I hope the optimizer handles this ;)
					break;
				case 0x0a: // long short long short == B1010
					// bit "1" received
					receivedCode+=1;
					break;
				case 0x06: // short long long short
					// bit "f" received
					receivedCode+=2;
					break;
				default:
					// Bit was rubbish. Abort.
					//printf(" Bit was rubbish. Abort.");
					_state=-1;
					return;
			}
		}
	} else if (_state==48) { // Waiting for sync bit part 1
		// Must be 1 period.
		////printf(" state = 48");
		if (duration>max1Period) {
			_state=-1;
			return;
		}
	} else { // Waiting for sync bit part 2
		// Must be 31 periods.
		////printf(" ELSE line 168 " );
		if (duration<period*25 || duration>period*36) {
		  _state=-1;
		  return;
		}

		// receivedCode is a valid code!

		if (receivedCode!=previousCode) {
			repeats=0;
			previousCode=receivedCode;
		}

		repeats++;

		if (repeats>=_minRepeats) {
			if (!_inCallback) {
				_inCallback = true;
				(_callback)(receivedCode, period);
				_inCallback = false;
			}
			// Reset after callback.
			_state=-1;
			return;
		}

		// Reset for next round
		receivedCode = 0;
		_state=0; // no need to wait for another sync-bit!
		//printf(" return state=0 ");
		return;
	}
//printf("state ++");
	_state++;
	return;
}

bool RemoteReceiver::isReceiving(int waitMillis) {
//printf("isReceiving \n");
	//unsigned long startTime=millis();
	long double startTime=get_time()*1000;

	int waited; // Signed int!
	do {
		if (_state == 48) { // Abort if a valid code has been received in the mean time
//printf("###\n %f \n %f \n%d \n ***",startTime,get_time(),waitMillis);
			return true;
		}
		waited = ((get_time()*1000)-startTime);
	} while(waited>=0 && waited <= waitMillis); // Yes, clock wraps every 50 days. And then you'd have to wait for a looooong time.
//printf("###\n %f \n %f \n%d \n ***",startTime,get_time(),waitMillis);
	return false;
}

