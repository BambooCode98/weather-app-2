'use strict';

let main = document.querySelector(".wxContainer");
let cityInput = document.querySelector(".form");
let in1 = document.querySelector(".in1");
let in2 = document.querySelector(".in2");
let body = document.querySelector(".body");
let head = document.querySelector('.header');
let lat, long, city, state, country = "United States";
let getCityf = false;
let getDataf = false;
// let isDay = true;
let called = false;
let wxArray = [];
let elArray  =[];
let cities = [];
let empty = true;
let time = new Date();
let animRunningDay = false;
let animRunningRain = false;
// console.log(time.getDate());

let canvas = document.querySelector('.canvas');
let canvas2 = document.querySelector(".canvas2");
let ctx = canvas.getContext('2d'),
ctx2 = canvas2.getContext('2d'),
width = canvas.width = window.innerWidth,
height = canvas.height = window.innerHeight;
ctx2.width = width;
ctx2.height = height;


defCities();


window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
})

let stars = [];
let rayArray = [];
let drops = [];

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
    // perhaps i need another check? ---->>> morning problem
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

class Sunray{
  constructor(x,y,w,h,amt,theta,amplitude) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.amt = amt;
    this.theta = theta;
    this.amp = amplitude;
  }

  grad;
  rayChange = 0.1;
  
  gradient() {
    const grad = getGradient(this.x,this.y,this.w,this.h);
    // console.log(x,y,w,h);
    // const gradient = ctx.createLinearGradient(this.x,this.y,this.w,this.h);
    // gradient.addColorStop(0,"#fce570");
    // gradient.addColorStop(0.5,"#fce570");
    // gradient.addColorStop(0.75,"#fce570");
    // gradient.addColorStop(0,"red");
    // gradient.addColorStop(0.25,"red");
    // gradient.addColorStop(0.5,"red");
    // gradient.addColorStop(0.75,"white");
    // gradient.addColorStop(1,"blue");
    // gradient.addColorStop(1,"#2eb5e5");
    // return gradient;
    return grad;

  }

  update() {
    ctx.save();
    // ctx.beginPath();
    ctx.translate(width/2,height/2);
    ctx.rotate(this.theta);
    this.rayChange+=this.amt*0.005;
    ctx.fillStyle = this.gradient();
    // ctx.rect(0,0,this.w,this.h+(this.amp*Math.sin(this.rayChange*0.1)));
    // console.log(typeof grad);
    ctx.fillRect(0,0,this.w,this.h+(this.amp*Math.sin(this.rayChange*0.1)));
    // ctx.fill();
    ctx.restore();
    
  }
}

for(let i = 0; i < 100; i++) {
  // rayArray.push(new Sunray(0,0,10,25,5));
  rayArray.push(new Sunray(0,0,(Math.random()*(9-1)+1),(Math.random()*(75-15)+15)*2,Math.random()*(i-i/2)+i/2,Math.PI*2*(Math.random()+2),(Math.random()*(10-5)+5)/2));
}

// console.log(rays);

class Sun{
  constructor(x,y) {
    this.x = x;
    this.y = y;
    // this.rays = rays;
  }


  drawRay() {
    // console.log(rays);
    // ctx.beginPath();
    rayArray.forEach(ray => {
      ray.update();
      // console.log(ray.update());
    })
    // ctx.fill();
    // console.log("draw rays");

  }
  
  update() {
    ctx.beginPath();
    this.x = width/2;
    this.y = height/2;
    ctx.arc(this.x,this.y,50,0,Math.PI*2);
    // ctx.fillRect
    // this.drawRay();
    ctx.fillStyle = "#fce570";
    // ctx.fillStyle = gradient;
    // ctx.fillRect(0,0,50,50);
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ffffff";
    ctx.fill();
    
  }
  
}

class Rain{
  constructor(x,y, radius) {
    this.x = x;
    this.y = y;
    this.rad = radius;
    // this.rays = rays;
  }


