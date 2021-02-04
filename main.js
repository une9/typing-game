const html = document.getElementsByTagName('html')[0];
const wordInput = document.querySelector('.word-input');
const targetWord = document.querySelector('.word-display');
const button = document.querySelector('#button');
const timedisplay = document.querySelector('#time');
const scoredisplay = document.querySelector('#score');
const finalscore = document.querySelector('#finalScore');

const basicTime = 30;

let score = 0;
let time;
let playing = false;
let timer;
let words;

async function loadWords() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=100');
        if (response.status == 200) {
            const raw_words = await response.json();
            const filtered_words = raw_words.filter(word => word.length <= 8);
            return filtered_words;
        } else {
            console.log("error");
        }
    } catch (error) {
        console.log(error);
    }
}

async function wordLoading() {
    button.classList.toggle('loading');
    button.innerText = '로딩중...';
    html.classList.add('loadwords');

    words = await loadWords();

    html.classList.remove('loadwords');
    button.classList.toggle('loading');
    button.innerText = '게임 시작';

    console.log(words);
}

function newWord(){
    targetWord.innerText = words[Math.floor(Math.random() * words.length)];
}

function check() {
    if (wordInput.value === targetWord.innerText) {
        score++;
        scoredisplay.innerText = score;
        wordInput.value = '';
        newWord();
    }
}

function startgame() {
    playing = true;
    time = basicTime;
    timedisplay.innerText = time;
    score = 0;
    scoredisplay.innerText = score;
    timer = setInterval(count, 1000);

    button.innerText = '게임중...'
    button.classList.toggle('loading');
    wordInput.disabled = false;
    wordInput.focus();
    wordInput.innerText = '';
    
    newWord();
    
    finalScore.innerText = '';
    timedisplay.classList.remove('red');
}

function count() {
    time--;
    timedisplay.innerText = time;
    if (time <= 0) {
        clearInterval(timer);
        endgame();
    }
}

function endgame() {
    playing = false;
    button.innerText = '게임 시작';
    button.classList.toggle('loading');
    timedisplay.classList.add('red');
    finalScore.innerText = score + '점';
    wordInput.innerText = '';
    wordInput.disabled = true;
}

function buttonFunc() {
    if (!playing) {
        startgame();
    } 
}

(function init() {
    wordInput.disabled = true;
    wordInput.addEventListener("input", check);
    button.addEventListener('click', buttonFunc);
    wordLoading();
})();
