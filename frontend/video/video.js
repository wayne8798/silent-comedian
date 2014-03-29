window.onload = function() {

  //many functions from http://blog.teamtreehouse.com/building-custom-controls-for-html5-videos
  var video = document.getElementById("Video1");
  // Slider for the video progress bar, set max value as the video's duration
  var seekBar = document.getElementById("seek-bar");
  seekBar.max = video.duration;
  document.getElementById("endtime").textContent = timeChange(Math.floor(video.duration), 0);

  //volume and mute
  var volumeBar = document.getElementById("volume-bar");
  var muteButton = document.getElementById("mute");

  // Event listener for the mute button
  muteButton.addEventListener("click", function() {
    if (video.muted == false) {
      // Mute the video
      video.muted = true;
      // Update the button text
      muteButton.innerHTML = "Unmute";
    } else {
      // Unmute the video
      video.muted = false;

      // Update the button text
      muteButton.innerHTML = "Mute";
    }
  });

  // Event listener for the seek bar
  seekBar.addEventListener("change", function() {
    // Update the video time
    video.currentTime = seekBar.value;
  });

  
  // Update the seek bar as the video plays
  video.addEventListener("timeupdate", function() {
    // end at the set endTime
    if (video.currentTime >= video.endtime) {
            video.pause();
        }
    // Update the slider value
    seekBar.value = video.currentTime;
  });

  // Pause the video when the seek handle is being dragged
  seekBar.addEventListener("mousedown", function() {
    video.pause();
  });

  // Play the video when the seek handle is dropped
  seekBar.addEventListener("mouseup", function() {
    video.play();
  });

  // Event listener for the volume bar
  volumeBar.addEventListener("change", function() {
    video.volume = volumeBar.value;
  });
}


function open(path){
  var pathname = path;
  var video = document.getElementsByTagName('video')[0];
  var sources = video.getElementsByTagName('source');
  //add three types of video files
  sources[0].src = pathname + ".ogg";
  sources[1].src = pathname + ".webm";
  sources[2].src = pathname + ".mp4";
  video.load();
}

function setTimeRange(startTime, endTime) {
    var video = document.getElementsByTagName('video')[0];
    var sources = video.getElementsByTagName('source');
    var timeFrame = "#t=" + startTime + "," + endTime;

    //delete the time if it has already been added
    var source1 = sources[0].src.replace(/#t=\d*,\d*/, "");
    var source2 = sources[0].src.replace(/#t=\d*,\d*/, "");
    var source3 = sources[0].src.replace(/#t=\d*,\d*/, "");

    //add the timeframe to the video urls
    sources[0].src = source1 + timeFrame;
    sources[1].src = source2 + timeFrame;
    sources[2].src = source3 + timeFrame;

    //update the time displayed and the progress bar
    document.getElementById("starttime").textContent = timeChange(startTime, 0); 
    document.getElementById("endtime").textContent = timeChange(endTime, 0);
    document.getElementById("seek-bar").min = startTime;
    document.getElementById("seek-bar").max = endTime;
    video.endtime = endTime;
    video.load();
}


function timeChange (time, option){
  //seconds to hh:mm:ss
  if (option == 0){
    var hour = 00;
    var min = 00;
    var sec = 00;
    var totalTime = new Date();

    hour = Math.floor(time / 3600);
    time = time % 3600;
    min = Math.floor(time / 60);
    sec = time % 60; 

    min = checkTime(min);
    sec = checkTime(sec);

    fullTime = hour + ":" + min + ":" + sec;
    return fullTime;

  } else { //hh:mm:ss to seconds
   //parse the time (didn't write it yet)
   return time;
  }

}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function vidplay() {
   var video = document.getElementById("Video1");
   var button = document.getElementById("play");
   var button2 = document.getElementsByClassName("playButton2")[0];

    document.getElementById('Video1').addEventListener('loadedmetadata', function() {
    this.currentTime = 0;
  }, false);

   if (video.paused) {
      video.play();
      button2.textContent = "||";
      button.style.display = "none";
   } else {
      video.pause();
      button2.textContent = ">";
   }

}

  function restart() {
      var video = document.getElementById("Video1");
      video.currentTime = 0;
  }

  function skip(value) {
      var video = document.getElementById("Video1");
      video.currentTime += value;
  }

    