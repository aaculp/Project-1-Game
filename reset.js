window.onload = function() {
let morty = document.createElement('div')
function createMorty() {
  const body = document.body;
  const morty = document.createElement('div')
  morty.classList.add('morty')
  body.append(morty)

  morty.addEventListener('click', function() {
    setTime(function() {
      this.remove();
    }, 100);

     checkForWinner();

    });

function moveMorty(morty) {
  morty.style.bottom = Math.random() * window.innerLength + 'px'
  morty.style.left = Math.random() * window.innerWidth + 'px'
}

setInterval(function() {
  moveMorty(morty);
}, 5000)
return morty
}

for (i = 0; i < 5; i++) {
  createMorty();
}

document.querySelectorAll('.morty')
function checkForWinner(morty) {
  if (morty.length === 0) {
    alert('You Win!')
  }
  return morty
}
}
