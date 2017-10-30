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
      public svgDiv: HTMLDivElement;
      public canvas: HTMLCanvasElement;
      public boxDiv: HTMLDivElement;
      public brCarNum: HTMLBRElement;
      public brLine: HTMLBRElement;
      public inputRange: HTMLInputElement;
      public spanCar_no: HTMLSpanElement;
      public scriptSim: HTMLScriptElement;

      constructor() {
        super();
        this.svgDiv = <HTMLDivElement><any>document.getElementById("svgcanvas");
        this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName("canvas")[0];
        this.boxDiv = <HTMLDivElement><any>document.getElementsByClassName("box")[0];
        this.brCarNum = <HTMLBRElement><any>document.getElementsByTagName("br")[0];
        this.brLine = <HTMLBRElement><any>document.getElementsByTagName("br")[1];
        this.inputRange = <HTMLInputElement><any>document.getElementsByTagName("input")[0];
        this.spanCar_no = <HTMLSpanElement><any>document.getElementsByTagName("span")[0]
        this.scriptSim = <HTMLScriptElement><any>document.getElementById("js3");
      }

      initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
        document.body.innerHTML = ''; // clear children
        this.spanCar_no.nodeValue = "10";
        this.boxDiv.nodeValue = "Number of Cars:";
        this.boxDiv.appendChild(this.brCarNum);
        this.boxDiv.appendChild(this.brLine);
        this.boxDiv.appendChild(this.inputRange);
        this.boxDiv.appendChild(this.spanCar_no);
        this.svgDiv.appendChild(this.canvas);        
        this.svgDiv.appendChild(this.boxDiv);        
        document.body.appendChild(this.svgDiv);      
        document.body.appendChild(this.scriptSim);    
        return Promise.resolve();
      }   

      setTrafficLight(){
        // ctx.save()
        // ctx.fillStyle = 'green';
        // ctx.fillRect(10,10,50,50);
        // ctx.fill();
        // ctx.restore();
        // console.log("end1");
      }
    }  
}



var requestAnimFrame: (callback: () => void) => void = (function(){ 
  return window.requestAnimationFrame || 
  (<any>window).webkitRequestAnimationFrame || 
  (<any>window).mozRequestAnimationFrame || 
  (<any>window).oRequestAnimationFrame || 
  (<any>window).msRequestAnimationFrame || 
  function(callback: any){ 
      window.setTimeout(callback, 1000 / 60, new Date().getTime()); 
  }; 
})(); 

var car_no = 10; 
var canvas: HTMLCanvasElement = <HTMLCanvasElement><any>document.getElementsByTagName("canvas")[0];
var ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

let w: number = 370;
let h: number = 270;
canvas.width = w;
canvas.width = h; 
let roads: any[] = [];
let intersections_arr: any[] = [];
let cars: any[] = [];   

//initiate the parameters
function init(): any{
  //Launch Cars
  cars = [];
  roads = [];
  intersections_arr = [];
  //var car_no: any = $("input").val();
  //$(".car_no").html(car_no);
  var car_no: any = document.getElementsByTagName('input')[0].getAttribute("value");
  document.getElementsByClassName("car_no")[0].innerHTML=car_no;
  for(var i=0;i<car_no;i++){
    var car = new drawcar();
    car.s = 5;
    var pos_rand = Math.random();
    if(pos_rand < 0.5){
      car.x = w+25;
      car.y = 41;
      car.d = "w";
    }
    else{
      car.x = 120;
      car.y = h+25;
      car.d = "n";
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
    cars.push(car);	
  }
  
  //road1
  var road = new drawroad();
  road.x = 0, road.y = ((h/4)-30), road.width = w, road.height = 40;
  roads.push(road);
  
  //road2
  var road = new drawroad();
  road.x = ((w/2)-120), road.y = 0, road.width = 80, road.height = h;
  roads.push(road);
  
  // //road3
  var road = new drawroad();
  road.x = 0, road.y = (h/1.4), road.width = w, road.height = 40;
  roads.push(road);
  
  //road4
  var road = new drawroad();
  road.x = ((w/2)+80), road.y = 0, road.width = 40, road.height = h;
  roads.push(road);
  
  intersections();
}

//draw the map
function drawscene(): any{
  intersections_arr = [];
  //console.log("drawingscene");
  
  ctx.fillStyle = "#4DBB4C";
  ctx.fillRect(0,0,w,h);
  
  for(var i=0;i<roads.length;i++){
    roads[i].drawRoad();
  }
  intersections();
  drive_cars();
}

var left_green: boolean = false;      
// setInterval("left_greenc()",3000);         

function left_greenc(): void{
  left_green = !left_green;
}

function distance_check(c1: any, c2: any, axis: string): any{
  if(axis=="x"){
    var dist: number = c2.x - c1.x;
    var disty: number = c2.y - c1.y;
    if(dist>0 && dist<=(c1.l+15)){
      if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
        return true;
      }
    }
  }
  else if(axis=="-x"){
    var dist: number = c1.x - c2.x;
    var disty: number = c1.y - c2.y;
    if(dist>0 && dist<=(c1.l+15)){
      if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
        return true;
      }
    }
  }
  else if(axis=="-y"){
    var dist: number = c1.x - c2.x;
    var disty: number = c1.y - c2.y;
    if(disty>0 && disty<=(c1.l+15)){
      if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
        return true;
      }
    }
  }
  else if(axis=="y"){
    var dist: number= c2.x - c1.x;
    var disty: number = c2.y - c1.y;
    if(disty>0 && disty<=(c1.l+15)){
      if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
        return true;
      }
    }
  }
}

