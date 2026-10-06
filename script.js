const selectBox = document.querySelector(".select-box");
const playBoard = document.querySelector(".play-board");
const resultBox = document.querySelector(".result-box");

const playerXButton = document.querySelector(".playerX");
const playerOButton = document.querySelector(".playerO");
const replayButton = document.querySelector(".btn button");

const players = document.querySelector(".players");
const boxes = document.querySelectorAll(".play-area span");
const wonText = document.querySelector(".won-text");

let playerSign = "X";
let computerSign = "O";
let gameOver = false;
let computerTurn = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

playerXButton.addEventListener("click", function() {
    startGame("X");
});

playerOButton.addEventListener("click", function() {
    startGame("O");
});

function startGame(sign) {

    playerSign = sign;

    if (sign === "X") {
        computerSign = "O";
    } else {
        computerSign = "X";
    }

    gameOver = false;
    computerTurn = false;

    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    resultBox.classList.remove("show");

    boxes.forEach(function(box) {
        box.textContent = "";
        box.style.pointerEvents = "auto";
    });

    players.classList.remove("active");

    if (playerSign === "O") {
        players.classList.add("active");

        setTimeout(function() {
            computerMove();
        }, 500);
    }
}

boxes.forEach(function(box, index) {

    box.addEventListener("click", function() {

        if (gameOver || computerTurn || box.textContent !== "") {
            return;
        }

        makeMove(index, playerSign);

        if (checkWinner(playerSign)) {
            endGame(playerSign);
            return;
        }

        if (isDraw()) {
            endGame("draw");
            return;
        }

        players.classList.add("active");

        setTimeout(function() {
            computerMove();
        }, 500);
    });
});

function makeMove(index, sign) {

    boxes[index].textContent = sign;
    boxes[index].style.pointerEvents = "none";
}

function computerMove() {

    if (gameOver) {
        return;
    }

    computerTurn = true;

    let move = getBestMove();

    if (move !== null) {
        makeMove(move, computerSign);
    }

    if (checkWinner(computerSign)) {
        endGame(computerSign);
        return;
    }

    if (isDraw()) {
        endGame("draw");
        return;
    }

    computerTurn = false;

    players.classList.remove("active");
}

function getBestMove() {

    let emptyBoxes = [];

    boxes.forEach(function(box, index) {

        if (box.textContent === "") {
            emptyBoxes.push(index);
        }
    });

    if (emptyBoxes.length === 0) {
        return null;
    }

    let winningMove = findWinningMove(computerSign);

    if (winningMove !== null) {
        return winningMove;
    }

    let blockingMove = findWinningMove(playerSign);

    if (blockingMove !== null) {
        return blockingMove;
    }

    if (boxes[4].textContent === "") {
        return 4;
    }

    let corners = [0, 2, 6, 8].filter(function(index) {
        return boxes[index].textContent === "";
    });

    if (corners.length > 0) {

        return corners[
            Math.floor(Math.random() * corners.length)
        ];
    }

    return emptyBoxes[
        Math.floor(Math.random() * emptyBoxes.length)
    ];
}

function findWinningMove(sign) {

    for (let combination of winningCombinations) {

        let values = combination.map(function(index) {
            return boxes[index].textContent;
        });

        let signCount = values.filter(function(value) {
            return value === sign;
        }).length;

        let emptyIndex = values.indexOf("");

        if (signCount === 2 && emptyIndex !== -1) {
            return combination[emptyIndex];
        }
    }

    return null;
}

function checkWinner(sign) {

    return winningCombinations.some(function(combination) {

        return combination.every(function(index) {

            return boxes[index].textContent === sign;
        });
    });
}

function isDraw() {

    return [...boxes].every(function(box) {
        return box.textContent !== "";
    });
}

function endGame(winner) {

    gameOver = true;
    computerTurn = false;

    boxes.forEach(function(box) {
        box.style.pointerEvents = "none";
    });

    if (winner === "draw") {

        wonText.innerHTML = "Match has been <p>Draw!</p>";

    } else if (winner === playerSign) {

        wonText.innerHTML = "You <p>Won!</p>";

    } else {

        wonText.innerHTML = "Computer <p>Won!</p>";
    }

    resultBox.classList.add("show");
}

replayButton.addEventListener("click", function() {

    selectBox.classList.remove("hide");
    playBoard.classList.remove("show");
    resultBox.classList.remove("show");

    gameOver = false;
    computerTurn = false;

    boxes.forEach(function(box) {
        box.textContent = "";
        box.style.pointerEvents = "auto";
    });

    players.classList.remove("active");
});