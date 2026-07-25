// =======================================
// MatchCup Mobile
// game.js
// Часть 1
// =======================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// ------------------------
// СОСТОЯНИЕ ИГРЫ
// ------------------------

let gameStarted = false;
let gamePaused = false;

let matchTime = 60;
let timer = null;

let scoreLeft = 0;
let scoreRight = 0;

// ------------------------
// НАСТРОЙКИ
// ------------------------

let selectedMode = 2;
let selectedDifficulty = "easy";
let selectedTeam = "aziz";

// ------------------------
// СОСТАВЫ
// ------------------------

const squads = {

    aziz: [
        "Азиз",
        "Хабиб",
        "Абдул",
        "Мухаммад"
    ],

    abdul: [
        "Абдул",
        "Мухаммад",
        "Азиз",
        "Хабиб"
    ],

    shamil: [
        "Шамиль",
        "Шамиль Jr",
        "Мухаммад",
        "Мухаммад Jr"
    ],

    muhammad: [
        "Мухаммад",
        "Мухаммад Jr",
        "Шамиль",
        "Шамиль Jr"
    ]

};

const enemySquad = [
    "Шамиль",
    "Шамиль Jr",
    "Мухаммад",
    "Мухаммад Jr"
];

// ------------------------
// МАССИВЫ
// ------------------------

let teamA = [];
let teamB = [];

let ball = null;

// ------------------------
// КЛАСС ИГРОКА
// ------------------------

class Player {

    constructor(name, team, x, y, human = false) {

        this.name = name;

        this.team = team;

        this.x = x;
        this.y = y;

        this.startX = x;
        this.startY = y;

        this.radius = 18;

        this.speed = 3.5;

        this.human = human;

        this.goalkeeper = false;

        this.passTarget = null;

        this.hasBall = false;

        this.color =
            team === "A"
                ? "#ff4444"
                : "#4488ff";

    }

}
// =======================================
// Часть 2
// =======================================

// ------------------------
// КЛАСС МЯЧА
// ------------------------

class Ball {

    constructor() {

        this.reset();

        this.radius = 10;

    }

    reset() {

        this.x = WIDTH / 2;
        this.y = HEIGHT / 2;

        this.vx = 0;
        this.vy = 0;

    }

}

ball = new Ball();

// ------------------------
// СОЗДАНИЕ ИГРОКОВ
// ------------------------

function createPlayer(name, team, x, y, human = false, goalkeeper = false) {

    const p = new Player(
        name,
        team,
        x,
        y,
        human
    );

    p.goalkeeper = goalkeeper;

    return p;

}

// ------------------------
// СОЗДАНИЕ МАТЧА
// ------------------------

function createMatch() {

    teamA = [];
    teamB = [];

    scoreLeft = 0;
    scoreRight = 0;

    ball.reset();

    const myPlayers = squads[selectedTeam];

    const enemyPlayers = enemySquad;

    // ---------- МОЯ КОМАНДА ----------

    for (let i = 0; i < selectedMode; i++) {

        teamA.push(

            createPlayer(

                myPlayers[i],

                "A",

                140,

                120 + i * 90,

                i === 0,

                i === selectedMode - 1

            )

        );

    }

    // ---------- СОПЕРНИК ----------

    for (let i = 0; i < selectedMode; i++) {

        teamB.push(

            createPlayer(

                enemyPlayers[i],

                "B",

                WIDTH - 140,

                120 + i * 90,

                false,

                i === selectedMode - 1

            )

        );

    }

}

// ------------------------
// ВСЕ ИГРОКИ
// ------------------------

function allPlayers() {

    return [

        ...teamA,

        ...teamB

    ];

}
// =======================================
// Часть 3
// =======================================

// ------------------------
// МЕНЮ
// ------------------------

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");

const scoreALabel = document.getElementById("scoreA");
const scoreBLabel = document.getElementById("scoreB");
const timeLabel = document.getElementById("time");

document.querySelectorAll("[data-team]").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll("[data-team]")
            .forEach(x => x.classList.remove("selected"));

        btn.classList.add("selected");

        selectedTeam = btn.dataset.team;

    };

});

document.querySelectorAll("[data-mode]").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll("[data-mode]")
            .forEach(x => x.classList.remove("selected"));

        btn.classList.add("selected");

        selectedMode = Number(btn.dataset.mode);

    };

});

document.querySelectorAll("[data-level]").forEach(btn => {

    btn.onclick = () => {

        document
            .querySelectorAll("[data-level]")
            .forEach(x => x.classList.remove("selected"));

        btn.classList.add("selected");

        selectedDifficulty = btn.dataset.level;

    };

});

// ------------------------
// ТАЙМЕР
// ------------------------

function startTimer() {

    clearInterval(timer);

    matchTime = 60;

    timeLabel.textContent = matchTime;

    timer = setInterval(() => {

        if (!gameStarted) return;

        matchTime--;

        timeLabel.textContent = matchTime;

        if (matchTime <= 0) {

            clearInterval(timer);

            gameStarted = false;

            alert(
                "Матч завершён!\n\n" +
                scoreLeft +
                " : " +
                scoreRight
            );

        }

    }, 1000);

}

// ------------------------
// НАЧАЛО ИГРЫ
// ------------------------

document
    .getElementById("startBtn")
    .onclick = () => {

        menu.classList.add("hidden");

        hud.classList.remove("hidden");

        createMatch();

        startTimer();

        gameStarted = true;

    };

// ------------------------
// ОБНОВЛЕНИЕ HUD
// ------------------------

function updateHUD() {

    scoreALabel.textContent = scoreLeft;
    scoreBLabel.textContent = scoreRight;
    timeLabel.textContent = matchTime;

}
// =======================================
// Часть 4
// Джойстик и управление
// =======================================


