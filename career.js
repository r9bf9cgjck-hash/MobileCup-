let career={

level:1,

xp:0,

coins:0,

wins:0,

goals:0,

season:1

};



// загрузка

function loadCareer(){

let save=
localStorage.getItem("matchcup_career");


if(save){

career=JSON.parse(save);

}

}


loadCareer();



// сохранение

function saveCareer(){

localStorage.setItem(
"matchcup_career",
JSON.stringify(career)
);

}



// опыт

function addXP(value){


career.xp+=value;


let need=career.level*200;


if(career.xp>=need){


career.level++;

career.xp=0;

career.coins+=100;


alert(
"🎉 Новый уровень!\n"+
"Уровень: "+career.level
);


}


saveCareer();

}



// победа

function winCareer(){


career.wins++;

career.coins+=50;

addXP(100);

}



// гол

function goalCareer(){


career.goals++;

career.coins+=10;

addXP(20);

}



// окно карьеры

document
.getElementById("careerBtn")
.onclick=function(){


alert(

"🏆 MATCH CUP КАРЬЕРА\n\n"+

"⭐ Уровень: "+
career.level+

"\n\n⚡ Опыт: "+
career.xp+

"\n\n🪙 Монеты: "+
career.coins+

"\n\n🏟 Победы: "+
career.wins+

"\n\n⚽ Голы: "+
career.goals+

"\n\n📅 Сезон: "+
career.season

);


};
