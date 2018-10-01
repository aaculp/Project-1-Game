  let morty = document.createElement('div')
  const body = document.body
  morty.classList.add('morty')
  body.append(morty)

function createMorty() {
  let morty = document.createElement('div')
  morty.classList.add('morty')
  body.append(morty)
  // randomly moves morty
  function moveMorty(morty) {
    morty.style.bottom = Math.random() * window.innerLength + 'px'
    morty.style.left = Math.random() * window.innerWidth + 'px'
  }
  // how long it takes morty to move up
  setInterval(function() {
    moveMorty(morty)
  }, 5000)
}

  for(i = 0; i < 5; i++) {
  createMorty()
}

// let mortyCreate = setInterval(createMorty(), 5000)
// function stopMorty() {
//   clearInterval(mortyCreate)
// }


// function newMorty() {
//   var morty = document.querySelectorAll('.morty');
//   var count = 0;
//   var mortyCreate = setInterval(createMorty, 5000);
//   function stopMorty() {
//     if (count == 5) {
//       clearInterval(mortyCreate);
//     } else {
//       count++;
//     }
//   }
// }

// let numberMorty = document.querySelectorAll('.morty')
// let mortyCreate = setInterval(function(){
//   for(i = 0; i < 5; i++) {
//     // createMorty()
//     if (numberMorty.length >= 5) {
//       // createMorty()
//       console.log('This worked!')
//     } else {
//       clearInterval(mortyCreate)
//       console.log('This isnt working')
//     }
//   }
// })

document.addEventListener('keydown', moveRick)
document.addEventListener('keyup', shootRocket)
let rickMove = 600;

function shootRocket(event) {
  let rocket = document.querySelector('#rocket')
  event.preventDefault()
  if (event.keyCode == 32) {
    rocket.style.top = 635 + 'px'
    console.log('space')
  }
}

function moveRick(event) {
  let rick = document.querySelector('#rick')
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
  }
}

function firstCollision(rocket, morty) {
 let rocketTop = window.getComputedStyle(rocket, null).getPropertyValue("top");
 let rocketLeft = window.getComputedStyle(rocket, null).getPropertyValue("left");
 let rocketHeight = window.getComputedStyle(rocket, null).getPropertyValue("height");
 let rocketWidth = window.getComputedStyle(rocket, null).getPropertyValue("width");
 let rocketBottom = window.getComputedStyle(rocket, null).getPropertyValue("bottom");
 rocketTop = parseInt(rocketTop.split('px')[0])
 rocketLeft = parseInt(rocketLeft.split('px')[0])
 rocketHeight = parseInt(rocketHeight.split('px')[0])
 rocketWidth = parseInt(rocketWidth.split('px')[0])
 rocketBottom = parseInt(rocketBottom.split('px')[0])

 let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
 let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
 let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");
 let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
 let mortyBottom = window.getComputedStyle(morty, null).getPropertyValue("bottom");
 mortyTop = parseInt(mortyTop.split('px')[0])
 mortyLeft = parseInt(mortyLeft.split('px')[0])
 mortyHeight = parseInt(mortyHeight.split('px')[0])
 mortyWidth = parseInt(mortyWidth.split('px')[0])
 mortyBottom = parseInt(mortyBottom.split('px')[0])

  if (mortyTop < rocketTop + rocketHeight && mortyTop + mortyHeight > rocketTop &&
    mortyLeft < rocketLeft + rocketWidth && mortyLeft + mortyWidth > rocketLeft) {
  setInterval(function(){
    morty.remove()
  },100)
  rocket.style.top = 10 + 'px'
  rocket.style.transition = 'none'
  setTimeout(function(){
  rocket.style.transition = 'top 1s linear'
  },0)
  }
}

