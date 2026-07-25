const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = 600;
const H = 800;


// ======================
// НАСТРОЙКИ ИГРЫ
// ======================

let playing = false;

let scoreA = 0;
let scoreB = 0;

let timeLeft = 60;

let timer;


// ======================
// ИГРОКИ
// ======================

const heroes = {

aziz:{
name:"Азиз",
speed:6,
power:95,
color:"#ff9900"
},

abdul:{
name:"Абдул",
speed:6,
power:80,
color:"#ffcc00"
},

muhammad:{
name:"Мухаммад",
speed:7,
power:90,
color:"#00ccff"
},

muhammadjr:{
name:"Мухаммад Jr",
speed:8,
power:85,
color:"#66ffff"
}

};


let selectedHero="aziz";


// ======================
// МЯЧ
// ======================

let ball={

x:300,
y:400,
vx:0,
vy:0,
r:10

};



// ======================
// ИГРОКИ НА ПОЛЕ
// ======================

let players=[];



function createMatch(){

let hero = heroes[selectedHero];


players=[


{
team:"A",
human:true,
name:hero.name,
x:150,
y:400,
r:25,
speed:hero.speed,
power:hero.power,
color:hero.color
},


{
team:"A",
human:false,
name:"Союзник",
x:150,
y:250,
r:25,
speed:5,
power:80,
color:"#ff4444"
},


{
team:"B",
human:false,
name:"Соперник",
x:450,
y:400,
r:25,
speed:5,
power:80,
color:"#2255ff"
},


{
team:"B",
human:false,
name:"Соперник Jr",
x:450,
y:550,
r:25,
speed:6,
power:85,
color:"#003399"
}


];


resetBall();

timeLeft=60;


startTimer();

}




function resetBall(){

ball.x=300;
ball.y=400;
ball.vx=0;
ball.vy=0;

}



// ======================
// ТАЙМЕР
// ======================

function startTimer(){

clearInterval(timer);


timer=setInterval(()=>{


if(!playing)return;


timeLeft--;


let clock=document.getElementById("time");


if(clock)
clock.innerText=timeLeft;



if(timeLeft<=0){

playing=false;

alert(
"Матч окончен!\n"+
scoreA+" : "+scoreB
);

}



},1000);

}



// ======================
// ДЖОЙСТИК
// ======================

let joystick={

x:0,
y:0

};


let joy=document.getElementById("joystick");
let stick=document.getElementById("stick");



if(joy){


joy.addEventListener(
"touchmove",
function(e){


let touch=e.touches[0];

let rect=joy.getBoundingClientRect();


let x=
touch.clientX-(rect.left+60);


let y=
touch.clientY-(rect.top+60);



let dist=Math.sqrt(
x*x+y*y
);



if(dist>45){

x=x/dist*45;
y=y/dist*45;

}



stick.style.left=(35+x)+"px";
stick.style.top=(35+y)+"px";


joystick.x=x/45;
joystick.y=y/45;



});



joy.addEventListener(
"touchend",
function(){


joystick.x=0;
joystick.y=0;


stick.style.left="35px";
stick.style.top="35px";


});


}
// ======================
// УДАР
// ======================

let shoot=document.getElementById("shoot");


if(shoot){

shoot.addEventListener(
"touchstart",
function(){


let me=players[0];


let dx=ball.x-me.x;
let dy=ball.y-me.y;


let d=Math.sqrt(
dx*dx+dy*dy
);



if(d<80){

ball.vx=dx/d*12;
ball.vy=dy/d*12;

}


});

}



// ======================
// ОБНОВЛЕНИЕ
// ======================


function update(){


if(!playing)return;


let me=players[0];


// движение главного игрока

me.x += joystick.x * me.speed;
me.y += joystick.y * me.speed;



// границы поля

if(me.x<25) me.x=25;
if(me.x>575) me.x=575;

if(me.y<25) me.y=25;
if(me.y>775) me.y=775;



// движение ботов

players
.filter(p=>!p.human)
.forEach(bot=>{


let dx=ball.x-bot.x;
let dy=ball.y-bot.y;


let d=Math.sqrt(
dx*dx+dy*dy
);



if(d>5){

bot.x += dx/d*bot.speed*0.5;
bot.y += dy/d*bot.speed*0.5;

}


});



// мяч

ball.x+=ball.vx;
ball.y+=ball.vy;


ball.vx*=0.98;
ball.vy*=0.98;



// отскок от стен

if(ball.y<10){

ball.y=10;
ball.vy*=-1;

}


if(ball.y>790){

ball.y=790;
ball.vy*=-1;

}



// гол только через ворота

if(ball.x<0){

if(ball.y>300 && ball.y<500){

scoreB++;

resetBall();

}
else{

ball.x=10;
ball.vx*=-1;

}

}



if(ball.x>600){


if(ball.y>300 && ball.y<500){

scoreA++;

resetBall();

}
else{

ball.x=590;
ball.vx*=-1;

}

}



// столкновение игроков

players.forEach(p=>{


let dx=ball.x-p.x;
let dy=ball.y-p.y;


let d=Math.sqrt(
dx*dx+dy*dy
);



if(d<p.r+ball.r){


ball.vx=dx/d*9;
ball.vy=dy/d*9;


}


});



let a=document.getElementById("scoreA");
let b=document.getElementById("scoreB");


if(a)a.innerText=scoreA;
if(b)b.innerText=scoreB;



}



// ======================
// РИСОВКА
// ======================


function draw(){


ctx.clearRect(0,0,W,H);



// поле

ctx.fillStyle="#2e7d32";
ctx.fillRect(0,0,W,H);



// линия центра

ctx.strokeStyle="white";
ctx.lineWidth=3;

ctx.beginPath();

ctx.moveTo(300,0);
ctx.lineTo(300,800);

ctx.stroke();



// круг центра

ctx.beginPath();

ctx.arc(
300,
400,
80,
0,
Math.PI*2
);

ctx.stroke();



// ворота

ctx.lineWidth=5;

ctx.strokeRect(
0,
300,
50,
200
);


ctx.strokeRect(
550,
300,
50,
200
);



ctx.lineWidth=1;



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
p.y-35
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



// ======================
// ВЫБОР ИГРОКА
// ======================


document
.querySelectorAll(".player")
.forEach(el=>{


el.onclick=function(){


document
.querySelectorAll(".player")
.forEach(x=>
x.classList.remove("selected")
);


el.classList.add("selected");


selectedHero=el.dataset.id;


};


});




// ======================
// СТАРТ
// ======================


document
.getElementById("startBtn")
.onclick=function(){


document
.getElementById("menu")
.classList.add("hidden");


document
.getElementById("hud")
.classList.remove("hidden");


createMatch();


playing=true;


};



loop();
let selectedTeam = "aziz";
let difficulty = "easy";

document.querySelectorAll(".team").forEach(team=>{

team.onclick=function(){

document.querySelectorAll(".team")
.forEach(t=>t.classList.remove("selected"));

team.classList.add("selected");

selectedTeam = team.dataset.team;

console.log("Команда:", selectedTeam);

};

});


document.querySelectorAll(".difficulty").forEach(level=>{

level.onclick=function(){

document.querySelectorAll(".difficulty")
.forEach(t=>t.classList.remove("selected"));

level.classList.add("selected");

difficulty = level.dataset.level;

console.log("Сложность:", difficulty);

};

});



document.getElementById("startBtn").onclick=function(){

document.getElementById("menu")
.classList.add("hidden");


document.getElementById("hud")
.classList.remove("hidden");


console.log(
"Старт игры",
selectedTeam,
difficulty
);

};
