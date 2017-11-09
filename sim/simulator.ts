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
  export class Board extends pxsim.BaseBoard {
    public svgDiv: HTMLDivElement;
    public canvas: HTMLCanvasElement;
    public scriptSim: HTMLScriptElement;
    public car_no: number;
    public canvas_width: number = 370;
    public canvas_height: number = 270;
    public roads: any[];
    public cars: any[];
    public intersections_arr: any[];
    public left_green: boolean;
    public tMap: jsLib.tMap;

    constructor() {
      super();
      this.svgDiv = <HTMLDivElement><any>document.getElementById("svgcanvas");
      this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName("canvas")[0];
      this.scriptSim = <HTMLScriptElement><any>document.getElementById("js3");
      this.car_no = 1, this.canvas_width = 370, this.canvas_height = 270;
      this.roads = [], this.cars = [], this.intersections_arr = [];
      this.left_green = false;    
    }

    initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
      document.body.innerHTML = ''; // clear children
      this.svgDiv.appendChild(this.canvas);        
      document.body.appendChild(this.svgDiv);      
      document.body.appendChild(this.scriptSim); 
      this.tMap = new jsLib.tMap(this);
      this.tMap.car_no = this.car_no, this.tMap.canvas = this.canvas;
      this.tMap.w = this.canvas_width, this.tMap.h = this.canvas_height 
      this.tMap.roads = this.roads, this.tMap.cars = this.cars, this.tMap.intersections_arr = this.intersections_arr;
      this.tMap.left_green = this.left_green;
      this.tMap.init();
      this.tMap.animloop();
      console.log("b.left_green: "+this.tMap.left_green);
      setInterval(()=>this.tMap.left_greenc(),3000); 
      console.log("b.left_green1: "+this.tMap.left_green);
      return Promise.resolve();
    }   

    updateView() {

    }
  }  
}

var requestAnimFrame = (function(){
  console.log("dd-"); 
  return window.requestAnimationFrame || 
  (<any>window).webkitRequestAnimationFrame || 
  (<any>window).mozRequestAnimationFrame || 
  (<any>window).oRequestAnimationFrame || 
  (<any>window).msRequestAnimationFrame || 
  function(callback: any){ 
      window.setTimeout(callback, 1000 / 60); 
  }; 
})(); 

namespace jsLib{


  export class tMap{
    public car_no: number;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public w: number;
    public h: number;
    public roads: any[];
    public cars: any[];
    public intersections_arr: any[];
    public left_green: boolean;
    
    constructor(b: pxsim.Board){
      this.car_no = b.car_no;
      this.canvas = b.canvas;
      this.ctx = b.canvas.getContext("2d");
      this.w = b.canvas_width;
      this.h = b.canvas_height;
      this.roads = b.roads;
      this.cars = b.cars;
      this.intersections_arr = b.intersections_arr;
      this.left_green = b.left_green;
    }

