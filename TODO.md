

Approach/Caveats
* Simple: no build step!
* Modules: I'm using browser JavaScript modules because I don't want to configure a build step. So I've included instructions for running locally and I also deploy this static site on each commit
* Progressive enhancement: add the fancy stuff only when its supported
* Ponyfill: provides that functionality as a standalone module
* CSS Custom properties: excludes IE11 with no fallback. only used for values that will change during runtime (that is, as a result of user interaction after the page loads)


If this were to go to production:
* Fallback for CSS custom properties (IE, Opera mini)
* Fallback for script modules (IE, Opera mini)
* Transpilation for e.g. const in ES6 (<IE10)
* Include a noscript tag to present meaningful content to users without JavaScript
* Complete the page's meta information and ensure content structure is sensible

* [x] load scripts asynchronously (modules load async by default)
* [ ] Markup & Style: layout & ui
* [ ] Style: dim, normal and washed themes
* [ ] Feature detection (adapt css3test?)
* [ ] Re-create the API (which one, or both?) and attach to global object
* [ ] Configurable options:
  - Root element (default: document.body)
  - Throttle?
* [ ] Apply theme to sample UI based on light-level
* Deploy this static site on each commit* Unit tests
* Voice-over announcement of changes to interactive elements (checkbox, slider)
* Automated a11y tests
* Manual tests
  - Keyboard a11y
  - User stories/BDD?



README
* Ponyfill vs polyfill approach:
  - Show how it could be adapted as a polyfill (vs ponyfill) via text replacement in CSS source
  - Using browsersync

Prior art
* Polyfill vs ponyfill https://ponyfoo.com/articles/polyfills-or-ponyfills
* https://philipwalton.com/articles/the-dark-side-of-polyfilling-css/
* CSS feature test https://css3test.com/#mediaqueries-5
'Media queries': function (test) {
		var matches = matchMedia(test);
		if (matches.media !== 'invalid' && matches.matches) {
			return true;
		}
		else {
			var matches = matchMedia('not ' + test);
			return matches.media !== 'invalid' && matches.matches
		}
	}
