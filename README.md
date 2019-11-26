# Ambient Light Sensor Demo

## Overview

This repo prototypes a progressive enhancement/ponyfill for the [`light-level` CSS `@media` feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/light-level), a yet to be implemented media query which will allow developers to change their user interfaces to the suit the device's ambient light level.

It uses the JavaScript [`AmbientLightSensor` API](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor)

## How to run the demo

Clone this repo and run `npx browser-sync` to see the demo in your browser at `http://localhost:3000`

## Simulator

If you can't run this demo in a [browser that supports the AmbientLightSensor API](https://caniuse.com/#feat=ambient-light) you can use the provided simulator, simply uncomment the following line in `index.html`:

```html
<!-- Uncommment this line to see this demo with a simulated AmbientLightSensor API -->
<!-- <script async src="sciprts/simulator.js"></script> -->
  ```

## Approach, notes & caveats
* I've only implemented the AmbientLightSensor API, and not devicelight
* I've used CSS Custom properties: excludes IE11 with no fallback. only used for values that will change during runtime (that is, as a result of user interaction after the page loads)
* UI polish: I've applied a very minimal set of styles to the sample UI

### What would be different if this was a polyfill (vs ponyfill)?
* Styles would be written using the media query syntax instead of using the `[data-light-level`] attribute selector
* The script would load only if a feature test for the CSS light-level media query failed (i.e. `window.matchMedia((light-level: normal))`)
* The script would provide a mechanism for carrying out a text replacement for the (unsupported) light-level media query with a query that will resolve based on the light-level detected via JavaScript

### What would be different if this were to go to production:
* Fallback for CSS custom properties (IE, Opera mini)
* Fallback for script modules (IE, Opera mini)
* Transpilation for e.g. const in ES6 (<IE10)
* Include a noscript tag to present meaningful content to users without JavaScript
* Complete the page's meta information and ensure content structure is sensible
* Split out styles dependent on the light sensor and only load them when one is available

## References

I made use of some prior art when compiling this demo. Many thanks to the talented developers who have come before me.

* CSS feature test: https://css3test.com/#mediaqueries-5
* Polyfill vs ponyfill: https://ponyfoo.com/articles/polyfills-or-ponyfills
* The Dark Side of Polyfilling CSS: hilipwalton.com/articles/the-dark-side-of-polyfilling-css/

--

😎
