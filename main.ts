/*
Copyright (C): 2010-2019, DXXZ Tech
modified from LZD
*/

//% color=#ec924d weight=25 icon="\uf09e"
//% blockId="BTRemote" block="蓝牙遥控器"
namespace BTRemote {

    export enum GetKey {
        //% blockId="LeftForward" block="左前进"
        LeftForward = 1,
        //% blockId="LeftBackward" block="左后退"
        LeftBackward = 2,
        //% blockId="RightForward" block="右前进"
        RightForward = 3,
        //% blockId="RightBackward" block="右后退"
        RightBackward = 4,
        //% blockId="LeftRotation" block="左旋"
        LeftRotation = 5,
        //% blockId="RightRotation" block="右旋"
        RightRotation = 6,
        //% blockId="LeftTranslation" block="左平移"
        LeftTranslation = 7,
        //% blockId="RightTranslation" block="右平移"
        RightTranslation = 8
    }
    export enum GetKeyState {
        //% blockId="Press" block="按下"
        Press = 1,
        //% blockId="Release" block="松开"
        Release = 0
    }
    export enum GetMotorKey {
        //% blockId="Motor1" block="电机1"
        Motor1 = 1,
        //% blockId="Motor2" block="电机2"
        Motor2 = 2,
        //% blockId="Motor3" block="电机3"
        Motor3 = 3,
        //% blockId="Motor4" block="电机4"
        Motor4 = 4
    }
    export enum GetMotorState {
        //% blockId="Stop" block="松开"
        Stop = 0,
        //% blockId="Forward" block="正转"
        Forward = 1,
        //% blockId="Backward" block="反转"
        Backward = 2
    }
    export enum GetButtonKey {
        //% blockId="Button1" block="按键1"
        Button1 = 1,
        //% blockId="Button2" block="按键2"
        Button2 = 2,
        //% blockId="Button3" block="按键3"
        Button3 = 3
    }
    export enum GetButtonState {
        //% blockId="Press" block="按下"
        Press = 1,
        //% blockId="Release" block="松开"
        Release = 0
    }

    //% blockId= BTRemoteControl_init block="初始化蓝牙遥控器引脚RX | %txpin | TX | %rxpin "
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
    //% blockId= BTRemoteControl_data block="接收遥控器数据"
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

    //% blockId= BluetoothCar_uart block="小车| %keynum | %state "
    //% weight=15
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothCar(keynum: GetKey, state: GetKeyState): boolean {
        return ReBTdata == (100 + keynum * 10 + state)
    }

    //% blockId= BluetoothMotor_uart block="电机| %motorkeynum | %motorstate "
    //% weight=10
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothMotor(motorkeynum: GetMotorKey, motorstate: GetMotorState): boolean {
        return ReBTdata == (200 + motorkeynum * 10 + motorstate)
    }

    //% blockId= BluetoothButton_uart block="按键| %buttonkeynum | %buttonstate "
    //% weight=5
    //% angle.min=0 angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=20
    export function uartBluetoothButton(buttonkeynum: GetButtonKey, buttonstate: GetButtonState): boolean {
        return ReBTdata == (300 + buttonkeynum * 10 + buttonstate)
    }
}
