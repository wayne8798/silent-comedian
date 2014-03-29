#!/usr/bin/python

import sys
import numpy as np
from scipy.io.wavfile import read

# outputs information about silent clips
def output(i, count):
    start_m = ( i - count ) / 1800
    start_s = (( i - count ) / 30 ) % 60
    end_m = i / 1800
    end_s = ( i / 30 ) % 60
    print str(start_m) + ':' + str(start_s) + ' to ' +\
        str(end_m) + ':' + str(end_s)

# takes in two arguments. the first is the dB level. sound below this level
# will be considered as silent. the second is the input WAV file name.
db_lvl = int(sys.argv[1])
fname = sys.argv[2]

samprate, wavdata = read(fname)
# for each second, we evaluate the dB level 30 times.
nchunks = 30 * len(wavdata) / samprate
chunks = np.array_split(wavdata, nchunks)
dbs = [20*np.log10(np.sqrt(np.mean(chunk**2))+1) for chunk in chunks]

count = 0
for i in range(nchunks):
    if dbs[i] < db_lvl:
        count = count + 1
    else:
        # if the clip has been silent for longer than 1 sec, outputs
        # the starting and ending time.
        if count > 30:
            output(i, count)
        count = 0

if count > 30:
    output(nchunks-1, count)
