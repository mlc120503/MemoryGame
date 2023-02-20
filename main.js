const cards = document.querySelectorAll(".memory-card");
const timeH = document.querySelector(".time-value");
const playerscore = document.querySelector(".score-value");

timeH.innerHTML = "01:30";
let timeSecond = 90;
let timestartcounting = false;
let hasFlippedCard = 0; //count the filpped card in current round
let matchedCard = 0;
let lockBoard = false;
let firstCard, secondCard, thirdCard;
let score = 0;

function flipCard() {
  if (lockBoard) return; //lock the board until the function is executed
  if (this === firstCard || this === secondCard) return; //avoid double/triple click the same card

  this.classList.add("flip");

  timer();

  if (hasFlippedCard == 0) {
    //first click
    hasFlippedCard += 1;
    firstCard = this;
  } else if (hasFlippedCard == 1) {
    //second click
    hasFlippedCard += 1;
    secondCard = this;
  } else {
    //third click
    hasFlippedCard = 0;
    thirdCard = this;

    matching();
  }
  allMatched();
}

//check the cards wheather is a match
function matching() {
  let isMatch =
    firstCard.dataset.image == secondCard.dataset.image &&
    secondCard.dataset.image == thirdCard.dataset.image;

  //isMatch ? disableCards() : unfilpCards();
  if (isMatch) {
    disableCards();
  } else {
    unfilpCards();
    score > 0 ? (score -= 1) : "";
    playerscore.innerHTML = `${score}`;
  }
}

//disable the click when the current filpped is matched
function disableCards() {
  lockBoard = true;
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  thirdCard.removeEventListener("click", flipCard);
  matchedCard += 3;
  resetBoard();
}

//unfilp the cards when they are not matched
function unfilpCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    thirdCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

//reset the lock and the card state each round
function resetBoard() {
  [hasFlippedCard, lockBoard] = [0, false];
  [firstCard, secondCard, thirdCard] = [null, null, null];
}

//shuffle the card
(function firstshuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 15);
    card.style.order = randomPos;
  });
})();
function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 15);
    card.style.order = randomPos;
  });
}

//after all cards are matched, shuffle again, add 15 point and inform the player
function allMatched() {
  if (matchedCard == document.getElementsByClassName("memory-card").length) {
    matchedCard = 0;

    setTimeout(() => {
      alert("You win the game and score 15 points!!");
      cards.forEach((card) => card.classList.remove("flip"));
      shuffle();
      timeSecond = 90;
    }, 500);
    resetBoard();
    cards.forEach((card) => card.addEventListener("click", flipCard));
    score += 15;
    playerscore.innerHTML = `${score}`;
  }
}

//start counting when player filps
function timer() {
  if (!timestartcounting) {
    const countDown = setInterval(() => {
      timeSecond--;
      displayTime(timeSecond);
      if (timeSecond < 0) {
        endTime();
        clearInterval(countDown);
      }
    }, 1000);
    timestartcounting = true;
  }
}
//display the time
function displayTime(second) {
  const min = Math.floor(second / 60);
  const sec = Math.floor(second % 60);
  timeH.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
}
//reset the timer and imform player when time is 0
function endTime() {
  timeH.innerHTML = "TIME OUT";
  alert("TIME OUT");
  cards.forEach((card) => card.classList.remove("flip"));
  shuffle();
  timestartcounting = false;
  timeSecond = 90;
}

cards.forEach((card) => card.addEventListener("click", flipCard));