  drawDrop() {
    // console.log(rays);
    // ctx.beginPath();
    drops.forEach(drop => {
      drop.update();
      // console.log(ray.update());
    })
    // ctx.fill();
    // console.log("draw rays");

  }
  
  update() {
    ctx.beginPath();
    ctx.fillStyle = "#42bcf5";
    // ctx.shadowBlur = 0;
    // ctx.shadowColor = null;
    this.x -= 0.2;
    this.y += 0.2+this.rad;
    ctx.arc(this.x,this.y,this.rad,0,Math.PI*2);
    ctx.fill();

    if(this.x < 0) this.x = width;
    if(this.x > width) this.x = 0;
    if(this.y < 0) this.y = height;
    if(this.y > height) this.y = 0;
  }
  
}

for(let i = 0; i < 50; i++) {
  stars.push(new Star(width*Math.random(), height * Math.random(), Math.random()*4, Math.random()*2));
}

for(let i = 0; i < 50; i++) {
  drops.push(new Rain(width*Math.random(), height*Math.random(), 5*Math.random()));
}

let sun = new Sun(width/2,height/2);

cityInput.addEventListener("submit", (e) => {
  e.preventDefault();
  empty = false;
  let i1 = in1.value;
  let i2 = in2.value;
  // console.log(i1,i2);

  let firstCityLetter = i1.charAt(0).toUpperCase();
  let firstStateLetter = i2.charAt(0).toUpperCase();
  // console.log(firstCityLetter,firstStateLetter);
  city = i1.replace(i1.charAt(0),firstCityLetter);
  state = i2.replace(i2.charAt(0),firstStateLetter);
  // console.log(city,state);
  if(elArray.length != 0) {
    elArray.forEach(el => {
      // console.log(el);
      el.remove();
    })
    elArray = [];
  }
  cityInput.reset();
  // head.textContent = "BambooWX - " + i1 + ", " + i2;
  // if(width < 500) {
  //   head.style.fontSize = "1.2rem";
  // } else {
  //   head.style.fontSize = "1.5rem";
  // }
  // head.style.fontWeight = "700";
  // head.
  if(city !== null && state !== null) {
    getCityf = true;
    getDataf = true;
    // console.log("getting city data");
    run(city,state,"United States");
  }
})




async function getCity(city,state,country) {
  head.textContent = "BambooWX - " + city + ", " + state;
  if(width < 500) {
    head.style.fontSize = "1.2rem";
  } else {
    head.style.fontSize = "1.5rem";
  }
  head.style.fontWeight = "700";
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
    // console.log(wxArray, "before filling");
    // wxPeriods.forEach(period => {
    //   wxArray.push(period);
    // })
    ctx.clearRect(0,0,width,height);
    wxPeriods.forEach(obj => {
      let box = document.createElement("div");
      // console.log(obj);
      box.classList.add('textBox');
      elArray.push(box);
      let day = document.createElement('h3');
      day.textContent = obj.name;
      let isDaytime = document.createElement('p');
      isDaytime = obj.isDaytime;
      if(obj.number === 1) {
        // console.log(isDaytime, "daytime?");
        // console.log(isDaytime, obj.probabilityOfPrecipitation);
        if(obj.probabilityOfPrecipitation.value == 0 || obj.probabilityOfPrecipitation.value != null) {
          changeStyles(obj.isDaytime, obj.probabilityOfPrecipitation.value);
          } else {
          changeStyles(obj.isDaytime, obj.probabilityOfPrecipitation.value);
        }
      }
      let sWords = document.createElement('p');
      sWords.classList.add('short');
      sWords.textContent = obj.shortForecast;
      let dWords = document.createElement('p');
      dWords = obj.detailedForecast;
      let wxImage = document.createElement('img');
      wxImage.src = `https://api.weather.gov/${obj.icon}`;
      let endl = document.createElement('br');
      let endl2 = document.createElement('br');
      let endl3 = document.createElement('br');
      box.style.marginTop= "5%";
      if(obj.number === 14 && width < 450) {
        box.style.marginBottom= "60%";
      } else if(obj.number === 14 && width > 450) {
        box.style.marginBottom= "40%";
      } else if(obj.number === 14 && width > 750) {
        box.style.marginBottom= "20%";
      }
      box.append(endl3,day,wxImage,endl,sWords,endl2,dWords);
      main.append(box);
    })
    // console.log(wxArray, "after filling");

    // wxArray = [];
    // called = false;
    
  } catch {
    // called = false;
    console.log("Could not get data");
  }
}


