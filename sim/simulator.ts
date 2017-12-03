/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
declare interface  CanvasRenderingContext2D {
  fillRect(x:any,y:any,w:any,h:any) : void;
}

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
  export class Board extends pxsim.CoreBoard {
    public svgDiv: HTMLDivElement;
    public canvas: HTMLCanvasElement;
    public scriptSim: HTMLScriptElement;
    public slow: HTMLInputElement;
    public fast: HTMLInputElement;
    public car_no: number;
    public ratio: HTMLSpanElement;
    public canvas_width: number = 370;
    public canvas_height: number = 670;
    public roads: any[];
    public cars: any[];
    public intersections_arr: any[];
    public tMap: jsLib.tMap;
    public ctx: CanvasRenderingContext2D;
    public intersection_waits_NS: any[][] = new Array(8);
    public intersection_waits_EW: any[][] = new Array(8);
    constructor() {
      super();
      this.svgDiv = <HTMLDivElement><any>document.getElementById("svgcanvas");
      this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName("canvas")[0];
      this.scriptSim = <HTMLScriptElement><any>document.getElementById("js3");
      this.ratio = <HTMLSpanElement><any>document.getElementById("ratio");
      this.slow = <HTMLInputElement><any>document.getElementById("slow");
      this.fast = <HTMLInputElement><any>document.getElementById("fast");
      this.ctx = this.canvas.getContext("2d");
      this.car_no = 15, this.canvas_width = 370, this.canvas_height = 670;
      this.roads = [], this.cars = [], this.intersections_arr = [];
      this.tMap = new jsLib.tMap(this); 
      this.intersection_waits_NS[0] = new Array(null, 2);
      this.intersection_waits_NS[1] = new Array(null, 3);
      this.intersection_waits_NS[2] = new Array(0, 4);
      this.intersection_waits_NS[3] = new Array(1, 5);
      this.intersection_waits_NS[4] = new Array(2, 6);
      this.intersection_waits_NS[5] = new Array(3, 7);
      this.intersection_waits_NS[6] = new Array(4, null);
      this.intersection_waits_NS[7] = new Array(5, null);
      this.intersection_waits_EW[0] = new Array(null, 1);
      this.intersection_waits_EW[1] = new Array(0, null);
      this.intersection_waits_EW[2] = new Array(null, 3);
      this.intersection_waits_EW[3] = new Array(2, null);
      this.intersection_waits_EW[4] = new Array(4, 5);
      this.intersection_waits_EW[5] = new Array(4, null);
      this.intersection_waits_EW[6] = new Array(null, 7);
      this.intersection_waits_EW[7] = new Array(6, null);
    }

    initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
      document.body.innerHTML = ''; // clear children
      this.svgDiv.appendChild(this.canvas);        
      document.body.appendChild(this.svgDiv);      
      document.body.appendChild(this.scriptSim);
      this.tMap.init();             
      this.tMap.animloop();
      return Promise.resolve();
    }   

    setDirAtInter(dir: TLDir, loc: number){
      //North-South
      if(dir == 0){
        this.intersections_arr[loc].NS = true;
        this.intersections_arr[loc].EW = false;
        this.intersections_arr[loc].startTime = new Date().getTime();        
        
      }
      //East-West
      else if(dir == 1){
        this.intersections_arr[loc].EW = true;
        this.intersections_arr[loc].NS = false;  
        this.intersections_arr[loc].startTime = new Date().getTime();                
      }
    }

    getCarsWait(dir: TLDir, loc: number): number{
      // this.cars.forEach(element => {
      //   console.log(element.x + " " + element.y);
      // });

      if(dir == 0){
        var fitered_cars: any[] = [];
        for (var i = 0; i < this.cars.length; i++) {
          if (this.cars[i].d == "n" || this.cars[i].d == "s") {
            if (Math.abs(this.intersections_arr[loc].x - this.cars[i].x) < 40) {
              if (this.intersection_waits_NS[loc][0] == null) {
                if (this.cars[i].y <= this.intersections_arr[this.intersection_waits_NS[loc][1]].y) {
                  fitered_cars.push(this.cars[i]);
                }
              } else if (this.intersection_waits_NS[loc][1] == null) {
                if (this.cars[i].y >= this.intersections_arr[this.intersection_waits_NS[loc][0]].y) {
                  fitered_cars.push(this.cars[i]);
                }
              } else {
                if (this.cars[i].y >= this.intersections_arr[this.intersection_waits_NS[loc][0]].y && this.cars[i].y <= this.intersections_arr[this.intersection_waits_NS[loc][1]].y) {
                  fitered_cars.push(this.cars[i]);
                }
              }
            }
          }
        }
        return fitered_cars.length;
      }
      else if(dir == 1){
        var fitered_cars = [];
        for (var i = 0; i < this.cars.length; i++) {
          if (this.cars[i].d == "e" || this.cars[i].d == "w") {
            if (Math.abs(this.intersections_arr[loc].y - this.cars[i].y) < 40) {
              if (this.intersection_waits_EW[loc][0] == null) {

                if (this.cars[i].x <= this.intersections_arr[this.intersection_waits_EW[loc][1]].x) {
                  fitered_cars.push(this.cars[i]);
                }
              } else if (this.intersection_waits_EW[loc][1] == null) {
                if (this.cars[i].x >= this.intersections_arr[this.intersection_waits_EW[loc][0]].x) {
                  fitered_cars.push(this.cars[i]);
                }
              } else {
                if (this.cars[i].x >= this.intersections_arr[this.intersection_waits_EW[loc][0]].x && this.cars[i].x <= this.intersections_arr[this.intersection_waits_EW[loc][1]].x) {
                  fitered_cars.push(this.cars[i]);
                }
              }
            }
          }
          
        }
        
        return fitered_cars.length;
      }
      else if(dir == 2){
        return this.intersections_arr[loc].countAWCars;
      }
      else{
        return 0;
      }
    }

    StopDirAtInter(dir: StopDir, loc: number){
      //North-South
      if(dir == 0){
        this.intersections_arr[loc].NS = false;
        this.intersections_arr[loc].startTime = new Date().getTime();                
      }
      //East-West
      else if(dir == 1){
        this.intersections_arr[loc].EW = false;
        this.intersections_arr[loc].startTime = new Date().getTime();                
      }
      //All-way
      else if(dir == 2){
        this.intersections_arr[loc].NS = false;        
        this.intersections_arr[loc].EW = false; 
        this.intersections_arr[loc].startTime = new Date().getTime();                
      } 
    }

    getDirection(loc: number): number{
      if(this.intersections_arr[loc].NS == true){
        return 0;
      }
      else if(this.intersections_arr[loc].EW == true){
        return 1;
      }
      else{
        return null;
      }
    }

    getDuration(loc: number): number{
      var endTime = new Date().getTime();
      var diff = (endTime - this.intersections_arr[loc].startTime)/1000;
      console.log("diff: "+diff);
      return diff;
    }

    checkInterLoc(loc: number): number{
      if(this.getCarsWait(0,loc)>0 || this.getCarsWait(1,loc)>0){
        return loc;
      }
      else{
        return null;
      }
    }
  }  
}