let joystick = {

    active:false,

    x:0,

    y:0

};



const joystickBox =
document.getElementById("joystick");


const stick =
document.getElementById("stick");



// ------------------------
// НАЖАТИЕ ДЖОЙСТИКА
// ------------------------

function moveJoystick(e){

    if(!gameStarted) return;


    const touch =
    e.touches[0];


    const rect =
    joystickBox.getBoundingClientRect();


    let x =
    touch.clientX -
    (rect.left + rect.width/2);


    let y =
    touch.clientY -
    (rect.top + rect.height/2);



    let distance =
    Math.sqrt(
        x*x + y*y
    );


    const max = 45;


    if(distance > max){

        x =
        x / distance * max;

        y =
        y / distance * max;

    }



    joystick.x =
    x / max;


    joystick.y =
    y / max;



    stick.style.left =
    (35 + x) + "px";


    stick.style.top =
    (35 + y) + "px";


}



function resetJoystick(){

    joystick.x = 0;

    joystick.y = 0;


    stick.style.left =
    "35px";

    stick.style.top =
    "35px";

}




joystickBox.addEventListener(
"touchmove",
moveJoystick
);



joystickBox.addEventListener(
"touchend",
resetJoystick
);



// ------------------------
// ДВИЖЕНИЕ ИГРОКА
// ------------------------

function updateHumanPlayer(){

    const player =
    teamA[0];


    if(!player) return;



    player.x +=
    joystick.x *
    player.speed;


    player.y +=
    joystick.y *
    player.speed;



    limitPlayer(player);

}



// ------------------------
// ГРАНИЦЫ ПОЛЯ
// ------------------------

function limitPlayer(p){


    p.x =
    Math.max(
        p.radius,
        Math.min(
            WIDTH-p.radius,
            p.x
        )
    );


    p.y =
    Math.max(
        p.radius,
        Math.min(
            HEIGHT-p.radius,
            p.y
        )
    );


}
// =======================================
// Часть 5
// Физика мяча
// =======================================


// ------------------------
// ДВИЖЕНИЕ МЯЧА
// ------------------------

function updateBall(){


    if(!ball) return;


    // движение

    ball.x += ball.vx;

    ball.y += ball.vy;



    // трение

    ball.vx *= 0.97;

    ball.vy *= 0.97;



    // остановка слишком медленного мяча

    if(Math.abs(ball.vx) < 0.05)
        ball.vx = 0;


    if(Math.abs(ball.vy) < 0.05)
        ball.vy = 0;



    // стены сверху и снизу

    if(ball.y < ball.radius){

        ball.y = ball.radius;

        ball.vy *= -1;

    }



    if(ball.y > HEIGHT-ball.radius){

        ball.y =
        HEIGHT-ball.radius;

        ball.vy *= -1;

    }



    // боковые стены пока отражают
    // (ворота добавим позже)

    if(ball.x < ball.radius){

        ball.x = ball.radius;

        ball.vx *= -1;

    }


    if(ball.x > WIDTH-ball.radius){

        ball.x =
        WIDTH-ball.radius;

        ball.vx *= -1;

    }

}


// ------------------------
// УДАР ПО МЯЧУ
// ------------------------

function kickBall(player, power = 10){


    let dx =
    ball.x - player.x;


    let dy =
    ball.y - player.y;


    let distance =
    Math.sqrt(
        dx*dx + dy*dy
    );



    if(distance < player.radius + 35){


        ball.vx =
        (dx / distance) * power;


        ball.vy =
        (dy / distance) * power;


    }

}
// =======================================
// Часть 6
// Столкновения
// =======================================


// ------------------------
// СТОЛКНОВЕНИЕ ИГРОК - МЯЧ
// ------------------------

function checkPlayerBallCollision(){


    allPlayers().forEach(player=>{


        let dx =
        ball.x - player.x;


        let dy =
        ball.y - player.y;


        let distance =
        Math.sqrt(
            dx*dx + dy*dy
        );



        if(
            distance <
            player.radius + ball.radius
        ){


            // направление от игрока

            if(distance === 0)
                distance = 1;



            let force = 7;


            ball.vx =
            (dx / distance) * force;


            ball.vy =
            (dy / distance) * force;


            // чуть отодвигаем мяч

            ball.x =
            player.x +
            (dx / distance) *
            (player.radius + ball.radius + 2);


            ball.y =
            player.y +
            (dy / distance) *
            (player.radius + ball.radius + 2);


        }


    });


}




// ------------------------
// СТОЛКНОВЕНИЕ ИГРОКОВ
// ------------------------

function checkPlayersCollision(){


    let players =
    allPlayers();



    for(
        let i = 0;
        i < players.length;
        i++
    ){


        for(
            let j = i + 1;
            j < players.length;
            j++
        ){


            let a = players[i];

            let b = players[j];



            let dx =
            b.x - a.x;


            let dy =
            b.y - a.y;


            let distance =
            Math.sqrt(
                dx*dx + dy*dy
            );



            let minDistance =
            a.radius + b.radius;



            if(
                distance < minDistance &&
                distance > 0
            ){


                let push =
                (minDistance-distance)/2;



                let nx =
                dx/distance;


                let ny =
                dy/distance;



                a.x -= nx*push;

                a.y -= ny*push;


                b.x += nx*push;

                b.y += ny*push;



                limitPlayer(a);

                limitPlayer(b);

            }


        }


    }


}
// =======================================
// Часть 7
// ИИ игроков
// =======================================


// ------------------------
// ДВИЖЕНИЕ К ЦЕЛИ
// ------------------------

