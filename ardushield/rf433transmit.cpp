#include "shieldlib/arduPi.h"
#include "message.h"
#include <wiringSerial.h>
#include <string>
 
//using System;
 using namespace std;
//namespace Ascended.System
int XFlag = 0;
long in_Msg;
uint16_t crc = 0x0000;
//string hex = "0123456789ABCDEF";
int handle; //serial

void crc_ccitt_init(void);
uint16_t crc_ccitt_crc(void);
void crc_ccitt_update(uint8_t );
void crc_ccitt_update(uint16_t );
void printMsg(Message* );
void addTestNormalMsg(char );

void setup() {
 printf("Remotetransmit: \n");
 handle = serialOpen ((char*)"/dev/ttyAMA0", 1200) ;
}

void addTestNormalMsg(char command,uint8_t* address)
{
  Message msg;

  crc_ccitt_init();
  crc_ccitt_update(msg.message_header = 0xA5);

  msg.timestamp = 0xFFFF;
  crc_ccitt_update(msg.timestamp = 0xFFFF);
// crc_ccitt_update(0xFF);
  crc_ccitt_update(msg.message_type = 0x03);
  crc_ccitt_update(msg.message_length = 0x09);
 //free(msg.message);
  msg.message = (uint8_t*)malloc(msg.message_length);
  crc_ccitt_update(msg.message[0] = address[0]);
  crc_ccitt_update(msg.message[1] = address[1]);
  crc_ccitt_update(msg.message[2] = address[2]);
  crc_ccitt_update(msg.message[3] = address[3]);
  crc_ccitt_update(msg.message[4] = address[4]);
  crc_ccitt_update(msg.message[5] = address[5]);
  crc_ccitt_update(msg.message[6] = address[6]);
  crc_ccitt_update(msg.message[7] = address[7]);
  crc_ccitt_update(msg.message[8] = command);
  crc_ccitt_update(msg.dirty_bit = 0x00);


  msg.CRC = crc_ccitt_crc(); 

  printMsg(&msg);
 // printMsg(&msg);
free(msg.message);

}


void printMsg(Message* msg)
{

serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,0xAA);
serialPutchar(handle,msg->message_header);
serialPutchar(handle,(msg->timestamp>>8)&0xFF);
serialPutchar(handle,msg->timestamp&0xFF);
serialPutchar(handle,msg->message_type);
serialPutchar(handle,msg->message_length);
 for(int i = 0; i < msg->message_length; i++)
serialPutchar(handle,msg->message[i]);
serialPutchar(handle,msg->dirty_bit);

serialPutchar(handle,(msg->CRC)>>8);
serialPutchar(handle,(msg->CRC&0xFF));

  printf("%x",msg->message_header);
  printf("%x",msg->timestamp);
  printf("%x",msg->message_type);
  printf("%x",msg->message_length );
  for(int i = 0; i < msg->message_length; i++)
    printf("%x",msg->message[i]);
  printf("%x",msg->dirty_bit);
  printf("%x",msg->CRC);
printf(" printf \n");

}


void crc_ccitt_init(void)
{
  crc = 0xffff;
}
void crc_ccitt_update(uint16_t x)
{
crc_ccitt_update((uint8_t)((x>>8)&0xFF));
crc_ccitt_update((uint8_t)(x & 0xFF));
}
void crc_ccitt_update(uint8_t x)
{
  uint16_t crc_new = (uint8_t)(crc >> 8) | (crc << 8);
  crc_new ^= x;
  crc_new ^= (uint8_t)(crc_new & 0xff) >> 4;
  crc_new ^= crc_new << 12;
  crc_new ^= (crc_new & 0xff) << 5;
  crc = crc_new;
}
uint16_t crc_ccitt_crc(void)
{
  return crc;
}

int main (int argc, char* argv[]){
	setup(); 
	uint8_t command=0x11;
char* char_command;
	uint8_t address[8]={0,0,0,0,0,0,0,0};
	for (int i=1;i<argc-1;i++)
	{
//	printf("arg %s ",argv[i]);
		if (strcmp(argv[i] ,"-c")==0)
		{
			command=atoi(argv[i+1]);
			char_command=(argv[i+1]);
			//printf("com %x \n",command);
		}
		if (strcmp(argv[i],"-a")==0)
		{
			char* parts =strtok((argv[i+1]),".:;,");
			int j=0;
			while(parts)
			{
			address[j]=atoi(parts);
			//printf("addr %d  %x \n",j,address[j]);
			j++;
			parts =strtok(NULL,".;:,");
			}
			if (j!=8)
			{
			//	printf("ERROR invalid adress\n");
				exit(303);
			}
		}
	}
/*	char buffer[50];
	int x =sprintf (buffer, "node /home/pi/nodefiles/SendSense.js -id 322838 -d %d &", command);
	printf("%s \n",buffer);
	system(buffer);*/
	addTestNormalMsg(command,address);

	return (0); 
}


