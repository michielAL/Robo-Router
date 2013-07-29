rm -f rfreceiver.o rfreceive.o rftransmit.o
rm -f libarduino/RemoteSwitch/RemoteReceiver.o
g++ -c libarduino/RemoteSwitch/RemoteReceiver.cpp -o libarduino/RemoteSwitch/RemoteReceiver.o

g++ -c shieldlib/arduPi.cpp -oarduPi.o
echo "lib building done"
g++ -lrt -lpthread -o rfreceiver.o shieldlib/arduPi.o libarduino/RemoteSwitch/RemoteReceiver.o rf433receive.cpp
echo "build rfreceive done"
g++ -lrt -lpthread -o rftransmit.o shieldlib/arduPi.o  wiringPi/wiringPi/wiringSerial.o rf433transmit.cpp
echo "build rftransmit done"
echo ""
#sudo ./rfreceiver.o

