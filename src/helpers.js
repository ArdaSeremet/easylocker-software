/* eslint-disable */

import * as CONFIG from "@/./config";

export const handleOpeningDrawer = (relayNumber, cb) => {
    CONFIG.client.setID(1);

    CONFIG.client.writeCoil(CONFIG.OUTPUT_COIL_BASE + parseInt(relayNumber), true)
        .then(() => {
            console.log('Opened solenoid connected to relay number', relayNumber);

            /* Delay a bit, don't overload the bus with many requests. */
            setTimeout(() => {
                cb(null);
            }, 1000);
        }).catch((err) => {
            console.error('Cannot open solenoid connected to relay number', relayNumber, err.message);
            cb(true);
        });


    return true;
}

export const pollSolenoidUntilClosed = (relayNumber, cb, firstTime = true) => {
    CONFIG.client.setID(1);

    CONFIG.client.readCoils(CONFIG.INPUT_COIL_BASE + parseInt(relayNumber), 1)
        .then(data => {
            const state = data.data[0];
            if (state == true) {
                setTimeout(() => {
                    pollSolenoidUntilClosed(relayNumber, cb, false);
                }, 1000);

                console.log("Open. Polling again...");
            } else {
                cb(null, true);
            }
        }).catch((err) => {
            console.error(err.message);
            cb(true, null);
        });

    return true;
}
