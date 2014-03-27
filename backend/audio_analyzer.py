#!/usr/bin/python

import sys
import numpy as np
from scipy.io.wavfile import read

fname = sys.argv[1]
samprate, wavdata = read(fname)
nchunks = 30*len(wavdata)/samprate
chunks = np.array_split(wavdata, nchunks)
dbs = [20*np.log10(np.sqrt(np.mean(chunk**2))+1) for chunk in chunks]

count = 0
for i in range(nchunks):
    if dbs[i] < 20:
        count = count + 1
    else:
        if count > 30:
            m = (i-count)/1800
            s = ((i-count)/30)%60
            print str(m) + ':' + str(s)
        count = 0
