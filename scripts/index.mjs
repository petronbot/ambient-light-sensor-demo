// // deviceLightAPI.js

// import polyfillApi from polyFillModule.js

// if (feature exists in browser) {
//   return the browser's API
// }

// return polyfillApi


// // index.js

// import deviceLightAPI from deviceLightAPI.js

// --

//  UI Stuff


/**
 * onFormInputChange
 *
 * @param {Object} event - The onchange event triggered on our element
 * @return {undefined} Nada!
 * @example
 *
 *     inputElement.addEventListener(onFormInputChange);
 */
function onFormInputChange(event) {
  const formData = new FormData(event.target.form)

  // Fake the ponyfill's behaviour by directly setting a data attribute on the body
  if (event.target.name === "light-level" && event.target.checked === true) {
    document.body.setAttribute('data-light-level', event.target.value)
  }

  // Conditionally disable and enable the light level controls
  const lightLevelInputs = document.getElementById('light-level-inputs')
  if (formData.get('toggle-control')) {
    lightLevelInputs.removeAttribute('disabled')
  } else {
    lightLevelInputs.setAttribute('disabled', 'true')
  }
}

if ('AmbientLightSensor' in window) {
  const sensor = new AmbientLightSensor()
  sensor.onreading = event => {
    const illuminance = event.target.illuminance
    const lightLevel = illuminance < 25 ? 'dim' : illuminance < 1000 ? 'normal' : 'washed'
    document.body.setAttribute('data-light-level', lightLevel)
    document.getElementById('debug-sensor-input-available').textContent = illuminance
  };
  sensor.onerror = (event) => {
    console.log(event.error.name, event.error.message);
  };
  sensor.start()
  const debug = JSON.stringify(sensor)
}

// Initialise form behaviour
const inputs = ["toggle-control", "light-level"] // these are the inputs we're interested in
const inputElems = document.getElementById("controls-form").elements;

for (let i = 0; i < inputElems.length; i++) {
  if (inputs.includes(inputElems[i].name)) {
    inputElems[i].addEventListener('change', onFormInputChange)
  }
}

// [ ] Remove checked attribure from "light level control override" checkbox when sensor input is available
// [ ] Set disabled attribute on "light level select" fieldset to disabled when "light level control override" checkbox is unchecked
