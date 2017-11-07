/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
declare interface  CanvasRenderingContext2D {
  rounded_rect(x:any,y:any,w:any,h:any,r:any) : void;
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
   public canvas_width: number;
   public canvas_height: number;
   public roads: any[];
   public cars: any[];
   public intersections_arr: any[];
   public left_green: boolean;
   
   constructor() {
     super();
     this.svgDiv = <HTMLDivElement><any>document.getElementById("svgcanvas");
     this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName("canvas")[0];
     this.scriptSim = <HTMLScriptElement><any>document.getElementById("js3");
     this.car_no = 10, this.canvas_width = 370, this.canvas_height = 270;
     this.roads = [], this.cars = [], this.intersections_arr = [];
     this.left_green = false; 
   }

   initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
     document.body.innerHTML = ''; // clear children
     this.svgDiv.appendChild(this.canvas);        
     document.body.appendChild(this.svgDiv);      
     document.body.appendChild(this.scriptSim); 
     let tMap = new jsLib.tMap();
     tMap.tMapInit();
     tMap.tMapAnim();
     // jsLib.init();
     // jsLib.animloop();
     return Promise.resolve();
   }   



 }  
}

namespace jsLib{

export class tMap{
 public b: pxsim.Board;
 constructor(){
   this.b = new pxsim.Board();
 }
 tMapInit(){
   init();
 }
 tMapAnim(){
   animloop();
 }
}

var map = new tMap();
var b: pxsim.Board = map.b;
var car_no = b.car_no;  
var canvas: HTMLCanvasElement =  b.canvas;
var ctx: CanvasRenderingContext2D = b.canvas.getContext("2d");

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

let w: number = b.canvas_width;
let h: number = b.canvas_height;
canvas.width = w;
canvas.height = h; 
let roads: any[] = b.cars;
let intersections_arr: any[] = b.roads;
let cars: any[] = b.intersections_arr;  
var left_green: boolean = b.left_green;         
setInterval(()=>jsLib.left_greenc(),3000);  

//initiate the parameters
export function init(): any{
 //Launch Cars
 cars = [];
 roads = [];
 intersections_arr = [];
 for(var i=0;i<car_no;i++){
   var car = new drawcar();
   car.s = 5;
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
   cars.push(car);	
   //console.log("car.d: "+car.d);
 }
 
 //road1
 var road = new drawroad();
 road.x = 0, road.y = ((h/4)-30), road.width = w, road.height = 40;
 roads.push(road);
 
 //road2
 var road = new drawroad();
 road.x = ((w/2)-120), road.y = 0, road.width =80, road.height = h;
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

export function left_greenc(): void{
 b.left_green = !b.left_green;
 left_green = b.left_green;
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

function gen_dir(c: drawcar, inter: any): any{
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

function drive_cars(): any{
 for(var i=0;i<cars.length;i++){
   var c = cars[i];
   //console.log("drive car.d: "+c.d);
   
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
       //console.log("reposition " + "east");
       c.x = 295;
       c.y = 46.5;
       c.d = "w";
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
       //console.log("reposition" + " north");
       c.x = 120.5;
       c.y = h+25;
       c.d = "s";
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
     for(var l=0;l<cars.length;l++){
       var c2 = cars[l];
       //check collision between cars when facing west
       var dc = distance_check(c,c2,"-x");
       //dc==true means collision exits
       if(dc == true){
         c.s = 0;
         for(var k=0;k<intersections_arr.length;k++){
           var inter = intersections_arr[k];
           //if the car meets the inter
           if(inter.y + inter.height > c.y && inter.y < c.y){
             //for road with 2 lanes on x axis
             if(inter.height == 80){
               // # cars waiting at top lane when meeting the inter
               var lc = 0;
               // # cars waiting at bottom lane
               var ld = 0;
               //for loop to check how many cars waiting at each lane when meeting the inter
               for(var v=0;v<cars.length;v++){
                 if(cars[v].y == (inter.y + 22) && cars[v].x > inter.x && cars[v].s == 0){
                   lc++;
                 }
                 if(cars[v].y == c.y && cars[v].x > inter.x && cars[v].s == 0){
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
               var dc = distance_check(c,c2,"-x");
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
         for(var k=0;k<intersections_arr.length;k++){
           var inter = intersections_arr[k];
           //true means meets
           if(check_inter(c, inter, "-x")){
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
               gen_dir(c, inter);
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
       c.x = w+25;
       c.d = "w";
       c.x -= c.s;
       
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
 public x: number = w+25;
 public y: number = 40;
 //car speed
 public s: number = 5;
 public l: number = 25;
 //car direction
 public d: string = "w";
 public dd: boolean = false;
 public color: string = "#F5D600";
 public w: number;
 public turningS: boolean;

 public drawCar(): void{
   ctx.fillStyle = this.color;
   if(this.d == "w"){
     this.w = 25;
     ctx.rounded_rect(this.x, this.y, this.l, 12, 2);
     ctx.fillStyle="#99B3CE";
     ctx.fillRect(this.x+5, this.y, 5, 12);
     ctx.fillRect(this.x+18, this.y, 2, 12);
     ctx.fillStyle = this.color;
     ctx.fillRect(this.x+6, this.y-2, 2 ,2);
     ctx.fillRect(this.x+6, this.y+12, 2 ,2);
   }
   else if(this.d == "e"){
     this.w = 25;
     ctx.rounded_rect(this.x, this.y, this.l, 12, 2);
     ctx.fillStyle="#99B3CE";
     ctx.fillRect(this.x+15, this.y, 5, 12);
     ctx.fillRect(this.x+4, this.y, 2, 12);
     ctx.fillStyle = this.color;
     ctx.fillRect(this.x+14, this.y-2, 2 ,2);
     ctx.fillRect(this.x+14, this.y+12, 2 ,2);
   }
   else if(this.d == "s"){
     this.w = 12;
     ctx.rotate(Math.PI/2);
     ctx.rounded_rect(this.y, -this.x, this.l, 12, 2);
     ctx.fillStyle="#99B3CE";
     ctx.fillRect(this.y+15, -this.x, 5, 12);
     ctx.fillRect(this.y+4, -this.x, 2, 12);
     ctx.fillStyle = this.color;
     ctx.fillRect(this.y+14, -this.x-2, 2 ,2);
     ctx.fillRect(this.y+14, -this.x+12, 2 ,2);
     ctx.rotate(-Math.PI/2);
     
   }
   else{
     this.w = 12;
     ctx.rotate(Math.PI/2);
     ctx.rounded_rect(this.y, -this.x, this.l, 12, 2);
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
 
 public leftZebra(){
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
 }
 public rightZebra(){
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
 }
 public topZebra(){
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
 }
 public botZebra(){
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
 }

 public leftTrafficL(){
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
   ctx.fillRect(this.x-3,this.y+this.height-12,6,6);
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
 
 public rightTrafficL(){
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
   ctx.fillRect(this.x+this.width+2,this.y+12,6,6);
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
 public topTrafficL(){
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
   ctx.fillRect(this.x+4,this.y-2,6,6);
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
     ctx.fillRect(this.x+28,this.y-2,6,6);
     ctx.fill();
     ctx.restore();
     ctx.shadowOffsetX = undefined;
     ctx.shadowBlur = undefined;
   }
   
   ctx.fillStyle = "#ddd";
   ctx.fillRect(this.x-3,this.y-2,(this.width/2),1);
 }
 public botTrafficL(){
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
   ctx.fillRect(this.x+this.width-10,this.y+this.height+2,6,6);
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
     ctx.fillRect(this.x+this.width-32,this.y+this.height+2,6,6);
     ctx.fill();
     ctx.restore();
     ctx.shadowOffsetX = undefined;
     ctx.shadowBlur = undefined;
   }
   
   ctx.fillStyle = "#ddd";
   ctx.fillRect(this.x+(this.width/2)+3,this.y+this.height+2,(this.width/2),1);
 }

 public drawInter(index: number): any{
   ctx.fillStyle = "#605A4C";
   ctx.fillRect(this.x,this.y,this.width,this.height);
   
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
   var interName = "A" + index;
   ctx.fillStyle = "white"
   ctx.font = "15px serif"
   ctx.fillText(interName, this.x+this.width/9, this.y+this.height/3);    
   if(this.top == "rgba(0,255,0,0.4)"){
     ctx.lineWidth = 1;
     ctx.strokeStyle = '#000000';
     var interMidX = this.x+this.width/2;
     var interMidY = this.y+this.height/2;
     ctx.setLineDash([]);
     ctx.beginPath();
     ctx.moveTo(interMidX, interMidY);
     ctx.lineTo(interMidX, interMidY-this.height/4);
     ctx.lineTo(interMidX-this.height/12, interMidY-this.height/6);
     ctx.moveTo(interMidX, interMidY-this.height/4);
     ctx.lineTo(interMidX+this.height/12, interMidY-this.height/6);
     ctx.moveTo(interMidX,interMidX);
     ctx.closePath();
     ctx.stroke();
   }
   if(this.bottom == "rgba(0,255,0,0.4)"){
     ctx.lineWidth = 1;
     ctx.strokeStyle = '#000000';
     var interMidX = this.x+this.width/2;
     var interMidY = this.y+this.height/2;
     ctx.setLineDash([]);
     ctx.beginPath();
     ctx.moveTo(interMidX, interMidY);
     ctx.lineTo(interMidX, interMidY+this.height/4);
     ctx.lineTo(interMidX-this.height/12, interMidY+this.height/6);
     ctx.moveTo(interMidX, interMidY+this.height/4);
     ctx.lineTo(interMidX+this.height/12, interMidY+this.height/6);
     ctx.moveTo(interMidX,interMidX);
     ctx.closePath();
     ctx.stroke();
   }
   if(this.left == "rgba(0,255,0,0.4)"){
     ctx.lineWidth = 1;
     ctx.strokeStyle = '#000000';
     var interMidX = this.x+this.width/2;
     var interMidY = this.y+this.height/2;
     ctx.setLineDash([]);
     ctx.beginPath();
     ctx.moveTo(interMidX, interMidY);
     ctx.lineTo(interMidX-this.height/4, interMidY);
     ctx.lineTo(interMidX-this.height/4+this.height/12, interMidY-this.height/12);
     ctx.moveTo(interMidX-this.height/4, interMidY);
     ctx.lineTo(interMidX-this.height/4+this.height/12, interMidY+this.height/12);
     ctx.closePath();
     ctx.stroke();
   }
   if(this.right == "rgba(0,255,0,0.4)"){
     ctx.lineWidth = 1;
     ctx.strokeStyle = '#000000';
     var interMidX = this.x+this.width/2;
     var interMidY = this.y+this.height/2;
     ctx.setLineDash([]);
     ctx.beginPath();
     ctx.moveTo(interMidX, interMidY);
     ctx.lineTo(interMidX+this.height/4, interMidY);
     ctx.lineTo(interMidX+this.height/4-this.height/12, interMidY-this.height/12);
     ctx.moveTo(interMidX+this.height/4, interMidY);
     ctx.lineTo(interMidX+this.height/4-this.height/12, interMidY+this.height/12);
     ctx.closePath();
     ctx.stroke();
   }
  }
}

function intersections(): any{
 var index = 0;
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
             inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
             // console.log("inter.x: "+inter.x+", inter.y: "+inter.y);
             // console.log("inter.w: "+inter.width+", inter.h: "+inter.height);
             intersections_arr.push(inter);
             index++;
             inter.drawInter(index);
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
     ctx.rounded_rect(this.x-10,this.y,10,this.height, 2);
     ctx.fillStyle = "#A09383";
     ctx.rounded_rect(this.x+this.width,this.y,10,this.height, 2);
     
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
     ctx.rounded_rect(this.x,this.y-10,this.width,10, 2);
     ctx.fillStyle = "#A09383";
     ctx.rounded_rect(this.x,this.y+this.height,this.width,10, 2);
     
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

export function animloop(): any{
   drawscene();
   requestAnimFrame(animloop); 
}

}