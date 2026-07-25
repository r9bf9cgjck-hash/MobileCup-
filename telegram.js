// =================================
// MATCH CUP TELEGRAM SYSTEM
// =================================


// Проверяем Telegram


const tg = window.Telegram?.WebApp;



if(tg){

    tg.ready();

    tg.expand();


    console.log(
        "Telegram Mini App запущен"
    );

}



// ================================
// ВИБРАЦИЯ
// ================================


function vibrate(type="light"){


if(tg && tg.HapticFeedback){

    tg.HapticFeedback.impactOccurred(type);

}

else if(navigator.vibrate){

    navigator.vibrate(50);

}


}




// ================================
// КНОПКИ
// ================================


document.querySelectorAll("button")
.forEach(btn=>{


btn.addEventListener(
"click",
()=>{

vibrate("medium");


});


});





// ================================
// ПРОФИЛЬ ИГРОКА
// ================================


function getProfile(){


let username="Игрок";


if(tg && tg.initDataUnsafe.user){


username =
tg.initDataUnsafe.user.first_name;


}



return username;


}





// ================================
// ОКНО ПРОФИЛЯ
// ================================


function showProfile(){


let name=getProfile();



alert(`

👤 Профиль MATCH CUP


Игрок:
${name}


⭐ Уровень:
${career.level}


🏆 Победы:
${career.wins}


⚽ Голы:
${career.goals}


🪙 Монеты:
${career.coins}


`);



}




// ================================
// ПОДЕЛИТЬСЯ
// ================================


function shareGame(){


let text =
"⚽ Я играю в MATCH CUP!\nСобери свою команду 2 VS 2 и победи!";


if(tg){


tg.openTelegramLink(
"https://t.me/share/url?url=https://t.me/&text="
+
encodeURIComponent(text)
);


}

else{


navigator.share?.({

title:"MATCH CUP",

text:text

});


}



}




// ================================
// ЕЖЕДНЕВНЫЙ БОНУС
// ================================


function dailyBonus(){


let today =
new Date().toDateString();



let last =
localStorage.getItem(
"daily_bonus"
);



if(last!==today){


career.coins+=100;


career.xp+=50;


localStorage.setItem(
"daily_bonus",
today
);


saveCareer();


alert(
"🎁 Ежедневный бонус!\n+100 монет"
);


}



}





// ================================
// СТАРТ ПРОФИЛЯ
// ================================


window.addEventListener(
"load",
()=>{


dailyBonus();


});