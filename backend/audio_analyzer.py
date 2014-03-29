#!/usr/bin/python

import sys
import numpy as np
from scipy.io.wavfile import read

def output(i, count):
    start_m = (i-count)/1800
    start_s = ((i-count)/30)%60
    end_m = i/1800
    end_s = (i/30)%60
    print str(start_m) + ':' + str(start_s) + ' to ' +\
        str(end_m) + ':' + str(end_s)

db_lvl = int(sys.argv[1])
fname = sys.argv[2]

samprate, wavdata = read(fname)
nchunks = 30*len(wavdata)/samprate
chunks = np.array_split(wavdata, nchunks)
dbs = [20*np.log10(np.sqrt(np.mean(chunk**2))+1) for chunk in chunks]

count = 0
for i in range(nchunks):
    if dbs[i] < db_lvl:
        count = count + 1
    else:
        if count > 30:
            output(i, count)
        count = 0

if count > 30:
    output(nchunks-1, count)
