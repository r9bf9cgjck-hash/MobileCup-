const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = 600;
const H = 800;


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
// СОСТОЯНИЕ
// ======================

let playing=false;

let scoreA=0;
let scoreB=0;



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

let hero=heroes[selectedHero];


players=[

{
team:"A",
human:true,
x:150,
y:400,
r:25,
speed:hero.speed,
power:hero.power,
color:hero.color,
name:hero.name
},


{
team:"A",
human:false,
x:150,
y:250,
r:25,
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
r:25,
speed:5,
power:80,
color:"#2277ff",
name:"Соперник"
},


{
team:"B",
human:false,
x:450,
y:550,
r:25,
speed:6,
power:85,
color:"#0055cc",
name:"Соперник Jr"
}

];


resetBall();

}




function resetBall(){

ball.x=300;
ball.y=400;
ball.vx=0;
ball.vy=0;

}



// ======================
// ДЖОЙСТИК
// ======================


let joystick={
x:0,
y:0
};


let stick=document.getElementById("stick");
let joy=document.getElementById("joystick");



if(joy){

joy.addEventListener("touchmove",function(e){


let touch=e.touches[0];

let rect=joy.getBoundingClientRect();


let x=touch.clientX-(rect.left+60);
let y=touch.clientY-(rect.top+60);


let dist=Math.sqrt(x*x+y*y);


if(dist>40){

x=x/dist*40;
y=y/dist*40;

}


stick.style.left=(35+x)+"px";
stick.style.top=(35+y)+"px";


joystick.x=x/40;
joystick.y=y/40;


});


joy.addEventListener("touchend",function(){


stick.style.left="35px";
stick.style.top="35px";


joystick.x=0;
joystick.y=0;


});

}
 
// ======================
// КНОПКА УДАРА
// ======================

let shoot=document.getElementById("shoot");


if(shoot){

shoot.addEventListener("touchstart",function(){

let me=players[0];


let dx=ball.x-me.x;
let dy=ball.y-me.y;


let d=Math.sqrt(dx*dx+dy*dy);


if(d<80){

ball.vx=dx/d*10;
ball.vy=dy/d*10;

}

});

}



// ======================
// ОБНОВЛЕНИЕ
// ======================


function update(){


if(!playing)return;


let me=players[0];


// движение игрока

me.x+=joystick.x*me.speed;
me.y+=joystick.y*me.speed;



// ограничение поля

if(me.x<20)me.x=20;
if(me.x>580)me.x=580;

if(me.y<20)me.y=20;
if(me.y>780)me.y=780;



// боты

players
.filter(p=>!p.human)
.forEach(bot=>{


let dx=ball.x-bot.x;
let dy=ball.y-bot.y;


let d=Math.sqrt(dx*dx+dy*dy);


if(d>5){

bot.x+=dx/d*bot.speed*.4;
bot.y+=dy/d*bot.speed*.4;

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

if(ball.y<10 || ball.y>790){

ball.vy*=-1;

}



// голы

if(ball.x<0){

scoreB++;

resetBall();

}


if(ball.x>600){

scoreA++;

resetBall();

}



let sa=document.getElementById("scoreA");
let sb=document.getElementById("scoreB");


if(sa)sa.innerText=scoreA;
if(sb)sb.innerText=scoreB;



}



// ======================
// РИСОВКА
// ======================


function draw(){


ctx.clearRect(0,0,W,H);


// поле

ctx.fillStyle="#2e7d32";
ctx.fillRect(0,0,W,H);



// центральная линия

ctx.strokeStyle="white";
ctx.lineWidth=3;

ctx.beginPath();

ctx.moveTo(300,0);
ctx.lineTo(300,800);

ctx.stroke();



// круг центра

ctx.beginPath();

ctx.arc(300,400,80,0,Math.PI*2);

ctx.stroke();




// ворота

ctx.lineWidth=5;

ctx.strokeRect(0,300,50,200);

ctx.strokeRect(550,300,50,200);


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


document.querySelectorAll(".player")
.forEach(el=>{


el.onclick=function(){


document.querySelectorAll(".player")
.forEach(x=>x.classList.remove("selected"));



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
