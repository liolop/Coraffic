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

namespace pxsim.events{
    /**
     * @param loc
     * @param body
     */
    //% block="On a car meets intersection %loc" blockId=on_car_inter
    export function onCarInter(loc: number, body: RefAction){
        board().bus.listen("loc",loc,body);
    }

    /**
     * Detect car at inter
     */
    //%
    export function detectCarInter(){
        for(var i = 0; i<board().intersections_arr.length;i++){        
            var loc: number = board().checkInterLoc(i);
            board().bus.queue("loc",loc);
        }
    }
}

namespace pxsim.intersections{

    /**
     * @param dir
     * @param loc
     */
    //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter
    export function setDirAtInter(dir: TLDir, loc: number){
        board().setDirAtInter(dir, loc);
    }

    /**
     * @param dir
     * @param loc
     */
    //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter
    export function stopDirAtInter(dir: StopDir, loc: number){
        return board().StopDirAtInter(dir, loc);
    }
}

namespace pxsim.status{
    /** 
     * @param loc
     * @param dir
    */
    //% block="Cars waiting for %dir|at intersection %loc" blockId=get_cars_waiting weight=50
    export function getCarsWait(dir: TLDir,loc: number): number{
        return board().getCarsWait(dir, loc);
    }

    /**
     * @param loc
     */
    //% block="Direction at intersection %loc" blockId=get_dir weight=40
    export function getDirection(loc: number): number{
        return board().getDirection(loc);
    }

    /**
     * @param loc
     */
    //% block="Duration at intersection %loc" blockId=get_duration weight=30
    export function getDuration(loc: number): number{
        return board().getDuration(loc);
    }

    /**
     * @param loc
     */
    //% block="%loc" blockId=param_loc weight=20
    export function locParam(loc: TLDir): number{
        if(loc == 0){
            return 0;
        }
        else{
            return 1;
        }
    }
}