namespace jsLib{

  var requestAnimFrame = (function(){
    return window.requestAnimationFrame || 
    (<any>window).webkitRequestAnimationFrame || 
    (<any>window).mozRequestAnimationFrame || 
    (<any>window).oRequestAnimationFrame || 
    (<any>window).msRequestAnimationFrame || 
    function(callback: any){ 
        window.setTimeout(callback, 1000 / 60); 
    }; 
  })(); 

  export class tMap{
    public ratio: HTMLSpanElement;
    public car_no: number;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public w: number;
    public h: number;
    public roads: any[];
    public cars: any[];
    public intersections_arr: any[];
    public b: pxsim.Board;
    public slow: HTMLInputElement;
    public fast: HTMLInputElement;
    public globalSpeed: number;

    constructor(b: pxsim.Board){
      this.b = b;
      this.car_no = b.car_no;
      this.canvas = b.canvas;
      this.ctx = b.ctx;
      this.w = b.canvas_width;
      this.h = b.canvas_height;
      this.roads = b.roads;
      this.cars = b.cars;
      this.intersections_arr = b.intersections_arr;
      this.ratio = b.ratio;
      this.slow = b.slow;
      this.fast = b.fast;
      this.slow.addEventListener("click", (e:Event) => this.toSlow());
      this.fast.addEventListener("click", (e:Event) => this.toFast());
      this.globalSpeed = 3;
    }


    //initiate the parameters
    public init(): any{
      //road1
      var road = new drawroad(this);
      road.x = ((this.w/2)-120), road.y = 0, road.width =40, road.height = this.h;
      this.roads.push(road);


      //road2
      var road = new drawroad(this);
      road.x = ((this.w/2)+80), road.y = 0, road.width = 40, road.height = this.h;
      this.roads.push(road);


      //road3
      var road = new drawroad(this);
      road.x = 0, road.y = ((this.h/4)-80), road.width = this.w, road.height = 40;
      this.roads.push(road);
      

      //road4
      var road = new drawroad(this);
      road.x = 0, road.y = ((this.h/3)), road.width = this.w, road.height = 40;
      this.roads.push(road);

      //road5
      var road = new drawroad(this);
      road.x = 65, road.y = 400, road.width = this.w, road.height = 40;
      this.roads.push(road);


      //road6
      var road = new drawroad(this);
      road.x = 0, road.y = (this.h/1.4) + 100, road.width = this.w, road.height = 40;
      this.roads.push(road);
      
      //generating cars at beginning
      for(var i=0;i<this.car_no;i++){
        var car = new drawcar(this);
        car.s = 3;
        var pos_rand = Math.random();
        if(pos_rand < 0.1){
          car.x = this.w+25;
          car.y = this.roads[2].y+3;
          car.d = "w";
        }
        else if(pos_rand > 0.1 && pos_rand < 0.2){
          car.x = this.roads[1].x+37;
          car.y = this.h+15;
          car.d = "n";
        }
        else if(pos_rand > 0.2 && pos_rand < 0.3){
          car.x = this.roads[0].x+37;
          car.y = this.h+15;
          car.d = "n";
        }
        else if(pos_rand > 0.3 && pos_rand < 0.4){
          car.x = this.roads[1].x+15;
          car.y = -15;
          car.d = "s";
        }
        else if(pos_rand > 0.4 && pos_rand < 0.5){
          car.x = this.roads[0].x+15;
          car.y = -15;
          car.d = "s";
        }
        else if(pos_rand > 0.5 && pos_rand < 0.6){
          car.x = this.w+25;
          car.y = this.roads[3].y+3;
          car.d = "w";
        }
        else if(pos_rand > 0.6 && pos_rand < 0.7){
          car.x = this.w+25;
          car.y = this.roads[4].y+3;
          car.d = "w";
        }
        else if(pos_rand > 0.7 && pos_rand < 0.8){
          car.x = this.w+25;
          car.y = this.roads[5].y+3;
          car.d = "w";
        }
        else if(pos_rand > 0.8 && pos_rand < 0.9){
          car.x = -15;
          car.y = this.roads[3].y+23;
          car.d = "e";
        }
        else if(pos_rand > 0.9 && pos_rand < 1){
          car.x = -15;
          car.y = this.roads[2].y+23;
          car.d = "e";
        }
        else{
          car.x = -15;
          car.y = this.roads[5].y+23;
          car.d = "e";
        }

        var color_rand = Math.random();
        var color = "";
        if(color_rand < 0.2){
          var color = "#fff";
        }
        else if(color_rand > 0.2 && color_rand < 0.4){
          var color = "#E22322";
        }
        else if(color_rand > 0.4 && color_rand < 0.6){
          var color = "#F9D111";
        }
        else if(color_rand > 0.6 && color_rand < 0.8){
          var color = "#367C94";
        }
        else if(color_rand > 0.8 && color_rand < 1){
          var color = "#222";
        }
        // console.log(color);
        car.color = color;
        this.cars.push(car);	
        //console.log("car.d: "+car.d);
      }

      this.intersections();
    } 
    
