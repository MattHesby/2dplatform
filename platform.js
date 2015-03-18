/**
* Created with 2dplatform.
* User: MattHesby
* Date: 2015-03-13
* Time: 01:47 AM
* To change this template use Tools | Templates.
*/
//$(document).ready(function(){
var d = new Date();
var startTime = 0;
var timeOffset = d.getTime();    
var trackTime = 0;
    
  
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.strokeRect(0,0,1500,600);

    
var player = {
    pressLeft: false,
    pressRight: false,
    mass: 20,
    canJump: false,
    hitBottom: false,
    hitTop: false,
    hitLeft: false,
    hitRight: false,
    gravity: 15,
    xV: 0,
    yV: 0,
    xA: 0,
    yA: 0,
    maxSpeed: 100,
    maxFall: 20,
    x: x,
    y: y,
    width: 20,
    height: 20,
    health: 10,
    rightF: 0,
    leftF: 0,
    upF: 0,
    downF: 0,
    friction: 0,
    hitSolid: function(){
        
    },
    btndown: function(evt){
        if(evt.keyCode === 65 || evt.keyCode === 37){ //Press Left
            player.pressLeft = true;
        }
        if(evt.keyCode === 68 || evt.keyCode === 39){ // Press Right
            player.pressRight = true;
        }
        if(evt.keyCode === 87 && player.canJump || evt.keyCode === 38){ // Press up
            player.jumping = true;
        }
    },
    btnup: function(evt){
        if(evt.keyCode === 65 || evt.keyCode === 37){
            player.pressLeft = false;
        }
        if(evt.keyCode === 68 || evt.keyCode === 39){
            player.pressRight = false;
        }
        if(evt.keyCode === 87 || evt.keyCode === 38){
            player.jumping = false;
        }        
    },
    move: function(){
        
        //Set Forces to Default
        player.upF = 0;
        player.downF = 0;
        player.leftF = 0;
        player.rightF = 0;
        player.xA = 0;
        player.yA = 0;
        
        //Apply player forces
        if(player.pressLeft)player.leftF += 25;
        if(player.pressRight)player.rightF += 25;
        
        //Gravity
        player.downF = 5;
        
        //Hitting a solid
        player.hitBottom = false;
        player.hitTop = false;
        player.hitLeft = false;
        player.hitRight = false;
        for(i = 0; i < blocks.length; i++){
            var tempCollide = isColliding(player, blocks[i]) 
            if(tempCollide === "above") player.hitBottom = true;
            if(tempCollide === "below") player.hitTop = true;
            if(tempCollide === "leftOf") player.hitRight = true;
            if(tempCollide === "rightOf") player.hitLeft = true;
        }
        if(player.hitBottom){
            if(player.hitBottom)player.yV = 0;
            player.canJump = true;
            player.friction = 15;
            player.upF = 5;
        }
        else{
            player.upF = 0;
            player.canJump = false;
            player.friction = 15;
        }
        //console.log(onaBlock)       
        //jumping
        
        player.jump();
        
        // Applying Friction
        if(player.xV > 0) player.leftF += player.friction;
        if(player.xV < 0) player.rightF += player.friction;
        if(player.xV > 0 && player.xV <= 5) player.xV = 0;
        if(player.xV < 0 && player.xV >= -5) {console.log("he"); player.xV = 0;}
        
        
        //finding Dx and Dy based on forces
        player.xA = player.rightF - player.leftF;
        player.yA = player.upF - player.downF;
        

        //if(player.dy > player.maxFall) player.dy = player.maxFall;
        //if(player.dy * -1 > player.maxFall) player.dy = player.maxFall * -1;


        //if(onaBlock) console.log("dy: " + player.dy)
//F = m a
//V =         
        
        ///Actually changing x and y
        //console.log("dy: "+ player.dy);
        player.xV += player.xA;
        player.yV += player.yA;
        //Capping Max Speed
        if(player.xV > player.maxSpeed) player.xV = player.maxSpeed;
        if(player.xV * -1 > player.maxSpeed) player.xV = player.maxSpeed * -1;        
        
        

        //console.log(player.xV);
        player.x += player.xV/10;
        player.y -= player.yV/10;
    },
    jump: function(evt){
        if(player.jumping && player.canJump){
            player.upF += 90;
        }

        
    },
    draw: function(){
        ctx.strokeRect(player.x,player.y, player.width, player.height)
    
    }
    
}

function isColliding(thing1, thing2){
    //console.log("ehcking");
    if((thing1.y + thing1.height) < (thing2.y) || (thing1.y > (thing2.y + thing2.height)) || ((thing1.x + thing1.width) < thing2.x) || (thing1.x > (thing2.x + thing2.width)))return false;
    if(thing1.y  < thing2.y && thing1.y - thing2.y < thing1.x - thing2.x){
        thing1.y = thing2.y - thing2.height;
        console.log("above")
        return "above";
    }
    else if(thing1.y  > thing2.y + thing2.height && thing1.y - thing2.y < thing1.x - thing2.x){
        console.log("woops");
        if(thing1.x < thing2.x){ 
            console.log("t1: " + thing1.x)
            console.log("t2: " + thing2.x)
            player.x = thing2.x - thing1.width;
            player.xV = 0;
            console.log("leftof");
            return "leftof"
        }
        else {
            console.log("rightof")
            player.x = thing2.x + thing2.width;
            player.xV = 0;
            return "rightof"
        }
    }
    else{
        player.y = thing2.y + thing2.height
        player.yV = 0;
        console.log("below");
        return "below"
    }
    
    
    //     else{
//         if(thing1.y < thing2.y) return "above";
//         else if(thing1.y > thing2.y) return "below"
//         else if(thing1.x  < thing2.x) return "leftof"
//         else return "rightof"
//     }
}
     
window.addEventListener("keydown", player.btndown);
window.addEventListener("keyup", player.btnup)
function gameLoop(){
    d = new Date();
    ctx.clearRect(0, 0, 1500, 600);
    player.hitSolid();
    player.move();
    player.draw();
    for(i = 0; i < blocks.length; i++){
        blocks[i].draw();
    }

    trackTime = trackTime + d.getTime() - timeOffset;
    //console.log(player.x)
    window.requestAnimationFrame(gameLoop);
}   
gameLoop();    

    
    
    
    
//})