function moveToTarget(player, tx, ty){


    let dx =
    tx - player.x;


    let dy =
    ty - player.y;


    let distance =
    Math.sqrt(
        dx*dx + dy*dy
    );



    if(distance > 5){


        let speed =
        player.speed * 0.7;



        if(selectedDifficulty === "hard")
            speed *= 1.4;


        if(selectedDifficulty === "normal")
            speed *= 1.15;



        player.x +=
        (dx/distance) * speed;


        player.y +=
        (dy/distance) * speed;


        limitPlayer(player);

    }

}



// ------------------------
// ИИ ОДНОЙ КОМАНДЫ
// ------------------------

function updateTeamAI(team){


    team.forEach(player=>{


        // человек управляет первым

        if(player.human)
            return;



        // вратарь пока стоит у ворот
        // умнее сделаем позже

        if(player.goalkeeper){

            let goalX =
            player.team==="A"
            ? 70
            : WIDTH-70;


            moveToTarget(
                player,
                goalX,
                HEIGHT/2
            );


            return;

        }



        // ближайший к мячу атакует


        let closest =
        getClosestPlayer(
            team,
            ball.x,
            ball.y
        );


        if(player === closest){


            moveToTarget(
                player,
                ball.x,
                ball.y
            );


        }

        else{


            // остальные держат позиции

            moveToTarget(
                player,
                player.startX,
                player.startY
            );


        }



    });


}



// ------------------------
// ПОИСК БЛИЖАЙШЕГО
// ------------------------

function getClosestPlayer(team,x,y){


    let result = null;

    let best = Infinity;



    team.forEach(player=>{


        if(player.goalkeeper)
            return;



        let dx =
        x-player.x;


        let dy =
        y-player.y;


        let d =
        Math.sqrt(
            dx*dx+dy*dy
        );



        if(d < best){

            best=d;

            result=player;

        }


    });


    return result;

}



// ------------------------
// ЗАПУСК ИИ
// ------------------------

function updateAI(){


    updateTeamAI(teamA);

    updateTeamAI(teamB);


}
// =======================================
// Часть 8
// Открывания и позиции ИИ
// =======================================


// ------------------------
// ОПРЕДЕЛЕНИЕ РОЛИ
// ------------------------

function getPlayerRole(player, index, team){


    if(player.goalkeeper)
        return "goalkeeper";


    if(index === 0)
        return "attacker";


    return "support";

}



// ------------------------
// ОТКРЫВАНИЕ ИГРОКА
// ------------------------

function makeRun(player){


    let direction =
    player.team==="A"
    ? 1
    : -1;



    let targetX =
    player.startX +
    direction * 120;



    let targetY =
    player.startY;



    moveToTarget(
        player,
        targetX,
        targetY
    );


}



// ------------------------
// ФУТБОЛЬНЫЙ ИИ
// ------------------------

function updateFootballAI(team){


    team.forEach((player,index)=>{


        if(player.human)
            return;



        if(player.goalkeeper)
            return;



        let role =
        getPlayerRole(
            player,
            index,
            team
        );



        let haveBall = false;



        if(
            team.some(p=>p.hasBall)
        ){

            haveBall=true;

        }



        // если команда атакует

        if(haveBall){


            if(role==="attacker"){

                makeRun(player);

            }


            else{


                moveToTarget(

                    player,

                    player.startX +
                    (
                    player.team==="A"
                    ?60
                    :-60
                    ),

                    player.startY

                );

            }


        }


        // если мяча нет

        else{


            let closest =
            getClosestPlayer(
                team,
                ball.x,
                ball.y
            );



            if(player===closest){


                moveToTarget(
                    player,
                    ball.x,
                    ball.y
                );


            }

            else{


                moveToTarget(

                    player,

                    player.startX,

                    player.startY

                );


            }


        }


    });


}
// =======================================
// Часть 9
// Вратарь
// =======================================


// ------------------------
// ЗОНА ВРАТАРЯ
// ------------------------

function goalkeeperZone(player){


    let leftSide =
    player.team === "A";


    let minX =
    leftSide ? 25 : WIDTH-120;


    let maxX =
    leftSide ? 120 : WIDTH-25;



    // ограничиваем движение

    if(player.x < minX)
        player.x = minX;


    if(player.x > maxX)
        player.x = maxX;



    if(player.y < 150)
        player.y = 150;


    if(player.y > HEIGHT-150)
        player.y = HEIGHT-150;


}



// ------------------------
// ДВИЖЕНИЕ ВРАТАРЯ
// ------------------------

function updateGoalkeeper(player){


    if(!player.goalkeeper)
        return;



    let goalX =
    player.team==="A"
    ? 70
    : WIDTH-70;



    // всегда держит линию ворот

    player.x +=
    (goalX-player.x)*0.08;



    // следит за мячом по Y

    player.y +=
    (ball.y-player.y)*0.04;



    goalkeeperZone(player);



    // выход за мячом

    let distance =

    Math.sqrt(

        (ball.x-player.x)**2 +

        (ball.y-player.y)**2

    );



    let canRun =

    player.team==="A"

    ? ball.x < 180

    : ball.x > WIDTH-180;



    if(distance < 130 && canRun){


        moveToTarget(

            player,

            ball.x,

            ball.y

        );


        goalkeeperZone(player);


    }


}



// ------------------------
// ОБНОВЛЕНИЕ ВСЕХ ВРАТАРЕЙ
// ------------------------

function updateGoalkeepers(){


    allPlayers().forEach(player=>{


        if(player.goalkeeper){

            updateGoalkeeper(player);

        }


    });


}
// =======================================
// Часть 10
// Пас
// =======================================


// ------------------------
// НАЙТИ БЛИЖАЙШЕГО СОЮЗНИКА
// ------------------------

