/// <reference path="../libs/core/enums.d.ts"/>


namespace pxsim.loops {

    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever" 
    export function forever(body: RefAction): void {
        thread.forever(body)
    }

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    export function pauseAsync(ms: number) {
        return Promise.delay(ms)
    }
}

function logMsg(m:string) { console.log(m) }

// namespace pxsim.console {
//     /**
//      * Print out message
//      */
//     //% 
//     export function log(msg:string) {
//         logMsg("CONSOLE: " + msg)
//         // why doesn't that work?
//         //board().writeSerial(msg + "\n")
//     }
// }

namespace pxsim.traffics{

    /**
     * @param dir
     * @param loc
     */
    //% block="Allow going %dir|at intersection %loc" blockId=set_light_at_inter
    export function setTLAtInter(dir: TLDir, loc: InterLocation){

    }

    /** 
     * @param loc
     * @param dir
    */
    //% block="Cars going %dir|waiting at intersection %loc" blockId=get_cars_waiting
    export function getCarsWait(dir: TLDir,loc: InterLocation): number{
        return 0;
    }

    /** 
     * @param loc
     * @param dir
    */
    //% block="Current going %dir|duration at intersection %loc" blockId=get_going_duration
    export function getGoingDuration(dir: TLDir, loc: InterLocation): number{
        return 0;
    }

    /** 
     * @param seconds
    */
    //% block="%seconds|(seconds)" blockId=input_seconds
    export function inputSeconds(seconds: number):number{
        return seconds;
    }

    /** 
     * @param carNum
    */
    //% block="%carNum|(cars)" blockId=input_carNum
    export function inputCarNum(carNum: number):number{
        return carNum;
    }

    /** 
     * @param dir
    */
    //% block="Allow %dir" blockId=set_dir
    export function setDir(dir: TLDir){

    }

    /** 
     * @param loc
    */
    //% block="Current direction duration at intersection %loc" blockId=get_dir_duration
    export function getDirDuration(loc: InterLocation): number{
        return 0;
    }



}