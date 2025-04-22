let spinEnabled;

export const stopSpin = () => spinEnabled = false;

export const addRotation = (map) => {

    const secondsPerRevolution = 100; 
    spinEnabled = true;

    function spinGlobe() {
        if (spinEnabled) {
            let distancePerSecond = 360 / secondsPerRevolution;
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            map.easeTo({
                center,
                duration: 1000,
                easing: (n) => n
            });

            map.once('moveend', spinGlobe);
        } else {
            map.stop();
        }
    }
    spinGlobe();
    $('.mapbox-improve-map').remove();
};