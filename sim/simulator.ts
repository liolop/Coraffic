/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

//declaring variable from the js library
declare let ctx: CanvasRenderingContext2D;
declare let car_no: number;
declare let w: number;
declare let h: number;
declare let roads: any;
declare let intersections_arr: any;
declare let cars: any;
declare let drawIntersection: any;

//Test variables
declare let testV:any;
//

declare function distance_check(c1:any, c2:any, axis: string): boolean;
declare function check_inter(c:any, inter:any, axis:string): boolean;
declare function gen_dir(c:any, inter:any): void;
//Test Functions
declare function checkFile(): any;
//
declare function init(): void;
declare function drawscene(): void;
declare function left_greenc(): void;
declare function drive_cars(): any;
declare function drawcar(): any;
declare function intersections(): any;
declare function drawroad(): any;
declare function animloop(): any;
declare function requestAnimFrame(): any;

/**
 * Code
 */
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
        public element : HTMLDivElement;
        public canvas: HTMLCanvasElement;

        constructor() {
            super();
            this.element = <HTMLDivElement><any>document.getElementById('svgcanvas');
            this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName('canvas')[0];
        }

        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            document.body.innerHTML = ''; // clear children
            document.body.appendChild(this.element);

            return Promise.resolve();
        }   

        setTrafficLight(){
          ctx.save();
          ctx.fillStyle = 'green';
          ctx.shadowColor = 'rgba(0,255,0,1)'
          ctx.shadowOffsetX = -2;
          ctx.shadowBlur = 2;
          ctx.fillRect(65,65,6,6);
          ctx.fill();
          ctx.restore();
          ctx.shadowOffsetX = undefined;
          ctx.shadowBlur = undefined;       
        }

        putCarsIn(){
          drawscene();
          //Window.requestAmimFrame();
        }

    }
}