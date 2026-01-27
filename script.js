/** @param {number} ms | Utility */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// DOM Variables
const gameBoard = /** @type {HTMLElement} */ (document.getElementById('gameBoard'));
const gameDecisionBoard = /** @type {HTMLElement} */ (document.getElementById('gameDecisionBoard'));
const gameHands = /** @type {NodeListOf<HTMLButtonElement>} */ (gameBoard.querySelectorAll('button'));
const gameVerdict = /** @type {HTMLElement} */ (document.getElementById('gameVerdict'));
const replayBtn = /** @type {HTMLButtonElement} */ (gameVerdict.lastElementChild);
const openRulesBtn = /** @type {HTMLButtonElement} */ (document.getElementById('openRules'));
const closeRulesBtn = /** @type {HTMLButtonElement} */ (document.getElementById('closeRules'));
const rules = /** @type {HTMLElement} */ (closeRulesBtn.parentElement);
const scoreElem = /** @type {HTMLElement} */ (document.getElementById('score'));
const [playerHand, computerHand] = /** @type {HTMLButtonElement[]} */ (Array.from(gameDecisionBoard.querySelectorAll('button')));

// Script Variables
const rpsOutcomes = new Map([
  [
    'rock',
    new Map([
      ['scissors', 'win'],
      ['paper', 'lose'],
      ['lizard', 'win'],
      ['spock', 'lose'],
      ['rock', 'tie'],
    ]),
  ],
  [
    'paper',
    new Map([
      ['rock', 'win'],
      ['scissors', 'lose'],
      ['spock', 'win'],
      ['lizard', 'lose'],
      ['paper', 'tie'],
    ]),
  ],
  [
    'scissors',
    new Map([
      ['paper', 'win'],
      ['rock', 'lose'],
      ['lizard', 'win'],
      ['spock', 'lose'],
      ['scissors', 'tie'],
    ]),
  ],
  [
    'lizard',
    new Map([
      ['spock', 'win'],
      ['rock', 'lose'],
      ['paper', 'win'],
      ['scissors', 'lose'],
      ['lizard', 'tie'],
    ]),
  ],
  [
    'spock',
    new Map([
      ['rock', 'win'],
      ['paper', 'lose'],
      ['scissors', 'win'],
      ['lizard', 'lose'],
      ['spock', 'tie'],
    ]),
  ],
]);

const targetClassNames = ['btn-paper', 'btn-scissors', 'btn-rock', 'btn-lizard', 'btn-spock'];
let score = 0;

gameBoard.addEventListener('click', performAction);
replayBtn.addEventListener('click', replay);
openRulesBtn.addEventListener('click', () => rules.classList.add('reveal'));
closeRulesBtn.addEventListener('click', () => rules.classList.remove('reveal'));

/** @param {PointerEvent} e */
async function performAction(e) {
  const target = e.target;
  if (!(target instanceof HTMLButtonElement)) return;
  gameHands.forEach((gh) => (gh.disabled = true));
  const playerChoice = target.id;
  const computerChoice = ['rock', 'paper', 'scissors', 'lizard', 'spock'][Math.floor(Math.random() * 5)];
  await hideBoard(gameBoard);
  await revealBoard(gameDecisionBoard);
  await revealHands(playerChoice, computerChoice);
  determineWinner(playerChoice, computerChoice);
}

/**
 * @param {string} playerChoice
 * @param {string} computerChoice
 */
async function revealHands(playerChoice, computerChoice) {
  const playerHandImg = /** @type {HTMLImageElement} */ (playerHand.firstElementChild);
  playerHand.classList.remove(...targetClassNames);
  computerHand.classList.remove(...targetClassNames);
  playerHand.classList.add('btn-' + playerChoice);
  playerHandImg.src = `assets/images/icon-${playerChoice}.svg`;
  await sleep(3000);
  const computerHandImg = document.createElement('img');
  computerHandImg.src = `assets/images/icon-${computerChoice}.svg`;
  computerHand.appendChild(computerHandImg);
  computerHand.classList.remove('mystery-hand');
  computerHand.classList.add('btn-hand');
  computerHand.classList.add('btn-' + computerChoice);
  await sleep(700);
}

/**
 * @param {string} playerChoice
 * @param {string} computerChoice
 */
const determineWinner = (playerChoice, computerChoice) => {
  const outcome = rpsOutcomes.get(playerChoice)?.get(computerChoice);
  const verdict = /** @type {HTMLElement} */ (gameVerdict.firstElementChild);

  if (outcome === 'win') {
    ++score;
    verdict.textContent = 'YOU WIN!';
    playerHand.classList.add('winner');
    scoreElem.textContent = score.toString();
  } else if (outcome === 'lose') {
    verdict.textContent = 'YOU LOSE!';
    computerHand.classList.add('winner');
  } else {
    verdict.textContent = 'DRAW!';
  }

  gameVerdict.style.visibility = 'visible';
  replayBtn.disabled = false;
};

async function replay() {
  await hideBoard(gameDecisionBoard);
  gameVerdict.style.visibility = 'hidden';
  playerHand.classList.remove(...targetClassNames, 'winner');
  computerHand.classList.remove(...targetClassNames, 'winner', 'btn-hand');
  computerHand.classList.add('mystery-hand');
  computerHand.replaceChildren();
  revealBoard(gameBoard);
  gameHands.forEach((gh) => (gh.disabled = false));
}

/** @param {HTMLElement} board */
async function hideBoard(board) {
  board.classList.remove('fade-in');
  board.classList.add('fade-out');
  await sleep(700);
  board.style.display = 'none';
}

/** @param {HTMLElement} board */
async function revealBoard(board) {
  board.classList.remove('fade-out');
  board.classList.add('fade-in');
  await sleep(700);
  board.id === 'gameBoard' ? (board.style.display = 'block') : (board.style.display = 'flex');
}
