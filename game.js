const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const W = 800;
const H = 500;


// =====================
// НАСТРОЙКИ
// =====================

let selectedTeam = "aziz";
let mode = 2;
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

aziz:[
"Азиз",
"Хабиб",
"Абдул",
"Мухаммад"
],

abdul:[
"Абдул",
"Мухаммад",
"Азиз",
"Хабиб"
],

shamil:[
"Шамиль",
"Шамиль Jr",
"Мухаммад",
"Мухаммад Jr"
],

muhammad:[
"Мухаммад",
"Мухаммад Jr",
"Шамиль",
"Шамиль Jr"
]

};



// =====================
// ВЫБОР МЕНЮ
// =====================


document.querySelectorAll(".option")
.forEach(o=>{

o.onclick=function(){

let parent=this.parentElement;


parent.querySelectorAll(".option")
.forEach(x=>{

if(x!==this &&
(x.dataset.team||
x.dataset.mode||
x.dataset.level))
x.classList.remove("selected");

});


this.classList.add("selected");



if(this.dataset.team)
selectedTeam=this.dataset.team;


if(this.dataset.mode)
mode=Number(this.dataset.mode);


if(this.dataset.level)
difficulty=this.dataset.level;


};


});



// =====================
// ИГРОКИ
// =====================

let players=[];


let ball={

x:400,
y:250,

vx:0,
vy:0,

r:10

};



function createPlayer(
team,
name,
x,
y,
human=false,
role="field"
){

return {

team,

name,

x,
y,

startX:x,
startY:y,

speed:5,

color:
team==="A"
?"#ff3333"
:"#3388ff",

human,

role,

r:20,

};

}
// =====================
// СОЗДАНИЕ МАТЧА
// =====================

function createMatch(){

players=[];


let names=teams[selectedTeam];


// МОЯ КОМАНДА

for(let i=0;i<mode;i++){

let role="field";


if(i===mode-1)
role="goalkeeper";


players.push(

createPlayer(

"A",

names[i],

150+i*40,

150+i*70,

i===0,

role

)

);

}



// СОПЕРНИКИ


let enemyNames=[
"Шамиль",
"Шамиль Jr",
"Мухаммад",
"Мухаммад Jr"
];



for(let i=0;i<mode;i++){


let role="field";


if(i===mode-1)
role="goalkeeper";



players.push(

createPlayer(

"B",

enemyNames[i],

650-i*40,

150+i*70,

false,

role

)

);


}



resetBall();

startTimer();

}




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
scoreA+
" : "+
scoreB
);


}



},1000);

}





// =====================
// ДЖОЙСТИК
// =====================

let joystick={

x:0,
y:0

};



const joy=document.getElementById("joystick");
const stick=document.getElementById("stick");



joy.addEventListener("touchmove",e=>{


let t=e.touches[0];

let r=joy.getBoundingClientRect();


let x=t.clientX-(r.left+60);
let y=t.clientY-(r.top+60);


let d=Math.sqrt(x*x+y*y);


if(d>50){

x=x/d*50;
y=y/d*50;

}


stick.style.left=35+x+"px";
stick.style.top=35+y+"px";


joystick.x=x/50;
joystick.y=y/50;



});



joy.addEventListener("touchend",()=>{


joystick.x=0;
joystick.y=0;


stick.style.left="35px";
stick.style.top="35px";


});





// =====================
// УДАР
// =====================

document.getElementById("shoot")
.onclick=function(){


let me=players[0];


let dx=ball.x-me.x;
let dy=ball.y-me.y;


let d=Math.sqrt(dx*dx+dy*dy);



if(d<70){


ball.vx=dx/d*14;
ball.vy=dy/d*14;


}

};





// =====================
// ПАС
// =====================

document.getElementById("pass")
.onclick=function(){


let me=players[0];


let mate=players.find(p=>

p.team==="A" &&
p!==me

);



if(mate){


let dx=mate.x-ball.x;
let dy=mate.y-ball.y;


let d=Math.sqrt(dx*dx+dy*dy);


ball.vx=dx/d*8;
ball.vy=dy/d*8;


}



};
// =====================
// ОБНОВЛЕНИЕ ИГРЫ
// =====================

function update(){


if(!playing)return;



let me=players[0];


// управление человеком

me.x+=joystick.x*me.speed;
me.y+=joystick.y*me.speed;



limitPlayer(me);




// ИИ

players.forEach(p=>{


if(p.human)return;



// ВРАТАРЬ

if(p.role==="goalkeeper"){


let targetX=
p.team==="A"?70:730;


if(Math.abs(p.x-targetX)>5){

p.x+=(targetX-p.x)*0.03;

}



let minY=170;
let maxY=330;


if(p.y<minY)p.y=minY;
if(p.y>maxY)p.y=maxY;



if(
Math.abs(ball.x-p.x)<120 &&
Math.abs(ball.y-p.y)<120
){

moveToBall(p);

}


return;

}




// Открывание

let attack=

(p.team==="A" && ball.x>400)
||
(p.team==="B" && ball.x<400);



if(attack){


let openX=
p.team==="A"
?p.startX+80
:p.startX-80;


p.x+=(openX-p.x)*0.02;


}else{


moveToBall(p);

}



});





// мяч

ball.x+=ball.vx;
ball.y+=ball.vy;



ball.vx*=0.97;
ball.vy*=0.97;



// стены

if(ball.y<10 || ball.y>490){

ball.vy*=-1;

}




// голы

if(
ball.x<0 &&
ball.y>170 &&
ball.y<330
){

scoreB++;

goal();

}



if(
ball.x>800 &&
ball.y>170 &&
ball.y<330
){

scoreA++;

goal();

}



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




// =====================
// ДВИЖЕНИЕ БОТОВ
// =====================

function moveToBall(p){


let dx=ball.x-p.x;
let dy=ball.y-p.y;


let d=Math.sqrt(dx*dx+dy*dy);



if(d>5){


let speed=p.speed;


if(difficulty==="hard")
speed+=2;


p.x+=dx/d*speed*0.35;
p.y+=dy/d*speed*0.35;


}


}



function limitPlayer(p){


p.x=Math.max(
20,
Math.min(780,p.x)
);


p.y=Math.max(
20,
Math.min(480,p.y)
);


}




function goal(){


ball.x=400;
ball.y=250;

ball.vx=0;
ball.vy=0;


}





// =====================
// РИСОВАНИЕ
// =====================

function draw(){


ctx.clearRect(0,0,W,H);


// поле

ctx.fillStyle="#238b45";

ctx.fillRect(
0,
0,
W,
H
);



// линии

ctx.strokeStyle="white";

ctx.lineWidth=3;



ctx.beginPath();

ctx.moveTo(400,0);
ctx.lineTo(400,500);

ctx.stroke();



// центр

ctx.beginPath();

ctx.arc(
400,
250,
70,
0,
Math.PI*2
);

ctx.stroke();



// штрафные

ctx.strokeRect(
0,
150,
100,
200
);


ctx.strokeRect(
700,
150,
100,
200
);



// ворота

ctx.strokeRect(
0,
190,
35,
120
);


ctx.strokeRect(
765,
190,
35,
120
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
p.y-28
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
