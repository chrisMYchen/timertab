
  
  var timeinterval;

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function initializeClock(id, endtime) {
    chrome.storage.sync.set({'endTime': Date.parse(endtime)}, function() {
        console.log('endTime value set to ' + Date.parse(endtime));
    });

    function updateClockInner() {
      var t = getTimeRemaining(endtime);
      updateClock(id, t);
    }

    timeinterval = setInterval(updateClockInner, 10);
  }

  function initializeMiniClock(id, endtime) {
    // chrome.storage.sync.set({'endTimeMini': Date.parse(endtime), function() {
    //   console.log('miniendtime set to ' + Date.parse(endtime));
    // }});
    function updateClockInner() {
      var millis = endtime - new Date();
      var days = millis / (1000*60*60*24);
      updateMiniClock(id, days);
    }
    minitimeinterval = setInterval(updateClockInner,10);
  }

  function updateMiniClock(id, days) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var decimalSpan = clock.querySelector('.decimal');
    if (days <= 0) {
      clearInterval(timeinterval);
      // var audio = new Audio('tuturu_1.mp3');
      // audio.play();
      daysSpan.innerHTML = '0';
      decimalSpan.innerHTML = '00000000000';
    }
    else {
      daysSpan.innerHTML = days.toFixed(0);
      decimalSpan.innerHTML = (days+"").split(".")[1].padEnd(15, "0").substring(0,15);
    }
  }

  function updateClock(id, t) {
    var clock = document.getElementById(id);
    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');
    if (t.total <= 0) {
      clearInterval(timeinterval);
      var audio = new Audio('tuturu_1.mp3');
      audio.play();
      daysSpan.innerHTML = '0';
      hoursSpan.innerHTML = '0';
      minutesSpan.innerHTML = '0';
      secondsSpan.innerHTML = '0';
    }
    else {
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
      minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
      secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    }
  }


  document.addEventListener('DOMContentLoaded', function () {
    //test sound to get audio playing
    var audio = new Audio('silence.mp3');
    audio.play();
    chrome.storage.sync.get(['taskName'], function(result) {
        if (result.taskName != null) {
            var s = document.getElementById("taskname");
            s.innerHTML = result.taskName; 
        }   
    });
    chrome.storage.sync.get(['endTime'], function(result) {
        var currTimeDiff = result.endTime - Date.parse(new Date());
        if (result.endTime != null && currTimeDiff >= 0) {
            initializeClock('clockdiv', new Date(result.endTime));
        }
    });

    initializeMiniClock("miniclock", new Date('May 23, 2018 23:59:00'));

    chrome.storage.sync.get(['mission'], function(result) {
      var missionText = result.mission;
      if (missionText != null) {
        document.getElementById('mission').value = missionText;
      }
    });
    if (chrome.runtime.lastError) {
        var deadline = new Date(Date.parse(new Date()));
        initializeClock('clockdiv', deadline);
    }
    var form = document.getElementById('form');
    form.onsubmit = function(e) {
        e.preventDefault();
        var minutes = document.getElementById("minutes").value;
        var taskname = document.getElementById("tasktext").value;
        var s = document.getElementById("taskname");
        s.innerHTML = taskname;
        chrome.storage.sync.set({'taskName': taskname}, function() {
            console.log('taskName value set to ' + taskname);
        });
        var newdeadline = new Date(Date.parse(new Date()) + 1000 * 60 *  parseInt(minutes));
        clearInterval(timeinterval);
        initializeClock('clockdiv', newdeadline);
    }

    mission.addEventListener("input", function (e) {
      var missionText = this.value;
      chrome.storage.sync.set({'mission': missionText}, function() {
        console.log('set mission to ' + missionText);
      });

      var classname = "hasText";
      if (this.value == "") {
        this.classList.remove(classname);
      }
      else {
        if (!this.classList.contains(classname)) {
          this.classList.add(classname);
        }
      }
    });

  });
