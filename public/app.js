const socket = io();

const gameBoard = document.getElementById("game-board");
const status = document.getElementById("status");

// Generate cards dynamically
let cards = [];
for (let i = 1; i <= 8; i++) {
    cards.push(i, i); // Pair of cards
}
cards = cards.sort(() => Math.random() - 0.5); // Shuffle

cards.forEach((num, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = num;
    card.dataset.index = index;
    gameBoard.appendChild(card);
});

let flippedCards = [];
gameBoard.addEventListener("click", (e) => {
    const card = e.target;
    if (card.classList.contains("card") && !card.classList.contains("flipped")) {
        card.textContent = card.dataset.value;
        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
});

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        status.textContent = "Match Found!";
        socket.emit("match-found", { index1: card1.dataset.index, index2: card2.dataset.index });
    } else {
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "";
            card2.textContent = "";
        }, 1000);
        status.textContent = "No Match!";
    }
    flippedCards = [];
}

socket.on("update-board", ({ index1, index2 }) => {
    document.querySelector(`[data-index='${index1}']`).style.visibility = "hidden";
    document.querySelector(`[data-index='${index2}']`).style.visibility = "hidden";
});
