const LIGHT_LEVELS = [
  {
    value: '0',
    minLux: 0,
    maxLux: 49,
    name: 'dim',
    label: 'Dim'
  },
  {
    value: '1',
    minLux: 50,
    maxLux: 999,
    name: 'normal',
    label: 'Normal'
  },
  {
    value: '2',
    minLux: 1000,
    maxLux: 10000, // Warning: Arbitrarily large number!
    name: 'washed',
    label: 'Washed'

  }
]

/**
 * startAmbientLightSensor
 *
 * @return {Object|null} Our shiny light sensor, or null if there's none available
 * @example
 *
 *     inputElement.addEventListener(onFormInputChange);
 */
function startAmbientLightSensor() {
  // The light sensor API is not available in this browser
  if (!('AmbientLightSensor' in window)) {
    return null
  }
  const sensor = new AmbientLightSensor()
  sensor.onreading = event => {
    const illuminance = event.target.illuminance
    const lightLevel = LIGHT_LEVELS.find(function (level) {
      return illuminance > level.minLux && illuminance < level.maxLux
    })

    // Here's our 'ponyfill' bit..
    document.body.setAttribute('data-light-level', lightLevel.name)

    // Keep our UI in sync
    document.getElementById('light-level').value = lightLevel.value

    // And let's print the raw value to the UI to help us debug
    document.getElementById('debug-sensor-input-available').textContent = illuminance
  };
  sensor.onerror = (event) => {
    // TODO: do something more useful with this error, e.g. allow the user to restart
    console.log(event.error.name, event.error.message);
  };
  sensor.start()
  return sensor;
}

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

  if (event.target.name === 'light-level') {
    const lightLevel = LIGHT_LEVELS.find(function (level) {
      console.log(level, event.target.value, level.value === event.target.value)
      return level.value === event.target.value
    })

    document.getElementById('light-level-label').textContent = lightLevel.label
    // Fake the ponyfill's behaviour by directly setting a data attribute on the body
    document.body.setAttribute('data-light-level', lightLevel.name)
  }

  // Conditionally disable and enable the light level controls
  const lightLevelInput = document.getElementById('light-level')
  if (formData.get('toggle-control')) {
    lightLevelInput.removeAttribute('disabled')
  } else {
    lightLevelInput.setAttribute('disabled', 'true')
  }
}

// Let's give form controls their behaviour..

const toggleControlInput = document.getElementById('toggle-control');
const lightLevelInput = document.getElementById('light-level')

toggleControlInput.addEventListener('change', onFormInputChange)
lightLevelInput.addEventListener('change', onFormInputChange)

// .. and finally start the light sensor
const lightSensor = startAmbientLightSensor();

if (lightSensor) {
  toggleControlInput.checked = false
  lightLevelInput.setAttribute('disabled', 'true');
}
