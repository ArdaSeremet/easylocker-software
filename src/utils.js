const Gpio = window.require('onoff').Gpio;

let ledInterval = null;
let debugLED = new Gpio(22, 'out');
debugLED.writeSync(0);

export const startLEDBlink = () => {
    ledInterval = setInterval(() => {
        debugLED.writeSync(debugLED.readSync() ^ 1);
    }, 1000);
};

export const stopLEDBlink = () => {
    clearInterval(ledInterval);
};