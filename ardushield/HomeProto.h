
/* 
 * The actual message is 32 bits of data:
 * bits 0-25: the group code - a 26bit number assigned to controllers.
 * bit 26: group flag
 * bit 27: on/off flag
 * bits 28-31: the device code - a 4bit number.
 */

typedef union _homeeasymess {
    uint32_t full;
    struct  {
      unsigned long FillCode   :2;
      unsigned long GroupFlag  :1;
      unsigned long OnoffFlag  :1;
      unsigned long DeviceCode :4;
      unsigned long GroupCode  :8;
    } part;
} ACHOMEEASYMESS;
