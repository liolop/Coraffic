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
        public spriteElement: SVGCircleElement;
        public sprite : Sprite;

        /****/
        public car: Car;
        public carElement: SVGPolygonElement;
        /****/

        constructor() {
            super();
            this.element = <SVGSVGElement><any>document.getElementById('svgcanvas');
            this.spriteElement = <SVGCircleElement>this.element.getElementById('svgsprite');
            this.sprite = new Sprite()
            
            /****/
            this.carElement = <SVGPolygonElement>this.element.getElementById('svgcar');
            this.car = new Car();
            /****/

        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            document.body.innerHTML = ''; // clear children
            document.body.appendChild(this.element);

            return Promise.resolve();
        }       
        
        public x: number;
        public y: number;
        updateView() {
            // this.spriteElement.cx.baseVal.value = this.sprite.x;
            // this.spriteElement.cy.baseVal.value = this.sprite.y;

            /****/
            this.carElement.setAttribute("transform","translate("+this.car.x+","+this.car.y+")" );
            /****/
        }

        public lightIcon: SVGPolygonElement;
        updateLight(light: TrafficLight) {
            this.lightIcon = <SVGPolygonElement>this.element.getElementById('lightIcon');

            if(light.lightNum == 0){
                this.lightIcon.setAttribute("points", " "+20+","+5+" "+30+","+15+" "+25+","+15+" "+25+","+35+" "+15+","+35+" "+15+","+15+" "+10+","+15+" ");
                this.lightIcon.setAttribute("transform", "translate("+90+","+90+")");
                this.lightIcon.setAttribute("fill", "green");
            }
            
            document.getElementById('svgcanvas').appendChild(this.lightIcon);
            console.log(document.getElementById('svgcanvas').innerHTML);
        }
    }
}