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
declare namespace events {
    /**
     * @param loc
     * @param body
     */
    //% block="On a car meets intersection %loc" blockId=on_car_inter
    //% shim=events::onCarInter
    function onCarInter(loc: number, body: () => void): void;

    /**
     * Detect car at inter
     */
    //%
    //% shim=events::detectCarInter
    function detectCarInter(): void;

}
declare namespace intersections {
    /**
     * @param dir
     * @param loc
     */
    //% block="Allow %dir|at intersection %loc" blockId=set_dir_at_inter
    //% shim=intersections::setDirAtInter
    function setDirAtInter(dir: TLDir, loc: number): void;

    /**
     * @param dir
     * @param loc
     */
    //% block="Stop %dir|at intersection %loc" blockId=stop_dir_at_inter
    //% shim=intersections::stopDirAtInter
    function stopDirAtInter(dir: StopDir, loc: number): void;

}
declare namespace status {
    /** 
     * @param loc
     * @param dir
     */
    //% block="Cars waiting for %dir|at intersection %loc" blockId=get_cars_waiting weight=50
    //% shim=status::getCarsWait
    function getCarsWait(dir: TLDir, loc: number): number;

    /**
     * @param loc
     */
    //% block="Direction at intersection %loc" blockId=get_dir weight=40
    //% shim=status::getDirection
    function getDirection(loc: number): number;

    /**
     * @param loc
     */
    //% block="Duration at intersection %loc" blockId=get_duration weight=30
    //% shim=status::getDuration
    function getDuration(loc: number): number;

    /**
     * @param loc
     */
    //% block="%loc" blockId=param_loc weight=20
    //% shim=status::locParam
    function locParam(loc: TLDir): number;

}

// Auto-generated. Do not edit. Really.
