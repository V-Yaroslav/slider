const sliderClassName = 'sl-slider';
const sliderWrapperClassName = 'sl-slider-items';
const sliderItemClassName = 'sl-slider-item';
const sliderItemActiveClassName = 'sl-slider-item-active';
const sliderLeftClassName = 'sl-slider-left';
const sliderRightClassName = 'sl-slider-right';
const sliderDotsClassName = 'sl-slider-dots';
const sliderDotClassName = 'sl-slider-dot';
const sliderDotActiveClassName = 'sl-slider-dot-active';


class Slider {
    constructor(slider, options = {}){
        this.slider = slider;
        this.count = slider.childElementCount;
        this.currentSlide = 0;

        this.x1 = null;

        this.settings = {
            autoplaySpeed: options.autoplaySpeed || 8000
        };

        this.createHTML = this.createHTML.bind(this);
        this.setEvents = this.setEvents.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.stopDrag = this.stopDrag.bind(this);

        this.clickDots = this.clickDots.bind(this);
        this.clickLeft = this.clickLeft.bind(this);
        this.clickRight = this.clickRight.bind(this);
        this.changeActiveSlide = this.changeActiveSlide.bind(this);
        this.changeActiveDotClass = this.changeActiveDotClass.bind(this);

        this.createHTML();
        this.setEvents();

        this.timer = setInterval(this.clickRight, this.settings.autoplaySpeed);
    }

    createHTML(){
        this.slider.classList.add(sliderClassName);
        this.slider.innerHTML = `
            <div class="${sliderWrapperClassName}">
                ${this.slider.innerHTML}
            </div>
            <div>
                <button class="${sliderLeftClassName}">
                    Left
                </button>
                <button class="${sliderRightClassName}">
                    Right
                </button>
            </div>
            <div class="${sliderDotsClassName}"></div>
        `;

        this.sliderWrapper = this.slider.querySelector(`.${sliderWrapperClassName}`);
        this.dotsContainer = this.slider.querySelector(`.${sliderDotsClassName}`);

        const height = this.sliderWrapper.children[0].offsetHeight
        this.sliderWrapper.style.height = `${height}px`;
        
        this.sliderItems = Array.from(this.sliderWrapper.children).map((sliderItem) => 
            wrapElementByDiv({
                element: sliderItem,
                className: sliderItemClassName
            })
        );
        this.sliderItems[this.currentSlide].classList.add(sliderItemActiveClassName);

        this.dotsContainer.innerHTML = Array.from( Array(this.count).keys() ).map((key) => (
            `<button class="${sliderDotClassName} ${key === this.currentSlide ?
                sliderDotActiveClassName : ''}">
            </button>`
        )).join('');

        this.dots = this.dotsContainer.getElementsByClassName(sliderDotClassName);
        this.left = this.slider.querySelector(`.${sliderLeftClassName}`);
        this.right = this.slider.querySelector(`.${sliderRightClassName}`);
    }

    setEvents() {
        this.sliderWrapper.addEventListener('pointerdown', this.startDrag);
        window.addEventListener('pointerup', this.stopDrag);
        window.addEventListener('pointercancel', this.stopDrag);

        this.dotsContainer.addEventListener('click', this.clickDots);
        this.left.addEventListener('click', this.clickLeft);
        this.right.addEventListener('click', this.clickRight);
    }

    destroyEvents() {
        this.sliderWrapper.removeEventListener('pointerdown', this.startDrag);
        window.removeEventListener('pointerup', this.stopDrag);
        window.removeEventListener('pointercancel', this.stopDrag);

        this.dotsContainer.removeEventListener('click', this.clickDots);
        this.left.removeEventListener('click', this.clickLeft);
        this.right.removeEventListener('click', this.clickRight);
    }

    startDrag(e) {
        clearInterval(this.timer);

        this.x1 = e.pageX;
    }

    stopDrag(e) {
        if (!this.x1 || e.pageX === 0){
            return false;
        }

        let x2 = e.pageX;

        if (x2 - this.x1 > 60) {
            this.clickLeft();
        }

        if (x2 - this.x1 < -60) {
            this.clickRight();
        }
        this.x1 = null;
    }

    changeActiveSlide() {
        clearInterval(this.timer);

        this.sliderItems[this.currentSlide].classList.add(sliderItemActiveClassName);

        this.changeActiveDotClass();

        this.timer = setInterval(this.clickRight, this.settings.autoplaySpeed);
    }

    clickDots(e) {
        const dot = e.target.closest('button');
        if (!dot) {
            return;
        }

        let dotNumber;
        for(let i = 0; i < this.dots.length; i++){
            if(this.dots[i] === dot) {
                dotNumber = i;
                break;
            }
        }

        if (dotNumber === this.currentSlide) {
            return;
        }

        this.sliderItems[this.currentSlide].classList.remove(sliderItemActiveClassName);
        this.currentSlide = dotNumber;
        this.changeActiveSlide();
    }

    clickLeft() {
        this.sliderItems[this.currentSlide].classList.remove(sliderItemActiveClassName);
        this.currentSlide = (this.currentSlide <= 0) ? (this.count - 1) : --this.currentSlide;
        this.changeActiveSlide();
    }
    clickRight() {
        this.sliderItems[this.currentSlide].classList.remove(sliderItemActiveClassName);
        this.currentSlide = (this.currentSlide >= this.count - 1) ? 0 : ++this.currentSlide;
        this.changeActiveSlide();
    }

    changeActiveDotClass() {
        for(let i = 0; i < this.dots.length; i++) {
            this.dots[i].classList.remove(sliderDotActiveClassName);
        }
        this.dots[this.currentSlide].classList.add(sliderDotActiveClassName);
    }
}


function wrapElementByDiv({element, className}){
    const wrapper = document.createElement('div');
    wrapper.classList.add(className);

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    return wrapper;
}