function findBestPassTarget(player){


    let best = null;

    let bestScore = -Infinity;



    teamA.forEach(mate=>{


        if(mate === player)
            return;



        if(mate.goalkeeper)
            return;



        let dx =
        mate.x-player.x;


        let dy =
        mate.y-player.y;


        let distance =
        Math.sqrt(
            dx*dx+dy*dy
        );



        // направление атаки

        let forward =

        player.team==="A"

        ? mate.x-player.x

        : player.x-mate.x;



        let score =

        forward*0.5 -

        distance*0.2;



        if(score > bestScore){

            bestScore = score;

            best = mate;

        }


    });



    return best;

}



// ------------------------
// СДЕЛАТЬ ПАС
// ------------------------

function passBall(){


    let player =
    teamA[0];


    if(!player)
        return;



    let dx =
    ball.x-player.x;


    let dy =
    ball.y-player.y;



    let distance =
    Math.sqrt(
        dx*dx+dy*dy
    );



    // игрок должен быть рядом

    if(distance > 50)
        return;



    let target =
    findBestPassTarget(player);



    if(!target)
        return;



    let tx =
    target.x-ball.x;


    let ty =
    target.y-ball.y;



    let d =
    Math.sqrt(
        tx*tx+ty*ty
    );



    ball.vx =
    (tx/d)*8;


    ball.vy =
    (ty/d)*8;



}



// ------------------------
// КНОПКА ПАСА
// ------------------------

document
.getElementById("pass")
.onclick = () => {


    if(gameStarted){

        passBall();

    }


};
// =======================================
// Часть 11
// Удар по мячу
// =======================================


// ------------------------
// СИЛА УДАРА
// ------------------------

let shotPower = 10;

let chargingShot = false;



// ------------------------
// НАПРАВЛЕНИЕ УДАРА
// ------------------------

function shootBall(){


    let player =
    teamA[0];


    if(!player)
        return;



    let dx =
    ball.x-player.x;


    let dy =
    ball.y-player.y;



    let distance =
    Math.sqrt(
        dx*dx+dy*dy
    );



    // игрок далеко

    if(distance > 55)
        return;



    if(distance===0)
        distance=1;



    let power =
    shotPower;



    ball.vx =
    (dx/distance)*power;


    ball.vy =
    (dy/distance)*power;



    shotPower = 10;


}



// ------------------------
// ЗАРЯД УДАРА
// ------------------------

function startChargeShot(){


    chargingShot = true;


    let charge = setInterval(()=>{


        if(!chargingShot){

            clearInterval(charge);

            return;

        }



        shotPower += 0.5;



        if(shotPower > 18)
            shotPower = 18;



    },100);



}



function stopChargeShot(){


    chargingShot=false;


    shootBall();


}



// ------------------------
// КНОПКА УДАРА
// ------------------------

const shootButton =
document.getElementById("shoot");



shootButton.addEventListener(
"touchstart",
()=>{


    if(gameStarted){

        startChargeShot();

    }


});



shootButton.addEventListener(
"touchend",
()=>{


    if(gameStarted){

        stopChargeShot();

    }


});



// Для компьютера

shootButton.onclick = () => {


    if(gameStarted){

        shootBall();

    }


};
// =======================================
// Часть 12
// Голы и ворота
// =======================================


// ------------------------
// РАЗМЕР ВОРОТ
// ------------------------

const goalHeight = 160;

const goalTop =
(HEIGHT - goalHeight) / 2;

const goalBottom =
goalTop + goalHeight;



// ------------------------
// ПРОВЕРКА ГОЛА
// ------------------------

function checkGoal(){



    // левый гол

    if(

        ball.x < 0 &&

        ball.y > goalTop &&

        ball.y < goalBottom

    ){


        scoreRight++;


        updateHUD();


        resetAfterGoal();


        return;


    }



    // правый гол

    if(

        ball.x > WIDTH &&

        ball.y > goalTop &&

        ball.y < goalBottom

    ){


        scoreLeft++;


        updateHUD();


        resetAfterGoal();


        return;


    }



}



// ------------------------
// ПОСЛЕ ГОЛА
// ------------------------

function resetAfterGoal(){


    ball.reset();



    teamA.forEach((p,i)=>{


        p.x = p.startX;

        p.y = p.startY;


    });



    teamB.forEach((p)=>{


        p.x = p.startX;

        p.y = p.startY;


    });


}
// =======================================
// Часть 13
// Отрисовка игры
// =======================================


// ------------------------
// ПОЛЕ
// ------------------------

function drawField(){


    // фон поля

    ctx.fillStyle = "#238b45";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );



    // линии

    ctx.strokeStyle = "white";

    ctx.lineWidth = 3;



    // центральная линия

    ctx.beginPath();

    ctx.moveTo(
        WIDTH/2,
        0
    );

    ctx.lineTo(
        WIDTH/2,
        HEIGHT
    );

    ctx.stroke();



    // круг центра

    ctx.beginPath();

    ctx.arc(
        WIDTH/2,
        HEIGHT/2,
        70,
        0,
        Math.PI*2
    );

    ctx.stroke();



    // штрафные площади

    ctx.strokeRect(
        0,
        HEIGHT/2-90,
        120,
        180
    );


    ctx.strokeRect(
        WIDTH-120,
        HEIGHT/2-90,
        120,
        180
    );



    // ворота

    ctx.strokeRect(
        -5,
        goalTop,
        35,
        goalHeight
    );


    ctx.strokeRect(
        WIDTH-30,
        goalTop,
        35,
        goalHeight
    );



}



// ------------------------
// ИГРОКИ
// ------------------------

