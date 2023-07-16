import { shuffleElementsOdd } from './shuffleElements';
import { shuffleElementsEven } from './shuffleElements';
import { saveGame, shiftSquare, resetCounter, changeCounter, verificationSolution } from './movingElements';
import move from '../assets/move.mp3';

let currentSize = 4;
let numberOfElements = 16;
let size = 4;
let elements = [];
let arrayOfElements = [];
let sec = 0;
let min = 0;
let timeOfGame;
let moveAudio = new Audio(move);
let sound = true;
moveAudio.volume = 0.7;
let results = [];

const controlButtons = ['Start', 'Pause', 'Sound OFF']
const saveButtons = ['Results', 'Save', 'Saved game'];

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.querySelector('body').append(wrapper);

const wrapperForControlButtons = document.createElement('div');
wrapperForControlButtons.classList.add('wrapper-control-buttons');
for (let i = 0; i < controlButtons.length; i++) {
    let button = document.createElement('button');
    button.classList.add('control-buttons');
    button.textContent = controlButtons[i];
    button.id = controlButtons[i];
    wrapperForControlButtons.append(button);
}
wrapper.append(wrapperForControlButtons);

const timerAndMoves = document.createElement('div');
timerAndMoves.classList.add('timer-wrapper');

const moves = document.createElement('div');
moves.classList.add('timer');
moves.textContent = '0';
timerAndMoves.append(moves);

const timer = document.createElement('div');
timer.classList.add('timer');

const minutes = document.createElement('span');
minutes.textContent = '00';
timer.append(minutes);

const separator = document.createElement('span');
separator.textContent = ':';
timer.append(separator);

const seconds = document.createElement('span');
seconds.textContent = '00';
timer.append(seconds);

timerAndMoves.append(timer);
wrapper.append(timerAndMoves);

const box = document.createElement('div');
box.classList.add('box');
wrapper.append(box);

const messageBack = document.createElement('div');
messageBack.classList.add('message-back');
box.append(messageBack);

const message = document.createElement('p');
message.classList.add('message');
box.append(message);

const wrapperForSaveButtons = document.createElement('div');
wrapperForSaveButtons.classList.add('wrapper-control-buttons');
for (let i = 0; i < saveButtons.length; i++) {
    let button = document.createElement('button');
    button.classList.add('control-buttons');
    button.textContent = saveButtons[i];
    button.id = saveButtons[i];
    wrapperForSaveButtons.append(button);
}
wrapper.append(wrapperForSaveButtons);

const wrapperForSizeButtons = document.createElement('div');
wrapperForSizeButtons.classList.add('wrapper-for-size');

for (let i = 3; i <= 8; i++) {
  const btnSize = document.createElement('button');
  btnSize.textContent = `${i} x ${i}`;
  btnSize.classList.add('button-size');
  btnSize.setAttribute('data-size', `${i}`);
  wrapperForSizeButtons.append(btnSize);
}
wrapper.append(wrapperForSizeButtons);

export function fillFieldWidthElements (el) {
    for (let i = 0; i < el.length; i++) {
        box.append(el[i]);
    }
}

function dragStart(e) {
    e.dataTransfer.clearData();
    e.target.style.opacity = '0.5';
    e.dataTransfer.setData('text/plain', e.target.dataset.number);
}

function dragEnd(e) {
    e.target.style.opacity = '1';
}

function drop(e) {
    const id = e.dataTransfer.getData('text');
    const element = document.querySelector(`div[data-number="${id}"]`);
    element.style.transition = 'none';
    shiftSquare(element, arrayOfElements);
}

function dragover(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function createElements (num, size) {
    for (let i = 0; i < num; i++) {
        let element = document.createElement('div');
        element.classList.add('element', `element-${size}`);
        element.textContent = `${i + 1}`;
        element.setAttribute('data-number', i + 1);
        element.draggable = 'true';
        element.addEventListener('dragstart', dragStart);
        element.addEventListener('dragend', dragEnd);
        elements.push(element);
    }
    elements[elements.length - 1].draggable = '';
    elements[elements.length - 1].addEventListener('drop', drop);
    fillFieldWidthElements(elements);
}
createElements(numberOfElements, currentSize);

function createElementsSavedGame (arr, size) {
    for (let i = 0; i < arr.length; i++) {
        let element = document.createElement('div');
        element.classList.add('element', `element-${size}`);
        element.textContent = `${arr[i]}`;
        element.setAttribute('data-number', arr[i]);
        element.draggable = 'true';
        element.addEventListener('dragstart', dragStart);
        element.addEventListener('dragend', dragEnd);
        elements.push(element);
    }
    for (let i = 0; i < elements.length; i++) {
        if (Number(elements[i].dataset.number) === arr.length) {
            elements[i].draggable = '';
            elements[i].addEventListener('drop', drop);
        }
    }
    fillFieldWidthElements(elements);
}

function deleteElements (elem) {
    elem.forEach((el) => {
    el.remove();
  });
  arrayOfElements = [];
  elements = [];
}

export function addElementsForArray (elements, size) {
    let line = [];
    for (let i = 0; i < elements.length; i++) {
        if (i < currentSize) {
            line.push(elements[i]);
            if(i === elements.length - 1) {
                arrayOfElements.push(line);
            }
        } else {
            arrayOfElements.push(line);
            line = [];
            currentSize += size;
            i -= 1;
        }
    }
    placesElements(arrayOfElements);
}
addElementsForArray(elements, size);

export function placesElements (arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (Number(arr[i][j].dataset.number) === arr[i].length ** 2) {
                arr[i][j].style.opacity = '0';
                arr[i][j].style.cursor = 'default';
            }
            setTimeout(() => { arr[i][j].style.transform = `translate(${j * 100}%, ${i * 100}%)`; });
        }
    }
}

