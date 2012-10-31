/*
 * Copyright (c) 2012, Intel Corporation
 * File revision: 16 October 2012
 * Please see http://software.intel.com/html5/license/samples 
 * and the included README.md file for license terms and conditions.
 */


// The watch id references the current `watchHeading`
var watchID = null;

// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);


var rotate_object = null;

// Cordova is ready
//
function onDeviceReady() {
    $('#control').change(function (event) {
        if (event.currentTarget.value == "on")
            startWatch();
        else
            stopWatch();
    }
        );
    $('#freeze').change(function (event) {
        if (event.currentTarget.value == "on")
            startNeedle();
        else
            startCompass();
    }
        );

    rotate_object = document.getElementById('needle');
    rotate_object.type = 1;
    startWatch();
}


// Start watching the compass
//
function startWatch() {

    var options = { frequency: 50 };

    watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    $('#freeze+div').show();
}

// Stop watching the compass
//
function stopWatch() {
    if (watchID) {
        navigator.compass.clearWatch(watchID);
        watchID = null;
        $('#freeze+div').hide();
    }
}


function startNeedle() {
    previous_value = 0;
    previous_sign = 1;
    rotate_object.style['-webkit-transform'] = 'rotate(0deg)';
    rotate_object = document.getElementById('needle');
    rotate_object.type = 1;
}

function startCompass() {
    rotate_object.style['-webkit-transform'] = 'translateX(-12px) rotate(0deg)';
    rotate_object = document.getElementById('compass');
    rotate_object.type = -1;
}


var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
function direction(heading) {
    var dir = Math.abs(parseInt((heading) / 45) + 1);
    return directions[dir];
}

// onSuccess: Get the current heading
//
function onSuccess(heading) {
    var transform = null;
    if (rotate_object.type > 0) {
        transform = ' translateX(-12px) rotate(' + (360 - heading.magneticHeading) + 'deg)';
    }
    else {
        transform = 'rotate(' + -1 * (heading.magneticHeading) + 'deg)';
    }
    rotate_object.style['-webkit-transform'] = transform;
    console.log(rotate_object.style['-webkit-transform']);
    var info = document.getElementById('info-panel');
    info.innerHTML = direction(heading.magneticHeading) + '<br>' + parseInt(heading.magneticHeading) + ' &deg;';
}

// onError: Failed to get the heading
//
function onError(compassError) {
    alert('Compass error: ' + compassError.code);
}
    