function drawPlayers(){


    allPlayers().forEach(player=>{


        ctx.beginPath();


        ctx.arc(

            player.x,

            player.y,

            player.radius,

            0,

            Math.PI*2

        );


        ctx.fillStyle =
        player.color;


        ctx.fill();



        // имя

        ctx.fillStyle="white";


        ctx.font="14px Arial";


        ctx.textAlign="center";


        ctx.fillText(

            player.name,

            player.x,

            player.y-25

        );



    });



}



// ------------------------
// МЯЧ
// ------------------------

function drawBall(){


    ctx.beginPath();


    ctx.arc(

        ball.x,

        ball.y,

        ball.radius,

        0,

        Math.PI*2

    );


    ctx.fillStyle="white";


    ctx.fill();


}



// ------------------------
// ОБЩАЯ ОТРИСОВКА
// ------------------------

function draw(){


    drawField();


    drawPlayers();


    drawBall();


}
// =======================================
// Часть 14
// Главный цикл игры
// =======================================


// ------------------------
// ОБНОВЛЕНИЕ ИГРЫ
// ------------------------

function updateGame(){


    if(!gameStarted)
        return;



    // человек

    updateHumanPlayer();



    // ИИ

    updateAI();


    // улучшенный ИИ

    updateFootballAI(teamA);

    updateFootballAI(teamB);



    // вратари

    updateGoalkeepers();



    // мяч

    updateBall();



    // столкновения

    checkPlayerBallCollision();

    checkPlayersCollision();



    // голы

    checkGoal();



    // счёт

    updateHUD();


}



// ------------------------
// ОСНОВНОЙ LOOP
// ------------------------

function gameLoop(){



    updateGame();



    draw();



    requestAnimationFrame(
        gameLoop
    );


}



// запуск

gameLoop();
// =======================================
// Часть 15
// Правильные составы
// =======================================


// ------------------------
// СОСТАВЫ С ПАРАМИ
// ------------------------

const fullSquads = {


    aziz: {

        main:[
            "Азиз",
            "Хабиб"
        ],

        extra:[
            "Абдул",
            "Мухаммад"
        ]

    },



    abdul: {

        main:[
            "Абдул",
            "Мухаммад"
        ],

        extra:[
            "Азиз",
            "Хабиб"
        ]

    },



    shamil: {

        main:[
            "Шамиль",
            "Шамиль Jr"
        ],

        extra:[
            "Мухаммад",
            "Мухаммад Jr"
        ]

    },



    muhammad: {

        main:[
            "Мухаммад",
            "Мухаммад Jr"
        ],

        extra:[
            "Шамиль",
            "Шамиль Jr"
        ]

    }


};



// ------------------------
// ПОЛУЧЕНИЕ СОСТАВА
// ------------------------

function getMySquad(){


    let squad =
    fullSquads[selectedTeam];



    let result = [];


    // сначала основные

    result.push(
        ...squad.main
    );



    // потом дополнительные

    result.push(
        ...squad.extra
    );



    return result;

}



// ------------------------
// ОБНОВЛЁННЫЙ СОЗДАТЕЛЬ
// ------------------------

function getPlayersForMode(){


    let players =
    getMySquad();



    return players.slice(
        0,
        selectedMode
    );


}
// =======================================
// Часть 16
// Новое создание матча
// =======================================


// ------------------------
// СОЗДАНИЕ МАТЧА
// ------------------------

function createMatch(){


    teamA = [];

    teamB = [];

    ball.reset();



    let myNames =
    getPlayersForMode();



    let enemyNames =
    enemySquad.slice(
        0,
        selectedMode
    );



    // позиции

    let positions =
    getPositions();



    // МОЯ КОМАНДА

    for(let i=0;i<selectedMode;i++){


        let player =
        createPlayer(

            myNames[i],

            "A",

            positions.A[i].x,

            positions.A[i].y,

            i===0,

            i===selectedMode-1

        );


        teamA.push(player);


    }



    // СОПЕРНИКИ

    for(let i=0;i<selectedMode;i++){


        let player =
        createPlayer(

            enemyNames[i],

            "B",

            positions.B[i].x,

            positions.B[i].y,

            false,

            i===selectedMode-1

        );


        teamB.push(player);


    }



}



// ------------------------
// ПОЗИЦИИ ДЛЯ РЕЖИМОВ
// ------------------------

function getPositions(){



    if(selectedMode===2){


        return {


            A:[
                {
                    x:180,
                    y:200
                },
                {
                    x:80,
                    y:250
                }
            ],


            B:[
                {
                    x:620,
                    y:200
                },
                {
                    x:720,
                    y:250
                }
            ]


        };


    }




    if(selectedMode===3){


        return {


            A:[
                {
                    x:180,
                    y:130
                },
                {
                    x:100,
                    y:250
                },
                {
                    x:180,
                    y:370
                }
            ],



            B:[
                {
                    x:620,
                    y:130
                },
                {
                    x:700,
                    y:250
                },
                {
                    x:620,
                    y:370
                }
            ]


        };


    }




    // 4x4

    return {


        A:[

            {
                x:200,
                y:90
            },

            {
                x:120,
                y:200
            },

            {
                x:120,
                y:300
            },

            {
                x:200,
                y:410
            }

        ],



        B:[

            {
                x:600,
                y:90
            },

            {
                x:680,
                y:200
            },

            {
                x:680,
                y:300
            },

            {
                x:600,
                y:410
            }

        ]


    };


}
// =======================================
// Часть 17
// Роли игроков и тактика
// =======================================


// ------------------------
// НАЗНАЧЕНИЕ РОЛЕЙ
// ------------------------

