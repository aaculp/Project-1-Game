// function creaty morty div & adding it to body
function createMorty() {
  const body = document.body
  var morty = document.createElement('div')
  morty.classList.add('morty')
  body.append(morty)
  // lets me grab css properties that arent defined
  // ORDER = variable = grabs computed style from div(morty) => property value thats needed
  let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
  let mortyBottom = window.getComputedStyle(morty, null).getPropertyValue("bottom");
  let mortyRight = window.getComputedStyle(morty, null).getPropertyValue("right");
  let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
  let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
  let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");
  //Grab from MORTY CSS
  // randomly moves morty
  function moveMorty(morty) {
    morty.style.bottom = (Math.random() * window.innerLength) + 'px'
    // morty.style.left = (Math.random() * window.innerWidth) + 'px'
  }
  // how long it takes morty to move up
  setInterval(function() {
    moveMorty(morty)
  }, 4000)
}
// creates more morty
for(i = 0; i < 5; i++) {
  createMorty()
}
// ORDER = variable = grabs computed style from div(morty) => property value thats needed
let rocketTop = window.getComputedStyle(rocket, null).getPropertyValue("top");
let rocketBottom = window.getComputedStyle(rocket, null).getPropertyValue("bottom");
let rocketRight = window.getComputedStyle(rocket, null).getPropertyValue("right");
let rocketLeft = window.getComputedStyle(rocket, null).getPropertyValue("left");
let rocketWidth = window.getComputedStyle(rocket, null).getPropertyValue("width");
let rocketHeight = window.getComputedStyle(rocket, null).getPropertyValue("height");
let rocketAnimation = window.getComputedStyle(rocket, null).getPropertyValue('moving')
console.log(rocketAnimation)
// grab from Rocket CSS

document.addEventListener('keypress', shootRocket)
let rocketMove = document.getElementById('rocket')

document.addEventListener('keydown', moveRick)
let rickMove = 600;
// moves rocket animation when you hit space bar
function shootRocket(event) {
  event.preventDefault()
  if (event.keyCode == 32) {
    rocket.style.animation = 'moving 1s linear'
    console.log('space')
  } else if (rocket.style.animation == 618) {
    console.log('hit')
  }
}
// moves rick ATTACHED with rocket LEFT/RIGHT arrows
function moveRick(event) {
  if (event.keyCode == 39) {
    event.preventDefault()
    rickMove += 50;
    rocket.style.left = rickMove + 'px'
    rick.style.left = rickMove + 'px'
    console.log('right')
  } else if (event.keyCode == 37) {
    event.preventDefault()
    rickMove += -50;
    rocket.style.left = rickMove + 'px'
    rick.style.left = rickMove + 'px'
    console.log('left')
  } else if (rickMove == 0 || rickMove == 1200){
    document.removeEventlistener('keydown', moveRick)
  }
}


// function collision() {

// let rocketLeft = window.getComputedStyle(rocket, null).getPropertyValue("left");
// let rocketBottom = window.getComputedStyle(rocket, null).getPropertyValue("bottom");
// let rocketWidth = window.getComputedStyle(rocket, null).getPropertyValue("width");
// let rocketHeight = window.getComputedStyle(rocket, null).getPropertyValue("height");
// let rocketAnimation = window.getComputedStyle(rocket, null).getPropertyValue('animation')

// let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
// let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
// let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
// let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");

// if (rocketAnimation = mortyTop &&
//     rocketAnimation = mortyLeft &&
//     rocketAnimation = mortyRight) {
//   console.log('It worked!')
// } else {
//   console.log('This is not working!')
// }
// }

  // if (rocketLeft < mortyLeft + mortyWidth &&
  //     rocketLeft + rocketWidth > mortyLeft &&
  //     rocketBottom < mortyTop + mortyHeight &&
  //     rocketBottom + rocketHeight > mortyTop) {
  //     console.log('hit!')
  // } else {
  //   console.log('This code isnt working!')
  // }
//   //bottom of rocket = top of morty &&
//   //R/L of morty == R/L of rocket
//   // then console log hit
// function collision() {
//   if(mortyLeft < rocketLeft + rocketWidth &&
//      mortyLeft + mortyWidth > rocketLeft &&
//      mortyTop < rocketTop + rocketHeight &&
//      mortyTop + mortyHeight > rocketTop) {
//     console.log('hit!')
//   } else {
//     console.log('This code isnt working!')
//   }
// }


function playGame() {
  createMorty()
  // moveRick()
  // shootRocket()
  // collision()
}
playGame()