function run(city,state,country) {
  if(getDataf && !called) {
    // called = true;
    getCity(city,state,country);
    // console.log("from bottom if");
  }
}
         


function changeStyles(isDay, precipValue) {
  if(isDay && precipValue == 0 || isDay && precipValue == null) {

    body.style.color = "black";
    body.backgroundColor = "#2EB5E5";
    cityInput.style.backgroundImage = "linear-gradient(#2EB5E5ad,#ffffff,#ffffff)";
    head.style.backgroundImage = "linear-gradient(#ffffff,#ffffff,#2EB5E5ad)";

    // ctx.shadowBlur = 15;
    // ctx.shadowColor = "#ffffff";
    // ctx.fillStyle = "#2eb5e5";
    // ctx.fillRect(0,0,width,height);
    ctx.clearRect(0,0,width,height);
    ctx.globalAlpha = 1.0;
    // console.log("animate day");
    if(animRunningDay) return;
    animRunningDay = true;
    animRunningRain = false;
    animateDay();
  } else if(isDay && precipValue > 0){

    body.style.color = "white";
    cityInput.style.backgroundImage = "linear-gradient(#2EB5E5ad,#2c5ea8,#2c5ea8)";
    head.style.backgroundImage = "linear-gradient(#2c5ea8,#2c5ea8,#2EB5E5ad)";
    
    // ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0,0,width,height);
    // ctx.fillStyle = "#ffffff";
    // ctx.fillRect(0,0,width,height);
    // ctx.fillStyle = "#rgb(44, 94, 168)";
    // ctx.fillRect(0,0,width,height);
    // console.log("animate rain");
    ctx.clearRect(0,0,width,height);
    
    // ctx.shadowBlur = 0;
    // ctx.shadowColor = "";
    if(animRunningRain) return;
    animRunningRain = true;
    animRunningDay = false;
    animateRain();
  }  else if(!isDay && precipValue > 0){

    body.style.color = "white";
    cityInput.style.backgroundImage = "linear-gradient(#2EB5E5ad,#2c5ea8,#2c5ea8)";
    head.style.backgroundImage = "linear-gradient(#2c5ea8,#2c5ea8,#2EB5E5ad)";

    // ctx.fillStyle = "#0c1445";
    // ctx.fillRect(0,0,width,height);
    ctx.clearRect(0,0,width,height);
    animateRainNight();
  } else if(!isDay) {

    body.style.color = "white";
    cityInput.style.backgroundImage = "linear-gradient(#0c1445ad,#000000,#000000)";
    head.style.backgroundImage = "linear-gradient(#000000,#000000,#0c1445ad)";

    ctx.fillStyle = "#0c1445";
    ctx.fillRect(0,0,width,height);
    // ctx.clearRect(0,0,width,height);
    animateNight();
  }
}


function animateNight() {
  ctx.fillStyle = "#0c1445";
  ctx.fillRect(0,0,width,height);
  // console.log(Date.now());
  
  stars.forEach(star => {
    star.update();
    
  })
  requestAnimationFrame(animateNight);
}

function animateDay() {
  if(animRunningRain) return;
  ctx.fillStyle = "#2eb5e5";
  ctx.fillRect(0,0,width,height);

  
  ctx.beginPath();
  // let grad = getGradient()
  rayArray.forEach(ray => {
    ctx.shadowBlur = 0;
    ray.update();
    // ctx.fillStyle = ray.gradient();
    // ctx.fillRect(ray.x,ray.y,ray.w,ray.h)
    // console.log("update?");
  })
  ctx.fill();
  sun.update();
  animRunningDay = true;
  requestAnimationFrame(animateDay);

}

