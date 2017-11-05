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
declare namespace console {
    /**
     * Print out message
     */
    //%
    //% shim=console::log
    function log(msg: string): void;

}
declare namespace actions {
    /**
     * @param loc
     */
    //% blockId=set_light block="set traffic light at %loc" 
    //% blockGap=8 weight=54
    //% shim=actions::setUpLight
    function setUpLight(loc: TLLocation, body: () => void): void;

    /**
     * @param dir
     * @param color
     */
    //% block="set %dir|%color" blockId="set_dir_color"
    //% shim=actions::setDirColor
    function setDirColor(dir: TLDir, color: LightColor): void;

}

// Auto-generated. Do not edit. Really.
