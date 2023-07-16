import { placesElements, showMessage, saveResult } from './createFieldOfPlay';
import { playSound } from './createFieldOfPlay';

let counter = 0;

const getEmptyElPosition = (array) => {
    let emptyElementRow;
    let emptyElementColumn;
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (Number(array[i][j].dataset.number) === array.length ** 2) {
                emptyElementRow = i;
                emptyElementColumn = j;
            }
        }
    }
    return { emptyElementRow, emptyElementColumn };
}

export function shiftSquare (element, array) {
    const { emptyElementRow, emptyElementColumn } = getEmptyElPosition(array)

    if (element.classList.contains('element')) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                if (element.dataset.number === array[i][j].dataset.number) {
                    if (i === emptyElementRow - 1 && j === emptyElementColumn ||
                        i === emptyElementRow && j === emptyElementColumn - 1 ||
                        i === emptyElementRow && j === emptyElementColumn + 1 ||
                        i === emptyElementRow + 1 && j === emptyElementColumn) {
                            const element = array[i][j];
                            array[i][j] = array[emptyElementRow][emptyElementColumn];
                            array[emptyElementRow][emptyElementColumn] = element;
                            counter++;
                            document.querySelector('.timer').textContent = `${counter}`;
                            playSound();
                            if (verificationSolution(array)) {
                                showMessage(counter);
                                saveResult(counter);
                            }
                    }
                }
            }
        }
    }
    placesElements(array);
}

export function verificationSolution (array) {
    let resultArray = [];
    for (let i = 0; i < array.length ** 2; i++) {
        resultArray.push(i + 1);
    }
    let playArray = array.flat();
    return playArray.every((el, index) => Number(el.dataset.number) === resultArray[index]);
}

export function resetCounter () {
    counter = 0;
    document.querySelector('.timer').textContent = `${counter}`;
}

export function saveGame (min, sec, array, size) {
    let game = array.flat();
    for (let i = 0; i < game.length; i++) {
        game[i] = Number(game[i].dataset.number);
    }
    const savedGame = {
        moves: counter,
        minutes: min,
        seconds: sec,
        game: game,
        size: size,
    }
    localStorage.setItem('save-game-sk', JSON.stringify(savedGame));
}

export function changeCounter (count) {
    counter = count;
}

