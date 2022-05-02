basic.forever(function () {
    serial.writeLine("" + (SI1151.readInfraRed()))
    serial.writeLine("" + (SI1151.readLight()))
    serial.writeLine("" + (SI1151.readUltraVioletIndex()))
    basic.pause(500)
})
