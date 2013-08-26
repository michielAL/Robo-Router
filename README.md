Robo-Router
===========

Robo-Router v2

place ardushield/ and nodefiles/ 	in /home/Pi/
place startRR.sh 			in /home/pi/
place RoboRouter_bootup			in /etc/init.d/
and add RoboRouter_bootup to the bootup scripts useing "sudo update-rc.d RoboRouter_bootup defaults"
replace /boot/cmdline.txt with cmdline.txt


instal packages node, hostapd, webmin and iptables 
sudo apt-get update
sudo apt-get install <package> 

node = node.js webserver
hostapd = wifi network
iptables = NAT(Network addres translation) and firewall
webmin = tool for configuring iptables
sqlite3 = database