    //initiate the parameters
    public init(): any{
      console.log("this.car_no: "+this.car_no);
      for(var i=0;i<this.car_no;i++){
        var car = new drawcar(this);
        car.s = 1;
        // var pos_rand = Math.random();
        // if(pos_rand < 0.5){
        //   car.x = w+25;
        //   car.y = 41;
        //   car.d = "w";
        // }
        // else{
        //   car.x = 120;
        //   car.y = h+25;
        //   car.d = "n";
        // }
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
      
      //road1
      var road = new drawroad(this);
      road.x = 0, road.y = ((this.h/4)-30), road.width = this.w, road.height = 40;
      this.roads.push(road);
      
      //road2
      var road = new drawroad(this);
      road.x = ((this.w/2)-120), road.y = 0, road.width =80, road.height = this.h;
      this.roads.push(road);
      
      // //road3
      var road = new drawroad(this);
      road.x = 0, road.y = (this.h/1.4), road.width = this.w, road.height = 40;
      this.roads.push(road);
      
      //road4
      var road = new drawroad(this);
      road.x = ((this.w/2)+80), road.y = 0, road.width = 40, road.height = this.h;
      this.roads.push(road);
      
      this.intersections();
    }
  
    //draw the map
    drawscene(): any{
      
      this.ctx.fillStyle = "#4DBB4C";
      this.ctx.fillRect(0,0,this.w,this.h);
      
      for(var i=0;i<this.roads.length;i++){
        this.roads[i].drawRoad(i);
      }
      this.intersections();
      this.drive_cars();
    }      
  
    public left_greenc(): void{
      console.log("left_greenc: "+this.left_green);
      
      this.left_green = !this.left_green;
    }
  
    distance_check(c1: any, c2: any, axis: string): boolean{
      if(axis=="x"){
        var dist: number = c2.x - c1.x;
        var disty: number = c2.y - c1.y;
        if(dist>0 && dist<=(c1.l+15)){
          if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
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
          if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
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
          if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
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
          if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
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
  
    check_inter(c: any, inter: any, axis: string): boolean{
      if(axis == "x"){
        if(inter.height > 40){
          if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
            if(c.y-80 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
        else{
          if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
            if(c.y-40 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
      }
      else if(axis == "-x"){
        if(inter.height > 40){
          if((c.x - inter.x) > (c.l+8) && (c.x - inter.x) <= (c.l+inter.width + 5)){
            if(c.y-80 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
        else{
          if((c.x - inter.x) > (c.l+8) && (c.x - inter.x) <= (c.l+inter.width + 5)){
            if(c.y-40 <= inter.y && c.y+42 >= inter.y){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
      }
      else if(axis == "-y"){
        if(inter.width > 40){
          if((c.y - inter.y) > (c.l+8) && (c.y - inter.y) <= (c.l+inter.height +5)){
            if(c.x-80 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
        else{
          if((c.y - inter.y) > (c.l+8) && (c.y - inter.y) <= (c.l+inter.height + 5)){
            if(c.x-40 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
      }
      else if(axis == "y"){
        if(inter.width > 40){
          if((inter.y - c.y) > (c.l+8) && (inter.y - c.y) <= (c.l + 27)){
            if(c.x-80 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
        else{
          if((inter.y - c.y) > (c.l+8) && (inter.y - c.y) <= (c.l + 27)){
            if(c.x-40 <= inter.x && c.x+42 >= inter.x){
              return true;
            }
            else{return false;}            
          }
          else{return false;}          
        }
      }
      else{return false;}
    }      
  
    gen_dir(c: drawcar, inter: any): void{
      if(c.dd == false){
        var rand_dir = Math.random()*10;
        var dir = c.d;
        var rand_no1: any;
        var rand_no2: any;
        c.dd = true;
        if(c.d=="e"){
          if(inter.width < 80){
            rand_no1 = 2;
            rand_no2 = 5;
          }
          else{
            rand_no1 = 3;
            rand_no2 = 6;
          }
          if(rand_dir < rand_no1){
            if(inter.roadbottom == true){
              var dir: string = "s";
              c.d = "s";
              c.x = inter.x + 10;
              c.y = inter.y + inter.height - 27;
            }
            else{
              if(inter.roadright == true){
                var dir: string = c.d;
              }
              else{
                //turn
              }
            }
          }
          else if(rand_dir > 3 && rand_dir < rand_no2){
            if(inter.roadtop == true){
              var dir: string = "n";
              c.d = "n";
              c.x = inter.x + inter.width - 9;
              c.y = inter.y + c.l + 2;
            }
            else{
              if(inter.roadright == true){
                var dir: string = c.d;
              }
              else{
                //turn
              }
            }
          }
          else{
            if(inter.roadright == true){
              var dir: string = c.d;
            }
            else{
              //turn
              var dir: string = "s";
              c.d = "s";
              c.x = inter.x + 10;
              c.y = inter.y + 2;
            }
          }
        }
        else if(c.d=="w"){
          if(inter.width < 80){
            rand_no1 = 2;
            rand_no2 = 5;
          }
          else{
            rand_no1 = 3;
            rand_no2 = 6;
          }
          if(rand_dir < rand_no1){
            if(inter.roadbottom == true){
              var dir: string = "s";
              //all going south
              if((c.x -inter.width/2-50) == inter.x && (c.y-3-inter.width/2+20.5)==inter.y){
                c.d = "s";
                c.x = inter.x + 40;
              }
            }
            else{
              if(inter.roadleft == true){
                var dir: string = c.d;
              }
              else{
                //turn
              }
            }
          }
          else if(rand_dir > 3 && rand_dir < rand_no2){
            if(inter.roadtop == true){
              var dir: string = "n";
              c.d = "n";
              c.x = inter.x + inter.width + 1;
              c.y = inter.y + c.l - 30;
            }
            else{
              if(inter.roadleft == true){
                var dir: string = c.d;
              }
              else{
                //turn
              }
            }
          }
          else{
            if(inter.roadleft == true){
              var dir: string = c.d;
            }
            else{
              //turn
              var dir: string = "n";
              c.d = "n";
              c.x = inter.x + inter.width + 1;
              c.y = inter.y + c.l + 2;
            }
          }
        }
        else if(c.d=="n"){
          if(rand_dir < 3){
            if(inter.roadright == true){
              var dir: string = "e";
              c.d = "e";
              c.y = inter.y + inter.height - 10;
              c.x = inter.x + inter.width + 1;
            }
            else{
            }
          }
          else if(rand_dir > 3 && rand_dir < 6){
            if(inter.roadleft == true){
              var dir: string = "w";
              c.d = "w";
              c.y = inter.y + 8;
              c.x = inter.x + 5;
            }
            else{
            }
            
          }
            else{
              if(inter.roadtop == true){
                var dir: string = c.d;
              }
              else{
                //turn
                var dir: string = "w";
                c.d = "w";
                c.y = inter.y + 8;
                c.x = inter.x + 5;
              }
            }
        }
        else if(c.d=="s"){
          if(rand_dir < 3){
            if(inter.roadright == true){
              var dir: string = "e";
              c.d = "e";
              c.y = inter.y + inter.height - 21;
              c.x = inter.x + inter.width + 1;
            }
            else{
              if(inter.roadbottom == true){
                var dir: string = c.d;
              }
              else{
                //turn
                c.s = 0;
              }
            }
          }
          else if(rand_dir > 3 && rand_dir < 6){
            if(inter.roadleft == true){
              var dir: string = "w";
              c.d = "w";
              c.y = inter.y - 2;
              c.x = inter.x - 28;
            }
            else{
              if(inter.roadbottom == true){
                var dir: string = c.d;
              }
              else{
                //turn
                c.s = 0;
              }
            }
          }
          else{
            if(inter.roadleft == true){
              var dir: string = "w";
              c.d = "w";
              c.y = inter.y - 2;
              c.x = inter.x - 28;
            }
            else{
              //turn
              c.s = 0;
            }
          }
        }
      }
    }
  
    drive_cars(): void{
      for(var i=0;i<this.cars.length;i++){
        var c = this.cars[i];
        //console.log("drive car.d: "+c.d);    
        c.s = 5;
        if(c.d == "e"){
          for(var l=0;l<this.cars.length;l++){
            var c2 = this.cars[l];
            var dc: boolean = this.distance_check(c,c2,"x");
            if(dc == true){
              c.s = 0;
              for(var k=0;k<this.intersections_arr.length;k++){
                var inter = this.intersections_arr[k];
                if(inter.y + inter.height > c.y && inter.y < c.y){
                  //this is road
                  if(inter.height == 80){
                    var lc = 0;
                    var ld = 0;
                    for(var v=0;v<this.cars.length;v++){
                      if(this.cars[v].y == (inter.y + 44) && this.cars[v].x < inter.x && this.cars[v].s == 0){
                        lc++;
                      }
                      if(this.cars[v].y == c.y && this.cars[v].x < inter.x && this.cars[v].s == 0){
                        ld++;
                      }
                    }
                    if((ld-2)>lc){
                      c.y = inter.y + 44;
                      c.s = 0;
                    }
                    else{
                      c.s = 0;
                    }
                    var dc = this.distance_check(c,c2,"x");
                    if(dc == true){
                      c.s = 0;
                    }
                  }
                  else{
                    c.s = 0;
                  }
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
                    c.s = 5;
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
            //console.log("reposition " + "east");
            c.x = 295;
            c.y = 46.5;
            c.d = "w";
            c.y -= c.s;
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
                  //this is road
                  if(inter.width == 80){
                    var lc = 0;
                    var ld = 0;
                    for(var v=0;v<this.cars.length;v++){
                      if(this.cars[v].x == (inter.x + 55) && this.cars[v].y < inter.y && this.cars[v].s == 0){
                        lc++;
                      }
                      if(this.cars[v].x == c.x && this.cars[v].y < inter.y && this.cars[v].s == 0){
                        ld++;
                      }
                    }
                    if((ld-2)>lc){
                      c.x = inter.x + 55;
                      c.s = 0;
                    }
                    else{
                      c.s = 0;
                    }
                    var dc = this.distance_check(c,c2,"-y");
                    if(dc == true){
                      c.s = 0;
                    }
                  }
                  else{
                    c.s = 0;
                  }
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
                    c.s = 5;
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
            //reposition car
            //console.log("reposition" + " north");
            c.x = 120.5;
            c.y = this.h+25;
            c.d = "s";
            c.y -= c.s;
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
                  if(inter.width == 80){
                    var lc = 0;
                    var ld = 0;
                    for(var v=0;v<this.cars.length;v++){
                      if(this.cars[v].x == (inter.x + 36) && this.cars[v].y < inter.y && this.cars[v].s == 0){
                        lc++;
                      }
                      if(this.cars[v].x == c.x && this.cars[v].y < inter.y && this.cars[v].s == 0){
                        ld++;
                      }
                    }
                    if((ld-1)>lc){
                      c.x = inter.x + 36;
                      c.s = 0;
                    }
                    else{
                      c.s = 0;
                    }
                    var dc = this.distance_check(c,c2,"y");
                    if(dc == true){
                      c.s = 0;
                    }
                  }
                  else{
                    c.s = 0;
                  }
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
                    c.s = 5;
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
            //console.log("reposition" + " south");
            c.y = 365;
            c.x = 120.5;
            c.d = "n";
            c.y += c.s;
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
                  //for road with 2 lanes on x axis
                  if(inter.height == 80){
                    // # cars waiting at top lane when meeting the inter
                    var lc = 0;
                    // # cars waiting at bottom lane
                    var ld = 0;
                    //for loop to check how many cars waiting at each lane when meeting the inter
                    for(var v=0;v<this.cars.length;v++){
                      if(this.cars[v].y == (inter.y + 22) && this.cars[v].x > inter.x && this.cars[v].s == 0){
                        lc++;
                      }
                      if(this.cars[v].y == c.y && this.cars[v].x > inter.x && this.cars[v].s == 0){
                        ld++;
                      }
                    }
                    // if #cars at bot>2+#cars at top, set driving car's position to top lane
                    if((ld-2)>lc){
                      c.y = inter.y + 22;
                      c.s = 0;
                    }
                    //otherwise, stop because collision exits, it will stop behind the car
                    else{
                      c.s = 0;
                    }
                    //check collision after reseting the car's position or when it stops for waiting
                    var dc = this.distance_check(c,c2,"-x");
                    //if it for sure has collision, stop
                    if(dc == true){
                      c.s = 0;
                    }
                  }
                  //for road with only 1 lane on x axis, stop the car because of the collision existance
                  else{
                    c.s = 0;
                  }
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
                  }
                  //green go
                  else{
                    //green
                    c.s = 5;
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
            c.y = 40;
            c.x = this.w+25;
            c.d = "w";
            c.x -= c.s;
            
          }
          c.x -= c.s;
        }
        c.drawCar();
      }
    }
    
    intersections(): void{
      var index = 0;
      for(var i=0;i<this.roads.length;i++){
        var r1 = this.roads[i];
        for(var j=0;j<this.roads.length;j++){
          var r2 = this.roads[j];
          if(r1.width > r1.height){
            if(r2.width < r2.height){
              if((r1.x + r1.width) > r2.x && r1.x <= r2.x){
                if((r2.y + r2.height) >= r1.y && r2.y <= r1.y){
                  //console.log("intersection found at ("+r1.y+","+r2.x+")");
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
                  
                  var inter = new drawIntersection(this);
                  inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
                  // console.log("inter.x: "+inter.x+", inter.y: "+inter.y);
                  // console.log("inter.w: "+inter.width+", inter.h: "+inter.height);
                  this.intersections_arr.push(inter);
                  index++;
                  inter.drawInter(index);
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
      this.y = 40;
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

    constructor(map: tMap){
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;
      this.roadtop = true;
      this.roadleft = true;
      this.roadbottom = true;
      this.roadright = true;
      this.ctx = map.ctx;
      if(map.left_green == true){
        console.log("left green");
        this.right = "rgba(0,255,0,0.4)";
        this.left = "rgba(0,255,0,0.4)";
        this.top = "rgba(255,0,0,0.4)";
        this.bottom = "rgba(255,0,0,0.4)";
      }
      else{
        this.right = "rgba(255,0,0,0.4)";
        this.left = "rgba(255,0,0,0.4)";
        this.top = "rgba(0,255,0,0.4)";
        this.bottom = "rgba(0,255,0,0.4)";
      }
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
      
      console.log(shadow_color);
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
      
      if(this.height > 40){
        this.ctx.save();
        if(this.left == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        this.ctx.fillStyle = shadow_color;
        this.ctx.shadowColor = shadow_color
        this.ctx.shadowOffsetX = -2;
        this.ctx.shadowBlur = 2;
        /**
          * Left Traffic Light at Left side
          */
        //this.ctx.fillRect(this.x-3,this.y+this.height-30,6,6);
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowOffsetX = undefined;
        this.ctx.shadowBlur = undefined;
      }
      
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
      
      if(this.width > 40){
        this.ctx.save();
        if(this.top == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        this.ctx.fillStyle = shadow_color;
        this.ctx.shadowColor = shadow_color
        this.ctx.shadowOffsetY = -2;
        this.ctx.shadowBlur = 2;
        /**
         * Left Traffic Light at Top side
         */
        this.ctx.fillRect(this.x+28,this.y-2,6,6);
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.shadowOffsetX = undefined;
        this.ctx.shadowBlur = undefined;
      }
      
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
      this.ctx.fillStyle = "#605A4C";
      this.ctx.fillRect(this.x,this.y,this.width,this.height);
      
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
      this.ctx.fillText(interName, this.x+this.width/9, this.y+this.height/3);    
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