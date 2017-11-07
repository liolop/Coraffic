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

namespace pxsim.intersection{
    
    class parameters{
        public interLoc: InterLocation;
        constructor(){

        }
    }
    var param = new parameters();

    /**
     * @param loc location index of intersections
     */
    //% block="At intersection %loc" blockId=on_inter
    export function onInter(loc: InterLocation, body: RefAction){
        console.log("1");
        param.interLoc = loc;
    }

    /**
     * @param dir direction of the traffic light
     */
    //% block="Allow %dir" blockId=set_TL_dir
    export function setTLDir(dir: TLDir){
        if(param.interLoc == 0){
            console.log("A1");
        }
    }

    /**
     * @param loc location index of intersections
     */
    //% block="Switch the direction at intersection %loc" blockId=switch_inter_dir
    export function switchInterDir(loc: InterLocation){

    }

    /**
     * @param loc
     */
    //% block="current state duration of %loc" blockId=get_state_duration
    export function getStateDuration(loc: InterLocation): number {
        return 1;
    }

    /**
     * @param dir
     * @param loc
     */
    //% block="Going %dir|traffic flow at %loc" blockId=get_traffic_flow
    export function getTrafficFlow(dir: TLDir, loc: InterLocation): number{
        return 1;
    }

    /**
     * @param dir
     * @param loc
     */
    //% block="On intersection %loc|allow %dir" blockId=set_light_at_inter
    export function setTLAtInter(loc: InterLocation, dir: TLDir){

    }
}