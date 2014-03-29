#!/usr/bin/python

import cv2, sys, operator
from PIL import Image
from collections import defaultdict

# function that finds the primary colors
def find_primary_colors(count):
    im = Image.open("frame%d.jpg" % count)
    by_color = defaultdict(int)
    for pixel in im.getdata():
        by_color[pixel] += 1
    sorted_colors = sorted(by_color.iteritems(), key=operator.itemgetter(1))
    # print out top 5 most frequent colors in the count'th frame.
    print "Frame " + str(count)
    print sorted_colors[-1]
    print sorted_colors[-2]
    print sorted_colors[-3]
    print sorted_colors[-4]
    print sorted_colors[-5]

# takes in two arguments. first is the length of interval in seconds.
# for example, if interval = 60, then the script will extract a frame
# every 60 seconds and find the primary 5 colors in that frame.
# the second argument is the name of the mp4 file.
interval = int(sys.argv[1])
fname = sys.argv[2]

vidcap = cv2.VideoCapture(fname)
# number of frame per second. please note it can be a float number.
frame_rate = vidcap.get(5)
count = 0
frame_count = 0
success = True

while success:
    success, image = vidcap.read()
    if frame_count % (int(frame_rate * interval)) == 0:
        cv2.imwrite("frame%d.jpg" % count, image)
        find_primary_colors(count)
        count += 1
    frame_count += 1