    getRatio(){
      var stoppedCars = 0;
      var movingCars = 0;
      for(var i = 0; i < this.cars.length; i++) {
        if (this.cars[i].s == 0){
          stoppedCars++;
        } else {
          movingCars++;
        }
      };
      // console.log(this.slow);
      //console.log( String(stoppedCars/this.cars.length));
      this.ratio.textContent = String(parseFloat(String((1-stoppedCars/this.cars.length)*100)).toFixed(0) + "%");
    }

    //draw the map
    drawscene(): any{
      
      this.ctx.fillStyle = "#4DBB4C";
      this.ctx.fillRect(0,0,this.w,this.h);
      
      for(var i=0;i<this.roads.length;i++){
        this.roads[i].drawRoad(i);
      }
      //console.log("inter.length: "+this.intersections_arr.length)
      for(var i=0;i<this.intersections_arr.length;i++){
        this.intersections_arr[i].drawInter(i);
      }
      this.drive_cars();
      this.getRatio();
    }      
  
    distance_check(c1: any, c2: any, axis: string): boolean{
      if(axis=="x"){
        var dist: number = c2.x - c1.x;
        var disty: number = c2.y - c1.y;
        if(dist>0 && dist<=(c1.l+15)){
          if(c2.w > 15 && c1.w > 15 && Math.abs(c1.y - c2.y)>=0 && Math.abs(c1.y - c2.y)<=1){ //only check for collison on cars on the same axis
            return true;
          }
          else{return false;}
        }
        else{return false;}        
      }
      else if(axis=="-x"){
        var dist: number = c1.x - c2.x;
        var disty: number = c1.y - c2.y;
        if(dist>0 && dist<=(c1.l+15)){
          if(c2.w > 15 && c1.w > 15 && Math.abs(c1.y - c2.y)>=0 && Math.abs(c1.y - c2.y)<=1){ //only check for collison on cars on the same axis
            return true;
          }
          else{return false;}          
        }
        else{return false;}        
      }
      else if(axis=="-y"){
        var dist: number = c1.x - c2.x;
        var disty: number = c1.y - c2.y;
        if(disty>0 && disty<=(c1.l+15)){
          if(c2.w < 25 && c1.w < 25 && Math.abs(c1.x - c2.x)>=0 && Math.abs(c1.x - c2.x)<=1){ //only check for collison on cars on the same axis
            return true;
          }
          else{return false;}          
        }
        else{return false;}        
      }
      else if(axis=="y"){
        var dist: number= c2.x - c1.x;
        var disty: number = c2.y - c1.y;
        if(disty>0 && disty<=(c1.l+15)){
          if(c2.w < 25 && c1.w < 25 && Math.abs(c1.x - c2.x)>=0 && Math.abs(c1.x - c2.x)<=1){ //only check for collison on cars on the same axis
            return true;
          }
          else{return false;}          
        }
        else{return false;}        
      }
      else{
        return false;
      }
    }
  
    toSlow(): any{
      console.log("slow");
      for(var l=0;l<this.cars.length;l++){
        this.cars[l].s = 2;
      }
      this.globalSpeed = 2;
      console.log(this.cars[0].s);
    }

    toFast(): any{
      console.log("fast");
      for(var l=0;l<this.cars.length;l++){
        this.cars[l].s = 5;
      }
      this.globalSpeed = 5;
      console.log(this.cars[0].s);
    }
    
