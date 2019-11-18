# Lead Front-end Assessment

## Overview

The [`light-level` CSS `@media` feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/light-level) is a yet to be implemented media query which will allow developers to change their user interfaces to the suit the device's ambient light level.

There are currently 2 JavaScript APIs which can query for a device's light level:

1. `devicelight` (deprecated) https://developer.mozilla.org/en-US/docs/Web/API/Ambient_Light_Events
2. `AmbientLightSensor` https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor

Between them, they have support for Chrome (behind a `enable-generic-sensor-extra-classes` flag), Edge and Firefox (behind a `device.sensors.ambientLight.enabled` flag). Because support is limited, we provide an example `AmbientLightSensor` simulator offering a small slice of the API (allowing the example usage as demonstrated on the MDN `AmbientLightSensor` page above.) This is described below.

It is worth reading [Using light sensors](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent/Using_light_sensors) and the [Ambient Light Sensor spec](https://w3c.github.io/ambient-light/) to learn more.

## Task

We'd like you write a progressive enhancement polyfill/ponyfill for this media query and demonstrate its usage within the context of a simple interface of your choosing.

It provides us a chance to see your:

* Clean architectural implementation demonstrating separation of concerns, encapsulation of IO, and testable methods.
* Your level of general JavaScript knowledge.
* Understanding of cross-browser environments.

It is preferable to have access to an Android or Windows device with a light sensor with Chrome, Firefox and Edge installed (if applicable). Unfortunately, Macs don't seem to expose its light sensor to web APIs, and Safari on iOS has zero support.

## Simulator

Because the `AmbientLightSensor` API is not currently well supported, we provide the following simulator, which you can include inline on any example pages but should be separate from your code. It provides a limited slice of the forthcoming API, enough to enable testing a polyfill. The simulator emits approximately 60 events per second to listeners, with illuminance values varying sinusoidally between 25 and 1000 lux on a 10 second cycle time. Feel free to change the `Emulation defaults` values to test different scenarios.

```js
window.AmbientLightSensor = window.AmbientLightSensor || function () {
  if (this == window) {
    throw new Error("AmbientLightSensor must be invoked with new.");
  }
  
  const self = this;
  
  // Emulation defaults
  const SECONDS_PER_CYCLE = 10;
  const MIN_LUX = 25;
  const MAX_LUX = 1000;
  
  // State storage
  const readingListeners = [];
  const errorListeners = [];
  let simulating = false;
  
  // sensor value
  let illuminance = MIN_LUX;
  
  function update(time = 0) {
    const tau = Math.PI * 2;
    const msPerCycle = SECONDS_PER_CYCLE * 1e3
    const cycleTime = time % msPerCycle
    const percentageOfCycleTimeInRadians = (tau / msPerCycle) * cycleTime;
    const cycleValue = (1 + Math.sin(percentageOfCycleTimeInRadians)) / 2;
    const currentSimulatedLux = MIN_LUX + ((MAX_LUX - MIN_LUX) * cycleValue);

    illuminance = currentSimulatedLux;
   
    readingListeners.forEach((listener) => {
      setTimeout(() => listener(this), 0);
    });

    if (simulating) {
      requestAnimationFrame(update.bind(self));
    }
  }

  this.start = function commenceSimulation() {
    if (!simulating) {
      simulating = true;
      requestAnimationFrame(update.bind(self));
    }
    simulating;
  }
  
  this.stop = function stopSimulation() {
    simulating = false;
  }
  
  return Object.freeze(
    Object.defineProperties(this, {
      "onreading": {
        "get": (() => readingListeners[0]),
        "set": ((listener) => (readingListeners.push(listener), listener))
      },
      "onerror": {
        "get": (() => errorListeners[0]),
        "set": ((listener) => (errorListeners.push(listener), listener))
      },
      "illuminance": {
        "get": (() => illuminance)
      }
    })
  );
}
```

Unless there's a show stopping bug with the above (hopefully not!) we expect that it won't need to be modified. You should not attempt to throttle event frequency in the above code, as real devices will not gaurantee event frequency is above or below certain thresholds.

You can verify this is working with the following example code, which should change the background colour of the page based on the simulated illuminance value:

```js
// Use ambient light sensor

if ( 'AmbientLightSensor' in window ) {
  const sensor = new AmbientLightSensor();
  
  sensor.onreading = () => {
    const brightness = (sensor.illuminance / 1000) * 255 | 0;
    document.body.style.setProperty("background-color", `rgb(${brightness}, ${brightness}, ${brightness}`);
  };
  sensor.onerror = (event) => {
    console.log(event.error.name, event.error.message);
  };
  sensor.start();
}
```

The above is adapted from the MDN documentation.

## Guidance on time spent

While you should be free to decide how much time you'd like to spend developing your solution, in the interests of not taking up all your time, we strongly advise to limit yourself to five hours or less. Feel free to document approaches you would have taken had time been ample.

## Submission

Please push your changes to a public GitHub repo and let us know when you're done via email or by logging an issue on this repo.
