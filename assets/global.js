function getFocusableElements(container) {
	return Array.from(
	  container.querySelectorAll(
		"summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
	  )
	);
  }
  
  document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
	summary.setAttribute('role', 'button');
	summary.setAttribute('aria-expanded', summary.parentNode.hasAttribute('open'));
  
	if(summary.nextElementSibling.getAttribute('id')) {
	  summary.setAttribute('aria-controls', summary.nextElementSibling.id);
	}
  
	summary.addEventListener('click', (event) => {
	  event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
	});
  
	if (summary.closest('header-drawer')) return;
	summary.parentElement.addEventListener('keyup', onKeyUpEscape);
  });
  
  const trapFocusHandlers = {};
  
  function trapFocus(container, elementToFocus = container) {
	var elements = getFocusableElements(container);
	var first = elements[0];
	var last = elements[elements.length - 1];
  
	removeTrapFocus();
  
	trapFocusHandlers.focusin = (event) => {
	  if (
		event.target !== container &&
		event.target !== last &&
		event.target !== first
	  )
		return;
  
	  document.addEventListener('keydown', trapFocusHandlers.keydown);
	};
  
	trapFocusHandlers.focusout = function() {
	  document.removeEventListener('keydown', trapFocusHandlers.keydown);
	};
  
	trapFocusHandlers.keydown = function(event) {
	  if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
	  // On the last focusable element and tab forward, focus the first element.
	  if (event.target === last && !event.shiftKey) {
		event.preventDefault();
		first.focus();
	  }
  
	  //  On the first focusable element and tab backward, focus the last element.
	  if (
		(event.target === container || event.target === first) &&
		event.shiftKey
	  ) {
		event.preventDefault();
		last.focus();
	  }
	};
  
	document.addEventListener('focusout', trapFocusHandlers.focusout);
	document.addEventListener('focusin', trapFocusHandlers.focusin);
  
	elementToFocus.focus();
  }
  
  // Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
  try {
	document.querySelector(":focus-visible");
  } catch(e) {
	focusVisiblePolyfill();
  }
  
  function focusVisiblePolyfill() {
	const navKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'TAB', 'ENTER', 'SPACE', 'ESCAPE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN']
	let currentFocusedElement = null;
	let mouseClick = null;
  
	window.addEventListener('keydown', (event) => {
	  if(navKeys.includes(event.code.toUpperCase())) {
		mouseClick = false;
	  }
	});
  
	window.addEventListener('mousedown', (event) => {
	  mouseClick = true;
	});
  
	window.addEventListener('focus', () => {
	  if (currentFocusedElement) currentFocusedElement.classList.remove('focused');
  
	  if (mouseClick) return;
  
	  currentFocusedElement = document.activeElement;
	  currentFocusedElement.classList.add('focused');
  
	}, true);
  }
  
  function pauseAllMedia() {
	document.querySelectorAll('.js-youtube').forEach((video) => {
	  video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
	});
	document.querySelectorAll('.js-vimeo').forEach((video) => {
	  video.contentWindow.postMessage('{"method":"pause"}', '*');
	});
	document.querySelectorAll('video').forEach((video) => video.pause());
	document.querySelectorAll('product-model').forEach((model) => {
	  if (model.modelViewerUI) model.modelViewerUI.pause();
	});
  }
  
  function removeTrapFocus(elementToFocus = null) {
	document.removeEventListener('focusin', trapFocusHandlers.focusin);
	document.removeEventListener('focusout', trapFocusHandlers.focusout);
	document.removeEventListener('keydown', trapFocusHandlers.keydown);
  
	if (elementToFocus) elementToFocus.focus();
  }
  
  function onKeyUpEscape(event) {
	if (event.code.toUpperCase() !== 'ESCAPE') return;
  
	const openDetailsElement = event.target.closest('details[open]');
	if (!openDetailsElement) return;
  
	const summaryElement = openDetailsElement.querySelector('summary');
	openDetailsElement.removeAttribute('open');
	summaryElement.setAttribute('aria-expanded', false);
	summaryElement.focus();
  }
  
  
  
  function debounce(fn, wait) {
	let t;
	return (...args) => {
	  clearTimeout(t);
	  t = setTimeout(() => fn.apply(this, args), wait);
	};
  }
  
  function fetchConfig(type = 'json') {
	return {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
	};
  }
  
  /*
   * Shopify Common JS
   *
   */
  if ((typeof window.Shopify) == 'undefined') {
	window.Shopify = {};
  }
  
  Shopify.bind = function(fn, scope) {
	return function() {
	  return fn.apply(scope, arguments);
	}
  };

  
  class ModalDialog extends HTMLElement {
	constructor() {
	  super();
	  this.querySelector('[id^="ModalClose-"]').addEventListener(
		'click',
		this.hide.bind(this, false)
	  );
	  this.addEventListener('keyup', (event) => {
		if (event.code.toUpperCase() === 'ESCAPE') this.hide();
	  });
	  if (this.classList.contains('media-modal')) {
		this.addEventListener('pointerup', (event) => {
		  if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
		});
	  } else {
		this.addEventListener('click', (event) => {
		  if (event.target === this) this.hide();
		});
	  }
	}
  
	connectedCallback() {
	  if (this.moved) return;
	  this.moved = true;
	  document.body.appendChild(this);
	}
  
	show(opener) {
	  this.openedBy = opener;
	  const popup = this.querySelector('.template-popup');
	  document.body.classList.add('overflow-hidden');
	  this.setAttribute('open', '');
	  if (popup) popup.loadContent();
	  trapFocus(this, this.querySelector('[role="dialog"]'));
	  window.pauseAllMedia();
	}
  
	hide() {
	  document.body.classList.remove('overflow-hidden');
	  document.body.dispatchEvent(new CustomEvent('modalClosed'));
	  this.removeAttribute('open');
	  removeTrapFocus(this.openedBy);
	  window.pauseAllMedia();
	}
  }
  customElements.define('modal-dialog', ModalDialog);
  
  class ModalOpener extends HTMLElement {
	constructor() {
	  super();
  
	  const button = this.querySelector('button');
  
	  if (!button) return;
	  button.addEventListener('click', () => {
		const modal = document.querySelector(this.getAttribute('data-modal'));
		if (modal) modal.show(button);
	  });
	}
  }
  customElements.define('modal-opener', ModalOpener);
  
  class DeferredMedia extends HTMLElement {
	constructor() {
	  super();
	  const poster = this.querySelector('[id^="Deferred-Poster-"]');
	  if (!poster) return;
	  poster.addEventListener('click', this.loadContent.bind(this));
	}
  
	loadContent(focus = true) {
	  window.pauseAllMedia();
	  if (!this.getAttribute('loaded')) {
		const content = document.createElement('div');
		content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));
  
		this.setAttribute('loaded', true);
		const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
		if (focus) deferredElement.focus();
	  }
	}
  }
  
  customElements.define('deferred-media', DeferredMedia);
  
  class SliderComponent extends HTMLElement {
	constructor() {
	  super();
	  this.slider = this.querySelector('[id^="Slider-"]');
	  this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
	  this.enableSliderLooping = false;
	  this.currentPageElement = this.querySelector('.slider-counter--current');
	  this.pageTotalElement = this.querySelector('.slider-counter--total');
	  this.prevButton = this.querySelector('button[name="previous"]');
	  this.nextButton = this.querySelector('button[name="next"]');
  
	  if (!this.slider || !this.nextButton) return;
  
	  this.initPages();
	  const resizeObserver = new ResizeObserver(entries => this.initPages());
	  resizeObserver.observe(this.slider);
  
	  this.slider.addEventListener('scroll', this.update.bind(this));
	  this.slider.addEventListener('mousemove', this.update.bind(this), false);
	  this.slider.addEventListener('touchmove', this.update.bind(this), false);
	  this.slider.addEventListener('mouseup', this.update.bind(this), false);
	  this.slider.addEventListener('touchend', this.update.bind(this), false);

	  this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
	  this.nextButton.addEventListener('click', this.onButtonClick.bind(this));

	}
  
	initPages() {
	  this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
	  if (this.sliderItemsToShow.length < 2) return;
	  this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
	  this.slidesPerPage = Math.floor((this.slider.clientWidth - this.sliderItemsToShow[0].offsetLeft) / this.sliderItemOffset);
	  this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
	  this.update();
	}
  
	resetPages() {
	  this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
	  this.initPages();
	}
  
	update() {
	  const previousPage = this.currentPage;
	  this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;
	  if (this.currentPageElement && this.pageTotalElement) {
		this.currentPageElement.textContent = this.currentPage;
		this.pageTotalElement.textContent = this.totalPages;
	  }
  
	  if (this.currentPage != previousPage) {
		this.dispatchEvent(new CustomEvent('slideChanged', { detail: {
		  currentPage: this.currentPage,
		  currentElement: this.sliderItemsToShow[this.currentPage - 1]
		}}));
	  }
  
	  if (this.enableSliderLooping) return;
  
	  if (this.isSlideVisible(this.sliderItemsToShow[0]) && this.slider.scrollLeft === 0) {
		this.prevButton.setAttribute('disabled', 'disabled');
	  } else {
		this.prevButton.removeAttribute('disabled');
	  }
  
	  if (this.isSlideVisible(this.sliderItemsToShow[this.sliderItemsToShow.length - 1])) {
		this.nextButton.setAttribute('disabled', 'disabled');
	  } else {
		this.nextButton.removeAttribute('disabled');
	  }
	}
  
	isSlideVisible(element, offset = 0) {
	  const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
	  return (element.offsetLeft + element.clientWidth) <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
	}
  
	onButtonClick(event) {
	  event.preventDefault();
	  const step = event.currentTarget.dataset.step || 1;
	  this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + (step * this.sliderItemOffset) : this.slider.scrollLeft - (step * this.sliderItemOffset);
	  this.slider.scrollTo({
		left: this.slideScrollPosition
	  });
	}
  }
  
  customElements.define('slider-component', SliderComponent);
  
  class SlideshowComponent extends SliderComponent {
	constructor() {
	  super();
	  this.sliderControlWrapper = this.querySelector('.slider-buttons');
	  this.enableSliderLooping = true;
  
	  if (!this.sliderControlWrapper) return;
  
	  this.sliderFirstItemNode = this.slider.querySelector('.slideshow__slide');
	  if (this.sliderItemsToShow.length > 0) this.currentPage = 1;
  
	  this.sliderControlLinksArray = Array.from(this.sliderControlWrapper.querySelectorAll('.slider-counter__link'));
	  this.sliderControlLinksArray.forEach(link => link.addEventListener('click', this.linkToSlide.bind(this)));
	  this.slider.addEventListener('scroll', this.setSlideVisibility.bind(this));
	  this.setSlideVisibility();
  
	  if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
	}
  
	setAutoPlay() {
	  this.sliderAutoplayButton = this.querySelector('.slideshow__autoplay');
	  this.autoplaySpeed = this.slider.dataset.speed * 1000;
  
	  this.sliderAutoplayButton.addEventListener('click', this.autoPlayToggle.bind(this));
	  this.addEventListener('mouseover', this.focusInHandling.bind(this));
	  this.addEventListener('mouseleave', this.focusOutHandling.bind(this));
	  this.addEventListener('focusin', this.focusInHandling.bind(this));
	  this.addEventListener('focusout', this.focusOutHandling.bind(this));
  
	  this.play();
	  this.autoplayButtonIsSetToPlay = true;
	}
  
	onButtonClick(event) {
	  super.onButtonClick(event);
	  const isFirstSlide = this.currentPage === 1;
	  const isLastSlide = this.currentPage === this.sliderItemsToShow.length;
  
	  if (!isFirstSlide && !isLastSlide) return;
  
	  if (isFirstSlide && event.currentTarget.name === 'previous') {
		this.slideScrollPosition = this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
	  } else if (isLastSlide && event.currentTarget.name === 'next') {
		this.slideScrollPosition = 0;
	  }
	  this.slider.scrollTo({
		left: this.slideScrollPosition
	  });
	}
  
	update() {
	  super.update();
	  this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
	  this.prevButton.removeAttribute('disabled');
  
	  if (!this.sliderControlButtons.length) return;
  
	  this.sliderControlButtons.forEach(link => {
		link.classList.remove('slider-counter__link--active');
		link.removeAttribute('aria-current');
	  });
	  this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
	  this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
	}
  
	autoPlayToggle() {
	  this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
	  this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
	  this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
	}
  
	focusOutHandling(event) {
	  const focusedOnAutoplayButton = event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
	  if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
	  this.play();
	}
  
	focusInHandling(event) {
	  const focusedOnAutoplayButton = event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
	  if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
		this.play();
	  } else if (this.autoplayButtonIsSetToPlay) {
		this.pause();
	  }
	}
  
	play() {
	  this.slider.setAttribute('aria-live', 'off');
	  clearInterval(this.autoplay);
	  this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
	}
  
	pause() {
	  this.slider.setAttribute('aria-live', 'polite');
	  clearInterval(this.autoplay);
	}
  
	togglePlayButtonState(pauseAutoplay) {
	  if (pauseAutoplay) {
		this.sliderAutoplayButton.classList.add('slideshow__autoplay--paused');
		this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.playSlideshow);
	  } else {
		this.sliderAutoplayButton.classList.remove('slideshow__autoplay--paused');
		this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.pauseSlideshow);
	  }
	}
  
	autoRotateSlides() {
	  const slideScrollPosition = this.currentPage === this.sliderItems.length ? 0 : this.slider.scrollLeft + this.slider.querySelector('.slideshow__slide').clientWidth;
	  this.slider.scrollTo({
		left: slideScrollPosition
	  });
	}
  
	setSlideVisibility() {
	  this.sliderItemsToShow.forEach((item, index) => {
		const button = item.querySelector('a');
		if (index === this.currentPage - 1) {
		  if (button) button.removeAttribute('tabindex');
		  item.setAttribute('aria-hidden', 'false');
		  item.removeAttribute('tabindex');
		} else {
		  if (button) button.setAttribute('tabindex', '-1');
		  item.setAttribute('aria-hidden', 'true');
		  item.setAttribute('tabindex', '-1');
		}
	  });
	}
  
	linkToSlide(event) {
	  event.preventDefault();
	  const slideScrollPosition = this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * (this.sliderControlLinksArray.indexOf(event.currentTarget) + 1 - this.currentPage);
	  this.slider.scrollTo({
		left: slideScrollPosition
	  });
	}
  }
  
  customElements.define('slideshow-component', SlideshowComponent);
  