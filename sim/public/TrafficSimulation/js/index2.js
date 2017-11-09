window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     ||  
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var car_no = 36;
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");


var run = true;

if(run==true){
  
  var w = 1500, h = 830;
  canvas.width = w;
  canvas.height = h;
  var roads = [], intersections_arr = [], cars = [];
  
  /**
    1. initiate car's object reference (Line 37)
    2. initiate car's speed = 5 (Line 38)
    3. initiate car's random positions (Line 40-50)
    4. initiate car's random color set (Line 52-68)
    5. push each car object to cars array list

    6. initate all road object reference
    7. initiate all road's xy positions and scales
    8. push each road object to roads array list

    9. call intersections to initate intersections settings
  */  
  function init(){
    //Launch Cars
    cars = [];
    roads = [];
    intersections_arr = [];
    for(var i=0;i<car_no;i++){
      var car = new drawcar();
      car.s = 5;
      var pos_rand = Math.random();
      if(pos_rand < 0.5){
        car.x = w+25;
        car.y = 378;
        car.d = "w";
      }
      else{
        car.x = 786;
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
      car.color = color;
      cars.push(car);	
    }
    
    //road1
    var road = new drawroad();
    //road.y=375
    road.x = 0, road.y = ((h/2)-40), road.width = w, road.height = 80;
    roads.push(road);
    
    //road2
    var road = new drawroad();
    //road.x = 710
    road.x = ((w/2)-40), road.y = 0, road.width = 80, road.height = h;
    roads.push(road);
    
    //road3
    var road = new drawroad();
    road.x = 0, road.y = 200, road.width = w, road.height = 40;
    roads.push(road);
    
    //road4
    var road = new drawroad();
    road.x = 1050, road.y = ((h/2)-40), road.width = 40, road.height = (h - ((h/2)-40));
    roads.push(road);
    
    //road5
    var road = new drawroad();
    road.x = 450, road.y = 200, road.width = 40, road.height = h - 200;
    roads.push(road);
    
    //road6
    var road = new drawroad();
    road.x = 120, road.y = 0, road.width = 80, road.height = h;
    roads.push(road);
    
    //road7
    var road = new drawroad();
    road.x = 0, road.y = ((h/2)+240), road.width = w, road.height = 40;
    roads.push(road);
    
    intersections();
  }
  
  function drawscene(){
    // reset intersection array to zero, because roads array loop creates intersections
    intersections_arr = [];
    //console.log("drawingscene");
    
    ctx.fillStyle = "#4DBB4C";
    ctx.fillRect(0,0,w,h);
    
    //get each road reference
    for(var i=0;i<roads.length;i++){
      roads[i].draw();
    }
    //set up and draw intersections
    intersections();
    //set up, draw, and drive cars
    drive_cars();
  }

  var left_green = false;
  setInterval("left_greenc()",3000);
  
  function left_greenc(){
    left_green = !left_green;
  }
  
  function distance_check(c1, c2, axis){
    //c1 = car1, c2 = car2
    //when checking distances between cars on x axis, i.e. going east
    if(axis=="x"){
      //create a distance variable
      var dist,
      //distance between two cars on x axis
          dist = c2.x - c1.x;
      //distance between two cars on y axis
      disty = c2.y - c1.y;
      //if two car's body are overlapping on the same lane but two cars a not at the same position
      //15 is the gap value which is supposed to be the gap between 2 cars
      if(dist>0 && dist<=(c1.l+15)){
        //if car1's and car2's width > 15 and two cars at the same position
        if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
          //return true to represent collision
          return true;
        }
      }
    }
    else if(axis=="-x"){
      var dist,
          dist = c1.x - c2.x;
      disty = c1.y - c2.y;
      if(dist>0 && dist<=(c1.l+15)){
        if(c2.w > 15 && c1.w > 15 && c1.y == c2.y){ //only check for collison on cars on the same axis
          return true;
        }
      }
    }
      else if(axis=="-y"){
        var dist,
            dist = c1.x - c2.x;
        disty = c1.y - c2.y;
        if(disty>0 && disty<=(c1.l+15)){
          if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
            return true;
          }
        }
      }
      else if(axis=="y"){
        var dist,
            dist = c2.x - c1.x;
        disty = c2.y - c1.y;
        if(disty>0 && disty<=(c1.l+15)){
          if(c2.w < 25 && c1.w < 25 && c1.x == c2.x){ //only check for collison on cars on the same axis
            return true;
          }
        }
      }
        }
  
  function check_inter(c, inter, axis){
    //if car is going east 
    if(axis == "x"){
      //if the inter road is two way
      if(inter.height > 40){
        //if the car is away from the intersection more one car's length + 8
        //and the car is away from the intersection less than 2 car's length
        if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
          //if the car meets the inter
          //80 is same as the inter's width, 42 is same as the inter road's middle line
          if(c.y-80 <= inter.y && c.y+42 >= inter.y){
            //return true means the car meets the inter
            return true;
          }
        }
      }
      //if the inter road is one way
      else{
        //if the car is between 2 car's length and 1 car's length+8 aways from the intersection on axis
        if((inter.x - c.x) > (c.l+8) && (inter.x - c.x) <= (c.l+25)){
          //if the car facing east is on the west dir road
          if(c.y-40 <= inter.y && c.y+42 >= inter.y){
            //return true means the car is at the inter
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
  
  function gen_dir(c, inter){
    //dd=decide if reset random number, if false, reset
    if(c.dd == false){
      var rand_dir = Math.random()*10;
      var dir = c.d;
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
            var dir = "s";
            c.d = "s";
            c.x = inter.x + 10;
            c.y = inter.y + inter.height - 27;
          }
          else{
            if(inter.roadright == true){
              var dir = c.d;
            }
            else{
              //turn
            }
          }
        }
        else if(rand_dir > 3 && rand_dir < rand_no2){
          if(inter.roadtop == true){
            var dir = "n";
            c.d = "n";
            c.x = inter.x + inter.width - 9;
            c.y = inter.y + c.l + 2;
          }
          else{
            if(inter.roadright == true){
              var dir = c.d;
            }
            else{
              //turn
            }
          }
        }
          else{
            if(inter.roadright == true){
              var dir = c.d;
            }
            else{
              //turn
              var dir = "s";
              c.d = "s";
              c.x = inter.x + 10;
              c.y = inter.y + 2;
            }
          }
      }
      else if(c.d=="w"){
        //if inter is one way
        if(inter.width < 80){
          rand_no1 = 2;
          rand_no2 = 5;
        }
        //if inter is two way
        else{
          rand_no1 = 3;
          rand_no2 = 6;
        }
        //check for which dir to go
        if(rand_dir < rand_no1){
          //if inter allows go bot/south, change car dir to south, and move the car to trun
          if(inter.roadbottom == true){
            var dir = "s";
            c.d = "s";
            //reposition the car for turning
            c.x = inter.x + 20;
            c.y = inter.y + inter.height + c.l +2;
          }
          //if inter does not allow go bot
          else{
            //if inter allows go left/east
            if(inter.roadleft == true){
              //set dir to west
              var dir = c.d;
            }
            //if inter does not allow go left/east
            else{
              //turn
            }
          }
        }
        //check for which dir to go
        else if(rand_dir > 3 && rand_dir < rand_no2){
          //if inter allows go top/north, change car dir to north, move it to turn
          if(inter.roadtop == true){
            var dir = "n";
            c.d = "n";
            //for turning
            c.x = inter.x + inter.width + 1;
            c.y = inter.y + c.l - 30;
          }
          else{
            if(inter.roadleft == true){
              var dir = c.d;
            }
            else{
              //turn
            }
          }
        }
        //otherwise, go this way
        else{
          if(inter.roadleft == true){
            var dir = c.d;
          }
          //if it does not allow go left/east, go turn to north;
          else{
            //turn
            var dir = "n";
            c.d = "n";
            c.x = inter.x + inter.width + 1;
            c.y = inter.y + c.l + 2;
          }
        }
      }
      else if(c.d=="n"){
        if(rand_dir < 3){
          if(inter.roadright == true){
            var dir = "e";
            c.d = "e";
            c.y = inter.y + inter.height - 10;
            c.x = inter.x + inter.width + 1;
          }
          else{
          }
        }
        else if(rand_dir > 3 && rand_dir < 6){
          if(inter.roadleft == true){
            var dir = "w";
            c.d = "w";
            c.y = inter.y + 8;
            c.x = inter.x + 5;
          }
          else{
          }
          
        }
          else{
            if(inter.roadtop == true){
              var dir = c.d;
            }
            else{
              //turn
              var dir = "w";
              c.d = "w";
              c.y = inter.y + 8;
              c.x = inter.x + 5;
            }
          }
      }
      else if(c.d=="s"){
        if(rand_dir < 3){
          if(inter.roadright == true){
            var dir = "e";
            c.d = "e";
            c.y = inter.y + inter.height - 21;
            c.x = inter.x + inter.width + 1;
          }
          else{
            if(inter.roadbottom == true){
              var dir = c.d;
            }
            else{
              //turn
              c.s = 0;
            }
          }
        }
        else if(rand_dir > 3 && rand_dir < 6){
          if(inter.roadleft == true){
            var dir = "w";
            c.d = "w";
            c.y = inter.y - 2;
            c.x = inter.x - 28;
          }
          else{
            if(inter.roadbottom == true){
              var dir = c.d;
            }
            else{
              //turn
              c.s = 0;
            }
          }
        }
          else{
            if(inter.roadleft == true){
              var dir = "w";
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
  
  /*
    drive drawed cars
  */
  function drive_cars(){
    //outer for loop to get each driving car reference
    for(var i=0;i<cars.length;i++){
      var c = cars[i];
      //set driving car speed to 5
      c.s = 5;
      //setting up the driving car's property when the driving car's direction is east
      if(c.d == "e"){
        //inner for loop to get each collision-check car reference
        for(var l=0;l<cars.length;l++){
          var c2 = cars[l];
          //check distance between cars on x axis since car is facing east
          //if c1 and c2 are having collision, return true
          //as car is going east, they are set to be on the positive x axis
          var dc = distance_check(c,c2,"x");
          //if two cars having collision, position the car to an intersection or stop it
          if(dc == true){
            //stop the driving car
            c.s = 0;
            //outer for loop to get each intersection reference
            for(var k=0;k<intersections_arr.length;k++){
              //get the intersection reference
              var inter = intersections_arr[k];
              //if the driving car facing east is inside of the intersection
              if(inter.y + inter.height > c.y && inter.y < c.y){
                //if the intersection has 2 lanes on x axis
                if(inter.height == 80){
                  //number of cars waiting at top lane
                  var lc = 0;
                  //number of cars waiting at bot lane
                  var ld = 0;
                  //inner loop to get each car reference, check how many cars facing east are waiting at the inter 
                  for(var v=0;v<cars.length;v++){
                    //if the car going east in on the left side of the inter and on the bot lane of the road
                    //if the car is going to across an inter 
                    //   and car is stopped at the left-side stop line at the inter 
                    //   because of a collision
                    //inter.y+40 = the y of the left-side stop line
                    //inter.y+44 = the y of the car's supposed y when it stops at the stop line
                    //4 = the gap between the boundary of the road and the car's 
                    if(cars[v].y == (inter.y + 44) && cars[v].x < inter.x && cars[v].s == 0){
                      //number of the car waiting on the top lane
                      lc++;
                    }
                    // if the car is stopped at the top lane of the road
                    if(cars[v].y == c.y && cars[v].x < inter.x && cars[v].s == 0){
                      //number of the car waiting on the bot lane
                      ld++;
                    }
                  }
                  //if number of the cars waiting on the bot lane is 2 more than top lane
                  if((ld-2)>lc){
                    //set the driving car's position to the top lane
                    c.y = inter.y + 44;
                    c.s = 0;
                  }
                  //if number of the cars waiting on the top lane is 2 more than bot lane
                  else{
                    c.s = 0;
                  }
                  //check collision after reseting car's position
                  var dc = distance_check(c,c2,"x");
                  //if still collistion, stop the car
                  if(dc == true){
                    c.s = 0;
                  }
                }
                //if the intersection has 1 lane on x axis
                else{
                  //stop the car
                  c.s = 0;
                }
              }
            }
          }
          //if two cars not having collision
          else{
            var counter = 0;
            //get each intersection reference
            for(var k=0;k<intersections_arr.length;k++){
              var inter = intersections_arr[k];
              //check if the car is on the east dir road, true means not
              if(check_inter(c, inter, "x")){
                //if it is on the west dir road, car counter++
                counter++;
                //if the inter's going left is red
                if(inter.left == "rgba(255,0,0,0.4)"){
                  //car stops
                  c.s = 0;
                }
                //if its green
                else{
                  //car going
                  c.s = 5;
                  //figure dir of the car when facing the inter
                  gen_dir(c, inter);
                }
              }
            }
            //if the car is on the east dir road, then counter is supposed to be 0, then car passes intersection
            if(counter==0){
              //car past intersection reset random generator
              c.dd = false; 
            }
          }
        }
        //if the car is outside of the canvas
        if(c.x+26 >= canvas.width){
          //reposition car
          //set car to (-25, 444) which is next to the road at (0,375) which is the second road from the top
          c.x = -25;
          //444 = road.y - inter.h/2 - inter.h/4 - 
          c.y = 445;
          //set the repositioned going dir of the car to be east
          c.x = -25;
          c.d = "e";
          //c.y=439;
          c.y -= c.s;
        }
        //if not outside of the canvas, keep going
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
      //draw each car after setting it up
      c.draw();
    }
  }

  Object.getPrototypeOf(ctx).rounded_rect = function(x,y,w,h,r){
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
  


  /*
    draw the cars
  */
  function drawcar(){
    //when createing new car draw the car at (0,0)
    this.x = 0;
    this.y = 0;
    this.s = 5;
    this.l = 25; //length of vehicle
    this.d = "e"; //default car moving direction is east
    this.dd = false; 
    this.color = "#F5D600";
    
    //when initiating the map and the existing car is calling this, draw the car
    this.draw = function(){
      //fill the car with the random color
      ctx.fillStyle = this.color;
      //if car moving direction is west
      if(this.d == "w"){
        //set car width?
        this.w = 25;
        //draw the car's outline, car's width = car length, car's height = 12
        ctx.rounded_rect(this.x, this.y, this.l, 12);
        //set the car glass fillstyle
        ctx.fillStyle="#99B3CE";
        //draw the 2 glasses on the car
        ctx.fillRect(this.x+5, this.y, 5, 12);
        ctx.fillRect(this.x+18, this.y, 2, 12);
        //draw the 2 rearview mirros on the car
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x+6, this.y-2, 2 ,2);
        ctx.fillRect(this.x+6, this.y+12, 2 ,2);
      }
      else if(this.d == "e"){
        this.w = 25;
        ctx.rounded_rect(this.x, this.y, this.l, 12);
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
        ctx.rounded_rect(this.y, -this.x, this.l, 12);
        ctx.fillStyle="#99B3CE";
        //draw the same thing when a car faces east
        ctx.fillRect(this.y+15, -this.x, 5, 12);
        ctx.fillRect(this.y+4, -this.x, 2, 12);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.y+14, -this.x-2, 2 ,2);
        ctx.fillRect(this.y+14, -this.x+12, 2 ,2);
        //rotate the facing east car to face south
        ctx.rotate(-Math.PI/2);
        
      }
      else{
        this.w = 12;
        ctx.rotate(Math.PI/2);
        ctx.rounded_rect(this.y, -this.x, this.l, 12);
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

  /*
    draw each intersection
    1. initiate each intersection reference to specific value
    2. check if left_green is true. 
          If true, means going left of the inter is green, set left and right green
          If false, means going left is not ok, set top and down green
    3. call draw function to draw.
  */
  function drawinter(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.roadtop = true;
    this.roadleft = true;
    this.roadbottom = true;
    this.roadright = true;
    if(left_green == true){
      //green
      this.right = "rgba(0,255,0,0.4)";
      this.left = "rgba(0,255,0,0.4)";
      //red
      this.top = "rgba(255,0,0,0.4)";
      this.bottom = "rgba(255,0,0,0.4)";
    }
    else{
      this.right = "rgba(255,0,0,0.4)";
      this.left = "rgba(255,0,0,0.4)";
      this.top = "rgba(0,255,0,0.4)";
      this.bottom = "rgba(0,255,0,0.4)";
    }
    
    
    this.draw = function(){
      //set the one intersection to a grey color
      ctx.fillStyle = "#605A4C";
      //fill the one intersection with the grey color
      ctx.fillRect(this.x,this.y,this.width,this.height);
      
      /*
        zebra-crossing on the (left)
        1. if the intersection left side is passable:
              a. fill the zebra-crossing with the grey color
              b. fill the zebra-crossing with the color on the inter's left side
              c. start a new path to begin drawing the zebra-crossing
              d. draw the zebra-crossing as dash-lines using setLineDash()
              e. set each zebra-crossing line's drawing path
      */
      if(this.roadleft == true){
        //a
        ctx.fillStyle = "#605A4C";
        //b
        ctx.fillRect(this.x-20,this.y,20,this.height);
        //c
        ctx.beginPath();
        //d
        ctx.setLineDash([1,5]);
        //e
        ctx.moveTo(this.x-12, this.y);
        ctx.lineTo(this.x-12, (this.y + this.height));
        ctx.closePath();
        //specify colors or use around the zebra line
        ctx.strokeStyle = "#A09383";
        ctx.lineWidth = 10;
        ctx.fill();
        //stroke the path with the stokestyle
        ctx.stroke();
        
        //draw the stop line for the road
        ctx.fillStyle = "#A09383";
        //draw the stop line at (x-22, h/2+y-1) with a single lane's width
        //  according to the intersection references at (x,y)
        //  22 = the gap between the intersection and the stop line
        //  h/2+y-1 = draw the stop line starting at h2/y, the 1 = the weight of the stop line
        ctx.fillRect(this.x-22,(this.height/2)+this.y-1,2,(this.height/2)+1);
        // for double line road
        if(this.height > 40){
          ctx.fillStyle = "#A09383";
          ctx.fillRect(this.x-52,(this.height/(4/3))+this.y-2,30,2);
        }
        ctx.restore();
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
        
        ctx.fillStyle = "#A09383";
        ctx.fillRect(this.x+this.width-(this.width/2)-1,this.y+this.height+20,(this.width/2)+1,2);
        if(this.width > 40){
          ctx.fillStyle = "#A09383";
          ctx.fillRect(this.x+(this.width/(4/3))-2,this.y+this.height+20,2,30);
        }
        
      }
      
      //traffic lights on (left) side
      if(this.roadleft == true){
        //save the entire state of the canvas, draw traffic light based on the current canvas
        ctx.save();
        
        //if the intersection's going left is green
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
        ctx.fillRect(this.x-3,this.y+this.height-12,1,4);
        ctx.fill();
        ctx.restore();
        ctx.shadowOffsetX = undefined;
        ctx.shadowBlur = undefined;
        
        //if the intersection has 2 lanes
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
          //light on the top of the light line
          ctx.fillRect(this.x-3,this.y+this.height-30,1,4);
          ctx.fill();
          ctx.restore();
          ctx.shadowOffsetX = undefined;
          ctx.shadowBlur = undefined;
        }

        //traffic light holder line
        ctx.fillStyle = "#ddd";
        ctx.fillRect(this.x-3,this.y+this.height-(this.height/2)+3,1,(this.height/2));						
      }
      //traffic lights (right)
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
        ctx.fillRect(this.x+this.width+2,this.y+12,1,4);
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
          ctx.fillRect(this.x+this.width+2,this.y+30,1,4);
          ctx.fill();
          ctx.restore();
          ctx.shadowOffsetX = undefined;
          ctx.shadowBlur = undefined;
        }
        
        ctx.fillStyle = "#ddd";
        ctx.fillRect(this.x+this.width+2,this.y-3,1,(this.height/2));		
      }
      //traffic lights (top)
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
        ctx.fillRect(this.x+4,this.y-2,4,1);
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
          ctx.fillRect(this.x+28,this.y-2,4,1);
          ctx.fill();
          ctx.restore();
          ctx.shadowOffsetX = undefined;
          ctx.shadowBlur = undefined;
        }
        
        ctx.fillStyle = "#ddd";
        ctx.fillRect(this.x-3,this.y-2,(this.width/2),1);
      }
      //traffic lights (bottom)
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
        ctx.fillRect(this.x+this.width-10,this.y+this.height+2,4,1);
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
          ctx.fillRect(this.x+this.width-32,this.y+this.height+2,4,1);
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
  
  /*
    1. get each road object reference (Line 457 & 459)
    2. if r.width > r.height => its a horizontal road, other wise, its a vertical road
    3. if r1.width > r1.height
        if r2.width < r2.height
       => it makes a condition for an intersection
    4. find intersections
    5. set trafficlight existence at intersection
    6. make intersection object references
    7. draw each intersection
  */
  function intersections(){
    for(var i=0;i<roads.length;i++){
      var r1 = roads[i];
      for(var j=0;j<roads.length;j++){
        var r2 = roads[j];
        //road1 - horizontal road
        if(r1.width > r1.height){
          //raod 2 - vertical road
          if(r2.width < r2.height){
            //find intersections
            if((r1.x + r1.width) > r2.x && r1.x <= r2.x){
              if((r2.y + r2.height) >= r1.y && r2.y <= r1.y){
                //console.log("intersection found at ("+r1.y+","+r2.x+")");
                //set intersection's direction to true
                var roadtop = true;
                var roadbottom = true;
                var roadleft = true;
                var roadright = true;

                // intersection without top road, no top side trafficlight
                if(r1.y == r2.y){
                  //no intersection top
                  var roadtop = false;
                }
                // intersection without left road, no left side traffiglight
                if(r1.x == r2.x){
                  //no intersection left
                  var roadleft = false;
                }
                // intersection without right road, no right side trafficlight
                if((r1.x + r1.width) == (r2.x + r2.width)){
                  //no intersection right
                  var roadright = false;
                }
                // intersection without bottom road, no bot side trafficlight
                if((r1.y + r1.height)==(r2.y + r2.height)){
                  //no intersection top
                  var roadbottom = false;
                }
                
                // create intersection object
                var inter = new drawinter();
                // set intersections properties
                inter.x = r2.x, inter.y = r1.y, inter.width = r2.width, inter.height = r1.height, inter.roadtop = roadtop, inter.roadleft = roadleft, inter.roadright = roadright, inter.roadbottom = roadbottom;
                // push to intersection array
                intersections_arr.push(inter);
                // draw each intersection
                inter.draw();
              }
            }
          }
        }
      }
    }
  }
  
  /*
    draw each road reference
    1. initiate each road proptrty to a specific value
    2. call draw function to draw road
  */

  function drawroad(){
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.color = "#605A4C";
    
    /*
      1. fill the road with grey color
      2. set the fillstyle of the middle line of the road to be yellow
      3. if the road is vertical and it has 2 directions
            a. draw the yellow middle line
            b. begin to draw the dash line to divide the 2 lanes of each direction
            c. draw the curb of each road
    */
    this.draw = function(){
      //1
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x,this.y,this.width,this.height);
      
      //2
      ctx.fillStyle = "#A68B44";

      //3
      if(this.width < this.height && this.width > 40){
        //a yellowMiddleLine.width = 2;
        ctx.fillRect(this.x+((this.width/2)-1),this.y,2,this.height);
        
        //b
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
        
        //c curb.width = 10, curb.height = road.height
        ctx.fillStyle = "#A09383";
        ctx.rounded_rect(this.x-10,this.y,10,this.height);
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

  function animloop() {
      drawscene();
      requestAnimFrame(animloop); 
  }
  init();

}