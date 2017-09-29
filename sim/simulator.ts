/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

namespace pxsim {
    /**
     * This function gets called each time the program restarts
     */
    initCurrentRuntime = () => {
        runtime.board = new Board();
    };

    /**
     * Gets the current 'board', eg. program state.
     */
    export function board() : Board {
        return runtime.board as Board;
    }

    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    export class Board extends pxsim.BaseBoard {
        public element : SVGSVGElement;

        /****/
        public car: Car;
        public carElement: SVGPolygonElement;
        /****/

        constructor() {
            super();
            this.element = <SVGSVGElement><any>document.getElementById('svgcanvas');
            /****/
            this.carElement = <SVGPolygonElement>this.element.getElementById('car');
            /****/

        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            document.body.innerHTML = ''; // clear children
            document.body.appendChild(this.element);

            return Promise.resolve();
        }       

        setCarPos(carPos: CarPos) {
            this.car = initialCar(carPos);
            let angle = this.car.angle;
            let s1x = this.car.x - 10;
            let s2x = this.car.x + 10;
            let s1y = this.car.y - 10;
            let s2y = this.car.y + 10;
            if(carPos==0){
                this.carElement.setAttribute("points",""+s1x+","+s1y+" "+s2x+","+this.car.y+" "+s1x+","+s2y+"");
            }
        }

        public i = 0;
        updateCarPos(x:number, y:number, angle:number){
            if(angle == 90 && y >= 160){
                this.carElement.setAttribute("transform","translate("+0+","+0+") rotate("+90+" "+110+" "+110+")" );                                                
            }
            else if(angle == 90 && y + 20 < 190){
                this.i += 5;
                x = 0;
                y = 110 + this.i;
                this.carElement.setAttribute("transform","translate("+0+","+y+") rotate("+90+" "+110+" "+110+")" );                                
            }
            else{
                this.carElement.setAttribute("transform","translate("+x+","+y+") rotate("+angle+" "+x+" "+y+")" );                
            }
        }

        public lightIcon: SVGPolygonElement;
        updateLight(light: TrafficLight) {
            this.lightIcon = <SVGPolygonElement>this.element.getElementById('lightIcon');
            let a1x = light.x;
            let a2x = light.x+10;
            let a3x = light.x-10;
            let a4x = light.x+5;
            let a5x = light.x-5;
            let a1y = light.y-5;
            let a2y = light.y+15;
            let a3y = light.y-15;
            if(light.lightNum == 0){
                this.lightIcon.setAttribute("points", " "+110+","+125+" "+100+","+115+" "+105+","+115+" "+105+","+95+" "+115+","+95+" "+115+","+115+" "+120+","+115+" ");
                //this.lightIcon.setAttribute("points", " "+a1x+","+a3y+" "+a2x+","+a1y+" "+a4x+","+a1y+" "+a4x+","+a2y+" "+a5x+","+a2y+" "+a5x+","+a1y+" "+a3x+","+a1y+" ");
                this.lightIcon.setAttribute("fill", "green");
            }

            document.getElementById('svgcanvas').appendChild(this.lightIcon);
            //console.log(document.getElementById('svgcanvas').innerHTML);
        }
    }
}