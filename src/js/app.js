var words, colors, lastType, randomColorIdx, randomWords = [], randomDescriptions = [], usedColorsIdxs = [], currentWordsIdxs = [];

colors = ['rgb(255, 153, 102)', 'rgb(102, 204, 255)', 'rgb(51, 138, 62)', 'rgb(204, 204, 0)'];

init();

function init() {
    usedColorsIdxs = [];
    currentWordsIdxs = [];
    randomDescriptions = []; 
    randomWords = [];

    fetch('./src/js/words.json').then(function(result){
        return result.json();
    })
    .then(function(res){            
        words = res;
        var i = 0, idx = 0, exists = [];
        
        for( i = 0; i < colors.length; i++) {
            idx = getRandomIdxFromArray(currentWordsIdxs, words);
        }

        document.querySelectorAll('div.card, div.word').forEach(function (element) {
            updateElement(element);    
            addClickEvent(element);    
            if (element.className === 'word')
                element.style.border = '4px yellow solid';
        });
    })
    .catch(function(err){
        console.log(err);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}   

function getRandomIdxFromArray(array, arrayFrom) {
    var randomIdx = getRandomInt(0, arrayFrom.length -1);

    while (array.indexOf(randomIdx) > -1) {
        randomIdx = getRandomInt(0, arrayFrom.length -1);
    }    
    array.push(randomIdx);
    return randomIdx;    
}

function updateElement(element) {
    element.innerHTML = '';
    element.style.backgroundColor = '';
    var randomIdx = -1;
    
    if (element.className === 'word') {
        randomIdx = getRandomIdxFromArray(randomWords, currentWordsIdxs);
        element.insertAdjacentHTML('beforeEnd', '<span>' + words[currentWordsIdxs[randomIdx]].word + '</span>');
    } else {
        randomIdx = getRandomIdxFromArray(randomDescriptions, currentWordsIdxs);       
        element.insertAdjacentHTML('beforeEnd', '<p>' + words[currentWordsIdxs[randomIdx]].definition + '</p>');
    }   
    
    element.id = element.className + '-' + words[currentWordsIdxs[randomIdx]].id; 
} 

function addClickEvent(element) {
    element.addEventListener('click', function (e) {
        var id, clickedElem, type, idInt;
        document.querySelector('.result').innerHTML = '';

        if (e.target.parentNode.className.match('card|word')) {
            id = e.target.parentNode.id;
        } else {
            id = e.target.id;
        }
       
        clickedElem = document.getElementById(id);
        type = (clickedElem.className.indexOf('word') > -1? 'word' : 'card'); 
        
        if (type === lastType) return;

        idInt = parseInt(id.replace(type + '-', ''));

        if (type === 'word') {
            randomColorIdx = getRandomIdxFromArray(usedColorsIdxs, colors);
        }
        
        if (type === 'card') {
            if (clickedElem.style.backgroundColor === '') {
                clickedElem.style.backgroundColor = colors[randomColorIdx];
            } else {
                clickedElem.style.backgroundColor = 'rgb(255, 255, 255)';
            }
        } else {
            clickedElem.style.backgroundColor = colors[randomColorIdx];
        }

        toggleBorder(type); 
        lastType = type;
    });
}

function toggleBorder(type) {
    document.querySelectorAll('.card, .word').forEach(function(element) {       
        if (element.className !== type) {
            if (element.style.border === '') {
                if (usedColorsIdxs.length !== colors.length)
                    element.style.border = '4px yellow solid';
            } else {
                element.style.border = '';
            }
        } else {
            element.style.border = '';
        }        
    });
    console.log(usedColorsIdxs);
}

function isCorrect() {
    var type, lastType, match, qtdMatch = 0, i= 0; cardsArray = [], wordsArray = [];

    cardsArray = Array.prototype.map.call(document.querySelectorAll('div.card'), function(el) {
        return { id: el.id, color: el.style.backgroundColor };
    });

    wordsArray = Array.prototype.map.call(document.querySelectorAll('div.word'), function(el) {
        return { id: el.id, color: el.style.backgroundColor };
    });

    wordsArray.forEach(function (word) {

        if (word.color !== '') {

            for (i = 0; i < cardsArray.length; i++) {
                match = word.id.replace('word-', '') === cardsArray[i].id.replace('card-', '') && word.color === cardsArray[i].color;

                if (match) {
                    qtdMatch++;
                }
            }
        }
    });

    return wordsArray.length === qtdMatch;
}

document.getElementById('btn-check').addEventListener('click', function(event) {
    if (isCorrect()) {
        document.querySelector('.result').innerHTML = 'Winner ;)';
    } else {
        document.querySelector('.result').innerHTML = 'Try again :(';
    }
 });

 document.getElementById('btn-new').addEventListener('click', function(event) {
     document.querySelector('.result').innerHTML = '';
     init();
 })
 