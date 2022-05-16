let currentTime = document.querySelector("#current-time");
let countries = document.querySelector("#countries");
let cities = document.querySelector("#cities");
let towns = document.querySelector("#towns");
let imsakP = document.getElementById("imsak");
let gunesP = document.getElementById("gunes");
let ogleP = document.getElementById("ogle");
let ikindiP = document.getElementById("ikindi");
let aksamP = document.getElementById("aksam");
let yatsiP = document.getElementById("yatsi");
let timeLeft = document.getElementById("time-left");
let kaydetButton = document.querySelector("#kaydet")
let ulke = document.querySelector("#country");
let sehir = document.querySelector("#city");
let ilce = document.querySelector("#town");
var fetchContry=[], fetchCity=[], fetchTown=[];
counter = 0;

function nowTime() {

    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();

    if (hour<10) hour = "0" + hour;
    if (minute<10) minute = "0" + minute;

    currentTime.innerText = hour + ":" + minute
};


async function getCountry () {

    fetchContry = await (await fetch("./countries.json")).json();
    var html = "";

    for(i=0; i<fetchContry.length; i++){

        var indexTurkie = 0;


        html+=`<option value='${fetchContry[i].UlkeID}'>${fetchContry[i].UlkeAdi}</option>`;

        if(fetchContry[i].UlkeAdi == "Turkie") indexTurkie = i;

        countries.innerHTML = html;
        countries.selectedIndex = indexTurkie;
    
    }

    getCity(2);

};

async function getCity (countryID) {

    fetchCity = await (await fetch(`https://namaz-vakti-api.herokuapp.com/cities?country=${countryID}`)).json();
    var html = "";
    var indexErrachdia = 0;

    for (i=0; i<fetchCity.length; i++) {

        
        html+=`<option value='${fetchCity[i].SehirID || fetchCity[i].sehirID}'>${fetchCity[i].SehirAdi || fetchCity[i].sehirAdi}</option>`;
         
        if(fetchCity[i].sehirAdi == "Errachdia") indexErrachdia = i;
    };

    cities.innerHTML = html;

    if(countryID == 2) {

        cities.selectedIndex = indexErrachdia
        getTown(520);
    } 
    else{

        cities.selectedIndex = 0;

        getTown(fetchCity[0].SehirID || fetchCity[0].sehirID)
    };
    
};

async function getTown (cityID) {
    
    fetchTown = await (await fetch(`https://namaz-vakti-api.herokuapp.com/regions?country=2&city=${cityID}`)).json();
    var html = "";

    for(i=0; i<fetchTown.length; i++) {

        html += `<option value='${fetchTown[i].IlceID}'>${fetchTown[i].IlceAdi}</option>`
        
    };

    towns.innerHTML = html;
};

async function getPrayerTime (townID) {

    let fetchPrayer = await (await fetch(`https://namaz-vakti-api.herokuapp.com/data?region=${townID}`)).json();

    let selectPrayer = fetchPrayer[0]

    imsakP.innerText = selectPrayer[1];
    gunesP.innerText = selectPrayer[2];
    ogleP.innerText = selectPrayer[3];
    ikindiP.innerText = selectPrayer[4];
    aksamP.innerText = selectPrayer[5];
    yatsiP.innerText = selectPrayer[6];

    clearInterval(counter);
    counter = setInterval(()=>{
        remainingTime(selectPrayer[5])
    },1000);

};


async function remainingTime (aksam) {

    var todayNow = new Date();
    var endTime = new Date();
    endTime.setHours(aksam.substr(0,2));
    endTime.setMinutes(aksam.substr(3,2));
    endTime.setSeconds("0");
   
    

    var t = endTime - todayNow
    if (t>0) {
        var hour = Math.floor((t%(1000*60*60*24))/ (1000*60*60));
        var minute = Math.floor((t%(1000*60*60))/(1000*60));
        var second = Math.floor((t%(1000*60))/(1000));
        

        timeLeft.innerText = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
    }
    else {
        timeLeft.innerText = "00:00:00"
    }

};


function changeCountry () {

    var country = countries.value;
    console.log(country);
    getCity(country)
};

function changeCity () {

    var citie = cities.value;
    console.log(citie);
    getTown(citie)
};

countries.addEventListener("change", e=>{
    changeCountry ()
});

cities.addEventListener("change", e=>{
    changeCity ()
});

kaydetButton.addEventListener("click", e=>{
    
    ulke.innerText = countries.options[countries.selectedIndex].text;
    sehir.innerText = cities.options[cities.selectedIndex].text;
    ilce.innerText = towns.options[towns.selectedIndex].text;

    getPrayerTime(towns.value);

    $('#locationModal').modal('hide');

})



setInterval(function(){
    nowTime();
},1000);
getCountry();
getPrayerTime(9343);
