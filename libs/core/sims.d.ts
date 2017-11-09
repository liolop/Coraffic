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
     * @param loc
     */
    //% block="Current direction duration of %loc" blockId=get_state_duration
    //% shim=traffics::getStateDuration
    function getStateDuration(loc: InterLocation): number;

    /**
     * @param loc
     */
    //% block="Number of cars waiting at %loc" blockId=get_traffic_flow
    //% shim=traffics::getTrafficFlow
    function getTrafficFlow(loc: InterLocation): number;

    /**
     * @param dir
     * @param loc
     */
    //% block="Allow going %dir|at intersection %loc" blockId=set_light_at_inter
    //% shim=traffics::setTLAtInter
    function setTLAtInter(dir: TLDir, loc: InterLocation): void;

    /** 
     * @param loc
     */
    //% block="Cars waiting at intersection %loc" blockId=get_cars_waiting
    //% shim=traffics::getCarsWait
    function getCarsWait(loc: InterLocation): number;

    /** 
     * @param loc
     */
    //% block="Current going North-South duration at intersection %loc" blockId=get_NS_duration
    //% shim=traffics::getNSDuration
    function getNSDuration(loc: InterLocation): number;

    /** 
     * @param loc
     */
    //% block="Current going East-West duration at intersection %loc" blockId=get_EW_duration
    //% shim=traffics::getEWDuration
    function getEWDuration(loc: InterLocation): number;

    /** 
     * @param seconds
     */
    //% block="%seconds| (seconds)" blockId=input_seconds
    //% shim=traffics::inputSeconds
    function inputSeconds(seconds: number): number;

}

// Auto-generated. Do not edit. Really.
