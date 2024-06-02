/*
Copyright (C): 2010-2019, DXXZ Tech
modified from LZD
*/

//% color=#ec924d weight=25 icon="\uf09e"
namespace BTRemote {

    export enum GetKey {
        //% blockId="LeftForward" block="LeftForward"
        LeftForward = 1,
        //% blockId="LeftBackward" block="LeftBackward"
        LeftBackward = 2,
        //% blockId="RightForward" block="RightForward"
        RightForward = 3,
        //% blockId="RightBackward" block="RightBackward"
        RightBackward = 4,
        //% blockId="LeftRotation" block="LeftRotation"
        LeftRotation = 5,
        //% blockId="RightRotation" block="RightRotation"
        RightRotation = 6,
        //% blockId="LeftTranslation" block="LeftTranslation"
        LeftTranslation = 7,
        //% blockId="RightTranslation" block="RightTranslation"
        RightTranslation = 8
    }
    export enum GetKeyState {
        //% blockId="Press" block="Press"
        Press = 1,
        //% blockId="Release" block="Release"
        Release = 0
    }
    export enum GetMotorKey {
        //% blockId="Motor1" block="Motor1"
        Motor1 = 1,
        //% blockId="Motor2" block="Motor2"
        Motor2 = 2,
        //% blockId="Motor3" block="Motor3"
        Motor3 = 3,
        //% blockId="Motor4" block="Motor4"
        Motor4 = 4
    }
    export enum GetMotorState {
        //% blockId="Stop" block="Stop"
        Stop = 0,
        //% blockId="Forward" block="Forward"
        Forward = 1,
        //% blockId="Backward" block="Backward"
        Backward = 2
    }
    export enum GetButtonKey {
        //% blockId="Button1" block="Button1"
        Button1 = 1,
        //% blockId="Button2" block="Button2"
        Button2 = 2,
        //% blockId="Button3" block="Button3"
        Button3 = 3
    }
    export enum GetButtonState {
        //% blockId="Press" block="Press"
        Press = 1,
        //% blockId="Release" block="Release"
        Release = 0
    }

    //% blockId= BTRemoteControl_init block="Bluetooth Remote Control Uart Init at pin RX| %txpin TX| %rxpin"
    //% weight=25
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function initBluetoothLib(txpin: SerialPin, rxpin: SerialPin): void {
        serial.redirect(
            txpin,
            rxpin,
            BaudRate.BaudRate115200
        )
        basic.pause(1000)
    }
    let ReBTdata = 0
    //% blockId= BTRemoteControl_data block="Receive Remote Control Data"
    //% weight=20
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function dataBluetoothLib(): void {
        let cmd_BTdata: Buffer = null
        let BTdata = [0]
        cmd_BTdata = serial.readBuffer(0)
        for (let i = 0; i < 7; i++) {
            BTdata[i] = cmd_BTdata.getNumber(NumberFormat.Int8LE, i)
        }
        if (BTdata[0] == 0x24) {
            if (BTdata[1] == 0x23) {
                ReBTdata = (BTdata[3] - 0x30) * 100 + (BTdata[4] - 0x30) * 10 + (BTdata[5] - 0x30)
            }
        }
    }

    //% blockId= BluetoothCar_uart block="Control Car| %keynum | %state "
    //% weight=15
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothCar(keynum: GetKey, state: GetKeyState): boolean {
        return ReBTdata == (100 + keynum * 10 + state)
    }

    //% blockId= BluetoothMotor_uart block="Control Motor| %motorkeynum | %motorstate "
    //% weight=10
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothMotor(motorkeynum: GetMotorKey, motorstate: GetMotorState): boolean {
        return ReBTdata == (200 + motorkeynum * 10 + motorstate)
    }

    //% blockId= BluetoothButton_uart block="Control Button| %buttonkeynum | %buttonstate "
    //% weight=5
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothButton(buttonkeynum: GetButtonKey, buttonstate: GetButtonState): boolean {
        return ReBTdata == (300 + buttonkeynum * 10 + buttonstate)
    }
}
