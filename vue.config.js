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
                "productName": "Locker GUI",
                "appId": "com.plushwsw.easylocker",
                "linux": {
                    "executableName": "Locker GUI",
                    "target": {
                        "target": "AppImage",
                        "arch": [
                            "armv7l"
                        ]
                    }
                }
            }
        }
    }
}