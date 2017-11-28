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
    //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter
    export function setDirAtInter(dir: TLDir, loc: number){
        board().setDirAtInter(dir, loc);
    }

    /** 
     * @param loc
     * @param dir
    */
    //% block="Number of cars wait for %dir|at intersection %loc" blockId=get_cars_waiting
    export function getCarsWait(dir: TLDir,loc: number): number{
        return board().getCarsWait(dir, loc);
    }

    /**
     * @param dir
     * @param loc
     */
    //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter
    export function stopDirAtInter(dir: StopDir, loc: number){
        return board().StopDirAtInter(dir, loc);
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
     * @param loc
     */
    //% block="Current direction at intersection %loc" blockId=get_dir
    export function getDirection(loc: number): number{
        return board().getDirection(loc);
    }

    /**
     * @param loc
     */
    //% block="Duration of intersection %loc" blockId=get_duration
    export function getDuration(loc: number): number{
        return board().getDuration(loc);
    }

    /**
     * @param loc
     */
    //% block="%loc" blockId=param_loc
    export function locParam(loc: TLDir): number{
        if(loc == 0){
            return 0;
        }
        else{
            return 1;
        }
    }
}