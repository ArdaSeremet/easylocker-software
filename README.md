
# EasyLocker GUI Software for SBC Computers  

## Project Initialization

```
npm install
npm rebuild
npm install
```

  

### Starting a development server to experiment

```
npm run electron:serve
```

  

### Compile the application for ARMv7L Architecture

```
npm run electron:build -- --dir --linux --armv7l
```

The compiled executable can be found at `./dist_electron/linux-armv7l-unpacked/LockerGUI`.