    check_inter(c: any, inter: any, axis: string): boolean{
      if(axis == "x"){
          if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
            if(c.y-40 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
      }
      else if(axis == "-x"){
          if((c.x - inter.x) > (c.l+8) && (c.x - inter.x) <= (c.l+inter.width + 5)){
            if(c.y-40 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
      }
      else if(axis == "-y"){
          if((c.y - inter.y) > (c.l+8) && (c.y - inter.y) <= (c.l+inter.height + 5)){
            if(c.x-40 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
      }
      else if(axis == "y"){
          if((inter.y - c.y) > (c.l+8) && (inter.y - c.y) <= (c.l + 27)){
            if(c.x-40 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
      }
      else{return false;}
    }      
  
    gen_dir(c: drawcar, inter: any): void{
      if(c.dd == false){
        var rand_dir = Math.random();
        c.dd = true;
        if(c.d=="e"){
          if(inter.EW == true){
            if(rand_dir>0.5){
              c.d = "e";
            }  
            else{
              c.x = inter.x+13;
              c.d = "s";
            }
          }
        }
        else if(c.d=="w"){
          if(inter.EW == true){
            if(rand_dir>0.5){
              c.d = "w";
            }  
            else{
              c.x = inter.x+39;
              c.d = "n";
            }
          }
        }
        else if(c.d=="n"){
          if(inter.NS == true){
            if(rand_dir>0.5){
              c.d = "n";
            }  
            else{
              c.y = inter.y+26;
              c.d = "e";
            }
          }
        }
        else if(c.d=="s"){
          if(inter.NS == true){
            if(rand_dir>0.5){
              c.d = "s";
            }  
            else{
              if(inter.roadleft){
                c.y = inter.y;
                c.x = inter.x-15;
                c.d = "w";
              }
            }
          }
        }
      }
    }
  
    drive_cars(): void{
      for(var i=0;i<this.cars.length;i++){
        var c = this.cars[i];
        // console.log("drive car.s: "+c.s);    
        c.s = this.globalSpeed;
        if(c.d == "e"){
          for(var l=0;l<this.cars.length;l++){
            var c2 = this.cars[l];
            var dc: boolean = this.distance_check(c,c2,"x");
            if(dc == true){
              c.s = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(inter.y + inter.height > c.y && inter.y < c.y){
                    c.s = 0;
                }
              }
            }
            else{
              var counter = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(this.check_inter(c, inter, "x")){
                  counter++;
                  if(inter.left == "rgba(255,0,0,0.4)"){
                    //red
                    c.s = 0;
                  }
                  else{
                    //green
                    c.s = this.globalSpeed;
                    //figure dir
                    this.gen_dir(c, inter);
                  }
                }
              }
              if(counter==0){
                //car past intersection reset random generator
                c.dd = false;	
              }
            }
          }
          if(c.x+26 >= this.canvas.width){
            //reposition car
            var pos_rand: number = Math.random();
            if(pos_rand < 0.1){
              c.x = this.w+25;
              c.y = this.roads[2].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.1 && pos_rand < 0.2){
              c.x = this.roads[1].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.2 && pos_rand < 0.3){
              c.x = this.roads[0].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.3 && pos_rand < 0.4){
              c.x = this.roads[1].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.4 && pos_rand < 0.5){
              c.x = this.roads[0].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.5 && pos_rand < 0.6){
              c.x = this.w+25;
              c.y = this.roads[3].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.6 && pos_rand < 0.7){
              c.x = this.w+25;
              c.y = this.roads[4].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.7 && pos_rand < 0.8){
              c.x = this.w+25;
              c.y = this.roads[5].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.8 && pos_rand < 0.9){
              c.x = -15;
              c.y = this.roads[3].y+23;
              c.d = "e";
            }
            else if(pos_rand > 0.9 && pos_rand < 1){
              c.x = -15;
              c.y = this.roads[2].y+23;
              c.d = "e";
            }
            else{
              c.x = -15;
              c.y = this.roads[5].y+23;
              c.d = "e";
            }
          }
          c.x += c.s;
        }
        else if(c.d == "n"){
          for(var l=0;l<this.cars.length;l++){
            var c2 = this.cars[l];
            var dc = this.distance_check(c,c2,"-y");
            if(dc == true){
              c.s = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(inter.x + inter.width > c.x && inter.x < c.x){
                    c.s = 0;
                }
              }
            }
            else{
              var counter = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(this.check_inter(c, inter, "-y")){
                  counter++;
                  if(inter.bottom == "rgba(255,0,0,0.4)"){
                    //red
                    c.s = 0;
                  }
                  else{
                    //green
                    c.s = this.globalSpeed;
                    //figure dir
                    this.gen_dir(c, inter);
                  }
                }
              }
              if(counter==0){
                //car past intersection reset random generator
                c.dd = false;	
              }
            }
          }
          if(c.y+26 <= 0){
            var pos_rand: number = Math.random();
            //reposition car
            if(pos_rand < 0.1){
              c.x = this.w+25;
              c.y = this.roads[2].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.1 && pos_rand < 0.2){
              c.x = this.roads[1].x+37;
              c.y = this.h+15;
              c.d = "n";
            }
            else if(pos_rand > 0.2 && pos_rand < 0.3){
              c.x = this.roads[0].x+37;
              c.y = this.h+15;
              c.d = "n";
            }
            else if(pos_rand > 0.3 && pos_rand < 0.4){
              c.x = this.roads[1].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.4 && pos_rand < 0.5){
              c.x = this.roads[0].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.5 && pos_rand < 0.6){
              c.x = this.w+25;
              c.y = this.roads[3].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.6 && pos_rand < 0.7){
              c.x = this.w+25;
              c.y = this.roads[4].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.7 && pos_rand < 0.8){
              c.x = this.w+25;
              c.y = this.roads[5].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.8 && pos_rand < 0.9){
              c.x = -15;
              c.y = this.roads[3].y+23;
              c.d = "e";
              return;
            }
            else if(pos_rand > 0.9 && pos_rand < 1){
              c.x = -15;
              c.y = this.roads[2].y+23;
              c.d = "e";
              return;
            }
            else{
              c.x = -15;
              c.y = this.roads[5].y+23;
              c.d = "e";
              return;
            }
          }
          c.y -= c.s;
        }
        else if(c.d == "s"){
          for(var l=0;l<this.cars.length;l++){
            var c2 = this.cars[l];
            var dc = this.distance_check(c,c2,"y");
            if(dc == true){
              c.s = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(inter.x + inter.width > c.x && inter.x < c.x){
                  //this is road
                    c.s = 0;
                }
              }
            }
            else{
              var counter = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(this.check_inter(c, inter, "y")){
                  counter++;
                  if(inter.top == "rgba(255,0,0,0.4)"){
                    //red
                    c.s = 0;
                  }
                  else{
                    //green
                    c.s = this.globalSpeed;
                    //figure dir
                    this.gen_dir(c, inter);
                  }
                }
              }
              if(counter==0){
                //car past intersection reset random generator
                c.dd = false;	
              }
            }
          }
          if(c.y-26 >= this.h){
            //reposition car
            var pos_rand: number = Math.random();
            if(pos_rand < 0.1){
              c.x = this.w+25;
              c.y = this.roads[2].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.1 && pos_rand < 0.2){
              c.x = this.roads[1].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.2 && pos_rand < 0.3){
              c.x = this.roads[0].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.3 && pos_rand < 0.4){
              c.x = this.roads[1].x+15;
              c.y = -15;
              c.d = "s";
            }
            else if(pos_rand > 0.4 && pos_rand < 0.5){
              c.x = this.roads[0].x+15;
              c.y = -15;
              c.d = "s";
            }
            else if(pos_rand > 0.5 && pos_rand < 0.6){
              c.x = this.w+25;
              c.y = this.roads[3].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.6 && pos_rand < 0.7){
              c.x = this.w+25;
              c.y = this.roads[4].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.7 && pos_rand < 0.8){
              c.x = this.w+25;
              c.y = this.roads[5].y+3;
              c.d = "w";
              return;
            }
            else if(pos_rand > 0.8 && pos_rand < 0.9){
              c.x = -15;
              c.y = this.roads[3].y+23;
              c.d = "e";
              return;
            }
            else if(pos_rand > 0.9 && pos_rand < 1){
              c.x = -15;
              c.y = this.roads[2].y+23;
              c.d = "e";
              return;
            }
            else{
              c.x = -15;
              c.y = this.roads[5].y+23;
              c.d = "e";
              return;
            }
          }
          c.y += c.s;
        }
        else if(c.d == "w"){
          //for loops to check for meeting collision and intersection
          for(var l=0;l<this.cars.length;l++){
            var c2 = this.cars[l];
            //check collision between cars when facing west
            var dc = this.distance_check(c,c2,"-x");
            //dc==true means collision exits
            if(dc == true){
              c.s = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                //if the car meets the inter
                if(inter.y + inter.height > c.y && inter.y < c.y){
                    c.s = 0;
                }
              }
            }
            //if no collision
            else{
              var counter = 0;
              //for loop to check if the car meets the inter
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                //true means meets
                if(this.check_inter(c, inter, "-x")){
                  counter++;
                  //red, stop
                  if(inter.right == "rgba(255,0,0,0.4)"){
                    //red
                    c.s = 0;
                    this.intersections_arr[k].countEWCars++;
                    //console.log("driveCar Count:"+this.intersections_arr[k].countEWCars);                    
                  }
                  //green go
                  else{
                    //green
                    c.s = this.globalSpeed;
                    //figure dir
                    this.gen_dir(c, inter);                
                  }
                }
              }
              //if its not at intern
              if(counter==0){
                //car past intersection reset random generator
                c.dd = false;	
              }
            }
          }
          if(c.x+26 <= 0){
            //reposition car
            var rand: number = Math.random();
            if(pos_rand < 0.1){
              c.x = this.w+25;
              c.y = this.roads[2].y+3;
              c.d = "w";
            }
            else if(pos_rand > 0.1 && pos_rand < 0.2){
              c.x = this.roads[1].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.2 && pos_rand < 0.3){
              c.x = this.roads[0].x+37;
              c.y = this.h+15;
              c.d = "n";
              return;
            }
            else if(pos_rand > 0.3 && pos_rand < 0.4){
              c.x = this.roads[1].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.4 && pos_rand < 0.5){
              c.x = this.roads[0].x+15;
              c.y = -15;
              c.d = "s";
              return;
            }
            else if(pos_rand > 0.5 && pos_rand < 0.6){
              c.x = this.w+25;
              c.y = this.roads[3].y+3;
              c.d = "w";
            }
            else if(pos_rand > 0.6 && pos_rand < 0.7){
              c.x = this.w+25;
              c.y = this.roads[4].y+3;
              c.d = "w";
            }
            else if(pos_rand > 0.7 && pos_rand < 0.8){
              c.x = this.w+25;
              c.y = this.roads[5].y+3;
              c.d = "w";
            }
            else if(pos_rand > 0.8 && pos_rand < 0.9){
              c.x = -15;
              c.y = this.roads[3].y+23;
              c.d = "e";
              return;
            }
            else if(pos_rand > 0.9 && pos_rand < 1){
              c.x = -15;
              c.y = this.roads[2].y+23;
              c.d = "e";
              return;
            }
            else{
              c.x = -15;
              c.y = this.roads[5].y+23;
              c.d = "e";
              return;
            }
          }
          else if(c.x - 40 <= this.roads[4].x && (c.y == this.roads[4].y+3 || c.y == this.roads[4].y)){
            var rand = Math.random();
            if(rand >= 0.5){
              c.x = this.roads[4].x + 40;
              c.y = this.roads[4].y + 23;
              c.d = "e";
              c.x += c.s;
              return;
            }else{
              c.x = this.roads[0].x+37;
              c.d = "n";
              return;
            }
          }
          c.x -= c.s;
        }
        c.drawCar();
      }
    }
    
