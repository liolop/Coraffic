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
declare namespace trafficControl {
    /**
     * @param dir
     * @param loc
     */
    //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter
    //% shim=trafficControl::setDirAtInter
    function setDirAtInter(dir: TLDir, loc: number): void;

    /**
     * @param dir
     * @param loc
     */
    //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter
    //% shim=trafficControl::stopDirAtInter
    function stopDirAtInter(dir: StopDir, loc: number): void;

}
declare namespace trafficVariables {
    /** 
     * @param loc
     * @param dir
     */
    //% block="Number of cars wait for %dir|at intersection %loc" blockId=get_cars_waiting
    //% shim=trafficVariables::getCarsWait
    function getCarsWait(dir: TLDir, loc: number): number;

    /** 
     * @param seconds
     */
    //% block="%seconds|(seconds)" blockId=input_seconds
    //% shim=trafficVariables::inputSeconds
    function inputSeconds(seconds: number): number;

    /** 
     * @param carNum
     */
    //% block="%carNum|(cars)" blockId=input_carNum
    //% shim=trafficVariables::inputCarNum
    function inputCarNum(carNum: number): number;

    /**
     * @param loc
     */
    //% block="Current direction at intersection %loc" blockId=get_dir
    //% shim=trafficVariables::getDirection
    function getDirection(loc: number): number;

    /**
     * @param loc
     */
    //% block="Duration of intersection %loc" blockId=get_duration
    //% shim=trafficVariables::getDuration
    function getDuration(loc: number): number;

    /**
     * @param loc
     */
    //% block="%loc" blockId=param_loc
    //% shim=trafficVariables::locParam
    function locParam(loc: TLDir): number;

}

// Auto-generated. Do not edit. Really.
