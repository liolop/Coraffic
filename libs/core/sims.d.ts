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
    //% block="Number of cars wait for %dir|at intersection %loc" blockId=get_cars_waiting
    //% shim=traffics::getCarsWait
    function getCarsWait(dir: TLDir, loc: number): number;

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

    /**
     * @param loc
     */
    //% block="Current direction at intersection %loc" blockId=get_dir
    //% shim=traffics::getDirection
    function getDirection(loc: number): number;

    /**
     * @param loc
     */
    //% block="Duration of intersection %loc" blockId=get_duration
    //% shim=traffics::getDuration
    function getDuration(loc: number): number;

    /**
     * @param loc
     */
    //% block="%loc" blockId=param_loc
    //% shim=traffics::locParam
    function locParam(loc: TLDir): number;

}

// Auto-generated. Do not edit. Really.