    intersections(): void{
      console.log("roads.length: "+this.roads.length);
      for(var i=0;i<this.roads.length;i++){
        var r1 = this.roads[i];
        for(var j=0;j<this.roads.length;j++){
          var r2 = this.roads[j];
          if(r1.width > r1.height){
            if(r2.width < r2.height){
              if((r1.x + r1.width) > r2.x && r1.x <= r2.x){
                if((r2.y + r2.height) >= r1.y && r2.y <= r1.y){
                  console.log("intersection found at ("+r1.y+","+r2.x+")");
                  var roadtop = true;
                  var roadbottom = true;
                  var roadleft = true;
                  var roadright = true;
                  if(r1.y == r2.y){
                    //no intersection top
                    var roadtop = false;
                  }
                  if(r1.x == r2.x){
                    //no intersection left
                    var roadleft = false;
                  }
                  if((r1.x + r1.width) == (r2.x + r2.width)){
                    //no intersection right
                    var roadright = false;
                  }
                  if((r1.y + r1.height)==(r2.y + r2.height)){
                    //no intersection top
                    var roadbottom = false;
                  }
                  
                  if (r1.y == 400 && r2.x == 65) {
                    var roadleft = false;
                    // var roadbottom = false;
                  }
                  var inter = new drawIntersection(this);
                  inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
                  inter.startTime = new Date().getTime();
                  this.intersections_arr.push(inter);
                }
              }
            }
          }
        }
      }
    }

