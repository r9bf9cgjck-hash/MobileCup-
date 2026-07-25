let career = {

    level:1,
    xp:0,
    coins:0,

    wins:0,
    goals:0,

    season:1,

    player:selectedHero

};



// =======================
// ЗАГРУЗКА
// =======================


function loadCareer(){

let data = localStorage.getItem("matchcup_career");


if(data){

career = JSON.parse(data);

}


}



loadCareer();





// =======================
// СОХРАНЕНИЕ
// =======================


function saveCareer(){

localStorage.setItem(
"matchcup_career",
JSON.stringify(career)
);

}




// =======================
// ДОБАВИТЬ ОПЫТ
// =======================


function addXP(amount){


career.xp += amount;



let need = career.level * 300;



if(career.xp >= need){


career.level++;

career.xp=0;


career.coins+=100;



alert(
"🎉 Новый уровень!\nУровень: "
+career.level
);


}



saveCareer();


}




// =======================
// ПОБЕДА
// =======================


function careerWin(){


career.wins++;

career.coins+=50;


addXP(150);


saveCareer();


}





// =======================
// ГОЛ
// =======================


function careerGoal(){


career.goals++;

career.coins+=10;


addXP(30);


}





// =======================
// НОВЫЙ СЕЗОН
// =======================


function nextSeason(){


career.season++;


career.coins+=200;


saveCareer();


}





// =======================
// ОКНО КАРЬЕРЫ
// =======================


document
.getElementById("careerBtn")
.onclick=function(){


let text = `

🏆 MATCH CUP КАРЬЕРА


⭐ Уровень: ${career.level}


⚡ Опыт:
${career.xp}/${career.level*300}


🪙 Монеты:
${career.coins}


🏟 Победы:
${career.wins}


⚽ Голы:
${career.goals}


📅 Сезон:
${career.season}

`;


alert(text);


};





// =======================
// ПРОКАЧКА
// =======================


function upgradePlayer(){


if(career.coins>=100){


career.coins-=100;


heroes[selectedHero].power+=5;

heroes[selectedHero].speed+=0.2;



alert(
"🔥 Игрок улучшен!"
);



saveCareer();


}

else{


alert(
"Недостаточно монет"
);


}


}