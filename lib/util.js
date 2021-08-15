function generateQuestions(noOfQ, digitInMinuend, digitInSubtrahend, isBorrow) {
    if (largestNumberOfNDigit(digitInMinuend) < noOfQ) {
        return "not possible";
    }
    const minuendNumbers = [];
    const mcqs = [];
    while (minuendNumbers.length < noOfQ) {
        const minuendVal = minuendNumber(digitInMinuend);
        const minUptoSubtrahendPlaces = Number.parseInt(String(minuendVal).split("").slice(digitInMinuend - digitInSubtrahend, digitInMinuend).join(''));
        if (digitInSubtrahend < digitInMinuend &&
            !isBorrow &&
            minUptoSubtrahendPlaces < smallestNumberOfNDigit(digitInSubtrahend)) {
                continue;
        }

        if (digitInSubtrahend < digitInMinuend &&
            isBorrow &&
            minUptoSubtrahendPlaces == largestNumberOfNDigit(digitInSubtrahend)) {
            continue;
        }

        if (digitInSubtrahend === digitInMinuend && isBorrow) {
            if (minuendVal === largestNumberOfNDigit(digitInSubtrahend)) {
                continue;
            }
        }

        if (!minuendNumbers.includes(minuendVal)) {
            minuendNumbers.push(minuendVal);
            const subtrahend = +generateSubtrahend(minuendVal, digitInMinuend, digitInSubtrahend, isBorrow);
            const correctAnswer = minuendVal - subtrahend;
            const options = generateOptions(correctAnswer);
            shuffle(options);
            mcqs.push({
                minuend: minuendVal,
                subtrahend,
                correctAnswer,
                options
            });
        }
    }

    return mcqs;
}

function generateOptions(number) {
    const numberInArray = String(number).split("");
    shuffle(numberInArray);
    let number1 = Number.parseInt(numberInArray.join(''));
    if (number === number1) {
        number1 += getRandomInt(1, 10)
    }

    let number2 = getRandomInt(number+number*50*(1/100), number+number*50*(1/100));

    if (number2 === number) {
        number2 +=  getRandomInt(11, 21);
    }

    let number3 = getRandomInt(number+number*30*(1/100), number+number*40*(1/100));

    if (number3 === number) {
        number3 +=  getRandomInt(22, 31);
    }

    return [number, number1, number2, number3];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateSubtrahend(minuendNumber, digitInMinuend, digitInSubtrahend, isBorrow) {
    let number;

    if (isBorrow) {
        number = generateSubtrahendBorrow(minuendNumber, digitInMinuend, digitInSubtrahend);
    } else {
        number = generateSubtrahendNonBorrow(minuendNumber, digitInMinuend, digitInSubtrahend);
    }

    return number;
}

function generateSubtrahendNonBorrow(minuendNumber, digitInMinuend, digitInSubtrahend) {
    // const whichEverIsLesser = largestNumberOfNDigit(digitInSubtrahend) < minuendNumber
    // ? largestNumberOfNDigit(digitInSubtrahend)
    // : minuendNumber;
    // const number = getRandomInt(smallestNumberOfNDigit(digitInSubtrahend), whichEverIsLesser);
    const minuendNumberArray = String(minuendNumber).split('');
    // const numberInArray = String(number).split('');
    const numberArray = []

    for (let i = digitInMinuend - digitInSubtrahend; i < digitInMinuend; ++i) {
        const whichEverIsLesser = minuendNumberArray[i] < 1 ? minuendNumberArray[i] : 1
        const num = getRandomInt(whichEverIsLesser, Number.parseInt(minuendNumberArray[i]) + 1);
        numberArray.push(num);
    }

    return numberArray.join('');
}

function generateSubtrahendBorrow(minuendNumber, digitInMinuend, digitInSubtrahend) {
    const whichEverIsLesser = largestNumberOfNDigit(digitInSubtrahend) < minuendNumber
    ? largestNumberOfNDigit(digitInSubtrahend)
    : minuendNumber;
    const number = getRandomInt(smallestNumberOfNDigit(digitInSubtrahend), whichEverIsLesser);
    const minuendNumberArray = String(minuendNumber).split('');
    const numberInArray = String(number).split('');

    let isBorrowingNumber = false;

    for (let i = digitInMinuend - digitInSubtrahend; i < digitInMinuend; ++i) {
        if (i === 0) {
            continue;
        }

        if (numberInArray[Math.abs(digitInMinuend - digitInSubtrahend - i)] > minuendNumberArray[i]) {
            isBorrowingNumber = true;
            break;
        }
    }

    if (isBorrowingNumber) {
        return number;
    }

    for (let i = digitInMinuend - digitInSubtrahend; i < digitInMinuend; ++i) {
        if (i === 0) {
            continue;
        }

        const lastElementInNumber = numberInArray[Math.abs(digitInMinuend - digitInSubtrahend - i) - 1] || -1;
        if (minuendNumberArray[i-1] > lastElementInNumber) {
            // this item is eligible for borrow
            numberInArray[Math.abs(digitInMinuend - digitInSubtrahend - i)] = getRandomInt((Number.parseInt(minuendNumberArray[i]) +1)%10, 9);
        }
    }

    return numberInArray.join('');
}

function minuendNumber(digitInMinuend) {
    const minVal = smallestNumberOfNDigit(digitInMinuend);
    const maxVal = largestNumberOfNDigit(digitInMinuend);
    return getRandomIntInclusive(minVal, maxVal);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function largestNumberOfNDigit(digit) {
    return Array(digit).fill(9).join('');
}

function smallestNumberOfNDigit(digit) {
    const val = Array(digit).fill(0);
    val[0] = 1;
    return val.join('');
}

module.exports = {
    generateQuestions
}