function secondCollision(rocket, body) {
 let rocketTop = window.getComputedStyle(rocket, null).getPropertyValue("top");
 let rocketLeft = window.getComputedStyle(rocket, null).getPropertyValue("left");
 let rocketHeight = window.getComputedStyle(rocket, null).getPropertyValue("height");
 let rocketWidth = window.getComputedStyle(rocket, null).getPropertyValue("width");
 let rocketBottom = window.getComputedStyle(rocket, null).getPropertyValue("bottom");
 rocketTop = parseInt(rocketTop.split('px')[0])
 rocketLeft = parseInt(rocketLeft.split('px')[0])
 rocketHeight = parseInt(rocketHeight.split('px')[0])
 rocketWidth = parseInt(rocketWidth.split('px')[0])
 rocketBottom = parseInt(rocketBottom.split('px')[0])

 let bodyHeight = window.getComputedStyle(body, null).getPropertyValue("height");
 let bodyWidth = window.getComputedStyle(body, null).getPropertyValue("width");
 bodyHeight = parseInt(bodyHeight.split('px')[0]) //679
 bodyWidth = parseInt(bodyWidth.split('px')[0]) //820

  if (bodyHeight < rocketTop + rocketHeight) {
    rocket.style.top = 10 + 'px'
    rocket.style.transition = 'none'
    setTimeout(function(){
    rocket.style.transition = 'top 1s linear'
    },0)
  }
}

function thirdCollision(rick, morty) {
 let rickTop = window.getComputedStyle(rick, null).getPropertyValue("top");
 let rickLeft = window.getComputedStyle(rick, null).getPropertyValue("left");
 let rickHeight = window.getComputedStyle(rick, null).getPropertyValue("height");
 let rickWidth = window.getComputedStyle(rick, null).getPropertyValue("width");
 let rickBottom = window.getComputedStyle(rick, null).getPropertyValue("bottom");
 rickTop = parseInt(rickTop.split('px')[0])
 rickLeft = parseInt(rickLeft.split('px')[0])
 rickHeight = parseInt(rickHeight.split('px')[0])
 rickWidth = parseInt(rickWidth.split('px')[0])
 rickBottom = parseInt(rickBottom.split('px')[0])

 let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
 let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
 let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");
 let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
 let mortyBottom = window.getComputedStyle(morty, null).getPropertyValue("bottom");
 mortyTop = parseInt(mortyTop.split('px')[0])
 mortyLeft = parseInt(mortyLeft.split('px')[0])
 mortyHeight = parseInt(mortyHeight.split('px')[0])
 mortyWidth = parseInt(mortyWidth.split('px')[0])
 mortyBottom = parseInt(mortyBottom.split('px')[0])

 if (rickBottom < mortyBottom + mortyHeight && rickBottom + rickHeight > mortyBottom &&
    rickLeft <= mortyLeft + mortyWidth && rickLeft + rickWidth >= mortyLeft) {
  alert('You Lose!')
  }
}

function fourthCollision(body, morty) {
 let bodyHeight = window.getComputedStyle(body, null).getPropertyValue("height");
 let bodyWidth = window.getComputedStyle(body, null).getPropertyValue("width");
 bodyHeight = parseInt(bodyHeight.split('px')[0]) //679
 bodyWidth = parseInt(bodyWidth.split('px')[0]) //820

 let mortyTop = window.getComputedStyle(morty, null).getPropertyValue("top");
 let mortyLeft = window.getComputedStyle(morty, null).getPropertyValue("left");
 let mortyHeight = window.getComputedStyle(morty, null).getPropertyValue("height");
 let mortyWidth = window.getComputedStyle(morty, null).getPropertyValue("width");
 let mortyBottom = window.getComputedStyle(morty, null).getPropertyValue("bottom");
 mortyTop = parseInt(mortyTop.split('px')[0])
 mortyLeft = parseInt(mortyLeft.split('px')[0])
 mortyHeight = parseInt(mortyHeight.split('px')[0])
 mortyWidth = parseInt(mortyWidth.split('px')[0])
 mortyBottom = parseInt(mortyBottom.split('px')[0])

 if (bodyHeight < mortyBottom + mortyHeight) {
  alert('You Lose!')
  }
}

  function allcollapsed () {
    let rocket = document.querySelector('#rocket')
    let morty = document.querySelectorAll('.morty')
    for (i = 0; i < 5; i++) {
    firstCollision(rocket, morty[i]);
    }
  }

    setInterval(function(){
    secondCollision(rocket, body)
    thirdCollision(rick, morty)
    fourthCollision(body, morty)
    firstCollision(rocket, morty)
    allcollapsed()
  }, 100)
