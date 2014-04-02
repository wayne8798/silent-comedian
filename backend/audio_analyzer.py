#!/usr/bin/python

import sys
import numpy as np
from scipy.io.wavfile import read

fname = sys.argv[1]

samprate, wavdata = read(fname)
# we evaluate the dB level once per minute.
nchunks = len(wavdata) / (samprate * 60)
chunks = np.array_split(wavdata, nchunks)
dbs = [20*np.log10(np.sqrt(np.mean(chunk**2))+1) for chunk in chunks]

print dbs