function changeSizeOfField (event) {
    messageOnload();
    if(event.target.dataset.size) {
        currentSize = Number(`${event.target.dataset.size}`);
        numberOfElements = currentSize * currentSize;
        size = currentSize;
        deleteElements(elements);
        createElements(numberOfElements, currentSize);
        addElementsForArray(elements, size);
        resetCounter();
        stopTimer();
    }
}

const pauseBack = document.createElement('div');

function runControlButtonsFunction (event) {
    if (event.target.id === 'Start' && size % 2 !== 0) {
        deleteMessage();
        currentSize = size;
        arrayOfElements = [];
        shuffleElementsOdd(elements, size);
        resetCounter();
        stopTimer();
        timeOfGame = setInterval(startTimer, 1000);
    }

    if (event.target.id === 'Start' && size % 2 === 0) {
        deleteMessage();
        currentSize = size;
        arrayOfElements = [];
        shuffleElementsEven(elements, size);
        resetCounter();
        stopTimer();
        timeOfGame = setInterval(startTimer, 1000);
    }

    if (event.target.id === 'Pause') {
        if(verificationSolution(arrayOfElements)) {
            return false;
        }
        clearInterval(timeOfGame);
        pauseBack.classList.remove('message-result-close');
        pauseBack.classList.add('message-result');
        pauseBack.style.justifyContent = 'center';
        pauseBack.textContent = 'PAUSE';
        document.querySelector('body').append(pauseBack);
    }

    if (event.target.id === 'Sound OFF') {
        if (sound) {
            event.target.textContent = 'Sound ON';
            moveAudio.muted = true;
        } else {
            event.target.textContent = 'Sound OFF';
            moveAudio.muted = false;
        }
        sound = !sound;
    }
}

function moveElements (event) {
    event.target.style.transition = 'all 0.3s';
    shiftSquare(event.target, arrayOfElements);
}

function startTimer () {
    sec++;
    if (sec < 60) {
        seconds.textContent = `${String(sec).padStart(2, '0')}`;
    } else if (sec = 60) {
        sec = 0;
        seconds.textContent = `${String(sec).padStart(2, '0')}`;
        min++;
        if (min < 60) {
            minutes.textContent = `${String(min).padStart(2, '0')}`;
        } else if (min = 60) {
            min = 0;
            minutes.textContent = `${String(min).padStart(2, '0')}`;
        }
    }
}

export function stopTimer () {
    clearInterval(timeOfGame);
    sec = 0;
    min = 0;
    seconds.textContent = `00`;
    minutes.textContent = `00`;
    resetCounter();
}

export function playSound () {
    moveAudio.play();
}

export function showMessage (counter) {
    setTimeout(() => {
        messageBack.style.zIndex = '1';
        message.style.zIndex = '2';
        message.textContent = `Hooray! You solved the puzzle in ${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')} and ${counter} moves!`;
        seconds.textContent = `${String(sec).padStart(2, '0')}`;
        minutes.textContent = `${String(min).padStart(2, '0')}`;
     }, 300);
     setTimeout(() => {
        message.textContent = `Press Start for a new Game`;
        stopTimer ();
        resetCounter();
     }, 4000);
}

function deleteMessage () {
    messageBack.style.zIndex = '-1';
    message.style.zIndex = '-1';
}

function messageOnload () {
    messageBack.style.zIndex = '1';
    message.style.zIndex = '2';
    message.textContent = `Press Start for a new Game`;
}