function assignRoles(team){


    team.forEach((player,index)=>{


        // последний игрок - вратарь

        if(player.goalkeeper){

            player.role="goalkeeper";

            return;

        }



        if(index===0){

            player.role="attacker";

        }

        else if(index===1){

            player.role="defender";

        }

        else{

            player.role="support";

        }


    });


}



// ------------------------
// АТАКА
// ------------------------

function updateAttack(player){


    let direction =
    player.team==="A"
    ? 1
    : -1;



    if(player.role==="attacker"){


        let targetX =
        player.startX +
        direction*180;



        moveToTarget(

            player,

            targetX,

            player.startY

        );


    }



    if(player.role==="support"){


        let targetX =
        player.startX +
        direction*80;



        moveToTarget(

            player,

            targetX,

            player.startY

        );


    }


}



// ------------------------
// ЗАЩИТА
// ------------------------

function updateDefense(player){



    if(player.role!=="defender")
        return;



    // возвращаемся ближе к своим воротам


    moveToTarget(

        player,

        player.startX,

        player.startY

    );


}



// ------------------------
// ТАКТИКА КОМАНДЫ
// ------------------------

function updateTactics(team){



    assignRoles(team);



    let hasBall = false;



    team.forEach(p=>{


        if(p.hasBall)
            hasBall=true;


    });



    team.forEach(player=>{


        if(player.human)
            return;



        if(player.role==="defender"){


            updateDefense(player);


        }


        else if(hasBall){


            updateAttack(player);


        }



    });


}
// =======================================
// Часть 18
// Владение мячом
// =======================================


// ------------------------
// ПРОВЕРКА ВЛАДЕНИЯ
// ------------------------

function updatePossession(){


    let owner = null;

    let closest = 999;



    allPlayers().forEach(player=>{


        let dx =
        ball.x - player.x;


        let dy =
        ball.y - player.y;



        let distance =
        Math.sqrt(
            dx*dx + dy*dy
        );



        if(distance < 35 && distance < closest){

            closest = distance;

            owner = player;

        }


    });



    // сбрасываем владение

    allPlayers().forEach(p=>{

        p.hasBall = false;

    });



    if(owner){


        owner.hasBall = true;


        // мяч рядом с игроком


        let direction =

        owner.team==="A"
        ? 1
        : -1;



        ball.x =
        owner.x +
        direction*25;



        ball.y =
        owner.y;



        // мяч почти не движется

        ball.vx *= 0.5;

        ball.vy *= 0.5;


    }


}



// ------------------------
// ВЕДЕНИЕ МЯЧА
// ------------------------

function dribbleBall(player){



    if(!player.hasBall)
        return;



    let direction =

    player.team==="A"
    ? 1
    : -1;



    ball.x =
    player.x +
    direction*25;



    ball.y =
    player.y;



}



// ------------------------
// ОБНОВЛЕНИЕ ВЛАДЕНИЯ
// ------------------------

function updateBallControl(){


    updatePossession();



    allPlayers().forEach(player=>{


        if(player.hasBall){

            dribbleBall(player);

        }


    });


}
// =======================================
// Часть 19
// Действия с мячом
// =======================================


// ------------------------
// ПЕРЕДАЧА МЯЧА
// ------------------------

function makePass(player){


    if(!player.hasBall)
        return;



    let target =
    findBestPassTarget(player);



    if(!target)
        return;



    let dx =
    target.x - ball.x;


    let dy =
    target.y - ball.y;



    let distance =
    Math.sqrt(
        dx*dx + dy*dy
    );



    if(distance===0)
        return;



    player.hasBall=false;



    ball.vx =
    (dx/distance)*10;


    ball.vy =
    (dy/distance)*10;


}



// ------------------------
// УДАР ПО ВОРОТАМ
// ------------------------

function makeShot(player){


    if(!player.hasBall)
        return;



    player.hasBall=false;



    let direction =
    player.team==="A"
    ? 1
    : -1;



    ball.vx =
    direction*15;



    // немного случайности

    ball.vy =
    (Math.random()-0.5)*8;



}



// ------------------------
// ОТБОР МЯЧА
// ------------------------

function tackle(){


    let human =
    teamA[0];



    teamB.forEach(enemy=>{


        let dx =
        human.x-enemy.x;


        let dy =
        human.y-enemy.y;



        let distance =
        Math.sqrt(
            dx*dx+dy*dy
        );



        if(distance < 35){



            if(Math.random()>0.5){


                enemy.hasBall=true;

                human.hasBall=false;


                ball.x =
                enemy.x;


                ball.y =
                enemy.y;


            }


        }


    });


}



// ------------------------
// КНОПКИ
// ------------------------

document
.getElementById("pass")
.onclick=()=>{


    if(!gameStarted)
        return;


    makePass(teamA[0]);


};



document
.getElementById("shoot")
.onclick=()=>{


    if(!gameStarted)
        return;


    makeShot(teamA[0]);


};
// =======================================
// Часть 20
// Игра ИИ с мячом
// =======================================


// ------------------------
// ПРОВЕРКА ВЛАДЕНИЯ У КОМАНДЫ
// ------------------------

function getBallOwner(team){


    for(let p of team){

        if(p.hasBall)
            return p;

    }


    return null;

}



// ------------------------
// ПАСС ИИ
// ------------------------

function enemyPass(player, team){


    let target =
    findTeamMate(player, team);


    if(!target)
        return false;



    let dx =
    target.x-ball.x;


    let dy =
    target.y-ball.y;



    let d =
    Math.sqrt(
        dx*dx+dy*dy
    );



    if(d===0)
        return false;



    player.hasBall=false;



    ball.vx =
    (dx/d)*8;


    ball.vy =
    (dy/d)*8;



    return true;

}



