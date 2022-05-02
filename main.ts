/**
 * SI1151 block
 */
//%color=#444444 icon="\uf185" block="SI1151"
namespace SI1151 {
    let SI1151_I2C_ADDR = 0x53

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(SI1151_I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(SI1151_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SI1151_I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getInt8LE(reg: number): number {
        pins.i2cWriteNumber(SI1151_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SI1151_I2C_ADDR, NumberFormat.Int8LE);
    }

    function getUInt16LE(reg: number): number {
        pins.i2cWriteNumber(SI1151_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SI1151_I2C_ADDR, NumberFormat.UInt16LE);
    }

    function getInt16LE(reg: number): number {
        pins.i2cWriteNumber(SI1151_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(SI1151_I2C_ADDR, NumberFormat.Int16LE);
    }

    function writeParam(p: number, v: number) {
        setreg(0x17, v)
        setreg(0x18, p | 0xA0)

        return getreg(0x2E);
    }

    function reset(): void {
        setreg(0x08, 0x00)
        setreg(0x09, 0x00)
        setreg(0x04, 0x00)
        setreg(0x05, 0x00)
        setreg(0x06, 0x00)
        setreg(0x03, 0x00)
        setreg(0x21, 0xFF)

        setreg(0x18, 0x01)
        basic.pause(10)
        setreg(0x07, 0x17)
        basic.pause(10)
    }

    function begin(): void {
        reset()

        // enable UVindex measurement coefficients!
        setreg(0x13, 0x29);  //0x7B
        setreg(0x14, 0x89);  //0x6B
        setreg(0x15, 0x02);  //0x01
        setreg(0x16, 0x00);  //0x00

        // enable UV sensor
        writeParam(0x01, 0x80 | 0x20 | 0x10);
        // enable interrupt on every sample
        setreg(0x03, 0x01);
        setreg(0x04, 0x01);


        /************************/

        // measurement rate for auto
        setreg(0x08, 0xFF); // 255 * 31.25uS = 8ms

        // auto run
        setreg(0x18, 0x0F);
    }

    begin()

    /**
     * Ultra Violet Index
    */
    //% block="Show ultraviolet index"
    //% weight=74 blockGap=8
    //% blockId=read_UltraVioletIndex
    export function readUltraVioletIndex(): number {
        return (getUInt16LE(0x2C)/100)
    }

    /**
     *  Light Intensity
    */
    //% block="Show light intensity"
    //% weight=74 blockGap=8
    //% blockId=read_Light
    export function readLight(): number {
        return getUInt16LE(0x22)
    }

    /**
     *  Infra Red Intensity
    */
    //% block="Show infrared intensity"
    //% weight=74 blockGap=8
    //% blockId=read_InfraRed
    export function readInfraRed(): number {
        return getUInt16LE(0x24)
    }
} 
