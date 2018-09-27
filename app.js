function createMorty() {
  const body = document.body
  const morty = document.createElement('div')
  morty.classList.add('morty')
  body.append(morty)
  console.log(morty)

  function moveMorty(morty) {
    morty.style.bottom = (Math.random() * window.innerLength) + 'px'
    morty.style.left = (Math.random() * window.innerWidth) + 'px'
  }

  setInterval(function() {
    moveMorty(morty)
  }, 4000)
}

for(i = 0; i < 1; i++) {
  createMorty()
}

document.addEventListener('keydown', shootRocket)
let rocketMove = 600;
function shootRocket(event) {
  if (event.keyCode == 32) {
    event.preventDefault()
    rocket.style.visibility = visible;
    rocket.style.animation = moving;
    console.log('space')
  } else if(rocketMove == rickMove) {
    document.removeEventListener('keydown', shootRocket)
  }
}

document.addEventListener('keydown', moveRick)
let rickMove = 600;

function moveRick(event) {
  if (event.keyCode == 39) {
    rickMove += 40;
    rick.style.left = rickMove + 'px'
    console.log('right')
  } else if(rickMove == 1200) {
    document.removeEventListener('keydown', moveRick)
  } else if (event.keyCode == 37) {
    rickMove += -40;
    rick.style.left = rickMove + 'px'
    console.log('left')
  } else if (rickMove == -5) {
    document.removeEventListener('keydown', moveRick)
  }
}

function playGame() {
  createMorty()
  moveRick()
}
playGame()