// console.log(drops);
function animateRain() {
  // ctx.clearRect(0,0,width,height);
  // ctx.shadow
  ctx.shadowBlur = 0;
  ctx.shadowColor = "";
  // ctx.globalAlpha = 0.1;
  ctx.fillStyle = "rgba(44, 94, 168, 0.1)";
  // ctx.fillStyle = "rgb(44, 94, 168)";
  ctx.fillRect(0,0,width, height);
  
  // ctx.beginPath();
  ctx.beginPath();

  drops.forEach(drop => {
    drop.x -= 0.1;
    drop.y += 0.1;
    // ctx.fillStyle = "#42bcf5";
    // ctx.arc(500,500,100,0,Math.PI*2);
    drop.update();
  })
    // ctx.arc(500, 500, 100, 0, Math.PI*2);
  ctx.fill();

  // animRunningRain = true;

  requestAnimationFrame(animateRain);

}

function animateRainNight() {
  // ctx.restore();
  
  ctx.fillStyle = "rgba(44, 94, 168, 0.1)";
  ctx.fillRect(0,0,width, height);
  
  // ctx.beginPath();

  ctx.beginPath();

  drops.forEach(drop => {
    drop.x -= 0.1;
    drop.y += 0.1;
    // ctx.fillStyle = "#42bcf5";
    // ctx.arc(500,500,100,0,Math.PI*2);
    drop.update();
  })
    // ctx.arc(500, 500, 100, 0, Math.PI*2);
  ctx.fill();

  // ctx.fill();

  requestAnimationFrame(animateRain);

}


function collapseMenu() {
  cityInput.style.transition = "";
  cityInput.style.height = "0";
}


function getGradient(x,y,w,h) {
  const gradient = ctx.createLinearGradient(x,y,w,h);
  // console.log(time.getDay());
  if(time.getDate() === 4 && time.getMonth()+1 === 7) {
    gradient.addColorStop(0,"red");
    gradient.addColorStop(0.25,"red");
    gradient.addColorStop(0.5,"red");
    gradient.addColorStop(0.75,"white");
    gradient.addColorStop(1,"blue");
  } else if (time.getDate() === 24 && time.getMonth()+1 === 12) {
    gradient.addColorStop(0,"red");
    gradient.addColorStop(0.25,"red");
    gradient.addColorStop(0.5,"red");
    gradient.addColorStop(0.75,"green");
    // gradient.addColorStop(1,"green");
    // gradient.addColorStop(1,"#2eb5e5");

  } else {
    gradient.addColorStop(0,"#fce570");
    gradient.addColorStop(0.5,"#fce570");
    // gradient.addColorStop(0.75,"#fce570");
    gradient.addColorStop(1,"#2eb5e5");

  }
  // 
  // console.log('created grad');
  //4th of july
  // gradient.addColorStop(0,"red");
  // gradient.addColorStop(0.25,"red");
  // gradient.addColorStop(0.5,"red");
  // gradient.addColorStop(0.75,"white");
  // gradient.addColorStop(1,"blue");
  //4th ends
  return gradient;
}


function defCities() {
  let city1 = {
    num: 1,
    city: "Chicago",
    state: "Illinois"
  }
  let city2 = {
    num: 2,
    city: "Los Angeles",
    state: "California"
  }
  let city3 = {
    num: 3,
    city: "New York City",
    state: "New York"
  }
  cities.push(city1,city2,city3);

  let num = Math.random()*3;
  let defaultCity = cities[Math.floor(num)].city;
  let defaultState = cities[Math.floor(num)].state;

  if(empty){
    getCity(defaultCity,defaultState);
  }
}


// function getHolidayColors() {
//   if(time.getDay() === 23 && time.getMonth()+1 === 6) {

//   }
// }