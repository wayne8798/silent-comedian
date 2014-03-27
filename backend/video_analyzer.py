#!/usr/bin/python

import cv2, sys

fname = sys.argv[1]

vidcap = cv2.VideoCapture(fname)
success, image = vidcap.read()
count = 0
while success:
    success, image = vidcap.read()
    cv2.imwrite("frame%d.jpg" % count, image)
    count += 1
    if count > 100:
        break
