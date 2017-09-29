/// <reference path="../libs/core/enums.d.ts"/>

namespace pxsim.actions {
    /**
     * Run the car
     */
    //% weight=55
    //% blockId=device_run block="run the car"
    export function runAsync(){
        return board().car.runAsync();
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

namespace pxsim.loops {

    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever" 
    export function forever(body: RefAction){
        thread.forever(body)
    }
}

namespace pxsim {
    /**
     * A Car
     */
    //%
    export class Car{
        //%
        public x = 0;
        //%
        public y = 0;
        //%
        public angle = 0;

        public carPosTemp: CarPos = null;
        constructor(carPosition: CarPos){
            this.carPosTemp = carPosition;
            if(carPosition == CarPos.a1){
                this.x = 20;
                this.y = 110;
                this.angle = 0;
            }
        }

        public runAsync(){
            if(this.angle == 0){
                this.x = this.x + 5;
                this.y = 0;
            }
            if(this.angle == 90){
                this.x = 0;
                this.y = this.y + 5;
            }
            if(this.x + 20 >= 190 && this.angle == 0){
                this.angle = 0;
                this.x = 20;
                this.y = 110;
            }
            if(this.x + 20 == 110 && this.angle == 0){
                this.angle = 90;
                this.x = 0; 
            }
            board().updateCarPos(this.x,this.y,this.angle);
            return Promise.delay(400)
        }
    }
    export function initialCar(position: CarPos): Car{
        return new Car(position);
    }

    //%
    export class TrafficLight{
        //%
        public x = 0;
        //%
        public y = 0;
        //%
        public lightNum: number;
        public lightDirNum: number;
        //%
        public direct: ColorDirect;
        public lightPosTemp: LightPos;
        public lightDirTemp: LightDir;
        
        constructor(lightPos: LightPos, lightDir: LightDir, direction: ColorDirect){
            if(lightPos == LightPos.A1){
                this.x = 110;
                this.y = 110;
                this.lightPosTemp = lightPos;
            }
            if(lightDir == LightDir.Left){
                this.lightDirNum = 0;
                this.lightDirTemp = lightDir;
            }
            if(direction == ColorDirect.Right){
                this.lightNum = 0;
                this.direct = direction;
            }
        }
    }

}

namespace pxsim.objects{
    /**
     * @param position
     */
    //% block="Create Car at %position" blockId=device_CarPosition
    export function createCar(position: CarPos){
        board().setCarPos(position);
    }

    /**
     * @param lightPos
     * @param lightDir
     * @param direct
     */
    //% block="Create Traffic Light at %lightPos | face %lightDir | with %direct light" blockId=device_LightPos
    export function createTrafficLightPos(lightPos: LightPos, lightDir: LightDir, direct: ColorDirect){
        let light = new TrafficLight(lightPos, lightDir, direct);
        board().updateLight(light);
    }
}
