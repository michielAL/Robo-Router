sudo pkill nodejs
sudo pkill node
sudo pkill rfreceiver.o
sudo node /home/pi/nodefiles/index.js &
echo node.js server has been started
sudo /home/pi/ardushield/rfreceiver.o &
echo rfreceiver.o has been started
