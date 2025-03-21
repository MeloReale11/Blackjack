const playerEl = document.querySelector('.player-cards');
const dealerEl = document.querySelector('.dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const resetBtn = document.getElementById('reset');
const messageEl = document.getElementById('message');
const balanceEl = document.getElementById('balance');
const betEl = document.getElementById('bet');

let playerCards = [], dealerCards = [];
let playerTotal = 0, dealerTotal = 0;
let balance = 1000;
let bet = 100;

const cards = [
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '4', value: 4 },
  { name: '5', value: 5 },
  { name: '6', value: 6 },
  { name: '7', value: 7 },
  { name: '8', value: 8 },
  { name: '9', value: 9 },
  { name: '10', value: 10 },
  { name: 'J', value: 10 },
  { name: 'Q', value: 10 },
  { name: 'K', value: 10 },
  { name: 'A', value: 11 }
];

function getRandomCard() {
  return cards[Math.floor(Math.random() * cards.length)];
}

function calculateTotal(cards) {
  let total = 0, aces = 0;
  cards.forEach(card => {
    total += card.value;
    if (card.name === 'A') aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

function renderCards(cards, element) {
  element.innerHTML = '';
  cards.forEach(card => {
    const img = document.createElement('img');
    img.src = `images/${card.name}.png`;
    img.alt = card.name;
    element.appendChild(img);
  });
}

function updateScores() {
  playerTotal = calculateTotal(playerCards);
  dealerTotal = calculateTotal(dealerCards);
  playerScoreEl.textContent = playerTotal;
  dealerScoreEl.textContent = dealerTotal;
}

function disableControls(state = true) {
  hitBtn.disabled = state;
  standBtn.disabled = state;
}

function showMessage(msg) {
  messageEl.textContent = msg;
}

function resolveGame(result) {
  if (result === 'win') {
    balance += bet;
    showMessage(`Hai vinto $${bet}!`);
  } else if (result === 'lose') {
    balance -= bet;
    showMessage(`Hai perso $${bet}.`);
  } else {
    showMessage("Pareggio.");
  }

  balanceEl.textContent = balance;

  if (balance <= 0) {
    showMessage("Non hai più soldi!");
    disableControls(true);
  } else {
    disableControls();
  }
}

function startGame() {
  bet = parseInt(betEl.value) || 0;
  if (bet > balance || bet <= 0) {
    showMessage("Inserisci un numero valido!");
    disableControls(true);
    return;
  }

  playerCards = [getRandomCard(), getRandomCard()];
  dealerCards = [getRandomCard()];
  updateScores();
  renderCards(playerCards, playerEl);
  renderCards(dealerCards, dealerEl);
  disableControls(false);
  showMessage('');
}

hitBtn.addEventListener('click', () => {
  playerCards.push(getRandomCard());
  updateScores();
  renderCards(playerCards, playerEl);
  if (playerTotal > 21) {
    resolveGame('lose');
  }
});

standBtn.addEventListener('click', () => {
  while (dealerTotal < 17) {
    dealerCards.push(getRandomCard());
    updateScores();
    renderCards(dealerCards, dealerEl);
  }

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    resolveGame('win');
  } else if (playerTotal < dealerTotal) {
    resolveGame('lose');
  } else {
    resolveGame('tie');
  }
});

resetBtn.addEventListener('click', startGame);

startGame();
