initialize();

function initialize() {
  const gameBoard = /** @type {HTMLElement} */ (document.getElementById('gameBoard'));
  const rulesBtn = /** @type {HTMLButtonElement} */ (document.getElementById('rules'));
  let playerChoice,
    computerChoice = '';

  /** @param {Event} e */
  const performAction = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    playerChoice = target.id;
    console.log(playerChoice);
  };
  const viewRules = () => {
    console.log('Viewing Rules');
  };

  gameBoard.addEventListener('click', performAction);
  rulesBtn.addEventListener('click', viewRules);
}
