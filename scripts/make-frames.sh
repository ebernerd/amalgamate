#!/bin/bash
VIDEOS_DIR=$(pwd)
OUT_DIR=$VIDEOS_DIR/frames

# for f in $VIDEOS_DIR/$BODY_SEG/*; do ffmpeg -i $f -vf "select=eq(n\,0)" -q:v 3 ${f%%}.jpg; done
fBaseName=""
rm -rf $OUT_DIR
mkdir $OUT_DIR
for f in $VIDEOS_DIR/*.mp4; do
	fBaseName=$(basename ${f%.*})
	echo "Making frame $fBaseName"
	ffmpeg -i $f -vf "select=eq(n\,0)" -q:v 3 $OUT_DIR/$fBaseName.png
done