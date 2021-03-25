/* eslint-disable */

const mysql = window.require('mysql');
const SerialPort = window.require('serialport');
const Readline = SerialPort.parsers.Readline;
let ModbusRTU = window.require("modbus-serial");

const { options } = require('./options.js');
const utils = require('./utils.js');

export const OUTPUT_COIL_BASE = 100;
export const INPUT_COIL_BASE = 120;
export const INFRARED_COIL_BASE = 140;

export let client = new ModbusRTU();
export let LOCKER_ID = 0;

utils.startLEDBlink();

export const postData = (url = '', data = {}, cb) => {
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data
    })
        .then(res => res.json())
        .then(result => {
            cb(result)
            return true
        });

    return true;
};

export const db = mysql.createConnection({
    host: options.dbConfiguration.dbHost,
    user: options.dbConfiguration.dbUser,
    password: options.dbConfiguration.dbPass,
    database: options.dbConfiguration.dbName
});

db.connect(err => {
    if (err) throw err;
    console.log('Database Connection Successful!');

    db.query(`SELECT id FROM lockers WHERE unique_hardware_id = ?`,
        [options.uniqueSystemId],
        (err, res) => {
            if (err) return;

            if (res == null || res == undefined || res.length <= 0) {
                console.error('This locker is not defined in the database, please check the uniqueSystemId key in options file.');
                return;
            }

            LOCKER_ID = res[0].id;

            console.log("Got the Locker ID", LOCKER_ID);
        });
});

export const serial = new SerialPort(options.serialPorts.barcodeReader.port, {
    baudRate: options.serialPorts.barcodeReader.baudRate
});
export const serialParser = serial.pipe(new Readline({ delimiter: '\r' }));

client.connectRTUBuffered(options.serialPorts.modbusIOControl.port, {
    baudRate: options.serialPorts.modbusIOControl.baudRate,
    rtscts: true
});

client.setTimeout(2000);
client.on("error", function (error) {
    console.error("SerialPort Error: ", error);
});