function runGame () {
    if (localStorage.getItem('save-game-sk')) {
        const saveGame = JSON.parse(localStorage.getItem('save-game-sk'));
        minutes.textContent = `${String(saveGame.minutes).padStart(2, '0')}`;
        seconds.textContent = `${String(saveGame.seconds).padStart(2, '0')}`;
        moves.textContent = `${saveGame.moves}`;
        let game = saveGame.game;
        currentSize = saveGame.size;
        size = saveGame.size;
        min = saveGame.minutes;
        sec = saveGame.seconds;
        changeCounter(saveGame.moves);
        deleteElements(elements);
        createElementsSavedGame(game, saveGame.size);
        addElementsForArray(elements, saveGame.size);
    }
}

function save (event) {
    if (event.target.id === 'Save') {
        clearInterval(timeOfGame);
        if (!verificationSolution(arrayOfElements)) {
            saveGame(min, sec, arrayOfElements, size);
            messageBack.style.zIndex = '1';
            message.style.zIndex = '2';
            message.textContent = `This game is saved`;

            setTimeout(() => {
                messageBack.style.zIndex = '-1';
                message.style.zIndex = '-1';
                timeOfGame = setInterval(startTimer, 1000);
            }, 1000);
        } else {
            message.textContent = `Nothing to save`;

            setTimeout(() => {
                messageBack.style.zIndex = '-1';
                message.style.zIndex = '-1';
                messageOnload();
            }, 1000);
        }
    }

    if (event.target.id === 'Saved game') {
    if (localStorage.getItem('save-game-sk')) {
        clearInterval(timeOfGame);
        timeOfGame = setInterval(startTimer, 1000);
        messageBack.style.zIndex = '-1';
        message.style.zIndex = '-1';
        runGame();
    } else {
        return false;
    }
}

    if (event.target.id === 'Results') {
        showResults();
    }
}

function getResultsOnLoad () {
    const existedResultsStr = localStorage.getItem('results-sk');
    if (existedResultsStr) {
        results = JSON.parse(existedResultsStr);
    }
}

export function saveResult (count) {
    let elResult = {
        size: `${size} x ${size}`,
        moves: count,
        time: Number(min) * 60 + Number(sec),
    };
    results.push(elResult);
    localStorage.setItem('results-sk', JSON.stringify(results));
}


const messageForResult = document.createElement('div');

function showResults () {
    deleteMessage();
    clearInterval(timeOfGame);
    messageForResult.textContent = '';

    messageForResult.classList.remove('message-result-close');
    messageForResult.classList.add('message-result');
    const sortResult = results.sort((a, b) => a.time - b.time);

    if (sortResult.length > 0) {

        const titleResult = document.createElement('p');
        titleResult.textContent = `Best results:`;
        titleResult.style.paddingTop = '140px';
        messageForResult.append(titleResult);
        messageForResult.style.justifyContent = 'start';

        if (sortResult.length < 10) {
            for (let i = 0; i < sortResult.length; i++) {
                let minutes = Math.trunc(sortResult[i].time / 60);
                let seconds = sortResult[i].time - minutes * 60;
                const elResult = document.createElement('p');
                elResult.textContent = `${i + 1}. Size: ${sortResult[i].size}, Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}, Moves: ${sortResult[i].moves}`;
                messageForResult.append(elResult);
            }
        } else {
            for (let i = 0; i < 10; i++) {
                let minutes = Math.trunc(sortResult[i].time / 60);
                let seconds = sortResult[i].time - minutes * 60;
                const elResult = document.createElement('p');
                elResult.textContent = `${i + 1}. Size: ${sortResult[i].size}, Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}, Moves: ${sortResult[i].moves}`;
                messageForResult.append(elResult);
            }
        }

    } else {
        const elResult = document.createElement('div');
        elResult.textContent = `No saved results`;
        messageForResult.style.justifyContent = 'center';
        messageForResult.append(elResult);
    }
    document.querySelector('body').append(messageForResult);
}

function deleteResults () {
    messageForResult.classList.remove('message-result');
    messageForResult.classList.add('message-result-close');
    if (verificationSolution(arrayOfElements)) {
        messageOnload();
    } else {
        timeOfGame = setInterval(startTimer, 1000);
    }
}

function deletePause () {
    pauseBack.classList.remove('message-result');
    pauseBack.classList.add('message-result-close');
    timeOfGame = setInterval(startTimer, 1000);
}


box.addEventListener('dragover', dragover);
window.addEventListener('load', getResultsOnLoad);
window.addEventListener('load', messageOnload);
wrapperForSizeButtons.addEventListener('click', changeSizeOfField);
wrapperForControlButtons.addEventListener('click', runControlButtonsFunction);
wrapperForSaveButtons.addEventListener('click', save);
box.addEventListener('click', moveElements);
messageForResult.addEventListener('click', deleteResults);
pauseBack.addEventListener('click', deletePause);

