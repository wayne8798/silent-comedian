#!/usr/bin/python

import cv2, sys, operator,os
from PIL import Image
from collections import defaultdict

totalTime = 0
totalPix = 0
color_array = []
ratio_array = []
db_array = []
moviename = "thering.mp4"
# function that finds the primary colors
def find_primary_colors(count):
    im = Image.open(newdir +"/frame%d.jpg" % count)
    (width, height) = im.size
    totalPix = width * height
    by_color = defaultdict(int)
    for pixel in im.getdata():
        by_color[pixel] += 1
    sorted_colors = sorted(by_color.iteritems(), key=operator.itemgetter(1))
    # print out top 5 most frequent colors in the count'th frame.
   # print>>f, "Frame " + str(count)
    print>>f, sorted_colors[-1][0]
    print>>f2, float(sorted_colors[-1][1])/totalPix
    if len(sorted_colors) == 1:
        print>>f, sorted_colors[-1][0]
        print>>f2, float(sorted_colors[-1][1])/totalPix
        print>>f, sorted_colors[-1][0]
        print>>f2, float(sorted_colors[-1][1])/totalPix
        print>>f, sorted_colors[-1][0]
        print>>f2, float(sorted_colors[-1][1])/totalPix
        print>>f, sorted_colors[-1][0]
        print>>f2, float(sorted_colors[-1][1])/totalPix
    if len(sorted_colors) > 1:
        print>>f, sorted_colors[-2][0]
        print>>f2, float(sorted_colors[-2][1])/totalPix
    if len(sorted_colors) > 2:
        print>>f, sorted_colors[-3][0]
        print>>f2, float(sorted_colors[-3][1])/totalPix
    if len(sorted_colors) > 3:
        print>>f, sorted_colors[-4][0]
        print>>f2, float(sorted_colors[-4][1])/totalPix
    if len(sorted_colors) > 4:
        print>>f, sorted_colors[-5][0]
        print>>f2, float(sorted_colors[-5][1])/totalPix

# takes in two arguments. first is the length of interval in seconds.
# for example, if interval = 60, then the script will extract a frame
# every 60 seconds and find the primary 5 colors in that frame.
# the second argument is the name of the mp4 file.
interval = int(30)
#moviename = "thering.mp4"
newdir = moviename.replace(".mp4", "")
vidcap = cv2.VideoCapture(moviename)
f2 = open("ratios.txt", 'w')
f = open("colors.txt", 'w')
# number of frame per second. please note it can be a float number.
frame_rate = vidcap.get(5)
count = 0
frame_count = 0
success = True
if not os.path.exists(newdir):
    os.makedirs(newdir)
while success:
    success, image = vidcap.read()
    if frame_count % (int(frame_rate * interval)) == 0:
        cv2.imwrite(newdir + "/frame%d.jpg" % count, image)
        find_primary_colors(count)
        count += 1
    frame_count += 1
f.close()
