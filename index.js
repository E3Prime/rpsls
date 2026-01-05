initialize();

/** @param {number} ms */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function initialize() {
  const gameBoard = /** @type {HTMLElement} */ (document.getElementById('gameBoard'));
  const gameDecision = /** @type {HTMLElement} */ (document.getElementById('gameDecision'));
  const gameVerdict = /** @type {HTMLElement} */ (document.getElementById('gameVerdict'));
  const playAgainBtn = /** @type {HTMLButtonElement} */ (document.getElementById('playAgain'));
  const rulesBtn = /** @type {HTMLButtonElement} */ (document.getElementById('rules'));
  const infoRules = /** @type {HTMLElement} */ (document.getElementById('infoRules'));
  const closeRulesBtn = /** @type {HTMLButtonElement} */ (document.getElementById('closeRules'));
  const scoreElem = /** @type {HTMLElement} */ (document.getElementById('score'));
  let score = 0;

  const rpsOutcomes = new Map([
    [
      'rock',
      new Map([
        ['scissors', 'win'],
        ['paper', 'lose'],
        ['rock', 'tie'],
      ]),
    ],
    [
      'paper',
      new Map([
        ['rock', 'win'],
        ['scissors', 'lose'],
        ['paper', 'tie'],
      ]),
    ],
    [
      'scissors',
      new Map([
        ['paper', 'win'],
        ['rock', 'lose'],
        ['scissors', 'tie'],
      ]),
    ],
  ]);

  /** @param {Event} e */
  const performAction = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const playerChoice = target.id;
    const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    hideGameBoardAndRevealGameDecision();
    revealHands(playerChoice, computerChoice);
  };

  /**
   * @param {string} playerChoice
   * @param {string} computerChoice
   */
  const revealHands = async (playerChoice, computerChoice) => {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const [playerHand, computerHand] = gameDecision.querySelectorAll('.pick-container > :first-child');
    const playerHandImg = /** @type {HTMLImageElement} */ (playerHand.firstElementChild);
    const computerHandImg = /** @type {HTMLImageElement} */ (computerHand.firstElementChild);
    const targetClassNames = ['btn-paper', 'btn-scissors', 'btn-rock'];
    playerHand.classList.remove(...targetClassNames);
    computerHand.classList.remove(...targetClassNames);
    playerHand.classList.add('btn-' + playerChoice);
    computerHand.classList.add('btn-' + computerChoice);
    playerHandImg.src = `images/icon-${playerChoice}.svg`;
    computerHandImg.src = `images/icon-${computerChoice}.svg`;
    await sleep(1300);
    playerHand.style.opacity = '1';
    await sleep(1300);
    computerHand.style.opacity = '1';
    await sleep(1300);
    verdict(playerChoice, computerChoice, playerHand, computerHand);
  };

  /**
   * @param {string} playerChoice
   * @param {string} computerChoice
   * @param {HTMLButtonElement} playerHand
   * @param {HTMLButtonElement} computerHand
   */
  const verdict = (playerChoice, computerChoice, playerHand, computerHand) => {
    const result = rpsOutcomes.get(playerChoice)?.get(computerChoice);
    const winner = /** @type {HTMLElement} */ (gameVerdict.firstElementChild);

    if (result === 'win') {
      winner.textContent = 'YOU WIN!';
      playerHand.classList.add('winner');
      ++score;
      scoreElem.textContent = score.toString();
    } else if (result === 'lose') {
      winner.textContent = 'YOU LOSE';
      computerHand.classList.add('winner');
    } else {
      winner.textContent = 'DRAW!';
    }
    gameVerdict.style.visibility = 'visible';
  };

  const hideGameBoardAndRevealGameDecision = async () => {
    gameBoard.classList.add('fade-out');
    await sleep(1000);
    gameBoard.style.display = 'none';
    gameDecision.style.display = 'flex';
    gameDecision.classList.add('fade-in');
    await sleep(1000);
  };

  const hideGameDecisionAndRevealGameBoard = async () => {
    /** @type {NodeListOf<HTMLButtonElement>} */
    const [playerHand, computerHand] = gameDecision.querySelectorAll('.pick-container > :first-child');
    playerHand.classList.remove('winner');
    computerHand.classList.remove('winner');
    gameDecision.classList.remove('fade-in');
    gameDecision.classList.add('fade-out');
    playerHand.style.opacity = '0';
    computerHand.style.opacity = '0';
    gameVerdict.style.visibility = 'hidden';
    await sleep(1000);
    gameDecision.style.display = 'none';
    gameDecision.classList.remove('fade-out');
    await sleep(1000);
    gameBoard.classList.remove('fade-out');
    gameBoard.classList.add('fade-in');
    gameBoard.style.display = 'flex';
  };

  gameBoard.addEventListener('click', performAction);
  playAgainBtn.addEventListener('click', hideGameDecisionAndRevealGameBoard);
  rulesBtn.addEventListener('click', () => infoRules.classList.add('reveal-rules'));
  closeRulesBtn.addEventListener('click', () => infoRules.classList.remove('reveal-rules'));
}
