#include "shieldlib/arduPi.h"
#include "libarduino/RemoteSwitch/RemoteReceiver.h"
#include "message.h"
#include "HomeProto.h"
#include <stdlib.h>
#include <time.h> 

int XFlag = 0;
long in_Msg;
uint16_t crc = 0x0000;
void ACunFold(long unsigned int);
unsigned long last_receivedcode =0;
time_t last_timereceived;
//Callback function is called only when a valid code is received.
void showCode(unsigned long receivedCode, unsigned int period) {
  //Note: interrupts are disabled. You can re-enable them if needed.
   //Print the received code.
  printf("Code: ");
  printf("%x ",receivedCode);
  printf(" | ");
  printf("%d",receivedCode);
  in_Msg = receivedCode;
//  XFlag = 1; // process incoming code
    ACunFold(in_Msg);

}


void setup() {


printf("Remotereceive: \n");
  
  //Initialize receiver on interrupt 0 (= digital pin 2), calls the callback "showCode"
  //after 3 identical codes ave been received in a row. (thus, keep the button pressed
  //for a moment)
  //
  //See the interrupt-parameter of attachInterrupt for possible values (and pins)
  //to connect the receiver.

    RemoteReceiver::init(2, 2,showCode);
   // handle = serialOpen ((char*)"/dev/ttyAMA0", 1200) ;
printf("remote receiver initialised");
}

void loop() {
/*  if (XFlag) {
    XFlag = 0;
    ACunFold(in_Msg);
  }*/
delay(1000);
}

void ACunFold(unsigned long code) {
  ACHOMEEASYMESS Hecode;
  Hecode.full = code;
  //system("cd /home/pi/ardushield/");
  time_t now;
  now =time(NULL);
  if ((difftime(now,last_timereceived)<2.5 && code ==last_receivedcode))
	{return;}//prevent sending the same message multiple times
/*  if (code ==0x76946 ||code ==0x6138E ||code ==0x8030C)
  {
  	printf("\n door 11 \n");
  	system("sudo /home/pi/ardushield/rftransmit.o -a 9.135.101.67.33.0.0.0 -c 17 &");
	last_receivedcode=code;
	last_timereceived=now;
  }
else if (code ==0x76944 ||code ==0x6138C ||code ==0x8030A)
  {
  	printf("\n door 22 \n");  
	system("sudo /home/pi/ardushield/rftransmit.o -a 9.135.101.67.33.0.0.0 -c 34 &");
	last_receivedcode=code;
	last_timereceived=now;

  }
else if (code ==0x76A8A ||code ==0x614D2 ||code ==0x80450)
  {
  	printf("\n door 33 \n");  
 	system("sudo /home/pi/ardushield/rftransmit.o -a 9.135.101.67.33.0.0.0 -c 51 &");
	last_receivedcode=code;
	last_timereceived=now;

  }*/
	char buffer[60];
	int x =sprintf(buffer,"sudo node /home/pi/nodefiles/routing.js -in %x ",code);
	printf("%s \n",buffer);
	system(buffer);

}



int main (){ 
	setup(); 
	while(1){ 
		loop(); 
	} 
	//unistd::sleep();
	return (0); 
}




