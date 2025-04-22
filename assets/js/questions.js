import {
    data
} from '../data/countries-with-region.js';

import {
    addFeedbackLayer,
    removeFeedbackLayer,
    clickedCountryCode,
    clickEventHandler,
    resetClickedCountryCode
} from './layers.js';

import { isMobile } from './buttons.js';
import TimeOut from './timeout.js';
import { disableMapInteraction } from './exit.js';

let score = 0;

const increaseScore = () => ++score;

export const resetScore = () => score = 0;


const addFeedback = (map, countryCode, increaseScore, callback) => {
    disableMapInteraction(map);
    const correct = countryCode === clickedCountryCode ? true : false;
    addFeedbackLayer(map, correct, countryCode, callback);
    if (correct) {
        increaseScore();
        $('#checkmarks').append('<li ><svg class="correct"><use href="./assets/icons/correct.svg#icon"></use></svg></li>');
    } else {
        $('#checkmarks').append('<li ><svg class="incorrect"><use href="./assets/icons/incorrect.svg#icon"></use></svg></li>');
    }
};

export let setDblClickFeedbackLayer = () => {};

const setClickSelectEventListeners = (map, countryCode, increaseScore, callback) => {

    setDblClickFeedbackLayer = (event) => {
        
        clickEventHandler(event);

        if (clickedCountryCode) {
            map.off('dblclick', 'country-hover', setDblClickFeedbackLayer);
            removeFeedbackLayer(map);
            addFeedback(map, countryCode, increaseScore, callback);
        }
        
    };

    map.on('dblclick', 'country-hover', setDblClickFeedbackLayer);
};

export let touchStartFunction = () => {};
export let touchEndFunction = () => {};

const setTouchSelectEventListeners = (map, countryCode, increaseScore, callback) => {
    const setTapHoldFeedbackLayer = () => {
        removeFeedbackLayer(map);
        addFeedback(map, countryCode, increaseScore, callback);
    };

    let startX, startY, startTime, endX, endY, endTime, force;

    touchEndFunction = (endEvent) => {
        map.off('touchend', 'country-touch', touchEndFunction);
        endX = endEvent.point.x;
        endY = endEvent.point.y;
        endTime = endEvent.originalEvent.timeStamp;

        const distance = ((endX - startX) ** 2 + (startY - endY) ** 2) ** (1 / 2);
        
        if (
            (endEvent.originalEvent.touches.length <= 1) &&  
            distance < 10 && 
            ((endTime - startTime) > 50 || force > 0.5)
            )

        {
            clickEventHandler(endEvent);
            if (clickedCountryCode) {
                map.off('touchstart', 'country-touch', touchStartFunction);
                setTapHoldFeedbackLayer();
            } 
        }
    };

    touchStartFunction = (startEvent) => {
        const moreFingersTouch = (startEvent.originalEvent.touches.length > 1);

        startX = startEvent.point.x;
        startY = startEvent.point.y;
        startTime = startEvent.originalEvent.timeStamp;
        force = startEvent.originalEvent.targetTouches[0].force ? startEvent.originalEvent.targetTouches[0].force : 0;

        if (!moreFingersTouch) {
            map.once('touchend', 'country-touch', touchEndFunction);
        } 
    };

    map.on('touchstart', 'country-touch', touchStartFunction);
};

const setSelectEventListeners = (map, countryCode, increaseScore, callback) => {
    removeFeedbackLayer(map);
    if (!isMobile) {
        setClickSelectEventListeners(map, countryCode, increaseScore, callback);
    } else {
        setTouchSelectEventListeners(map, countryCode, increaseScore, callback);
    }
};

const getRandomCountryCodes = (countries, num) => {
    let codes = [];
    let randomCountryCodeIndex;
    while (codes.length < num) {
        randomCountryCodeIndex = Math.floor(Math.random() * countries.length);
        if (!codes.includes(countries[randomCountryCodeIndex])) {
            codes.push(countries[randomCountryCodeIndex]);
        }
    }
    return codes;
};

export const getQuestions = (region, num) => {
    const allCodesInRegion = Object.keys(data[region]);

    const randomCodes = getRandomCountryCodes(allCodesInRegion, num);

    const questions = [];
    for (const code of randomCodes) {
        const country = data[region][code];
        questions.push([code, country]);
    }

    return questions;
};

const enableMapInteraction = (map) => {
    map.dragPan.enable();
    map.scrollZoom.enable();
    map.touchZoomRotate.enable();
};

const oneQuestion = (map, code, country, region, callback) => {
    enableMapInteraction(map);
    resetClickedCountryCode();
    removeFeedbackLayer(map);

    $('#countryLabel').remove();
    $('body').append(`<div id="countryLabel" class="country country${region}">${country}</div>`);

    setSelectEventListeners(map, code, increaseScore, callback);

};


export const timeOutForShowScore = new TimeOut();

export const askQuestions = (map, region, questions, num, showScore) => {
    if (questions.length === 0) {
        return timeOutForShowScore.setTimeOutFunction(() => showScore(map, score, region, num), 1000);
    }

    const question = questions.pop();
    oneQuestion(map, question[0], question[1], region, () => {
        askQuestions(map, region, questions, num, showScore);
    });
};