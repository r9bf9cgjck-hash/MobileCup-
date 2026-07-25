const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = 600;
const H = 800;


// =======================
// ИГРОКИ
// =======================


const heroes = {

habib:{
name:"Хабиб",
power:90,
speed:5,
tackle:80,
color:"#ff3333"
},

salaudin:{
name:"Салаудин",
power:80,
speed:7,
tackle:75,
color:"#ff7777"
},

aziz:{
name:"Азиз",
power:95,
speed:6,
tackle:70,
color:"#ff9900"
},

abdul:{
name:"Абдул",
power:80,
speed:6,
tackle:95,
color:"#ffcc00"
},


shamil:{
name:"Шамиль Рб",
power:75,
speed:5,
tackle:95,
color:"#0066ff"
},


shamiljr:{
name:"Шамиль Jr",
power:80,
speed:7,
tackle:80,
color:"#3399ff"
},


muhammad:{
name:"Мухаммад",
power:90,
speed:7,
tackle:75,
color:"#00ccff"
},


muhammadjr:{
name:"Мухаммад Jr",
power:85,
speed:8,
tackle:85,
color:"#66ffff"
}

};



let selectedHero="habib";


// =======================
// СОСТОЯНИЕ
// =======================


let scoreA=0;
let scoreB=0;

let playing=false;



// =======================
// МЯЧ
// =======================


let ball={

x:300,
y:400,
vx:0,
vy:0,
r:10

};



// =======================
// ИГРОКИ НА ПОЛЕ
// =======================


let players=[];



function createMatch(){


let me=heroes[selectedHero];



players=[


{
team:"A",
human:true,
x:150,
y:400,
r:22,
speed:me.speed,
power:me.power,
color:me.color,
name:me.name
},



{
team:"A",
human:false,
x:150,
y:250,
r:22,
speed:5,
power:80,
color:"#ff5555",
name:"Союзник"
},



{
team:"B",
human:false,
x:450,
y:400,
r:22,
speed:6,
power:85,
color:"#2277ff",
name:"Соперник"
},


{
team:"B",
human:false,
x:450,
y:550,
r:22,
speed:5,
power:80,
color:"#0055cc",
name:"Соперник Jr"
}


];


ball.x=300;
ball.y=400;

}




// =======================
// УПРАВЛЕНИЕ
// =======================


let keys={};


document.addEventListener(
"keydown",
e=>keys[e.key]=true
);


document.addEventListener(
"keyup",
e=>keys[e.key]=false
);





// =======================
// ДВИЖЕНИЕ
// =======================


function update(){


if(!playing)return;



let me=players[0];


// игрок


if(keys["ArrowUp"])
me.y-=me.speed;


if(keys["ArrowDown"])
me.y+=me.speed;


if(keys["ArrowLeft"])
me.x-=me.speed;


if(keys["ArrowRight"])
me.x+=me.speed;



// боты


players
.filter(p=>!p.human)
.forEach(bot=>{


let dx=ball.x-bot.x;
let dy=ball.y-bot.y;

let d=Math.sqrt(dx*dx+dy*dy);


if(d>5){

bot.x+=dx/d*bot.speed*.5;
bot.y+=dy/d*bot.speed*.5;

}


});




// мяч


ball.x+=ball.vx;
ball.y+=ball.vy;


ball.vx*=0.98;
ball.vy*=0.98;




// столкновения


players.forEach(p=>{


let dx=ball.x-p.x;
let dy=ball.y-p.y;

let d=Math.sqrt(dx*dx+dy*dy);


if(d<p.r+ball.r){


ball.vx=dx/d*8;
ball.vy=dy/d*8;


}


});



// стены


if(ball.y<10||ball.y>790)
ball.vy*=-1;



// гол левый


if(ball.x<0){

scoreB++;
resetBall();

}


// гол правый


if(ball.x>600){

scoreA++;
resetBall();

}



}



function resetBall(){

ball.x=300;
ball.y=400;
ball.vx=0;
ball.vy=0;

}



// =======================
// УДАР
// =======================


document.addEventListener(
"keydown",
e=>{


if(e.code==="Space"){


let me=players[0];


let dx=ball.x-me.x;
let dy=ball.y-me.y;


let d=Math.sqrt(dx*dx+dy*dy);



if(d<60){


ball.vx=dx/d*heroes[selectedHero].power/5;
ball.vy=dy/d*heroes[selectedHero].power/5;


}



}


});




// =======================
// РИСОВКА
// =======================


function draw(){


ctx.clearRect(0,0,W,H);


// поле


ctx.fillStyle="#2e7d32";
ctx.fillRect(0,0,W,H);



// линия


ctx.strokeStyle="white";
ctx.beginPath();

ctx.moveTo(300,0);
ctx.lineTo(300,800);

ctx.stroke();



// игроки


players.forEach(p=>{


ctx.beginPath();

ctx.arc(
p.x,
p.y,
p.r,
0,
Math.PI*2
);


ctx.fillStyle=p.color;
ctx.fill();


ctx.fillStyle="white";
ctx.font="14px Arial";
ctx.textAlign="center";

ctx.fillText(
p.name,
p.x,
p.y-30
);


});



// мяч


ctx.beginPath();

ctx.arc(
ball.x,
ball.y,
ball.r,
0,
Math.PI*2
);

ctx.fillStyle="white";
ctx.fill();



requestAnimationFrame(loop);

}




function loop(){

update();
draw();

}



// =======================
// СТАРТ
// =======================


document.querySelectorAll(".player")
.forEach(el=>{


el.onclick=()=>{


document.querySelectorAll(".player")
.forEach(x=>x.classList.remove("selected"));


el.classList.add("selected");


selectedHero=el.dataset.id;


};


});





document.getElementById("startBtn")
.onclick=()=>{


document.getElementById("menu")
.classList.add("hidden");


document.getElementById("hud")
.classList.remove("hidden");


createMatch();

playing=true;


};



loop();