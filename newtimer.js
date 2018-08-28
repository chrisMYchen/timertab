const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

$(function () {
    var tz = moment.tz.guess();
    var dateObj = moment().tz(tz);
    var month = dateObj.month(); //months from 1-12    
    var day = dateObj.date();
    var year = dateObj.year();
    $("#month").text(monthNames[month]);
    $("#day").text(day + '.');


    chrome.storage.sync.get(['mission'], function (result) {
        var missionText = result.mission;
        if (missionText != null) {
            document.getElementById('mission').value = missionText;
        }
    });

    chrome.storage.sync.get(['task'], function (result) {
        var text = result.task;
        if (text != null) {
            document.getElementById('task').value = text;
        }
    });

    chrome.storage.sync.get(['taskTimerDate'], function (result) {
        var taskTimerDate = result.taskTimerDate;
        var date = moment(taskTimerDate);
        console.log('retrieved!', taskTimerDate);
        if (taskTimerDate != null) {
            console.log('0');
            var $taskTimerDate = $('#taskTimerDate');
            $($taskTimerDate).countdown(date.toDate());
        }
    });

    chrome.storage.sync.get(['longTimerTitle'], function (result) {
        var longTimerTitle = result.longTimerTitle;
        if (longTimerTitle != null) {
            $('#longTimerTitle').text(longTimerTitle);
        }
    });

    chrome.storage.sync.get(['longTimerDate'], function (result) {
        var longTimerDate = result.longTimerDate;
        console.log('retrieved!', longTimerDate);
        if (longTimerDate != null) {
            console.log('0');
            var $date = $('#longTimerDate');
            $($date).countdown(longTimerDate);
        }
    });
});

$("#task-form").submit(function (event) {
    event.preventDefault();
    var mins = $('#task-form :input[name=time]').val();
    console.log(mins);
    var tz = moment.tz.guess();
    var d1 = moment().tz(tz);
    d2 = moment(d1).add(mins, 'minutes');
    var date = d2.toDate();
    var dateString = date.toString()
    console.log(date);
    chrome.storage.sync.set({'taskTimerDate': dateString }, () => {
        if (mins != null) {
            console.log(mins);
            var $taskTimerDate = $('#taskTimerDate');
            $($taskTimerDate).countdown(date);
        }
    });
})
$("#config").submit(function (event) {
    console.log("ok config submit");
    event.preventDefault();
    var $inputs = $('#config :input');
    $inputs.each(function () {
        var val = $(this).val();
        var name = this.name;
        console.log(name, val);
        chrome.storage.sync.set({ [name]: val }, () => {
            console.log(name);
            if (name == 'longTimerDate') {
                if (val != null) {
                    $longTimerDate = $('#longTimerDate');
                    $($longTimerDate).countdown(val);
                }
            }
            if (name == 'longTimerTitle') {
                if (val != null) {
                    $('#longTimerTitle').text(val);
                }
            }
        });
    });
})

$("#mission").change(function () {
    var missionText = this.value;
    chrome.storage.sync.set({ 'mission': missionText }, function () {
        console.log('set mission to ' + missionText);
    });
});

$("#task").change(function () {
    var text = this.value;
    chrome.storage.sync.set({ 'task': text }, function () {
        console.log('set task to ' + text);
    });
});

$('[data-countdown]').each(function () {
    var $this = $(this), finalDate = $(this).data('countdown');
    $this.countdown(finalDate, function (event) {
        $this.html(event.strftime('%D d %H h %M m %S s'));
    }).on('finish.countdown', function(event){
        $(this).html('END').parent().addClass('disabled');
    });
});
