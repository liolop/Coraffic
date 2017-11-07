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
declare namespace intersection {
    /**
     * @param loc location index of intersections
     */
    //% block="At intersection %loc" blockId=on_inter
    //% shim=intersection::onInter
    function onInter(loc: InterLocation, body: () => void): void;

    /**
     * @param dir direction of the traffic light
     */
    //% block="Allow %dir" blockId=set_TL_dir
    //% shim=intersection::setTLDir
    function setTLDir(dir: TLDir): void;

    /**
     * @param loc location index of intersections
     */
    //% block="Switch the direction at intersection %loc" blockId=switch_inter_dir
    //% shim=intersection::switchInterDir
    function switchInterDir(loc: InterLocation): void;

    /**
     * @param loc
     */
    //% block="current state duration of %loc" blockId=get_state_duration
    //% shim=intersection::getStateDuration
    function getStateDuration(loc: InterLocation): number;

    /**
     * @param dir
     * @param loc
     */
    //% block="Going %dir|traffic flow at %loc" blockId=get_traffic_flow
    //% shim=intersection::getTrafficFlow
    function getTrafficFlow(dir: TLDir, loc: InterLocation): number;

    /**
     * @param dir
     * @param loc
     */
    //% block="On intersection %loc|allow %dir" blockId=set_light_at_inter
    //% shim=intersection::setTLAtInter
    function setTLAtInter(loc: InterLocation, dir: TLDir): void;

}

// Auto-generated. Do not edit. Really.