// ------------------------
// НАЙТИ ПАРТНЁРА
// ------------------------

function findTeamMate(player, team){


    let best=null;

    let distance=9999;



    team.forEach(p=>{


        if(p===player)
            return;


        if(p.goalkeeper)
            return;



        let d =
        Math.sqrt(

            (p.x-player.x)**2 +

            (p.y-player.y)**2

        );



        if(d<distance){

            distance=d;

            best=p;

        }


    });



    return best;

}



// ------------------------
// РЕШЕНИЯ ИИ
// ------------------------

function updateEnemyFootball(){



    let owner =
    getBallOwner(teamB);



    if(!owner)
        return;



    let nearGoal =

    owner.x < 180;



    // шанс паса

    let passChance =
    selectedDifficulty==="hard"
    ?0.6
    :0.35;



    if(nearGoal){


        makeShot(owner);


    }

    else if(Math.random()<passChance){


        enemyPass(
            owner,
            teamB
        );


    }



}



// ------------------------
// АТАКА МОЕЙ КОМАНДЫ БОТАМИ
// ------------------------

function updateMyTeamFootball(){


    let owner =
    getBallOwner(teamA);



    if(!owner)
        return;



    if(owner===teamA[0])
        return;



    let chance =
    selectedDifficulty==="hard"
    ?0.5
    :0.25;



    if(Math.random()<chance){


        makePass(owner);


    }


}
// =======================================
// Часть 21
// Улучшенный удар
// =======================================


// ------------------------
// ТОЧНОСТЬ УДАРА
// ------------------------

function getShotAccuracy(){


    if(selectedDifficulty==="easy")
        return 0.7;


    if(selectedDifficulty==="normal")
        return 0.85;


    return 0.95;


}



// ------------------------
// НОВЫЙ УДАР
// ------------------------

function advancedShot(player){


    if(!player.hasBall)
        return;



    player.hasBall=false;



    let targetX =
    player.team==="A"
    ? WIDTH
    : 0;



    let targetY =
    HEIGHT/2;



    let dx =
    targetX-ball.x;


    let dy =
    targetY-ball.y;



    let distance =
    Math.sqrt(
        dx*dx+dy*dy
    );



    if(distance===0)
        return;



    // ошибка удара

    let error =
    (1-getShotAccuracy())*100;



    dy +=
    (Math.random()-0.5)
    * error;



    distance =
    Math.sqrt(
        dx*dx+dy*dy
    );



    ball.vx =
    (dx/distance)*14;


    ball.vy =
    (dy/distance)*14;



}



// ------------------------
// ЗАМЕНА КНОПКИ УДАРА
// ------------------------

document
.getElementById("shoot")
.onclick=()=>{


    if(!gameStarted)
        return;



    advancedShot(
        teamA[0]
    );


};
// =======================================
// Часть 22
// Скорость и выносливость
// =======================================


// ------------------------
// НАСТРОЙКА ИГРОКА
// ------------------------

function setupPlayerStats(player){


    // разные характеристики


    if(player.goalkeeper){


        player.maxSpeed = 2.5;

        player.stamina = 100;


    }

    else if(player.role==="attacker"){


        player.maxSpeed = 4.5;

        player.stamina = 100;


    }

    else if(player.role==="defender"){


        player.maxSpeed = 3.5;

        player.stamina = 100;


    }

    else{


        player.maxSpeed = 3.8;

        player.stamina = 100;


    }



    player.acceleration = 0.15;


    player.currentSpeed = 0;


}



// ------------------------
// ОБНОВЛЕНИЕ СКОРОСТИ
// ------------------------

function updatePlayerSpeed(player){



    if(!player.stamina)
        player.stamina = 100;



    // если устал

    let fatigue =
    1 - (100-player.stamina)/200;



    let speed =
    player.maxSpeed *
    fatigue;



    if(player.currentSpeed < speed){


        player.currentSpeed +=
        player.acceleration;


    }

    else{


        player.currentSpeed =
        speed;


    }



    // расход энергии

    if(
        Math.abs(joystick.x)>0 ||
        Math.abs(joystick.y)>0
    ){


        player.stamina -=0.02;


    }



    if(player.stamina < 20){


        player.currentSpeed *=0.7;


    }



}



// ------------------------
// БЕГ С УЧЁТОМ СКОРОСТИ
// ------------------------

function movePlayerWithSpeed(player,x,y){



    updatePlayerSpeed(player);



    let dx=x-player.x;

    let dy=y-player.y;



    let d =
    Math.sqrt(
        dx*dx+dy*dy
    );



    if(d>1){


        player.x +=
        (dx/d)*player.currentSpeed;


        player.y +=
        (dy/d)*player.currentSpeed;


    }



    limitPlayer(player);


}
// =======================================
// Часть 23
// Камера и масштабирование
// =======================================


// ------------------------
// КАМЕРА
// ------------------------

let camera = {

    x:0,

    y:0,

    zoom:1

};



// ------------------------
// ОБНОВЛЕНИЕ КАМЕРЫ
// ------------------------

function updateCamera(){


    let player =
    teamA[0];


    if(!player)
        return;



    // камера следует за игроком


    camera.x =
    player.x - WIDTH/2;


    camera.y =
    player.y - HEIGHT/2;



    // границы камеры


    if(camera.x < 0)
        camera.x = 0;


    if(camera.y < 0)
        camera.y = 0;


}



// ------------------------
// НАСТРОЙКА ЭКРАНА
// ------------------------

function resizeCanvas(){


    let ratio =
    window.innerWidth /
    window.innerHeight;



    if(ratio < 1){


        canvas.style.width =
        "95vw";


        canvas.style.height =
        "60vh";


    }

    else{


        canvas.style.width =
        "90vw";


        canvas.style.height =
        "70vh";


    }


}