function check_inter(c: any, inter: any, axis: string): any{
  if(axis == "x"){
    if(inter.height > 40){
      if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
        if(c.y-80 <= inter.y && c.y+42 >= inter.y){
          return true;
        }
      }
    }
    else{
      if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
        if(c.y-40 <= inter.y && c.y+42 >= inter.y){
          return true;
        }
      }
    }
  }
  else if(axis == "-x"){
    if(inter.height > 40){
      if((c.x - inter.x) > (c.l+8) && (c.x - inter.x) <= (c.l+inter.width + 5)){
        if(c.y-80 <= inter.y && c.y+42 >= inter.y){
          return true;
        }
      }
    }
    else{
      if((c.x - inter.x) > (c.l+8) && (c.x - inter.x) <= (c.l+inter.width + 5)){
        if(c.y-40 <= inter.y && c.y+42 >= inter.y){
          return true;
        }
      }
    }
  }
  else if(axis == "-y"){
    if(inter.width > 40){
      if((c.y - inter.y) > (c.l+8) && (c.y - inter.y) <= (c.l+inter.height +5)){
        if(c.x-80 <= inter.x && c.x+42 >= inter.x){
          return true;
        }
      }
    }
    else{
      if((c.y - inter.y) > (c.l+8) && (c.y - inter.y) <= (c.l+inter.height + 5)){
        if(c.x-40 <= inter.x && c.x+42 >= inter.x){
          return true;
        }
      }
    }
  }
  else if(axis == "y"){
    if(inter.width > 40){
      if((inter.y - c.y) > (c.l+8) && (inter.y - c.y) <= (c.l + 27)){
        if(c.x-80 <= inter.x && c.x+42 >= inter.x){
          return true;
        }
      }
    }
    else{
      if((inter.y - c.y) > (c.l+8) && (inter.y - c.y) <= (c.l + 27)){
        if(c.x-40 <= inter.x && c.x+42 >= inter.x){
          return true;
        }
      }
    }
  }
}      

