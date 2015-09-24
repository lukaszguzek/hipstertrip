$(document).ready(function () {
    var arrowPrev = document.getElementsByClassName('slider__arrow--prev')[0];
    var arrowNext = document.getElementsByClassName('slider__arrow--next')[0];

    $('.slides-container').slick({
        autoplay: true,
        slidesToShow: 1,
        arrows: true,
        slidesToScroll: 1,
        dots: true,
        prevArrow: arrowPrev,
        nextArrow: arrowNext,
        mobileFirst: true,
        responsive: [
            {
                breakpoint: 660,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 1030,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    })
});


'use strict';

var contactForm = document.getElementById('contact-form');
contactForm.scrollIntoViewIfNeeded(true);


contactState = {
    formFields: ['name', 'email', 'message'],
    formId: 'contact-form',
    getForm: function () {
        return document.getElementById('contact-form');
    },
    getFormData: function () {
        var form = this.getForm();
        return $(form).serialize();
    },
    send: function () {
        var that = this, data, url;

        if (this.validateForm() > 0) {
            return false;
        }

        txt = this.getFormData();
        url = 'http://camp.efigence.com/camp/api/contact';

        return $.ajax({
            method: 'POST',
            crossDomain: true,
            data: txt,
            url: url
        })
        .done(function (data) {
            contactView.clearForm();
            contactView.showSendSuccess();
        })
        .fail(function (data) {
           that.checkForResponseErrors(data);
            if (that.checkForResponseErrors(data)) {
                that.parseResponseErrors(data);
            } else {
                contactView.showSendError(data.status);
            }
        })
    },
    init: function () {
        this.addListeners();
    },
    addListeners: function () {
        var form = this.getForm(),
        that = this;

        for (var i = 0, l = this.formFields.length; i < l; i++) {
            form[this.formFields[i]].addEventListener('blur', function (e) {
                that.validateField({
                    text: e.target.value,
                    fieldName: e.target.name
                })
            })
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            that.send();
        })
    },
    validateField: function (options) { // {text:, fieldName}
        var form, isValid;

        if (options.fieldName === 'email') {
            isValid = isEmail(options.text);
        } else {
            isValid = isNotEmpty(options.text);
        }

        if (!isValid) {
            contactView.showInvalidMessage(options);
            return false;
        } else {
            contactView.hideInvalidMessage(options);
            return true;
        }

        function isEmail(text) {
            return /[^@]+@[^@]+/.test(text);
        }

        function isNotEmpty(text) {
            if (!isNaN(parseInt(text))) {
                return false;
            } else {
                return text.length > 0;
            }
        }
    },
    validateForm: function () {
        var form = this.getForm(),
        invalidCounter = 0,
        isValid;

        for (var i = 0, l = this.formFields.length; i < l; i++) {
            isValid = this.validateField({
                text: form[this.formFields[i]].value,
                fieldName: this.formFields[i]
            });

            if (!isValid) {
                invalidCounter++;
            };
        };
        return invalidCounter;
    },
    checkForResponseErrors: function (data) {
        if (data.status === 422) {
            var response = JSON.parse(data.responseText);
            return response.hasOwnProperty('errors');
        } else {
            return false;
        }
    },
    parseResponseErrors: function (data) {
        var response = JSON.parse(data.responseText),
        errorsArray = [];
        console.log(response.errors);

        for (var key in response.errors) {
            errorsArray.push({
                fieldName: key,
                errorText: response.errors[key].join(' ')
            });
        };

        for (var i = 0, l = errorsArray.length; i < l; i++) {
            contactView.showInvalidMessage(errorsArray[i]);
        };
    }
};

contactView = {
    errorClass: 'contact__input--error',
    showInvalidMessage: function (options) {
        var query = '[data-field=' + options.fieldName + ']',
        errorElement = document.querySelector(query),
        errorDescriptionElement = errorElement.childNodes[1],
        errorText;

        if (options.fieldName === 'email') {
            errorText = 'Adres email jest nieprawidłowy';
        } else {
            errorText = 'Pole nie może być puste';
        }

        errorText = options.errorText || errorText;

        errorElement.classList.remove('hidden');
        contactForm[options.fieldName].classList.add(this.errorClass);
        errorDescriptionElement.textContent = errorText;
    },
    hideInvalidMessage: function (options) {
        var query = '[data-field=' + options.fieldName + ']',
        errorElement = document.querySelector(query);

        if (errorElement) {
            errorElement.classList.add('hidden');
            contactForm[options.fieldName].classList.remove(this.errorClass);
        }
    },
    showSendSuccess: function () {
        var button, buttonText, successText, successClass;
        button = document.getElementById('contact__send');
        buttonText = button.textContent;
        successText = 'Wiadmość została wysłana';
        successClass = 'contact__send--success';

        button.classList.add(successClass);
        button.textContent = successText;

        setTimeout(function () {
            button.classList.remove(successClass);
            button.textContent = buttonText;
        }, 3000)
    },
    showSendError: function (statusCode) {
        var that, button, buttonText, buttonTextError, errorClass, errorMessage, errorCode;

        that = this;
        button = document.getElementById('contact__send');
        buttonText = button.textContent;
        buttonTextError = 'Błąd!';
        errorClass = 'contact__send--error';
        errorCode = document.getElementById('error-text__code');
        errorMessage = document.getElementsByClassName('contact__error-description')[0];

        button.classList.add(errorClass);
        button.textContent = buttonTextError;
        errorCode.textContent = statusCode;
        errorMessage.classList.remove('hidden');

        setTimeout(function () {
            button.classList.remove(errorClass);
            button.textContent = buttonText;
            errorCode.textContent = '';
            errorMessage.classList.add('hidden');
            that.clearForm();
        }, 5000)
    },
    clearForm: function () {
        var form = contactState.getForm(),
        fields = contactState.formFields;

        for (var i = 0, l = fields.length; i < l; i++) {
            form[fields[i]].value = '';
        }
    }
};



contactState.init();

window.onload = function () {
    var coordinates = {lat: 52.230415, lng: 20.997336},
    map = new google.maps.LatLng(coordinates.lat, coordinates.lng),
    mapOptions = {
        zoom: 16,
        streetViewControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: map
    },
    mapContainer = document.getElementsByClassName('google-map')[0],
    backgroundMap = new google.maps.Map(mapContainer, mapOptions);
};

(function () {
    var btn = document.querySelector('.hamburger-button'),
    mainMenu = document.querySelector('.main-menu'),
    collapseClass = 'main-menu--collapsed',
    animationExpand = 'animated--scaleIn';
    animationCollapse = 'animated--scaleOut',
    animationDelay = 300;

    btn.addEventListener('click', function () {
        if (mainMenu.classList.contains(collapseClass)) {
            mainMenu.classList.toggle(collapseClass);
            mainMenu.classList.toggle(animationExpand);
        } else {
            mainMenu.classList.toggle(animationExpand);
            mainMenu.classList.toggle(animationCollapse);
            setTimeout(function () {
                mainMenu.classList.toggle(collapseClass);
                mainMenu.classList.toggle(animationCollapse);
            }, animationDelay);
        }
        btn.classList.toggle('fa-bars');
        btn.classList.toggle('fa-times');
    })
})();

(function () {
    'use strict';
    var headerVideo = document.getElementById('header-video'),
    format = 'video/mp4',
    playButton = document.getElementsByClassName('controls__play')[0],
    pauseButton = document.getElementsByClassName('controls__pause--light')[0],
    playingNow = false;

    if (canPlayTest(headerVideo, format)) {
        loadHeaderVideo();
    } else {
        loadVideoAltImage();
    }

    function canPlayTest(videoClip, format) {
        return videoClip.canPlayType(format).length > 0 || false;
    }

    function tryToPlay() {
        headerVideo.addEventListener('error', function () {
            loadVideoAltImage();
        });
        headerVideo.play();
        headerVideo.pause();
    }

    function loadHeaderVideo() {
        var headerVideoUrl = './video/video.mp4#t=1';

        headerVideo.src = headerVideoUrl;
        headerVideo.load();
        tryToPlay();
    }

    function loadVideoAltImage() {
        var videoAltImage = document.getElementById('video-alt-img'),
        videoAltImageSrc = './img/video-img.jpg';

        playButton.classList.add('hidden');
        videoAltImage.src = videoAltImageSrc;
        headerVideo.classList.add('hidden');
        videoAltImage.classList.remove('hidden');
    }

    function toggleControls() {
        var controls = document.getElementsByClassName('controls__content')[0];
        controls.classList.toggle('hidden');
        pauseButton.classList.toggle('hidden');
    }

    function togglePlay() {
        if (playingNow) {
            headerVideo.pause();
            playingNow = false;
        } else {
            headerVideo.play();
            playingNow = true;
        }
    }

    headerVideo.addEventListener('playing', function () {
        playingNow = true;
    });


    playButton.addEventListener('click', function () {
        toggleControls();
        togglePlay();
    });

    pauseButton.addEventListener('click', function () {
        toggleControls();
        togglePlay();
    });
})();




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2VsLmpzIiwiY29udGFjdC5qcyIsImdvb2dsZS1tYXBzLWJhY2tncm91bnMuanMiLCJ0b29nbGUtbWVudS5qcyIsInZpZGVvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyb3dQcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnc2xpZGVyX19hcnJvdy0tcHJldicpWzBdO1xuICAgIHZhciBhcnJvd05leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzbGlkZXJfX2Fycm93LS1uZXh0JylbMF07XG5cbiAgICAkKCcuc2xpZGVzLWNvbnRhaW5lcicpLnNsaWNrKHtcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMSxcbiAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgcHJldkFycm93OiBhcnJvd1ByZXYsXG4gICAgICAgIG5leHRBcnJvdzogYXJyb3dOZXh0LFxuICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDY2MCxcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiAxMDMwLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KVxufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNvbnRhY3RGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtZm9ybScpO1xuY29udGFjdEZvcm0uc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCh0cnVlKTtcblxuXG5jb250YWN0U3RhdGUgPSB7XG4gICAgZm9ybUZpZWxkczogWyduYW1lJywgJ2VtYWlsJywgJ21lc3NhZ2UnXSxcbiAgICBmb3JtSWQ6ICdjb250YWN0LWZvcm0nLFxuICAgIGdldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWZvcm0nKTtcbiAgICB9LFxuICAgIGdldEZvcm1EYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5nZXRGb3JtKCk7XG4gICAgICAgIHJldHVybiAkKGZvcm0pLnNlcmlhbGl6ZSgpO1xuICAgIH0sXG4gICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGRhdGEsIHVybDtcblxuICAgICAgICBpZiAodGhpcy52YWxpZGF0ZUZvcm0oKSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR4dCA9IHRoaXMuZ2V0Rm9ybURhdGEoKTtcbiAgICAgICAgdXJsID0gJ2h0dHA6Ly9jYW1wLmVmaWdlbmNlLmNvbS9jYW1wL2FwaS9jb250YWN0JztcblxuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICBkYXRhOiB0eHQsXG4gICAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29udGFjdFZpZXcuY2xlYXJGb3JtKCk7XG4gICAgICAgICAgICBjb250YWN0Vmlldy5zaG93U2VuZFN1Y2Nlc3MoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgdGhhdC5jaGVja0ZvclJlc3BvbnNlRXJyb3JzKGRhdGEpO1xuICAgICAgICAgICAgaWYgKHRoYXQuY2hlY2tGb3JSZXNwb25zZUVycm9ycyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoYXQucGFyc2VSZXNwb25zZUVycm9ycyhkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGFjdFZpZXcuc2hvd1NlbmRFcnJvcihkYXRhLnN0YXR1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gICAgfSxcbiAgICBhZGRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmdldEZvcm0oKSxcbiAgICAgICAgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZvcm1GaWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmb3JtW3RoaXMuZm9ybUZpZWxkc1tpXV0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC52YWxpZGF0ZUZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZS50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogZS50YXJnZXQubmFtZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuc2VuZCgpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgdmFsaWRhdGVGaWVsZDogZnVuY3Rpb24gKG9wdGlvbnMpIHsgLy8ge3RleHQ6LCBmaWVsZE5hbWV9XG4gICAgICAgIHZhciBmb3JtLCBpc1ZhbGlkO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmZpZWxkTmFtZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGlzRW1haWwob3B0aW9ucy50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBpc05vdEVtcHR5KG9wdGlvbnMudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LnNob3dJbnZhbGlkTWVzc2FnZShvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LmhpZGVJbnZhbGlkTWVzc2FnZShvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNFbWFpbCh0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gL1teQF0rQFteQF0rLy50ZXN0KHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNOb3RFbXB0eSh0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHRleHQpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5nZXRGb3JtKCksXG4gICAgICAgIGludmFsaWRDb3VudGVyID0gMCxcbiAgICAgICAgaXNWYWxpZDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZm9ybUZpZWxkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSB0aGlzLnZhbGlkYXRlRmllbGQoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGZvcm1bdGhpcy5mb3JtRmllbGRzW2ldXS52YWx1ZSxcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IHRoaXMuZm9ybUZpZWxkc1tpXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGludmFsaWRDb3VudGVyKys7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaW52YWxpZENvdW50ZXI7XG4gICAgfSxcbiAgICBjaGVja0ZvclJlc3BvbnNlRXJyb3JzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZShkYXRhLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9ycycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwYXJzZVJlc3BvbnNlRXJyb3JzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGRhdGEucmVzcG9uc2VUZXh0KSxcbiAgICAgICAgZXJyb3JzQXJyYXkgPSBbXTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZXJyb3JzKTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcbiAgICAgICAgICAgICAgICBlcnJvclRleHQ6IHJlc3BvbnNlLmVycm9yc1trZXldLmpvaW4oJyAnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBlcnJvcnNBcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LnNob3dJbnZhbGlkTWVzc2FnZShlcnJvcnNBcnJheVtpXSk7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuY29udGFjdFZpZXcgPSB7XG4gICAgZXJyb3JDbGFzczogJ2NvbnRhY3RfX2lucHV0LS1lcnJvcicsXG4gICAgc2hvd0ludmFsaWRNZXNzYWdlOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgcXVlcnkgPSAnW2RhdGEtZmllbGQ9JyArIG9wdGlvbnMuZmllbGROYW1lICsgJ10nLFxuICAgICAgICBlcnJvckVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSxcbiAgICAgICAgZXJyb3JEZXNjcmlwdGlvbkVsZW1lbnQgPSBlcnJvckVsZW1lbnQuY2hpbGROb2Rlc1sxXSxcbiAgICAgICAgZXJyb3JUZXh0O1xuXG4gICAgICAgIGlmIChvcHRpb25zLmZpZWxkTmFtZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gJ0FkcmVzIGVtYWlsIGplc3QgbmllcHJhd2lkxYJvd3knO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gJ1BvbGUgbmllIG1vxbxlIGJ5xIcgcHVzdGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3JUZXh0ID0gb3B0aW9ucy5lcnJvclRleHQgfHwgZXJyb3JUZXh0O1xuXG4gICAgICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgY29udGFjdEZvcm1bb3B0aW9ucy5maWVsZE5hbWVdLmNsYXNzTGlzdC5hZGQodGhpcy5lcnJvckNsYXNzKTtcbiAgICAgICAgZXJyb3JEZXNjcmlwdGlvbkVsZW1lbnQudGV4dENvbnRlbnQgPSBlcnJvclRleHQ7XG4gICAgfSxcbiAgICBoaWRlSW52YWxpZE1lc3NhZ2U6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdbZGF0YS1maWVsZD0nICsgb3B0aW9ucy5maWVsZE5hbWUgKyAnXScsXG4gICAgICAgIGVycm9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuXG4gICAgICAgIGlmIChlcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGNvbnRhY3RGb3JtW29wdGlvbnMuZmllbGROYW1lXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuZXJyb3JDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob3dTZW5kU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYnV0dG9uLCBidXR0b25UZXh0LCBzdWNjZXNzVGV4dCwgc3VjY2Vzc0NsYXNzO1xuICAgICAgICBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdF9fc2VuZCcpO1xuICAgICAgICBidXR0b25UZXh0ID0gYnV0dG9uLnRleHRDb250ZW50O1xuICAgICAgICBzdWNjZXNzVGV4dCA9ICdXaWFkbW/Fm8SHIHpvc3RhxYJhIHd5c8WCYW5hJztcbiAgICAgICAgc3VjY2Vzc0NsYXNzID0gJ2NvbnRhY3RfX3NlbmQtLXN1Y2Nlc3MnO1xuXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKHN1Y2Nlc3NDbGFzcyk7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHN1Y2Nlc3NUZXh0O1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoc3VjY2Vzc0NsYXNzKTtcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHQ7XG4gICAgICAgIH0sIDMwMDApXG4gICAgfSxcbiAgICBzaG93U2VuZEVycm9yOiBmdW5jdGlvbiAoc3RhdHVzQ29kZSkge1xuICAgICAgICB2YXIgdGhhdCwgYnV0dG9uLCBidXR0b25UZXh0LCBidXR0b25UZXh0RXJyb3IsIGVycm9yQ2xhc3MsIGVycm9yTWVzc2FnZSwgZXJyb3JDb2RlO1xuXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuICAgICAgICBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdF9fc2VuZCcpO1xuICAgICAgICBidXR0b25UZXh0ID0gYnV0dG9uLnRleHRDb250ZW50O1xuICAgICAgICBidXR0b25UZXh0RXJyb3IgPSAnQsWCxIVkISc7XG4gICAgICAgIGVycm9yQ2xhc3MgPSAnY29udGFjdF9fc2VuZC0tZXJyb3InO1xuICAgICAgICBlcnJvckNvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3ItdGV4dF9fY29kZScpO1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250YWN0X19lcnJvci1kZXNjcmlwdGlvbicpWzBdO1xuXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGVycm9yQ2xhc3MpO1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBidXR0b25UZXh0RXJyb3I7XG4gICAgICAgIGVycm9yQ29kZS50ZXh0Q29udGVudCA9IHN0YXR1c0NvZGU7XG4gICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKGVycm9yQ2xhc3MpO1xuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcbiAgICAgICAgICAgIGVycm9yQ29kZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhhdC5jbGVhckZvcm0oKTtcbiAgICAgICAgfSwgNTAwMClcbiAgICB9LFxuICAgIGNsZWFyRm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IGNvbnRhY3RTdGF0ZS5nZXRGb3JtKCksXG4gICAgICAgIGZpZWxkcyA9IGNvbnRhY3RTdGF0ZS5mb3JtRmllbGRzO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZm9ybVtmaWVsZHNbaV1dLnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuY29udGFjdFN0YXRlLmluaXQoKTtcbiIsIndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0ge2xhdDogNTIuMjMwNDE1LCBsbmc6IDIwLjk5NzMzNn0sXG4gICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhjb29yZGluYXRlcy5sYXQsIGNvb3JkaW5hdGVzLmxuZyksXG4gICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgem9vbTogMTYsXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuICAgICAgICBjZW50ZXI6IG1hcFxuICAgIH0sXG4gICAgbWFwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ29vZ2xlLW1hcCcpWzBdLFxuICAgIGJhY2tncm91bmRNYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcENvbnRhaW5lciwgbWFwT3B0aW9ucyk7XG59O1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlci1idXR0b24nKSxcbiAgICBtYWluTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW1lbnUnKSxcbiAgICBjb2xsYXBzZUNsYXNzID0gJ21haW4tbWVudS0tY29sbGFwc2VkJyxcbiAgICBhbmltYXRpb25FeHBhbmQgPSAnYW5pbWF0ZWQtLXNjYWxlSW4nO1xuICAgIGFuaW1hdGlvbkNvbGxhcHNlID0gJ2FuaW1hdGVkLS1zY2FsZU91dCcsXG4gICAgYW5pbWF0aW9uRGVsYXkgPSAzMDA7XG5cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChtYWluTWVudS5jbGFzc0xpc3QuY29udGFpbnMoY29sbGFwc2VDbGFzcykpIHtcbiAgICAgICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoY29sbGFwc2VDbGFzcyk7XG4gICAgICAgICAgICBtYWluTWVudS5jbGFzc0xpc3QudG9nZ2xlKGFuaW1hdGlvbkV4cGFuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWluTWVudS5jbGFzc0xpc3QudG9nZ2xlKGFuaW1hdGlvbkV4cGFuZCk7XG4gICAgICAgICAgICBtYWluTWVudS5jbGFzc0xpc3QudG9nZ2xlKGFuaW1hdGlvbkNvbGxhcHNlKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoY29sbGFwc2VDbGFzcyk7XG4gICAgICAgICAgICAgICAgbWFpbk1lbnUuY2xhc3NMaXN0LnRvZ2dsZShhbmltYXRpb25Db2xsYXBzZSk7XG4gICAgICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2ZhLWJhcnMnKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2ZhLXRpbWVzJyk7XG4gICAgfSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgaGVhZGVyVmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXZpZGVvJyksXG4gICAgZm9ybWF0ID0gJ3ZpZGVvL21wNCcsXG4gICAgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19wbGF5JylbMF0sXG4gICAgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fcGF1c2UtLWxpZ2h0JylbMF0sXG4gICAgcGxheWluZ05vdyA9IGZhbHNlO1xuXG4gICAgaWYgKGNhblBsYXlUZXN0KGhlYWRlclZpZGVvLCBmb3JtYXQpKSB7XG4gICAgICAgIGxvYWRIZWFkZXJWaWRlbygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRWaWRlb0FsdEltYWdlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuUGxheVRlc3QodmlkZW9DbGlwLCBmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvQ2xpcC5jYW5QbGF5VHlwZShmb3JtYXQpLmxlbmd0aCA+IDAgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJ5VG9QbGF5KCkge1xuICAgICAgICBoZWFkZXJWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvYWRWaWRlb0FsdEltYWdlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBoZWFkZXJWaWRlby5wbGF5KCk7XG4gICAgICAgIGhlYWRlclZpZGVvLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZEhlYWRlclZpZGVvKCkge1xuICAgICAgICB2YXIgaGVhZGVyVmlkZW9VcmwgPSAnLi92aWRlby92aWRlby5tcDQjdD0xJztcblxuICAgICAgICBoZWFkZXJWaWRlby5zcmMgPSBoZWFkZXJWaWRlb1VybDtcbiAgICAgICAgaGVhZGVyVmlkZW8ubG9hZCgpO1xuICAgICAgICB0cnlUb1BsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkVmlkZW9BbHRJbWFnZSgpIHtcbiAgICAgICAgdmFyIHZpZGVvQWx0SW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tYWx0LWltZycpLFxuICAgICAgICB2aWRlb0FsdEltYWdlU3JjID0gJy4vaW1nL3ZpZGVvLWltZy5qcGcnO1xuXG4gICAgICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHZpZGVvQWx0SW1hZ2Uuc3JjID0gdmlkZW9BbHRJbWFnZVNyYztcbiAgICAgICAgaGVhZGVyVmlkZW8uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHZpZGVvQWx0SW1hZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlQ29udHJvbHMoKSB7XG4gICAgICAgIHZhciBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19jb250ZW50JylbMF07XG4gICAgICAgIGNvbnRyb2xzLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVQbGF5KCkge1xuICAgICAgICBpZiAocGxheWluZ05vdykge1xuICAgICAgICAgICAgaGVhZGVyVmlkZW8ucGF1c2UoKTtcbiAgICAgICAgICAgIHBsYXlpbmdOb3cgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlclZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIHBsYXlpbmdOb3cgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGVhZGVyVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcGxheWluZ05vdyA9IHRydWU7XG4gICAgfSk7XG5cblxuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZUNvbnRyb2xzKCk7XG4gICAgICAgIHRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcblxuICAgIHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGVDb250cm9scygpO1xuICAgICAgICB0b2dnbGVQbGF5KCk7XG4gICAgfSk7XG59KSgpO1xuXG5cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9