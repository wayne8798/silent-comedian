#!/usr/bin/python

import cv2, sys, operator,os
from PIL import Image
from collections import defaultdict
import sys
import numpy as np
from scipy.io.wavfile import read
from itertools import izip

totalTime = 0
totalPix = 0
db_array = []
moviename = "montypython.mp4"
audioname = "montypython.wav"
newdir = moviename.replace(".mp4", "")
    # takes in two arguments. the first is the dB level. sound below this level
# will be considered as silent. the second is the input WAV file name.
db_lvl = int(30)
#audioname = "thering.wav"
samprate, wavdata = read(audioname)
# for each second, we evaluate the dB level 30 times.
nchunks = 30 * len(wavdata) / samprate
chunks = np.array_split(wavdata, nchunks)
dbs = [20*np.log10(np.sqrt(np.mean(chunk**2))+1) for chunk in chunks]
count = 0
dbtotal = 0
countchunk = 0
#f = open("sound.txt", 'w')
for i in range(nchunks):
    count = count + 1
    if np.isnan(dbs[i]) == False:
        dbtotal += dbs[i]
        if count > (30 * 30):
            countchunk+= 1
            dbtotal = dbtotal / (30*30)
            db_array.append(dbtotal)
            count = 0
            dbtotal = 0
countchunk+= 1
db_array.append(dbtotal/count)
totalTime = nchunks/30
#f.close()


tempstuff = -1
start = 0
end = 30
i = 0
f = open(newdir+'.js','w')
newimg = 0 #this tells us if we are done looking at one image
print>>f, "var {0} = {{".format(newdir)
print>>f, "\"totalTime\": {0}, ".format(totalTime)
print>>f, "\"videoPath\": \"{0}\", ".format(moviename)
print>>f, "\"movieTitle\": \"{0}\", ".format(newdir)
print>>f, "\"bars\": ["
nonblank = 0
with open('colors.txt') as numlines:
    for line in numlines:
       if line.strip():
          nonblank += 1
#for stuff in range(len(color_array)):
file1 = open(newdir+"/colors.txt")
file2 = open(newdir+"/ratios.txt")
for lineA, lineB in izip(file1, file2):
    lineA = lineA.replace("\n", "")
    line = lineB.replace("\n", "")
    framenum = int(i/5)
    print i
    if(newimg == 0):
        print>>f, "\
        {{\n\
            \"startTime\": {3},\n\
            \"endTime\": {2},\n\
            \"imagePath\": \"{1}\",\n\
            \"dB\": {0},\n\
            \"colors\":[".format(db_array[int((i)/5)], newdir + "/frame" + str(framenum) + ".jpg", end, start) #
        start += 30
        end += 30
    else:
        print>>f, ",\n",
    print>>f, "\
                {{\n\
                    \"color\": \"rgb{0}\",\n\
                    \"ratio\": {1}\n\
                }}".format(lineA, lineB),
    i += 1
    newimg+=1
    if(newimg == 5):
        if i != nonblank:
            print>>f, "\n\
            ]\n\
        },"
        newimg = 0
print>>f, "\n\
            ]\n\
        }\n\
    ]\n\
};"
f.close()
file1.close()
file2.close()

input("prompt: ")
