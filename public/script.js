const objects = [
  { id: "objeto1", imagen: "./img/ballena.jpg" },
  { id: "objeto2", imagen: "./img/loro.jpg" },
  { id: "objeto3", imagen: "./img/sapo.jpg" },
  { id: "objeto4", imagen: "./img/gatito.jpg" },
  { id: "objeto5", imagen: "./img/cebra.jpg" },
  { id: "objeto6", imagen: "./img/lobo.jpg" },
];

let gameState = {
  selectLevel: null,
  gridBoard: null,
  inGame: false,
  blockClick: false,
  pieceInGame: null,
  play: false,  
};

document.addEventListener("DOMContentLoaded", () => {
  setupLevelButtons();
  setupPlayButton();
  setupRestartButton();
});

//SET - UP
const setupLevelButtons = () => {
  const levelButtons = document.querySelectorAll(".level-button");

  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      levelButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      gameState.gridBoard = button.id;
      obtainLevel(button.id);
    });
  });
};

const setupPlayButton = () => {
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", () => {
    if (gameState.selectLevel) {
      gameState.play = true;  
      document.getElementById("overlay").style.display = "none";
      createBoard();  
    } else {
      alert("Por favor, selecciona un nivel antes de jugar.");
    }
  });
};


const obtainLevel = (stringLevel) => {
  const [num1, num2] = stringLevel.split("x").map(Number);
  const mult = num1 * num2;
  const result = mult / 2;
  gameState.selectLevel = result;  
};


const createBoard = () => {
  const shuffledObjects = shuffleArray(objects, gameState.selectLevel );
  console.log(shuffledObjects);
  assignPieces(shuffledObjects);
  const pieces = document.querySelectorAll(".piece");
  assignGridBoard();
  resetBoard(pieces);
  assignImages(pieces, shuffledObjects);
  assignClickEvents(pieces);
};

const assignGridBoard = () => {
  const board = document.getElementsByClassName('board')[0];
  const [num1, num2] = gameState.gridBoard.split("x").map(Number);
  board.style.gridTemplateColumns = `repeat(${num2}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${num1}, 1fr)`;
}


const shuffleArray = (array, levelIndex) => {
  const slicedArray = array.slice(0, levelIndex);
  const shuffledObjects = [...slicedArray, ...slicedArray].sort(
    () => Math.random() - 0.5
  );
  return shuffledObjects;
};

const assignPieces = (shuffledObjects) => {
  const board = document.getElementById("board");
  board.innerHTML = shuffledObjects
    .map(
      (object, index) => `<div id="piece-${index}" class="piece piece-hidden"></div>`
    )
    .join(""); // Le saca la , debido que es un array
};


const assignImages = (pieces, shuffledObjects) => {
  shuffledObjects.forEach((objeto, index) => {
    if (pieces[index]) {
      pieces[index].innerHTML = `<img src='${objeto.imagen}' />`;
      pieces[index].dataset.objetoId = objeto.id;
    }
  });
};

const assignClickEvents = (pieces) => {
  pieces.forEach((piece) => {
    piece.replaceWith(piece.cloneNode(true));
  });

  document.querySelectorAll(".piece").forEach((piece) => {
    piece.addEventListener("click", () => handlePieceClick(piece));
  });
};

//IN GAME
const handlePieceClick = (piece) => {
  if (gameState.blockClick) return;

  if (!gameState.inGame) {
    showPiece(piece);
    gameState.inGame = true;
    gameState.pieceInGame = piece;
  } else {
    showPiece(piece);
    checkMatch(piece);
  }
};

const checkMatch = (piece) => {
  if (
    gameState.pieceInGame &&
    gameState.pieceInGame.dataset.objetoId === piece.dataset.objetoId
  ) {
    piece.dataset.win = "true";
    gameState.pieceInGame.dataset.win = "true";
    verifyWin();
    gameState.blockClick = false;
    gameState.inGame = false;
    gameState.pieceInGame = null;
  } else {
    gameState.blockClick = true;

    setTimeout(() => {
      hidePiece(piece);
      hidePiece(gameState.pieceInGame);
      gameState.blockClick = false;
      gameState.inGame = false;
      gameState.pieceInGame = null;
    }, 1000);
  }
};

const verifyWin = () => {
  const pieces = document.querySelectorAll(".piece");
  const matchedPieces = [...pieces].filter(
    (piece) => piece.dataset.win === "true"
  );

  if (matchedPieces.length === pieces.length) {
    alert("¡Ganaste!");
    document.getElementById("restartButton").style.display = "block";
  }
};

const showPiece = (piece) => {
  piece.classList.remove("piece-hidden");
  piece.classList.add("piece-show");
};

const hidePiece = (piece) => {
  piece?.classList.remove("piece-show");
  piece?.classList.add("piece-hidden");
};


const resetBoard = (pieces) => {
  pieces.forEach((piece) => {
    piece.innerHTML = "";
    piece.dataset.win = "";
    piece.dataset.objetoId = "";
    hidePiece(piece);
  });
};


const setupRestartButton = () => {
  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", restartGame);
};


const restartGame = () => {
  Object.assign(gameState, {
    inGame: false,
    blockClick: false,
    pieceInGame: null,
    play: false,
  });
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("overlay").style.display = "flex";
  setupLevelButtons();  // Vuelve a habilitar la selección de nivel
};
