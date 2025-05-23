import {
    addExit
} from './exit.js';
import {
    startRound
} from './round.js';
import {
    addHoverLayer,
    addBlurLayer,
    addDesktopEventListeners,
    addTouchLayer
} from './layers.js';
import {
    addRegionBtns, addStarIcon
} from './buttons.js';
import {
    addHowToPlay, addHowToPlayIcon
} from './how-to-play.js';
import { stopSpin } from './spin.js';

import { isMobile } from './buttons.js';

const visitedBefore = window.localStorage.getItem('visitedBefore') === 'true' ? true : false;

const centerCoordinates = {
    europe: [14.213562, 53.541532],
    asia: [77.367783, 32.174450],
    africa: [17.015762, 8.895926],
    americas: [-84.811020, 11.632733],
};

let firstTime = true;

const addClickListenersToRegionBtns = (map) => {
    
    const addFlyOnClick = (button, region, center, zoom) => {
        button.click(() => {
            stopSpin();
            map.easeTo({
                center,
                zoom,
                duration: 1500,
                bearing: 0,
                essential: true
            });

            if (map.getLayer('country-hover')) { 
                map.setFilter('country-hover', null);
            }
            if (map.getLayer('country-touch')) { 
                map.setFilter('country-touch', null);
            }
            if (map.getLayer('country-blur')) { 
                map.setFilter('country-blur', null);
            }

            if (map.getLayer('country-hover')) {
                map.setFilter('country-hover', ['==', ['get', 'region'], region]);
            }

            if (map.getLayer('country-touch')) {
                map.setFilter('country-touch', ['==', ['get', 'region'], region]);
            }

            if (!map.getLayer('country-blur')) { 
                addBlurLayer(map);
            }
            map.setFilter('country-blur', ['!=', ['get', 'region'], region]);
            
            addDesktopEventListeners(map);
            
            startRound(map, region, 10);
        });
    };

    if (isMobile) {
         addTouchLayer(map);
    } else {
        addHoverLayer(map);
    } 

    addFlyOnClick($('#europeBtn'), 'Europe', centerCoordinates.europe , 3.5);
    addFlyOnClick($('#asiaBtn'), 'Asia', centerCoordinates.asia , 2.5);
    addFlyOnClick($('#africaBtn'), 'Africa', centerCoordinates.africa , 2.8);
    addFlyOnClick($('#americasBtn'), 'Americas', centerCoordinates.americas , 2.5);
};

const showChooseRegionTitle = () => {
    $('h1').removeClass('title').addClass('choose').fadeIn('slow').text('Choose a region!');
};

export const game = (map) => {
    const playedBefore = window.localStorage.getItem('playedBefore') === 'true' ? true : false;
    const continueFunction = () => {
        if (playedBefore) {
            addStarIcon(map);
        }
        addExit(map);
        showChooseRegionTitle();
        addRegionBtns();
        addClickListenersToRegionBtns(map);
    };

    if (!visitedBefore && firstTime) {
        firstTime = false;
        window.localStorage.setItem('visitedBefore', 'true');
        addHowToPlay(isMobile, false, continueFunction);
    } else {
        addHowToPlayIcon(isMobile);
        continueFunction();
    }
};