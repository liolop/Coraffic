// Auto-generated from simulator. Do not edit.
declare namespace loops {
    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever"
    //% shim=loops::forever
    function forever(body: () => void): void;

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    //% shim=loops::pauseAsync promise
    function pause(ms: number): void;

}
declare namespace traffics {
    /**
     * @param dir
     * @param loc
     */
    //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter
    //% shim=traffics::setDirAtInter
    function setDirAtInter(dir: TLDir, loc: number): void;

    /** 
     * @param loc
     * @param dir
     */
    //% block="Number of cars going %dir|waiting at intersection %loc" blockId=get_cars_waiting
    //% shim=traffics::getCarsWait
    function getCarsWait(dir: TLDir, loc: number): number;

    // /** 
    //  * @param loc
    //  * @param dir
    // */
    // //% block="Current allowed %dir|duration at intersection %loc" blockId=get_going_duration
    // export function getGoingDuration(dir: TLDir, loc: number): number{
    //     console.log("time: "+board().getDirDuration(dir, loc));
    //     return board().getDirDuration(dir, loc);
    // }
    /**
     * @param dir
     * @param loc
     */
    //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter
    //% shim=traffics::stopDirAtInter
    function stopDirAtInter(dir: StopDir, loc: number): void;

    /** 
     * @param seconds
     */
    //% block="%seconds|(seconds)" blockId=input_seconds
    //% shim=traffics::inputSeconds
    function inputSeconds(seconds: number): number;

    /** 
     * @param carNum
     */
    //% block="%carNum|(cars)" blockId=input_carNum
    //% shim=traffics::inputCarNum
    function inputCarNum(carNum: number): number;

}

// Auto-generated. Do not edit. Really.
