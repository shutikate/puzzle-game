import shuffle from 'lodash/shuffle';
import { fillFieldWidthElements } from './createFieldOfPlay';
import { addElementsForArray } from './createFieldOfPlay';


export function shuffleElementsOdd(el, size) {
    let shuffleArray = shuffle(el);
    let count = 0;
    let arrayForCheck = shuffleArray.filter((el) => Number(el.dataset.number) !== shuffleArray.length);
    for (let i = 0; i < arrayForCheck.length; i++) {
        let elementsBefore = arrayForCheck.slice(0, i);
        count = count  + elementsBefore.filter((el) => Number(arrayForCheck[i].dataset.number) < el.dataset.number).length;
    }
    if (count % 2 === 0) {
        fillFieldWidthElements (shuffleArray);
        addElementsForArray(shuffleArray, size);
    } else {
        shuffleElementsOdd(el, size);
    }
}

export function shuffleElementsEven(el, size) {
    let shuffleArray = shuffle(el);
    let stringOfEmptyElement;
    shuffleArray.forEach((el, index) => {
        if (Number(el.dataset.number) === shuffleArray.length) {
            stringOfEmptyElement = Math.floor(index / size);
        }
    })
    let count = 0;
    let arrayForCheck = shuffleArray.filter((el) => Number(el.dataset.number) !== shuffleArray.length);
    for (let i = 0; i < arrayForCheck.length; i++) {
        let elementsBefore = arrayForCheck.slice(0, i);
        count = count  + elementsBefore.filter((el) => Number(arrayForCheck[i].dataset.number) < el.dataset.number).length;
    }
    if ((count + stringOfEmptyElement) % 2 !== 0) {
        fillFieldWidthElements (shuffleArray);
        addElementsForArray(shuffleArray, size);
    } else {
        shuffleElementsEven(el, size);
    }
}
