// Auto-generated from simulator. Do not edit.
declare namespace actions {
    /**
     * Run the car
     */
    //% weight=55
    //% blockId=device_run block="run the car"
    //% shim=actions::runAsync promise
    function run(): void;

}
declare namespace console {
    /**
     * Print out message
     */
    //%
    //% shim=console::log
    function log(msg: string): void;

}
declare namespace loops {
    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever"
    //% shim=loops::forever
    function forever(body: () => void): void;

}
    /**
     * A Car
     */
    //%
    declare class Car {
        //%
        //% shim=.x
        public x: number;

        //%
        //% shim=.y
        public y: number;

        //%
        //% shim=.angle
        public angle: number;

    }
    //%
    declare class TrafficLight {
        //%
        //% shim=.x
        public x: number;

        //%
        //% shim=.y
        public y: number;

        //%
        //% shim=.lightNum
        public lightNum: number;

        //%
        //% shim=.direct
        public direct: ColorDirect;

    }
declare namespace objects {
    /**
     * @param position
     */
    //% block="Create Car at %position" blockId=device_CarPosition
    //% shim=objects::createCar
    function createCar(position: CarPos): void;

    /**
     * @param lightPos
     * @param lightDir
     * @param direct
     */
    //% block="Create Traffic Light at %lightPos | face %lightDir | with %direct light" blockId=device_LightPos
    //% shim=objects::createTrafficLightPos
    function createTrafficLightPos(lightPos: LightPos, lightDir: LightDir, direct: ColorDirect): void;

}

// Auto-generated. Do not edit. Really.
