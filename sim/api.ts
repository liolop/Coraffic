/// <reference path="../libs/core/enums.d.ts"/>

namespace pxsim.turtle {
    /**
     * Moves the sprite forward
     * @param steps number of steps to move, eg: 1
     */
    //% weight=90
    //% block
    export function forwardAsync(steps: number) {
        return board().car.forwardAsync(steps);
        //return board().sprite.forwardAsync(steps)
    }

    /**
     * Moves the sprite forward
     * @param direction the direction to turn, eg: Direction.Left
     * @param angle degrees to turn, eg:90
     */
    //% weight=85
    //% blockId=sampleTurn block="turn %direction|by %angle degrees"
    export function turnAsync(direction: Direction, angle: number) {
        let b = board();
        console.log("turn.direction: "+Direction.Left);
        if (direction == Direction.Left)
            b.sprite.angle -= angle;
        else
            b.sprite.angle += angle;
        return Promise.delay(400)
    }

}

namespace pxsim.actions {
    /**
     * Run the car
     */
    //% weight=90
    //% block
    export function runAsync(){
        return board().car.runAsync();
    }
}

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

namespace pxsim.console {
    /**
     * Print out message
     */
    //% 
    export function log(msg:string) {
        logMsg("CONSOLE: " + msg);
        // why doesn't that work?
        board().writeSerial(msg + "\n");
    }
}

namespace pxsim {
    /**
     * A ghost on the screen.
     */
    //%
    export class Sprite {
        /**
         * The X-coordiante
         */
        //%
        public x = 100;
         /**
         * The Y-coordiante
         */
        //%
        public y = 100;
        public angle = 90;
        
        constructor() {
        }
        
        private foobar() {}

        /**
         * Move the thing forward
         */
        //%
        // public forwardAsync(steps: number) {
        //     let deg = this.angle / 180 * Math.PI;
        //     this.x += Math.cos(deg) * steps * 10;
        //     this.y += Math.sin(deg) * steps * 10;
        //     board().updateView();
        //     return Promise.delay(400)
        // }
    }

    //%
    export class Car{
        //%
        public x = 0;
        //%
        public y = 0;
        public angle = 90;
        constructor(){

        }
        //%
        public forwardAsync(steps: number){
            this.x = this.x+steps;
            if(this.x >=190){
                this.x = 0;
            }
            board().updateView();
            return Promise.delay(400)
        }
        //%
        public runAsync(){
            this.x = this.x+10;
            if(this.x >=190){
                this.x = 0;
            }
            if()
            board().updateView();
            return Promise.delay(400)
        }
    }

    //%
    export class TrafficLight{
        //%
        public x = 0;
        public y = 0;
        public lightNum = 1;
        public direct: ColorDirect = null;
        
        constructor(direction: ColorDirect){
            if(direction == ColorDirect.Left){
                this.lightNum = 0;
                this.direct = direction;
            }
        }
        public setBlock(){
            return;
        }
    }
}

namespace pxsim.objects{
    //% block
    export function createCar(): Car{
        return new Car();
    }
    /**
     * @param direct
    */
    //% block="Create Traffic Light %direct" blockId=device_trafficLight
    export function createTrafficLight(direct: ColorDirect){
        let light = new TrafficLight(direct);
        board().updateLight(light);
        return light.setBlock();
    }
}

namespace pxsim.sprites {
    /**
     * Creates a new sprite
     */
    //% block
    export function createSprite(): Sprite {
        return new Sprite();
    }
    

}