function gen_dir(c: any, inter: any): any{
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
          var dir: any = "s";
          c.d = "s";
          c.x = inter.x + 10;
          c.y = inter.y + inter.height - 27;
        }
        else{
          if(inter.roadright == true){
            var dir: any = c.d;
          }
          else{
            //turn
          }
        }
      }
      else if(rand_dir > 3 && rand_dir < rand_no2){
        if(inter.roadtop == true){
          var dir: any = "n";
          c.d = "n";
          c.x = inter.x + inter.width - 9;
          c.y = inter.y + c.l + 2;
        }
        else{
          if(inter.roadright == true){
            var dir: any = c.d;
          }
          else{
            //turn
          }
        }
      }
      else{
        if(inter.roadright == true){
          var dir: any = c.d;
        }
        else{
          //turn
          var dir: any = "s";
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
          var dir: any = "s";
          c.d = "s";
          c.x = inter.x + 20;
          c.y = inter.y + inter.height + c.l +2;
        }
        else{
          if(inter.roadleft == true){
            var dir: any = c.d;
          }
          else{
            //turn
          }
        }
      }
      else if(rand_dir > 3 && rand_dir < rand_no2){
        if(inter.roadtop == true){
          var dir: any = "n";
          c.d = "n";
          c.x = inter.x + inter.width + 1;
          c.y = inter.y + c.l - 30;
        }
        else{
          if(inter.roadleft == true){
            var dir: any = c.d;
          }
          else{
            //turn
          }
        }
      }
      else{
        if(inter.roadleft == true){
          var dir: any = c.d;
        }
        else{
          //turn
          var dir: any = "n";
          c.d = "n";
          c.x = inter.x + inter.width + 1;
          c.y = inter.y + c.l + 2;
        }
      }
    }
    else if(c.d=="n"){
      if(rand_dir < 3){
        if(inter.roadright == true){
          var dir: any = "e";
          c.d = "e";
          c.y = inter.y + inter.height - 10;
          c.x = inter.x + inter.width + 1;
        }
        else{
        }
      }
      else if(rand_dir > 3 && rand_dir < 6){
        if(inter.roadleft == true){
          var dir: any = "w";
          c.d = "w";
          c.y = inter.y + 8;
          c.x = inter.x + 5;
        }
        else{
        }
        
      }
        else{
          if(inter.roadtop == true){
            var dir: any = c.d;
          }
          else{
            //turn
            var dir: any = "w";
            c.d = "w";
            c.y = inter.y + 8;
            c.x = inter.x + 5;
          }
        }
    }
    else if(c.d=="s"){
      if(rand_dir < 3){
        if(inter.roadright == true){
          var dir: any = "e";
          c.d = "e";
          c.y = inter.y + inter.height - 21;
          c.x = inter.x + inter.width + 1;
        }
        else{
          if(inter.roadbottom == true){
            var dir: any = c.d;
          }
          else{
            //turn
            c.s = 0;
          }
        }
      }
      else if(rand_dir > 3 && rand_dir < 6){
        if(inter.roadleft == true){
          var dir: any = "w";
          c.d = "w";
          c.y = inter.y - 2;
          c.x = inter.x - 28;
        }
        else{
          if(inter.roadbottom == true){
            var dir: any = c.d;
          }
          else{
            //turn
            c.s = 0;
          }
        }
      }
      else{
        if(inter.roadleft == true){
          var dir: any = "w";
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

function drive_cars(): any{
  for(var i=0;i<cars.length;i++){
    var c = cars[i];
    c.s = 5;
    if(c.d == "e"){
      for(var l=0;l<cars.length;l++){
        var c2 = cars[l];
        var dc = distance_check(c,c2,"x");
        if(dc == true){
          c.s = 0;
          for(var k=0;k<intersections_arr.length;k++){
            var inter = intersections_arr[k];
            if(inter.y + inter.height > c.y && inter.y < c.y){
              //this is road
              if(inter.height == 80){
                var lc = 0;
                var ld = 0;
                for(var v=0;v<cars.length;v++){
                  if(cars[v].y == (inter.y + 44) && cars[v].x < inter.x && cars[v].s == 0){
                    lc++;
                  }
                  if(cars[v].y == c.y && cars[v].x < inter.x && cars[v].s == 0){
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
                var dc = distance_check(c,c2,"x");
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
          for(var k=0;k<intersections_arr.length;k++){
            var inter = intersections_arr[k];
            if(check_inter(c, inter, "x")){
              counter++;
              if(inter.left == "rgba(255,0,0,0.4)"){
                //red
                c.s = 0;
              }
              else{
                //green
                c.s = 5;
                //figure dir
                gen_dir(c, inter);
              }
            }
          }
          if(counter==0){
            //car past intersection reset random generator
            c.dd = false;	
          }
        }
      }
      if(c.x+26 >= canvas.width){
        //reposition car
        c.x = -25;
        c.y = 444;
        c.x = -25;
        c.d = "e";
        c.y -= c.s;
      }
      c.x += c.s;
    }
    else if(c.d == "n"){
      for(var l=0;l<cars.length;l++){
        var c2 = cars[l];
        var dc = distance_check(c,c2,"-y");
        if(dc == true){
          c.s = 0;
          for(var k=0;k<intersections_arr.length;k++){
            var inter = intersections_arr[k];
            if(inter.x + inter.width > c.x && inter.x < c.x){
              //this is road
              if(inter.width == 80){
                var lc = 0;
                var ld = 0;
                for(var v=0;v<cars.length;v++){
                  if(cars[v].x == (inter.x + 55) && cars[v].y < inter.y && cars[v].s == 0){
                    lc++;
                  }
                  if(cars[v].x == c.x && cars[v].y < inter.y && cars[v].s == 0){
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
                var dc = distance_check(c,c2,"-y");
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
          for(var k=0;k<intersections_arr.length;k++){
            var inter = intersections_arr[k];
            if(check_inter(c, inter, "-y")){
              counter++;
              if(inter.bottom == "rgba(255,0,0,0.4)"){
                //red
                c.s = 0;
              }
              else{
                //green
                c.s = 5;
                //figure dir
                gen_dir(c, inter);
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
        c.x = 786;
        c.y = h+25;
        c.d = "n";
        c.y -= c.s;
      }
      c.y -= c.s;
    }
      else if(c.d == "s"){
        for(var l=0;l<cars.length;l++){
          var c2 = cars[l];
          var dc = distance_check(c,c2,"y");
          if(dc == true){
            c.s = 0;
            for(var k=0;k<intersections_arr.length;k++){
              var inter = intersections_arr[k];
              if(inter.x + inter.width > c.x && inter.x < c.x){
                //this is road
                if(inter.width == 80){
                  var lc = 0;
                  var ld = 0;
                  for(var v=0;v<cars.length;v++){
                    if(cars[v].x == (inter.x + 36) && cars[v].y < inter.y && cars[v].s == 0){
                      lc++;
                    }
                    if(cars[v].x == c.x && cars[v].y < inter.y && cars[v].s == 0){
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
                  var dc = distance_check(c,c2,"y");
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
            for(var k=0;k<intersections_arr.length;k++){
              var inter = intersections_arr[k];
              if(check_inter(c, inter, "y")){
                counter++;
                if(inter.top == "rgba(255,0,0,0.4)"){
                  //red
                  c.s = 0;
                }
                else{
                  //green
                  c.s = 5;
                  //figure dir
                  gen_dir(c, inter);
                }
              }
            }
            if(counter==0){
              //car past intersection reset random generator
              c.dd = false;	
            }
          }
        }
        if(c.y-26 >= h){
          //reposition car
          c.y = 368;
          c.x = w+25;
          c.d = "w";
          c.y += c.s;
        }
        c.y += c.s;
      }
      else if(c.d == "w"){
        for(var l=0;l<cars.length;l++){
          var c2 = cars[l];
          var dc = distance_check(c,c2,"-x");
          if(dc == true){
            c.s = 0;
            for(var k=0;k<intersections_arr.length;k++){
              var inter = intersections_arr[k];
              if(inter.y + inter.height > c.y && inter.y < c.y){
                //this is road
                if(inter.height == 80){
                  var lc = 0;
                  var ld = 0;
                  for(var v=0;v<cars.length;v++){
                    if(cars[v].y == (inter.y + 22) && cars[v].x > inter.x && cars[v].s == 0){
                      lc++;
                    }
                    if(cars[v].y == c.y && cars[v].x > inter.x && cars[v].s == 0){
                      ld++;
                    }
                  }
                  if((ld-2)>lc){
                    c.y = inter.y + 22;
                    c.s = 0;
                  }
                  else{
                    c.s = 0;
                  }
                  var dc = distance_check(c,c2,"-x");
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
            for(var k=0;k<intersections_arr.length;k++){
              var inter = intersections_arr[k];
              if(check_inter(c, inter, "-x")){
                counter++;
                if(inter.right == "rgba(255,0,0,0.4)"){
                  //red
                  c.s = 0;
                }
                else{
                  //green
                  c.s = 5;
                  //figure dir
                  gen_dir(c, inter);
                }
              }
            }
            if(counter==0){
              //car past intersection reset random generator
              c.dd = false;	
            }
          }
        }
        if(c.x+26 <= 0){
          //reposition car
          c.y = 444;
          c.x = -25;
          c.d = "e";
          c.y -= c.s;
          
        }
        c.x -= c.s;
      }
        c.drawCar();
  }
}

Object.getPrototypeOf(ctx).rounded_rect = function(x:any,y:any,w:any,h:any,r:any){
  if (typeof r === "undefined") {
    r = 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.lineTo(x + w - r, y);
  this.quadraticCurveTo(x + w, y, x + w, y + r);
  this.lineTo(x + w, y + h - r);
  this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  this.lineTo(x + r, y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r);
  this.lineTo(x, y + r);
  this.quadraticCurveTo(x, y, x + r, y);
  this.closePath();
  this.fill();
}   

class drawcar{
  public x: number;
  public y: number;
  public s: number;
  public l: number;
  public d: string;
  public dd: boolean;
  public color: string;

  public drawCar(): void{
    ctx.fillStyle = this.color;
    if(this.d == "w"){
      w = 25;
      ctx.fillRect(this.x, this.y, this.l, 12);
      ctx.fillStyle="#99B3CE";
      ctx.fillRect(this.x+5, this.y, 5, 12);
      ctx.fillRect(this.x+18, this.y, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x+6, this.y-2, 2 ,2);
      ctx.fillRect(this.x+6, this.y+12, 2 ,2);
    }
    else if(this.d == "e"){
      w = 25;
      ctx.fillRect(this.x, this.y, this.l, 12);
      ctx.fillStyle="#99B3CE";
      ctx.fillRect(this.x+15, this.y, 5, 12);
      ctx.fillRect(this.x+4, this.y, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x+14, this.y-2, 2 ,2);
      ctx.fillRect(this.x+14, this.y+12, 2 ,2);
    }
    else if(this.d == "s"){
      w = 12;
      ctx.rotate(Math.PI/2);
      ctx.fillRect(this.y, -this.x, this.l, 12);
      ctx.fillStyle="#99B3CE";
      ctx.fillRect(this.y+15, -this.x, 5, 12);
      ctx.fillRect(this.y+4, -this.x, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.y+14, -this.x-2, 2 ,2);
      ctx.fillRect(this.y+14, -this.x+12, 2 ,2);
      ctx.rotate(-Math.PI/2);
      
    }
    else{
      w = 12;
      ctx.rotate(Math.PI/2);
      ctx.fillRect(this.y, -this.x, this.l, 12);
      ctx.fillStyle="#99B3CE";
      ctx.fillRect(this.y+5, -this.x, 5, 12);
      ctx.fillRect(this.y+18, -this.x, 2, 12);
      ctx.fillStyle = this.color;
      ctx.fillRect(this.y+6, -this.x-2, 2 ,2);
      ctx.fillRect(this.y+6, -this.x+12, 2 ,2);
      ctx.rotate(-Math.PI/2);
    }
  }

}

class drawIntersection{
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

  constructor(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.roadtop = true;
    this.roadleft = true;
    this.roadbottom = true;
    this.roadright = true;
    if(left_green == true){
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
  
  public drawInter(): any{
    ctx.fillStyle = "#605A4C";
    ctx.fillRect(this.x,this.y,this.width,this.height);
    
    //zebra-crossing (left)
    if(this.roadleft == true){
      ctx.fillStyle = "#605A4C";
      ctx.fillRect(this.x-20,this.y,20,this.height);
      ctx.beginPath();
      ctx.setLineDash([1,5]);
      ctx.moveTo(this.x-12, this.y);
      ctx.lineTo(this.x-12, (this.y + this.height));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 10;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x-22,(this.height/2)+this.y-1,2,(this.height/2)+1);
      if(this.height > 40){
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x-52,(this.height/(4/3))+this.y-2,30,2);
      }
    }
    //zebra-crossing (right)
    if(this.roadright == true){
      ctx.fillStyle = "#605A4C";
      ctx.fillRect(this.x+this.width,this.y,22,this.height);
      ctx.beginPath();
      ctx.setLineDash([1,5]);
      ctx.moveTo(this.x+this.width+12, this.y);
      ctx.lineTo(this.x+this.width+12, (this.y + this.height));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 10;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x+this.width+22,this.y,2,(this.height/2)+1);
      if(this.height > 40){
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x+this.width+22,(this.height/4)+this.y-2,30,2);
      }
    }
    //zebra-crossing (top)
    if(this.roadtop == true){
      ctx.fillStyle = "#605A4C";
      ctx.fillRect(this.x,this.y-20,this.width,20);
      ctx.beginPath();
      ctx.setLineDash([1,5]);
      ctx.moveTo(this.x, this.y-12);
      ctx.lineTo((this.x + this.width), this.y-12);
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 10;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x,this.y-21,(this.width/2)+1,2);
      if(this.width > 40){
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x+(this.width/4)-2,this.y-50,2,30);
      }
    }
    //zebra-crossing (bottom)
    if(this.roadbottom == true){
      ctx.fillStyle = "#605A4C";
      ctx.fillRect(this.x,this.y+this.height,this.width,20);
      ctx.beginPath();
      ctx.setLineDash([1,5]);
      ctx.moveTo(this.x, this.y+this.height+12);
      ctx.lineTo((this.x + this.width), this.y+this.height+12);
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 10;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x+this.width-(this.width/2)-1,this.y+this.height+20,(this.width/2)+1,2);
      if(this.width > 40){
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x+(this.width/(4/3))-2,this.y+this.height+20,2,30);
      }
    }
    
    //1. traffic lights (left)
    if(this.roadleft == true){
      ctx.save();
      
      if(this.left == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      ctx.fillStyle = shadow_color;
      ctx.shadowColor = shadow_color
      ctx.shadowOffsetX = -2;
      ctx.shadowBlur = 2;
      /**
       * Right Traffic Light at Left side
       */
      //ctx.fillRect(this.x-3,this.y+this.height-12,6,6);
      ctx.fill();
      ctx.restore();
      ctx.shadowOffsetX = undefined;
      ctx.shadowBlur = undefined;
      
      if(this.height > 40){
        ctx.save();
        if(this.left == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        ctx.fillStyle = shadow_color;
        ctx.shadowColor = shadow_color
        ctx.shadowOffsetX = -2;
        ctx.shadowBlur = 2;
        /**
         * Left Traffic Light at Left side
         */
        //ctx.fillRect(this.x-3,this.y+this.height-30,6,6);
        ctx.fill();
        ctx.restore();
        ctx.shadowOffsetX = undefined;
        ctx.shadowBlur = undefined;
      }
      
      ctx.fillStyle = "#ddd";
      ctx.fillRect(this.x-3,this.y+this.height-(this.height/2)+3,1,(this.height/2));						
    }

    //2. traffic lights (right)
    if(this.roadright == true){
      ctx.save();
      if(this.right == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      ctx.fillStyle = shadow_color;
      ctx.shadowColor = shadow_color
      ctx.shadowOffsetX = 2;
      ctx.shadowBlur = 2;
      /**
       * Left Traffic Light at Right side
       */
      //ctx.fillRect(this.x+this.width+2,this.y+12,6,6);
      ctx.fill();
      ctx.restore();
      ctx.shadowOffsetX = undefined;
      ctx.shadowBlur = undefined;
      
      if(this.height > 40){
        ctx.save();
        if(this.right == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        ctx.fillStyle = shadow_color;
        ctx.shadowColor = shadow_color
        ctx.shadowOffsetX = 2;
        ctx.shadowBlur = 2;
        /**
         * Right Traffic Light at Right side
         */
        //ctx.fillRect(this.x+this.width+2,this.y+30,6,6);
        ctx.fill();
        ctx.restore();
        ctx.shadowOffsetX = undefined;
        ctx.shadowBlur = undefined;
      }
      
      ctx.fillStyle = "#ddd";
      ctx.fillRect(this.x+this.width+2,this.y-3,1,(this.height/2));		
    }

    //3. traffic lights (top)
    if(this.roadtop == true){
      ctx.save();
      if(this.top == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      ctx.fillStyle = shadow_color;
      ctx.shadowColor = shadow_color
      ctx.shadowOffsetY = -2;
      ctx.shadowBlur = 2;
      /**
       * Right Traffic Light at Top side
       */
      //ctx.fillRect(this.x+4,this.y-2,6,6);
      ctx.fill();
      ctx.restore();
      ctx.shadowOffsetX = undefined;
      ctx.shadowBlur = undefined;
      
      if(this.width > 40){
        ctx.save();
        if(this.top == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        ctx.fillStyle = shadow_color;
        ctx.shadowColor = shadow_color
        ctx.shadowOffsetY = -2;
        ctx.shadowBlur = 2;
        /**
        * Left Traffic Light at Top side
        */
        //ctx.fillRect(this.x+28,this.y-2,6,6);
        ctx.fill();
        ctx.restore();
        ctx.shadowOffsetX = undefined;
        ctx.shadowBlur = undefined;
      }
      
      ctx.fillStyle = "#ddd";
      ctx.fillRect(this.x-3,this.y-2,(this.width/2),1);
    }

    //4. traffic lights (bottom)
    if(this.roadbottom == true){
      ctx.save();
      if(this.bottom == "rgba(0,255,0,0.4)"){
        //green
        var shadow_color = 'rgba(0,255,0,1)';
      }
      else{
        var shadow_color = 'rgba(255,0,0,1)';
      }
      
      ctx.fillStyle = shadow_color;
      ctx.shadowColor = shadow_color
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 2;
      /**
       * Traffic Light on the right at Bottom side
       */
      //ctx.fillRect(this.x+this.width-10,this.y+this.height+2,6,6);
      ctx.fill();
      ctx.restore();
      ctx.shadowOffsetX = undefined;
      ctx.shadowBlur = undefined;
      
      if(this.width > 40){
        ctx.save();
        if(this.bottom == "rgba(0,255,0,0.4)"){
          //green
          var shadow_color = 'rgba(0,255,0,1)';
        }
        else{
          var shadow_color = 'rgba(255,0,0,1)';
        }
        
        ctx.fillStyle = shadow_color;
        ctx.shadowColor = shadow_color
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        /**
        * Traffic Light on the left at Bottom side
        */
        //ctx.fillRect(this.x+this.width-32,this.y+this.height+2,6,6);
        ctx.fill();
        ctx.restore();
        ctx.shadowOffsetX = undefined;
        ctx.shadowBlur = undefined;
      }
      
      ctx.fillStyle = "#ddd";
      ctx.fillRect(this.x+(this.width/2)+3,this.y+this.height+2,(this.width/2),1);
    }
  }
}

function intersections(): any{
  for(var i=0;i<roads.length;i++){
    var r1 = roads[i];
    for(var j=0;j<roads.length;j++){
      var r2 = roads[j];
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
              
              var inter = new drawIntersection();
              inter.drawInter();
              inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
              intersections_arr.push(inter);
              inter.drawInter();
            }
          }
        }
      }
    }
  }
}

class drawroad{
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  
  constructor(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.color = "#605A4C";
  }

  public drawRoad(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
    
    ctx.fillStyle = "#A68B44";
    if(this.width < this.height && this.width > 40){
      ctx.fillRect(this.x+((this.width/2)-1),this.y,2,this.height);
      
      ctx.beginPath();
      ctx.setLineDash([2,5]);
      ctx.moveTo(this.x+((this.width/4)-1), this.y);
      ctx.lineTo(this.x+((this.width/4)-1), (this.y + this.height));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.setLineDash([2,5]);
      ctx.moveTo(this.x+((this.width/(4/3))-1), this.y);
      ctx.lineTo(this.x+((this.width/(4/3))-1), (this.y + this.height));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x-10,this.y,10,this.height);
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x+this.width,this.y,10,this.height);
      
    }
    else if(this.width > this.height && this.height > 40){
      ctx.fillRect(this.x,this.y+((this.height/2)-1),this.width,2);
      
      ctx.beginPath();
      ctx.setLineDash([2,5]);
      ctx.moveTo(this.x, this.y+((this.height/4)-1));
      ctx.lineTo((this.x+this.width), this.y+((this.height/4)-1));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.setLineDash([2,5]);
      ctx.moveTo(this.x, this.y+((this.height/(4/3))-1));
      ctx.lineTo((this.x+this.width), this.y+((this.height/(4/3))-1));
      ctx.closePath();
      ctx.strokeStyle = "#A09383";
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x,this.y-10,this.width,10);
      ctx.fillStyle = "#A09383";
      ctx.fillRect(this.x,this.y+this.height,this.width,10);
      
    }
      else if(this.width > this.height && this.height < 41){
        ctx.fillRect(this.x,this.y+((this.height/2)-1),this.width,2);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x,this.y-10,this.width,10);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x,this.y+this.height,this.width,10);
      }
      else if(this.width < this.height && this.width < 41){
        ctx.fillRect(this.x+((this.width/2)-1),this.y,2,this.height);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x-10,this.y,10,this.height);
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x+this.width,this.y,10,this.height);
      } 
  }
}

function animloop(): any{
    drawscene();
    requestAnimFrame(animloop); 
}
init();
animloop();