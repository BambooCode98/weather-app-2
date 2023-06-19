'use strict';

let main = document.querySelector(".wxContainer");
let cityInput = document.querySelector(".form");
let in1 = document.querySelector(".in1");
let in2 = document.querySelector(".in2");
let lat, long, city, state, country = "United States";
let getCityf = false;
let getDataf = false;
// let isDay = true;

let canvas = document.querySelector('.canvas');



let ctx = canvas.getContext('2d'),
width = canvas.width = window.innerWidth,
height = canvas.height = window.innerHeight;

let stars = [];

class Star{
  constructor(x,y,radius, rate) {
    this.x = x;
    this.y = y;
    this.size = radius;
    this.blur = radius;
    this.sparkle = rate;
  }
  inc = 1;

  update() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size,0,Math.PI*2);
    ctx.fillStyle = "white";
    ctx.shadowColor = "white";
    // ctx.shadowBlur = this.blur*2;
    this.strobe();
    ctx.fill();
  }

  strobe() {
    
    // console.log(this.inc);
    this.inc+=0.1*this.sparkle;
    ctx.shadowBlur = this.blur + Math.sin(this.inc)*2;
    // this.inc += 1;
  }
}

for(let i = 0; i < 50; i++) {
  stars.push(new Star(width*Math.random(), height * Math.random(), Math.random()*4, Math.random()*2));
}

cityInput.addEventListener("submit", (e) => {
  e.preventDefault();
  let i1 = in1.value;
  let i2 = in2.value;
  console.log(i1,i2);
  city = i1;
  state = i2;
  if(city !== null && state !== null) {
    getCityf = true;
    getDataf = true;
    console.log("true");

    run()
  }
})




async function getCity() {
  let response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=daa0efcefa043d17b3c66f5e04fe9bd7`, {mode: 'cors'});
  let cityr  = await response.json();
  // console.log(cityr[0]);
  lat = (cityr[0].lat).toFixed(2);
  long = (cityr[0].lon).toFixed(2);

  // console.log(lat,long);

  try {
    let data = await fetch(`https://api.weather.gov/points/${lat},${long}`, {mode: 'cors'});
    let wxData = await data.json();
    let forecast = await fetch(wxData.properties.forecast, {mode: 'cors'});
    let forecastd = await forecast.json();
    let wxPeriods = forecastd.properties.periods;
    // console.log(wxPeriods);

    wxPeriods.forEach(obj => {
      let box = document.createElement("div");
      console.log(obj);
      let day = document.createElement('h3');
      day.textContent = obj.name;
      let isDaytime = document.createElement('p');
      isDaytime = obj.isDaytime;
      if(obj.number === 1) {
        // console.log(isDaytime, "daytime?");
        changeStyles(obj.isDaytime);
      }
      let sWords = document.createElement('p');
      sWords = obj.shortForecast;
      let dWords = document.createElement('p');
      dWords = obj.detailedForecast;
      let wxImage = document.createElement('img');
      wxImage.src = obj.icon;
      let endl = document.createElement('br');
      let endl2 = document.createElement('br');
      let endl3 = document.createElement('br');
      box.append(day,wxImage,endl3,isDaytime,endl,sWords,endl2,dWords);
      main.append(box);
    })
    
  } catch {
    console.log("Could not get data");
  }
}
function run() {
  if(getDataf) {
    getCity();
    // console.log("from bottom if");
  }
}
         


function changeStyles(isDay) {
  if(isDay) {
    canvas.style.backgroundColor = "white";
  } else {
    canvas.style.backgroundColor = "#0c1445";
  }
}


function animate() {
  ctx.fillStyle = "#0c1445";
  ctx.fillRect(0,0,width,height);

  stars.forEach(star => {
    star.update();
    
  })
  requestAnimationFrame(animate);
}

animate();