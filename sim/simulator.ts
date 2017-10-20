/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

declare var intersections_arr: any;
declare var ctx: any;
declare var x: number;
declare var y:number;
declare var s:number;
declare var l:number;
declare var d:string;
declare var dd:boolean;
declare var color:string;
declare var drawCar: any;
declare var draw:any;
declare var cars:any;
declare function drawcar():any;

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
        //public intersections_arr: any = [];
        
        constructor() {
            super();
            this.element = <HTMLDivElement><any>document.getElementById('svgcanvas');
            this.canvas = <HTMLCanvasElement><any>document.getElementsByTagName('canvas')[0];
            ctx = this.canvas.getContext("2d");
        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            document.body.innerHTML = ''; // clear children
            document.body.appendChild(this.element);

            return Promise.resolve();
        }       

        public w = 370;
        public h = 270;
        setCarNum(carNum: number){
            console.log("inside setCarNum");
            cars = [];
            let car_no: number = carNum;
            for(var i=0;i<car_no;i++){
                let car = this.drawcar();
                car.s = 5;
                let pos_rand: number = Math.random();
                if(pos_rand < 0.5){
                    car.x = this.w+25;
                    car.y = 41;
                    car.d = "w";
                }
                else{
                    car.x = 120;
                    car.y = this.h+25;
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
            this.drive_cars();
        }

        drawcar(): any{
            x = 0;
            y = 0;
            s = 5;
            l = 25; //length of vehicle
            d = "e";
            dd = false;
            color = "#F5D600";
            
            let draw = function(){
                console.log("drawcar()color: "+color);
              ctx.fillStyle = color;
              if(d == "w"){
                this.w = 25;
                ctx.rounded_rect(x, y, l, 12);
                ctx.fillStyle="#99B3CE";
                ctx.fillRect(x+5, y, 5, 12);
                ctx.fillRect(x+18, y, 2, 12);
                ctx.fillStyle = color;
                ctx.fillRect(x+6, y-2, 2 ,2);
                ctx.fillRect(x+6, y+12, 2 ,2);
              }
              else if(d == "e"){
                this.w = 25;
                ctx.rounded_rect(x, y, l, 12);
                ctx.fillStyle="#99B3CE";
                ctx.fillRect(x+15, y, 5, 12);
                ctx.fillRect(x+4, y, 2, 12);
                ctx.fillStyle = color;
                ctx.fillRect(x+14, y-2, 2 ,2);
                ctx.fillRect(x+14, y+12, 2 ,2);
              }
                else if(d == "s"){
                  this.w = 12;
                  ctx.rotate(Math.PI/2);
                  ctx.rounded_rect(y, -x, l, 12);
                  ctx.fillStyle="#99B3CE";
                  ctx.fillRect(y+15, -x, 5, 12);
                  ctx.fillRect(y+4, -x, 2, 12);
                  ctx.fillStyle = color;
                  ctx.fillRect(y+14, -x-2, 2 ,2);
                  ctx.fillRect(y+14, -x+12, 2 ,2);
                  ctx.rotate(-Math.PI/2);
                  
                }
                else{
                  this.w = 12;
                  ctx.rotate(Math.PI/2);
                  ctx.rounded_rect(y, -x, l, 12);
                  ctx.fillStyle="#99B3CE";
                  ctx.fillRect(y+5, -x, 5, 12);
                  ctx.fillRect(y+18, -x, 2, 12);
                  ctx.fillStyle = color;
                  ctx.fillRect(y+6, -x-2, 2 ,2);
                  ctx.fillRect(y+6, -x+12, 2 ,2);
                  ctx.rotate(-Math.PI/2);
                }
            }
            return this;
        }

        drive_cars(){
            for(var i=0;i<cars.length;i++){
              let c: any = cars[i];
              c.s = 5;
              if(c.d == "e"){
                for(var l=0;l<cars.length;l++){
                  let c2: any = cars[l];
                  let dc: any = this.distance_check(c,c2,"x");
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
                          let dc: any = this.distance_check(c,c2,"x");
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
                  var dc = this.distance_check(c,c2,"-y");
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
                    for(var k=0;k<intersections_arr.length;k++){
                      var inter = intersections_arr[k];
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
                  c.x = 786;
                  c.y = this.h+25;
                  c.d = "n";
                  c.y -= c.s;
                }
                c.y -= c.s;
              }
                else if(c.d == "s"){
                  for(var l=0;l<cars.length;l++){
                    var c2 = cars[l];
                    var dc = this.distance_check(c,c2,"y");
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
                      for(var k=0;k<intersections_arr.length;k++){
                        var inter = intersections_arr[k];
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
                    c.y = 368;
                    c.x = this.w+25;
                    c.d = "w";
                    c.y += c.s;
                  }
                  c.y += c.s;
                }
                else if(c.d == "w"){
                  for(var l=0;l<cars.length;l++){
                    var c2 = cars[l];
                    var dc = this.distance_check(c,c2,"-x");
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
                            var dc = this.distance_check(c,c2,"-x");
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
                        if(this.check_inter(c, inter, "-x")){
                          counter++;
                          if(inter.right == "rgba(255,0,0,0.4)"){
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
                  if(c.x+26 <= 0){
                    //reposition car
                    c.y = 444;
                    c.x = -25;
                    c.d = "e";
                    c.y -= c.s;
                    
                  }
                  c.x -= c.s;
                }
                  c.this.draw();
            }
        }
        
        distance_check(c1: any, c2: any, axis: string): any{
            if(axis=="x"){
              let dist: any = c2.x - c1.x;
              let disty: any = c2.y - c1.y;
              if(dist>0 && dist<=(c1.l+15)){
                if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
                  return true;
                }
              }
            }
            else if(axis=="-x"){
              let dist: any = c1.x - c2.x;
              let disty: any = c1.y - c2.y;
              if(dist>0 && dist<=(c1.l+15)){
                if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
                  return true;
                }
              }
            }
              else if(axis=="-y"){
                let dist: any = c1.x - c2.x;
                let disty: any = c1.y - c2.y;
                if(disty>0 && disty<=(c1.l+15)){
                  if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
                    return true;
                  }
                }
              }
              else if(axis=="y"){
                let dist: any = c2.x - c1.x;
                let disty: any = c2.y - c1.y;
                if(disty>0 && disty<=(c1.l+15)){
                  if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
                    return true;
                  }
                }
              }
                }
          
        check_inter(c: any, inter: any, axis: any): any{
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
          
        gen_dir(c: any, inter: any){
            if(c.dd == false){
              let rand_dir: any = Math.random()*10;
              let dir: any = c.d;
              c.dd = true;
              let rand_no1: any;
              let rand_no2: any;
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
                    let dir: string = "s";
                    c.d = "s";
                    c.x = inter.x + 10;
                    c.y = inter.y + inter.height - 27;
                  }
                  else{
                    if(inter.roadright == true){
                      let dir: string = c.d;
                    }
                    else{
                      //turn
                    }
                  }
                }
                else if(rand_dir > 3 && rand_dir < rand_no2){
                  if(inter.roadtop == true){
                    let dir: string = "n";
                    c.d = "n";
                    c.x = inter.x + inter.width - 9;
                    c.y = inter.y + c.l + 2;
                  }
                  else{
                    if(inter.roadright == true){
                      let dir: string = c.d;
                    }
                    else{
                      //turn
                    }
                  }
                }
                  else{
                    if(inter.roadright == true){
                      let dir: string = c.d;
                    }
                    else{
                      //turn
                      let dir: string = "s";
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
                    let dir: string = "s";
                    c.d = "s";
                    c.x = inter.x + 20;
                    c.y = inter.y + inter.height + c.l +2;
                  }
                  else{
                    if(inter.roadleft == true){
                        let dir: string = c.d;
                    }
                    else{
                      //turn
                    }
                  }
                }
                else if(rand_dir > 3 && rand_dir < rand_no2){
                  if(inter.roadtop == true){
                    let dir: string = "n";
                    c.d = "n";
                    c.x = inter.x + inter.width + 1;
                    c.y = inter.y + c.l - 30;
                  }
                  else{
                    if(inter.roadleft == true){
                        let dir: string = c.d;
                    }
                    else{
                      //turn
                    }
                  }
                }
                  else{
                    if(inter.roadleft == true){
                        let dir: string = c.d;
                    }
                    else{
                      //turn
                      let dir: string = "n";
                      c.d = "n";
                      c.x = inter.x + inter.width + 1;
                      c.y = inter.y + c.l + 2;
                    }
                  }
              }
                else if(c.d=="n"){
                  if(rand_dir < 3){
                    if(inter.roadright == true){
                      let dir: string = "e";
                      c.d = "e";
                      c.y = inter.y + inter.height - 10;
                      c.x = inter.x + inter.width + 1;
                    }
                    else{
                    }
                  }
                  else if(rand_dir > 3 && rand_dir < 6){
                    if(inter.roadleft == true){
                      let dir: string = "w";
                      c.d = "w";
                      c.y = inter.y + 8;
                      c.x = inter.x + 5;
                    }
                    else{
                    }
                    
                  }
                    else{
                      if(inter.roadtop == true){
                        let dir: string = c.d;
                      }
                      else{
                        //turn
                        let dir: string = "w";
                        c.d = "w";
                        c.y = inter.y + 8;
                        c.x = inter.x + 5;
                      }
                    }
                }
                else if(c.d=="s"){
                  if(rand_dir < 3){
                    if(inter.roadright == true){
                      let dir: string = "e";
                      c.d = "e";
                      c.y = inter.y + inter.height - 21;
                      c.x = inter.x + inter.width + 1;
                    }
                    else{
                      if(inter.roadbottom == true){
                        let dir: string = c.d;
                      }
                      else{
                        //turn
                        c.s = 0;
                      }
                    }
                  }
                  else if(rand_dir > 3 && rand_dir < 6){
                    if(inter.roadleft == true){
                      let dir: string = "w";
                      c.d = "w";
                      c.y = inter.y - 2;
                      c.x = inter.x - 28;
                    }
                    else{
                      if(inter.roadbottom == true){
                        let dir: string = c.d;
                      }
                      else{
                        //turn
                        c.s = 0;
                      }
                    }
                  }
                    else{
                      if(inter.roadleft == true){
                        let dir: string = "w";
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
        
    }
}