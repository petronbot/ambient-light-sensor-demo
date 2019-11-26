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