window.addEventListener(
"resize",
resizeCanvas
);


resizeCanvas();



// ------------------------
// РИСОВАНИЕ С КАМЕРОЙ
// ------------------------

function startCameraDraw(){


    ctx.save();


    ctx.translate(
        -camera.x,
        -camera.y
    );


}



// возврат

function endCameraDraw(){


    ctx.restore();


}
// =======================================
// Часть 24
// Камера + интерфейс
// =======================================


// ------------------------
// НОВАЯ ОТРИСОВКА С КАМЕРОЙ
// ------------------------

function drawWithCamera(){


    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    startCameraDraw();



    drawField();

    drawPlayers();

    drawBall();



    endCameraDraw();



    drawHUD();

}



// ------------------------
// HUD
// ------------------------

function drawHUD(){


    ctx.fillStyle =
    "rgba(0,0,0,0.4)";


    ctx.fillRect(
        10,
        10,
        180,
        70
    );



    ctx.fillStyle =
    "white";


    ctx.font =
    "22px Arial";


    ctx.textAlign =
    "left";



    ctx.fillText(

        scoreLeft+
        " : "+
        scoreRight,

        25,
        40

    );



    ctx.font =
    "18px Arial";


    ctx.fillText(

        "Время: "+
        matchTime,

        25,
        70

    );

}



// ------------------------
// ОБНОВЛЁННЫЙ LOOP
// ------------------------

function gameLoop(){



    updateGame();



    updateCamera();



    drawWithCamera();



    requestAnimationFrame(
        gameLoop
    );


}



// ------------------------
// КНОПКИ НЕ БЛОКИРУЮТ ПОЛЕ
// ------------------------

const controls =
document.getElementById("controls");



if(controls){


    controls.addEventListener(
        "touchstart",
        e=>{

            e.stopPropagation();

        }
    );


    controls.addEventListener(
        "mousedown",
        e=>{

            e.stopPropagation();

        }
    );


}
// =======================================
// Часть 25
// Финальная сборка основы
// =======================================


// ------------------------
// ПОДГОТОВКА ИГРОКОВ
// ------------------------

function prepareTeams(){


    teamA.forEach(player=>{


        setupPlayerStats(player);


    });



    teamB.forEach(player=>{


        setupPlayerStats(player);


    });



    assignRoles(teamA);

    assignRoles(teamB);


}



// ------------------------
// ПОЛНАЯ ИНИЦИАЛИЗАЦИЯ
// ------------------------

function startMatch(){


    createMatch();


    prepareTeams();


    ball.reset();


    gameStarted = true;


    startTimer();


}



// ------------------------
// ОБНОВЛЁННОЕ ОБНОВЛЕНИЕ ИГРЫ
// ------------------------

function updateGame(){


    if(!gameStarted)
        return;



    updateHumanPlayer();



    updateAI();



    updateFootballAI(teamA);

    updateFootballAI(teamB);



    updateTactics(teamA);

    updateTactics(teamB);



    updateGoalkeepers();



    updateBallControl();



    updateBall();



    checkPlayerBallCollision();


    checkPlayersCollision();



    updateEnemyFootball();


    updateMyTeamFootball();



    checkGoal();



    updateHUD();


}



// ------------------------
// ЗАПУСК
// ------------------------

window.onload = ()=>{


    resizeCanvas();


    draw();


};
// =======================================
// Часть 26
// Меню внутри JavaScript
// =======================================


// ------------------------
// СОЗДАНИЕ МЕНЮ
// ------------------------

function createMenu(){


    let menu =
    document.createElement("div");


    menu.id="gameMenu";


    menu.innerHTML = `

    <h1>⚽ Match Cup</h1>


    <h3>Команда</h3>

    <button class="teamBtn" data-team="aziz">
    Азиз + Хабиб
    </button>


    <button class="teamBtn" data-team="shamil">
    Шамили
    </button>



    <h3>Режим</h3>

    <button class="modeBtn" data-mode="2">
    2 × 2
    </button>


    <button class="modeBtn" data-mode="3">
    3 × 3
    </button>


    <button class="modeBtn" data-mode="4">
    4 × 4
    </button>



    <h3>Сложность</h3>

    <button class="difficultyBtn" data-level="easy">
    Лёгкая
    </button>


    <button class="difficultyBtn" data-level="normal">
    Нормальная
    </button>


    <button class="difficultyBtn" data-level="hard">
    Сложная
    </button>



    <br><br>


    <button id="startBtn">

    ▶ Играть

    </button>

    `;



    document.body.appendChild(menu);



}



// ------------------------
// НАСТРОЙКА МЕНЮ
// ------------------------

function setupMenu(){



    let teams =
    document.querySelectorAll(
        ".teamBtn"
    );


    teams.forEach(btn=>{


        btn.onclick=()=>{


            selectedTeam =
            btn.dataset.team;


        };


    });





    let modes =
    document.querySelectorAll(
        ".modeBtn"
    );



    modes.forEach(btn=>{


        btn.onclick=()=>{


            selectedMode =
            Number(
                btn.dataset.mode
            );


        };


    });





    let levels =
    document.querySelectorAll(
        ".difficultyBtn"
    );



    levels.forEach(btn=>{


        btn.onclick=()=>{


            selectedDifficulty =
            btn.dataset.level;


        };


    });





    document
    .getElementById("startBtn")
    .onclick=()=>{


        document
        .getElementById("gameMenu")
        .remove();



        startMatch();


    };

}



// ------------------------
// ЗАПУСК МЕНЮ
// ------------------------




    createMenu();

    setupMenu();


});

