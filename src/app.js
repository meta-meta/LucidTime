var UI = require('ui');
var Vector2 = require('vector2');
var Wakeup = require('wakeup');
var Vibe = require('ui/vibe');
var Light = require('ui/light');

Wakeup.launch(function(e) {
    if(e.wakeup) {
        // Ask the user if they are dreaming
        realityCheck();            
    } else {
        // App was launched manually. Configure
        appConfig();
    }   
});

function getConfig() {
    return JSON.parse(localStorage.getItem('config')) || {
        freq: 43,
        freqTemp: 43 
    };
}

function saveConfig(config) {
    localStorage.setItem('config', JSON.stringify(config));
}

function scheduleNextRealityCheck(freq) {   
    Wakeup.cancel('all');
    Wakeup.schedule({
        time: Date.now() / 1000 + freq * 60
    }, function(e) {
       if(e.failed) {
           // TODO: handle this
       } 
    });
}

function appConfig() {
    var config = getConfig();
    if(!config.freqTemp) {
        config.freqTemp = 43;
    }

    var w = new UI.Window({
        fullscreen: true
    });
    
    w.on('hide', function() {
        scheduleNextRealityCheck(config.freq);
        saveConfig(config);
    });

    function msg(n) {
        return 'Check reality every ' + n + ' mins.';
    }
    
    // 144 x 168 resolution
    
    var m = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(124, 168),
        font: 'bitham-30-black',
        text: msg(config.freq),
        textAlign: 'left'
    });
    
    var up = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: '+',
        textAlign: 'right'
    });

    var dn = new UI.Text({
        position: new Vector2(0, 148),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: '-',
        textAlign: 'right'
    });
    
    var sleep = new UI.Text({
        position: new Vector2(0, 70),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: '8hr',
        textAlign: 'right'
    });
    
    w.on('click', 'up', function() {
        inc(1);
    });
    
    w.on('longClick', 'up', function() {
        inc(30);
    });
    
    w.on('click', 'down', function() {
        dec(1);
    });
    
    w.on('longClick', 'down', function() {
        dec(20);
    });
    
    function inc(n) {
        var f = Math.min(1440, config.freq + n);
        config.freq = f;
        m.text(msg(f));
    }
    
    function dec(n) {
        var f = Math.max(2, config.freq - n);
        config.freq = f;
        m.text(msg(f));
    }   
    
    w.on('click', 'select', function() {
        config.freqTemp = config.freq;
        config.freq = 480;
        w.hide();
    });
    
    w.add(m);
    w.add(up);
    w.add(dn);
    w.add(sleep);
    w.show();
}

function realityCheck() {
    var config = getConfig();
    console.log(config);
    if(config.freq == 480) {
        config.freq = config.freqTemp;        
    }
    
    var w = new UI.Window({
        fullscreen: true
    });
    
    w.on('hide', function() {
        scheduleNextRealityCheck(config.freq);
        saveConfig(config);
    });    

    var q = new UI.Text({
        position: new Vector2(0, 30),
        size: new Vector2(144, 100),
        font: 'bitham-30-black',
        text: 'Is this a dream?',
        textAlign: 'left'
    });

    //var r = Math.floor(Math.random() * 2);

    var yes = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: 'YES',
        textAlign: 'right'
    });

    var no = new UI.Text({
        position: new Vector2(0, 148),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: 'NO',
        textAlign: 'right'
    });
    
    w.on('click', 'down', function() {
        w.hide();
    });

    w.add(q);
    w.add(yes);
    w.add(no);
    w.show();
    
    Light.trigger();
    Vibe.vibrate('long');
}