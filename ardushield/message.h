#ifndef MESSAGE_H
#define MESSAGE_H

typedef struct
{
  uint8_t	        message_header;
  uint16_t       	timestamp;
  uint8_t       	message_type;
  uint8_t               message_length;
  uint8_t*	        message;
  uint8_t               dirty_bit;
  uint16_t		CRC;
  
  uint8_t               received_from; // router received message over media type
} Message;

#endif
