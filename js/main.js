import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";

import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function hightLightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win positions");
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  const isChecked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  if (isChecked || isEndGame) return;

  // set classList cell
  cell.classList.add(currentTurn);

  // update cell value
  cellValues[index] =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  // Toggle turn
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    // ended
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }

    // X win or O win
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      hightLightWinCells(game.winPositions);
      break;
    }
    default:
    // playing
  }
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}

function resetGame() {
  // Reset temp variables
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");
  // Reset dom elements
  // Reset game status
  updateGameStatus(GAME_STATUS.PLAYING);
  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }

  // reset button replay
  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(() => {
  // bind click event for all li elements
  initCellElementList();

  //   bind click button to replay
  initReplayButton();
})();
