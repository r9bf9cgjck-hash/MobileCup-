const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const W = 800;
const H =500;


// =====================
// СОСТОЯНИЕ
// =====================

let selectedTeam = "aziz";
let difficulty = "easy";

let playing = false;

let scoreA = 0;
let scoreB = 0;

let time = 60;

let timer;


// =====================
// КОМАНДЫ
// =====================

const teams = {

aziz:{
name:"Азиз + Хабиб",
players:[
{
name:"Азиз",
color:"#ff9900",
speed:6,
power:95
},
{
name:"Хабиб",
color:"#ff3333",
speed:5,
power:90
}
]
},


abdul:{
name:"Абдул + Мухаммад",
players:[
{
name:"Абдул",
color:"#ffcc00",
speed:6,
power:80
},
{
name:"Мухаммад",
color:"#00ccff",
speed:7,
power:90
}
]
},


shamil:{
name:"Шамиль + Шамиль Jr",
players:[
{
name:"Шамиль",
color:"#0066ff",
speed:5,
power:85
},
{
name:"Шамиль Jr",
color:"#3399ff",
speed:7,
power:90
}
]
},


muhammad:{
name:"Мухаммад + Мухаммад Jr",
players:[
{
name:"Мухаммад",
color:"#00ffff",
speed:7,
power:90
},
{
name:"Мухаммад Jr",
color:"#66ffff",
speed:8,
power:95
}
]
}

};



// =====================
// ВЫБОР КОМАНДЫ
// =====================


document.querySelectorAll(".card")
.forEach(card=>{


card.onclick=function(){


document.querySelectorAll(".card")
.forEach(c=>c.classList.remove("selected"));


card.classList.add("selected");


selectedTeam = card.dataset.team;


};

});





document.querySelectorAll(".level")
.forEach(level=>{


level.onclick=function(){


document.querySelectorAll(".level")
.forEach(l=>l.classList.remove("selected"));


level.classList.add("selected");


difficulty = level.dataset.level;


};

});



// =====================
// ПОЛЕ
// =====================

let players=[];


let ball={

x:195,
y:350,

vx:0,
vy:0,

r:10

};



// =====================
// СОЗДАНИЕ МАТЧА
// =====================


function createMatch(){


let myTeam = teams[selectedTeam];



players=[


{
team:"A",
human:true,

name:myTeam.players[0].name,

x:100,
y:350,

speed:myTeam.players[0].speed,

power:myTeam.players[0].power,

color:myTeam.players[0].color,

r:24

},



{
team:"A",
human:false,

name:myTeam.players[1].name,

x:100,
y:200,

speed:5,

power:80,

color:myTeam.players[1].color,

r:24

}

];



// выбираем соперника


let enemy;


if(selectedTeam==="aziz")
enemy="shamil";

else
enemy="aziz";



let enemyTeam=teams[enemy];



players.push(

{
team:"B",
human:false,

name:enemyTeam.players[0].name,

x:290,
y:350,

speed:5,

power:80,

color:enemyTeam.players[0].color,

r:24

},


{
team:"B",
human:false,

name:enemyTeam.players[1].name,

x:290,
y:500,

speed:5,

power:80,

color:enemyTeam.players[1].color,

r:24

}

);



resetBall();

startTimer();


}
// =====================
// ДЖОЙСТИК
// =====================

let joystick = {
x:0,
y:0
};


let joy = document.getElementById("joystick");
let stick = document.getElementById("stick");


if(joy){

joy.addEventListener("touchmove", e=>{

let touch=e.touches[0];

let rect=joy.getBoundingClientRect();


let x=touch.clientX-(rect.left+60);
let y=touch.clientY-(rect.top+60);


let d=Math.sqrt(x*x+y*y);


if(d>50){

x=x/d*50;
y=y/d*50;

}


stick.style.left=(35+x)+"px";
stick.style.top=(35+y)+"px";


joystick.x=x/50;
joystick.y=y/50;


});


joy.addEventListener("touchend",()=>{

joystick.x=0;
joystick.y=0;

stick.style.left="35px";
stick.style.top="35px";

});


}




// =====================
// УДАР
// =====================

document.getElementById("shoot")
.onclick=function(){

let me=players[0];


let dx=ball.x-me.x;
let dy=ball.y-me.y;


let d=Math.sqrt(dx*dx+dy*dy);


if(d<80){

ball.vx=dx/d*12;
ball.vy=dy/d*12;

}

};




// =====================
// ТАЙМЕР
// =====================

function startTimer(){

clearInterval(timer);


time=60;


timer=setInterval(()=>{


if(!playing)return;


time--;


document.getElementById("time").innerText=time;


if(time<=0){

playing=false;


alert(
"Матч окончен\n"+
scoreA+" : "+scoreB
);


}


},1000);


}




// =====================
// ОБНОВЛЕНИЕ
// =====================

function update(){


if(!playing)return;


let me=players[0];


// движение игрока

me.x+=joystick.x*me.speed;
me.y+=joystick.y*me.speed;



// границы

me.x=Math.max(25,Math.min(365,me.x));
me.y=Math.max(25,Math.min(675,me.y));




// боты

players.filter(p=>!p.human)
.forEach(bot=>{


let dx=ball.x-bot.x;
let dy=ball.y-bot.y;


let d=Math.sqrt(dx*dx+dy*dy);


let speed=bot.speed;


if(difficulty==="hard")
speed+=2;


if(d>5){

bot.x+=dx/d*speed*.4;
bot.y+=dy/d*speed*.4;

}


});



// мяч

ball.x+=ball.vx;
ball.y+=ball.vy;


ball.vx*=0.98;
ball.vy*=0.98;



// стены

if(ball.y<10 || ball.y>690){

ball.vy*=-1;

}



// ворота

if(ball.x<0 && ball.y>260 && ball.y<440){

scoreB++;

resetBall();

}



if(ball.x>390 && ball.y>260 && ball.y<440){

scoreA++;

resetBall();

}



// столкновения

players.forEach(p=>{


let dx=ball.x-p.x;
let dy=ball.y-p.y;


let d=Math.sqrt(dx*dx+dy*dy);


if(d<p.r+ball.r){

ball.vx=dx/d*10;
ball.vy=dy/d*10;

}


});



document.getElementById("scoreA").innerText=scoreA;
document.getElementById("scoreB").innerText=scoreB;


}




function resetBall(){

ball.x=195;
ball.y=350;
ball.vx=0;
ball.vy=0;

}




// =====================
// РИСОВКА
// =====================

function draw(){


ctx.clearRect(0,0,W,H);


// поле

ctx.fillStyle="#2e7d32";
ctx.fillRect(0,0,W,H);


// центр

ctx.strokeStyle="white";
ctx.lineWidth=2;


ctx.beginPath();

ctx.moveTo(W/2,0);
ctx.lineTo(W/2,H);

ctx.stroke();


// ворота

ctx.lineWidth=5;


ctx.strokeRect(
0,
260,
45,
180
);


ctx.strokeRect(
345,
260,
45,
180
);


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




// =====================
// СТАРТ
// =====================

document.getElementById("startBtn")
.onclick=function(){


document.getElementById("menu")
.classList.add("hidden");


document.getElementById("hud")
.classList.remove("hidden");


createMatch();


playing=true;


};



loop();
