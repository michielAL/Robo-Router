#/bin/bash
cd /home/pi/nodefiles/HTML/images/foto
LAST=`exec ls $MY_DIR | sed 's/\([0-9]\+\).*/\1/g' | sort -n | tail -1`
echo $LAST
number=$LAST
name=$( printf "%d_image.jpg" $((1+number)))
printf "%s" $name
mv ../image.jpg $name
cd ..
raspistill -t 0 -o image.jpg
