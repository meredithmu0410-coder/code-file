const symbols = ["🍎","🍌","🍇","🍓","🥝","🍒","🥭","🍑"];
const boardEl = document.getElementById("gameBoard");
const stepEl = document.getElementById("stepCount");
const matchEl = document.getElementById("matchCount");
const timeEl = document.getElementById("timeCount");
const winModal = document.getElementById("winModal");
const finalStepEl = document.getElementById("finalStep");
const finalTimeEl = document.getElementById("finalTime");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const diffBtns = document.querySelectorAll(".diff-btn");

let config = {rows:4, cols:4};
let cardList = [];
let openedCards = [];
let isLock = false;
let step = 0;
let matched = 0;
let totalPairs = 0;
let timer = null;
let seconds = 0;

diffBtns.forEach(btn=>{
  btn.onclick = ()=>{
    diffBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const size = btn.dataset.size;
    config.rows = size === "4x2" ? 4 :4;
    config.cols = size === "4x2" ?2 :4;
    startGame();
  }
})

restartBtn.onclick = startGame;
playAgainBtn.onclick = ()=>{
  winModal.style.display = "none";
  startGame();
}

function startGame(){
  clearInterval(timer);
  seconds = 0;
  step = 0;
  matched = 0;
  openedCards = [];
  isLock = false;
  stepEl.textContent = step;
  matchEl.textContent = matched;
  timeEl.textContent = seconds;
  winModal.style.display = "none";

  totalPairs = (config.rows * config.cols)/2;
  const useSymbols = symbols.slice(0, totalPairs);
  cardList = [...useSymbols, ...useSymbols];
  shuffle(cardList);

  boardEl.style.gridTemplateColumns = `repeat(${config.cols}, 80px)`;
  boardEl.innerHTML = "";

  cardList.forEach((sym)=>{
    const cardWrap = document.createElement("div");
    cardWrap.className = "card";
    cardWrap.dataset.symbol = sym;

    const back = document.createElement("div");
    back.className = "card-back";
    back.innerText = "?";
    const front = document.createElement("div");
    front.className = "card-front";
    front.innerText = sym;

    cardWrap.appendChild(back);
    cardWrap.appendChild(front);
    cardWrap.onclick = ()=>cardClick(cardWrap);
    boardEl.appendChild(cardWrap);
  })

  timer = setInterval(()=>{
    seconds++;
    timeEl.textContent = seconds;
  },1000);
}

function shuffle(arr){
  for(let i = arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
}

function cardClick(card){
  if(isLock) return;
  if(card.classList.contains("flip")) return;
  if(card.classList.contains("matched")) return;

  card.classList.add("flip");
  openedCards.push(card);

  if(openedCards.length === 2){
    step++;
    stepEl.textContent = step;
    checkMatch();
  }
}

function checkMatch(){
  isLock = true;
  const c1 = openedCards[0];
  const c2 = openedCards[1];

  if(c1.dataset.symbol === c2.dataset.symbol){
    c1.classList.add("matched");
    c2.classList.add("matched");
    matched++;
    matchEl.textContent = matched;
    openedCards = [];
    isLock = false;

    if(matched === totalPairs){
      clearInterval(timer);
      setTimeout(()=>{
        finalStepEl.textContent = step;
        finalTimeEl.textContent = seconds;
        winModal.style.display = "flex";
      },400)
    }
  }else{
    c1.classList.add("wrong");
    c2.classList.add("wrong");
    setTimeout(()=>{
      c1.classList.remove("flip","wrong");
      c2.classList.remove("flip","wrong");
      openedCards = [];
      isLock = false;
    },900)
  }
}

startGame();
