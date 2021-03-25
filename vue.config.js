module.exports = {
    pluginOptions: {
        electronBuilder: {
            externals: [
                'serialport',
                'onoff',
                'modbus-serial',
                'mysql'
            ],
            builderOptions: {
                "productName": "LockerGUI",
		"compression": "normal",
                "appId": "com.plushwsw.easylocker",
                "linux": {
                    "executableName": "LockerGUI",
                    "target": {
                        "target": "AppImage",
                        "arch": [
                            "armv7l"
                        ]
                    }, "compression": "normal"
                }
            }
        }
    }
}
