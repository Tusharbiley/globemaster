import {
    addPlayBtn,
    removePlayBtn,
    addLogoutBtn,
    removeLogoutBtn,  // Importing logout button functionality
} from './buttons.js';

import {
    addRotation
} from './spin.js';

export const initialZoom = () => {
    return window.innerWidth < 600 ? 1 : 1.5;
};

export const worldviewFilters = [
    ["has", "color_group"],
    ["match", ["get", "disputed"], ["true"], false, true],
    ["match", ["get", "worldview"], ["RU"], false, true],
    ["match", ["get", "worldview"], ["CN"], false, true],
    ["match", ["get", "worldview"], ["MA"], false, true],
    ["match", ["get", "worldview"], ["AR"], false, true]
];

const createMapObject = (callback) => {
    if (!mapboxgl.supported()) {
        window.location.replace('../no-support.html');
    } else {
        mapboxgl.accessToken =
            'pk.eyJ1IjoidHVzaGFyODk4OSIsImEiOiJjbTlyMDhqajYweWt1MmlzYW16MTJpdmZ0In0.rlt9n2s1KOznjFcLXvF1fQ';
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/tushar8989/cm9rgd4k1009401s0fykn8030',
            projection: 'globe',
            zoom: initialZoom(),
            minZoom: 1,
            maxZoom: 7,
            center: [50, 40],
            interactive: false,
            attributionControl: false,
            dragPan: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            keyboard: false,
            doubleClickZoom: false,
            touchZoomRotate: false
        }).addControl(new mapboxgl.AttributionControl({
            customAttribution: '<span class="developer">&copy; App development by Hack-N-Cheese </span>'
        }));

        map.on('load', () => {
            addTilesetSource(map);
            callback(map);
        });

        map.on('error', () => {
            window.location.href = '../error.html';
        });
    }
};

const addTilesetSource = (map) => {
    map.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
        filter: [
            "all",
            ...worldviewFilters
        ],
        generateId: true
    });
};

const addMapIntroAnimation = () => {
    $('.map').addClass('animate-appear-map');
};

let gameFile;

export const startGame = (map) => {
    addPlayBtn(() => {
        if (!gameFile) {
            gameFile = import('./game.js');
        }
        gameFile.then(module => {
            removePlayBtn();
            removeLogoutBtn();
            module.game(map);
        });
    });
    addRotation(map);
    addLogoutBtn();
      // Adding the logout button
}; 


window.document.onload = 
    $('body').on('touchcancel', e => e.preventDefault());


createMapObject((map) => {
    addMapIntroAnimation();
    $('#preMapContainer').remove();
    startGame(map);
});