    public animloop(): void{
      this.drawscene();       
      requestAnimFrame(()=>this.animloop()); 
    }

  }
  export class drawroad{
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public color: string;
    public ctx: CanvasRenderingContext2D;
    public mapRef: tMap;
    
    constructor(map: tMap){
      this.x = this.x;
      this.y = this.y;
      this.mapRef = map;
      this.width = this.width;
      this.height = this.height;
      this.color = "#605A4C";
      this.ctx = map.ctx;
    }

    public drawRoad(i: number){
      this.x = this.mapRef.roads[i].x;
      this.y = this.mapRef.roads[i].y
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x,this.y,this.width,this.height);
      
      this.ctx.fillStyle = "#A68B44";
      if(this.width < this.height && this.width > 40){
        this.ctx.fillRect(this.x+((this.width/2)-1),this.y,2,this.height);
        
        this.ctx.beginPath();
        this.ctx.setLineDash([2,5]);
        this.ctx.moveTo(this.x+((this.width/4)-1), this.y);
        this.ctx.lineTo(this.x+((this.width/4)-1), (this.y + this.height));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.setLineDash([2,5]);
        this.ctx.moveTo(this.x+((this.width/(4/3))-1), this.y);
        this.ctx.lineTo(this.x+((this.width/(4/3))-1), (this.y + this.height));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x-10,this.y,10,this.height);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x+this.width,this.y,10,this.height);
        
      }
      else if(this.width > this.height && this.height > 40){
        this.ctx.fillRect(this.x,this.y+((this.height/2)-1),this.width,2);
        
        this.ctx.beginPath();
        this.ctx.setLineDash([2,5]);
        this.ctx.moveTo(this.x, this.y+((this.height/4)-1));
        this.ctx.lineTo((this.x+this.width), this.y+((this.height/4)-1));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.setLineDash([2,5]);
        this.ctx.moveTo(this.x, this.y+((this.height/(4/3))-1));
        this.ctx.lineTo((this.x+this.width), this.y+((this.height/(4/3))-1));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x,this.y-10,this.width,10);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x,this.y+this.height,this.width,10);
        
      }
      else if(this.width > this.height && this.height < 41){
        this.ctx.fillRect(this.x,this.y+((this.height/2)-1),this.width,2);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x,this.y-10,this.width,10);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x,this.y+this.height,this.width,10);
      }
      else if(this.width < this.height && this.width < 41){
        this.ctx.fillRect(this.x+((this.width/2)-1),this.y,2,this.height);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x-10,this.y,10,this.height);
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x+this.width,this.y,10,this.height);
      } 
    }
  }

  export class drawcar{
    public x: number;
    public y: number;
    //car speed
    public s: number;
    public l: number;
    //car direction
    public d: string;
    public dd: boolean;
    public color: string;
    public turningS: boolean;
    public w: number;
    public ctx: CanvasRenderingContext2D;

    constructor(map: tMap){
      this.x = map.w+25;
      this.y = map.roads[2].y+3;
      this.s = 1;
      this.l = 25;
      this.d = "w";
      this.dd = false;
      this.color = "#F5D600";
      this.ctx = map.ctx;
    }

    public drawCar(): void{
      this.ctx.fillStyle = this.color;
      if(this.d == "w"){
        this.w = 25;
        this.ctx.fillRect(this.x, this.y, this.l, 12);
        this.ctx.fillStyle="#99B3CE";
        this.ctx.fillRect(this.x+5, this.y, 5, 12);
        this.ctx.fillRect(this.x+18, this.y, 2, 12);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x+6, this.y-2, 2 ,2);
        this.ctx.fillRect(this.x+6, this.y+12, 2 ,2);
      }
      else if(this.d == "e"){
        this.w = 25;
        this.ctx.fillRect(this.x, this.y, this.l, 12);
        this.ctx.fillStyle="#99B3CE";
        this.ctx.fillRect(this.x+15, this.y, 5, 12);
        this.ctx.fillRect(this.x+4, this.y, 2, 12);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x+14, this.y-2, 2 ,2);
        this.ctx.fillRect(this.x+14, this.y+12, 2 ,2);
      }
      else if(this.d == "s"){
        this.w = 12;
        this.ctx.rotate(Math.PI/2);
        this.ctx.fillRect(this.y, -this.x, this.l, 12);
        this.ctx.fillStyle="#99B3CE";
        this.ctx.fillRect(this.y+15, -this.x, 5, 12);
        this.ctx.fillRect(this.y+4, -this.x, 2, 12);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.y+14, -this.x-2, 2 ,2);
        this.ctx.fillRect(this.y+14, -this.x+12, 2 ,2);
        this.ctx.rotate(-Math.PI/2);
        
      }
      else{
        this.w = 12;
        this.ctx.rotate(Math.PI/2);
        this.ctx.fillRect(this.y, -this.x, this.l, 12);
        this.ctx.fillStyle="#99B3CE";
        this.ctx.fillRect(this.y+5, -this.x, 5, 12);
        this.ctx.fillRect(this.y+18, -this.x, 2, 12);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.y+6, -this.x-2, 2 ,2);
        this.ctx.fillRect(this.y+6, -this.x+12, 2 ,2);
        this.ctx.rotate(-Math.PI/2);
      }
    }

  }

  export class drawIntersection{
    public x:number;
    public y:number;
    public width:number;
    public height:number;
    public roadtop:boolean;
    public roadleft:boolean;
    public roadbottom:boolean;
    public roadright:boolean;
    public right: string;
    public left: string;
    public top: string;
    public bottom: string;
    public ctx: CanvasRenderingContext2D;
    public NS: boolean;
    public EW: boolean;
    public AW: boolean;
    public startTime: number;

    constructor(map: tMap){
      this.x = this.x;
      this.y = this.y;
      this.width = this.width;
      this.height = this.height;
      this.roadtop = true;
      this.roadleft = true;
      this.roadbottom = true;
      this.roadright = true;
      this.ctx = map.ctx;
      this.NS = this.NS;
      this.EW = this.EW;
      this.AW = this.AW;
      this.startTime = this.startTime;
    }
    
    public leftZebra(){
      if(this.roadleft == true){
        this.ctx.fillStyle = "#605A4C";
        this.ctx.fillRect(this.x-20,this.y,20,this.height);
        this.ctx.beginPath();
        this.ctx.setLineDash([1,5]);
        this.ctx.moveTo(this.x-12, this.y);
        this.ctx.lineTo(this.x-12, (this.y + this.height));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 10;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x-22,(this.height/2)+this.y-1,2,(this.height/2)+1);
        if(this.height > 40){
          this.ctx.fillStyle = "#A09383";
          this.ctx.fillRect(this.x-52,(this.height/(4/3))+this.y-2,30,2);
        }
      }
    }
    public rightZebra(){
      if(this.roadright == true){
        this.ctx.fillStyle = "#605A4C";
        this.ctx.fillRect(this.x+this.width,this.y,22,this.height);
        this.ctx.beginPath();
        this.ctx.setLineDash([1,5]);
        this.ctx.moveTo(this.x+this.width+12, this.y);
        this.ctx.lineTo(this.x+this.width+12, (this.y + this.height));
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 10;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x+this.width+22,this.y,2,(this.height/2)+1);
        if(this.height > 40){
          this.ctx.fillStyle = "#A09383";
          this.ctx.fillRect(this.x+this.width+22,(this.height/4)+this.y-2,30,2);
        }
      }
    }
    public topZebra(){
      if(this.roadtop == true){
        this.ctx.fillStyle = "#605A4C";
        this.ctx.fillRect(this.x,this.y-20,this.width,20);
        this.ctx.beginPath();
        this.ctx.setLineDash([1,5]);
        this.ctx.moveTo(this.x, this.y-12);
        this.ctx.lineTo((this.x + this.width), this.y-12);
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 10;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x,this.y-21,(this.width/2)+1,2);
        if(this.width > 40){
          this.ctx.fillStyle = "#A09383";
          this.ctx.fillRect(this.x+(this.width/4)-2,this.y-50,2,30);
        }
      }
    }
    public botZebra(){
      if(this.roadbottom == true){
        this.ctx.fillStyle = "#605A4C";
        this.ctx.fillRect(this.x,this.y+this.height,this.width,20);
        this.ctx.beginPath();
        this.ctx.setLineDash([1,5]);
        this.ctx.moveTo(this.x, this.y+this.height+12);
        this.ctx.lineTo((this.x + this.width), this.y+this.height+12);
        this.ctx.closePath();
        this.ctx.strokeStyle = "#A09383";
        this.ctx.lineWidth = 10;
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = "#A09383";
        this.ctx.fillRect(this.x+this.width-(this.width/2)-1,this.y+this.height+20,(this.width/2)+1,2);
        if(this.width > 40){
          this.ctx.fillStyle = "#A09383";
          this.ctx.fillRect(this.x+(this.width/(4/3))-2,this.y+this.height+20,2,30);
        }
      }
    }

    public leftTrafficL(){
      this.ctx.save();
      
      if(this.left == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';

      }
      
      //console.log(shadow_color);
      this.ctx.fillStyle = shadow_color;
      this.ctx.shadowColor = shadow_color
      this.ctx.shadowOffsetX = -2;
      this.ctx.shadowBlur = 2;
      /**
        * Right Traffic Light at Left side
        */
      this.ctx.fillRect(this.x-3,this.y+this.height-12,6,6);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.shadowOffsetX = undefined;
      this.ctx.shadowBlur = undefined;
      
      this.ctx.fillStyle = "#ddd";
      this.ctx.fillRect(this.x-3,this.y+this.height-(this.height/2)+3,1,(this.height/2));						
    }
    
    public rightTrafficL(){
      this.ctx.save();
      if(this.right == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      this.ctx.fillStyle = shadow_color;
      this.ctx.shadowColor = shadow_color
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowBlur = 2;
      /**
        * Left Traffic Light at Right side
        */
      this.ctx.fillRect(this.x+this.width+2,this.y+12,6,6);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.shadowOffsetX = undefined;
      this.ctx.shadowBlur = undefined;
      
      if(this.height > 40){
        this.ctx.save();
        if(this.right == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        this.ctx.fillStyle = shadow_color;
        this.ctx.shadowColor = shadow_color
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowBlur = 2;
        /**
          * Right Traffic Light at Right side
          */
        //this.ctx.fillRect(this.x+this.width+2,this.y+30,6,6);
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowOffsetX = undefined;
        this.ctx.shadowBlur = undefined;
      }
      
      this.ctx.fillStyle = "#ddd";
      this.ctx.fillRect(this.x+this.width+2,this.y-3,1,(this.height/2));		
    }
    public topTrafficL(){
      this.ctx.save();
      if(this.top == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      //console.log();
      this.ctx.fillStyle = shadow_color;
      this.ctx.shadowColor = shadow_color
      this.ctx.shadowOffsetY = -2;
      this.ctx.shadowBlur = 2;
      /**
        * Right Traffic Light at Top side
        */
      this.ctx.fillRect(this.x+4,this.y-2,6,6);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.shadowOffsetX = undefined;
      this.ctx.shadowBlur = undefined;
      
      this.ctx.fillStyle = "#ddd";
      this.ctx.fillRect(this.x-3,this.y-2,(this.width/2),1);
    }
    public botTrafficL(){
      this.ctx.save();
      if(this.bottom == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      this.ctx.fillStyle = shadow_color;
      this.ctx.shadowColor = shadow_color
      this.ctx.shadowOffsetY = 2;
      this.ctx.shadowBlur = 2;
      /**
        * Traffic Light on the right at Bottom side
        */
      this.ctx.fillRect(this.x+this.width-10,this.y+this.height+2,6,6);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.shadowOffsetX = undefined;
      this.ctx.shadowBlur = undefined;
      
      if(this.width > 40){
        this.ctx.save();
        if(this.bottom == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        this.ctx.fillStyle = shadow_color;
        this.ctx.shadowColor = shadow_color
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 2;
        /**
         * Traffic Light on the left at Bottom side
         */
        this.ctx.fillRect(this.x+this.width-32,this.y+this.height+2,6,6);
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowOffsetX = undefined;
        this.ctx.shadowBlur = undefined;
      }
      
      this.ctx.fillStyle = "#ddd";
      this.ctx.fillRect(this.x+(this.width/2)+3,this.y+this.height+2,(this.width/2),1);
    }

    public drawInter(index: number): any{
      //console.log("["+index+"]: "+this.NS);
      this.ctx.fillStyle = "#605A4C";
      this.ctx.fillRect(this.x,this.y,this.width,this.height);
      //North-South, red - Left+Right, green - Top+Bot
      if(this.NS == true){
        this.right = "rgba(255,0,0,0.4)";
        this.left = "rgba(255,0,0,0.4)";
        this.top = "rgba(0,255,0,0.4)";
        this.bottom = "rgba(0,255,0,0.4)";
      }
      else if(this.EW == true){
        this.top = "rgba(255,0,0,0.4)";
        this.bottom = "rgba(255,0,0,0.4)";
        this.right = "rgba(0,255,0,0.4)";
        this.left = "rgba(0,255,0,0.4)";
      }
      else if(this.AW == true){
        this.top = "rgba(0,255,0,0.4)";
        this.bottom = "rgba(0,255,0,0.4)";
        this.right = "rgba(0,255,0,0.4)";
        this.left = "rgba(0,255,0,0.4)";
      }
      else{
        this.right = "rgba(255,0,0,0.4)";
        this.left = "rgba(255,0,0,0.4)";
        this.top = "rgba(255,0,0,0.4)";
        this.bottom = "rgba(255,0,0,0.4)";
      }
      //1. traffic lights (left)
      if(this.roadleft == true){ 
        //zebra-crossing (left)
        this.leftZebra(); 
        this.leftTrafficL();
      }
      //2. traffic lights (right)
      if(this.roadright == true){
        //zebra-crossing (right)
        this.rightZebra();
        this.rightTrafficL();        
      }        
      //3. traffic lights (top)
      if(this.roadtop == true){ 
        //zebra-crossing (top)
        this.topZebra();       
        this.topTrafficL();
      }
      //4. traffic lights (bottom)
      if(this.roadbottom == true){
        //zebra-crossing (bottom)
        this.botZebra();        
        this.botTrafficL();
      }    
      var interName = <string><any>index;
      this.ctx.fillStyle = "white"
      this.ctx.font = "15px serif"
      this.ctx.fillText(interName, this.x+this.width*2/3, this.y+this.height/3);    
      if(this.top == "rgba(0,255,0,0.4)"){
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        var interMidX = this.x+this.width/2;
        var interMidY = this.y+this.height/2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(interMidX, interMidY);
        this.ctx.lineTo(interMidX, interMidY-this.height/4);
        this.ctx.lineTo(interMidX-this.height/12, interMidY-this.height/6);
        this.ctx.moveTo(interMidX, interMidY-this.height/4);
        this.ctx.lineTo(interMidX+this.height/12, interMidY-this.height/6);
        this.ctx.moveTo(interMidX,interMidX);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      if(this.bottom == "rgba(0,255,0,0.4)"){
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        var interMidX = this.x+this.width/2;
        var interMidY = this.y+this.height/2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(interMidX, interMidY);
        this.ctx.lineTo(interMidX, interMidY+this.height/4);
        this.ctx.lineTo(interMidX-this.height/12, interMidY+this.height/6);
        this.ctx.moveTo(interMidX, interMidY+this.height/4);
        this.ctx.lineTo(interMidX+this.height/12, interMidY+this.height/6);
        this.ctx.moveTo(interMidX,interMidX);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      if(this.left == "rgba(0,255,0,0.4)"){
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        var interMidX = this.x+this.width/2;
        var interMidY = this.y+this.height/2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(interMidX, interMidY);
        this.ctx.lineTo(interMidX-this.height/4, interMidY);
        this.ctx.lineTo(interMidX-this.height/4+this.height/12, interMidY-this.height/12);
        this.ctx.moveTo(interMidX-this.height/4, interMidY);
        this.ctx.lineTo(interMidX-this.height/4+this.height/12, interMidY+this.height/12);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      if(this.right == "rgba(0,255,0,0.4)"){
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        var interMidX = this.x+this.width/2;
        var interMidY = this.y+this.height/2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.moveTo(interMidX, interMidY);
        this.ctx.lineTo(interMidX+this.height/4, interMidY);
        this.ctx.lineTo(interMidX+this.height/4-this.height/12, interMidY-this.height/12);
        this.ctx.moveTo(interMidX+this.height/4, interMidY);
        this.ctx.lineTo(interMidX+this.height/4-this.height/12, interMidY+this.height/12);
        this.ctx.closePath();
        this.ctx.stroke();
      }
    }
  }
}