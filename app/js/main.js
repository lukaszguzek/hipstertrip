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


'use strinct';

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
                console.log(data);
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
    className = 'main-menu--collapsed';

    btn.addEventListener('click', function () {
        mainMenu.classList.toggle(className);
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




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2VsLmpzIiwiY29udGFjdC5qcyIsImdvb2dsZS1tYXBzLWJhY2tncm91bnMuanMiLCJ0b29nbGUtbWVudS5qcyIsInZpZGVvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJvd1ByZXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzbGlkZXJfX2Fycm93LS1wcmV2JylbMF07XG4gICAgdmFyIGFycm93TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NsaWRlcl9fYXJyb3ctLW5leHQnKVswXTtcblxuICAgICQoJy5zbGlkZXMtY29udGFpbmVyJykuc2xpY2soe1xuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICBwcmV2QXJyb3c6IGFycm93UHJldixcbiAgICAgICAgbmV4dEFycm93OiBhcnJvd05leHQsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjYwLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMzAsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG59KTtcblxuIiwiJ3VzZSBzdHJpbmN0JztcblxudmFyIGNvbnRhY3RGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtZm9ybScpO1xuY29udGFjdEZvcm0uc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCh0cnVlKTtcblxuXG5jb250YWN0U3RhdGUgPSB7XG4gICAgZm9ybUZpZWxkczogWyduYW1lJywgJ2VtYWlsJywgJ21lc3NhZ2UnXSxcbiAgICBmb3JtSWQ6ICdjb250YWN0LWZvcm0nLFxuICAgIGdldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0LWZvcm0nKTtcbiAgICB9LFxuICAgIGdldEZvcm1EYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5nZXRGb3JtKCk7XG4gICAgICAgIHJldHVybiAkKGZvcm0pLnNlcmlhbGl6ZSgpO1xuICAgIH0sXG4gICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGRhdGEsIHVybDtcblxuICAgICAgICBpZiAodGhpcy52YWxpZGF0ZUZvcm0oKSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR4dCA9IHRoaXMuZ2V0Rm9ybURhdGEoKTtcbiAgICAgICAgdXJsID0gJ2h0dHA6Ly9jYW1wLmVmaWdlbmNlLmNvbS9jYW1wL2FwaS9jb250YWN0JztcblxuICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICBkYXRhOiB0eHQsXG4gICAgICAgICAgICB1cmw6IHVybFxuICAgICAgICB9KVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29udGFjdFZpZXcuY2xlYXJGb3JtKCk7XG4gICAgICAgICAgICBjb250YWN0Vmlldy5zaG93U2VuZFN1Y2Nlc3MoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgdGhhdC5jaGVja0ZvclJlc3BvbnNlRXJyb3JzKGRhdGEpO1xuICAgICAgICAgICAgaWYgKHRoYXQuY2hlY2tGb3JSZXNwb25zZUVycm9ycyhkYXRhKSkge1xuICAgICAgICAgICAgICAgIHRoYXQucGFyc2VSZXNwb25zZUVycm9ycyhkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgY29udGFjdFZpZXcuc2hvd1NlbmRFcnJvcihkYXRhLnN0YXR1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gICAgfSxcbiAgICBhZGRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmdldEZvcm0oKSxcbiAgICAgICAgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmZvcm1GaWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmb3JtW3RoaXMuZm9ybUZpZWxkc1tpXV0uYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdGhhdC52YWxpZGF0ZUZpZWxkKHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZS50YXJnZXQudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogZS50YXJnZXQubmFtZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuc2VuZCgpO1xuICAgICAgICB9KVxuICAgIH0sXG4gICAgdmFsaWRhdGVGaWVsZDogZnVuY3Rpb24gKG9wdGlvbnMpIHsgLy8ge3RleHQ6LCBmaWVsZE5hbWV9XG4gICAgICAgIHZhciBmb3JtLCBpc1ZhbGlkO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmZpZWxkTmFtZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGlzRW1haWwob3B0aW9ucy50ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSBpc05vdEVtcHR5KG9wdGlvbnMudGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWQpIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LnNob3dJbnZhbGlkTWVzc2FnZShvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LmhpZGVJbnZhbGlkTWVzc2FnZShvcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNFbWFpbCh0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gL1teQF0rQFteQF0rLy50ZXN0KHRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNOb3RFbXB0eSh0ZXh0KSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHRleHQpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHQubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGVGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb3JtID0gdGhpcy5nZXRGb3JtKCksXG4gICAgICAgIGludmFsaWRDb3VudGVyID0gMCxcbiAgICAgICAgaXNWYWxpZDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZm9ybUZpZWxkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlzVmFsaWQgPSB0aGlzLnZhbGlkYXRlRmllbGQoe1xuICAgICAgICAgICAgICAgIHRleHQ6IGZvcm1bdGhpcy5mb3JtRmllbGRzW2ldXS52YWx1ZSxcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IHRoaXMuZm9ybUZpZWxkc1tpXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGludmFsaWRDb3VudGVyKys7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaW52YWxpZENvdW50ZXI7XG4gICAgfSxcbiAgICBjaGVja0ZvclJlc3BvbnNlRXJyb3JzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09IDQyMikge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gSlNPTi5wYXJzZShkYXRhLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ2Vycm9ycycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwYXJzZVJlc3BvbnNlRXJyb3JzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGRhdGEucmVzcG9uc2VUZXh0KSxcbiAgICAgICAgZXJyb3JzQXJyYXkgPSBbXTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZXJyb3JzKTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzcG9uc2UuZXJyb3JzKSB7XG4gICAgICAgICAgICBlcnJvcnNBcnJheS5wdXNoKHtcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcbiAgICAgICAgICAgICAgICBlcnJvclRleHQ6IHJlc3BvbnNlLmVycm9yc1trZXldLmpvaW4oJyAnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBlcnJvcnNBcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LnNob3dJbnZhbGlkTWVzc2FnZShlcnJvcnNBcnJheVtpXSk7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuY29udGFjdFZpZXcgPSB7XG4gICAgZXJyb3JDbGFzczogJ2NvbnRhY3RfX2lucHV0LS1lcnJvcicsXG4gICAgc2hvd0ludmFsaWRNZXNzYWdlOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgcXVlcnkgPSAnW2RhdGEtZmllbGQ9JyArIG9wdGlvbnMuZmllbGROYW1lICsgJ10nLFxuICAgICAgICBlcnJvckVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSxcbiAgICAgICAgZXJyb3JEZXNjcmlwdGlvbkVsZW1lbnQgPSBlcnJvckVsZW1lbnQuY2hpbGROb2Rlc1sxXSxcbiAgICAgICAgZXJyb3JUZXh0O1xuXG4gICAgICAgIGlmIChvcHRpb25zLmZpZWxkTmFtZSA9PT0gJ2VtYWlsJykge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gJ0FkcmVzIGVtYWlsIGplc3QgbmllcHJhd2lkxYJvd3knO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXJyb3JUZXh0ID0gJ1BvbGUgbmllIG1vxbxlIGJ5xIcgcHVzdGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgZXJyb3JUZXh0ID0gb3B0aW9ucy5lcnJvclRleHQgfHwgZXJyb3JUZXh0O1xuXG4gICAgICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgY29udGFjdEZvcm1bb3B0aW9ucy5maWVsZE5hbWVdLmNsYXNzTGlzdC5hZGQodGhpcy5lcnJvckNsYXNzKTtcbiAgICAgICAgZXJyb3JEZXNjcmlwdGlvbkVsZW1lbnQudGV4dENvbnRlbnQgPSBlcnJvclRleHQ7XG4gICAgfSxcbiAgICBoaWRlSW52YWxpZE1lc3NhZ2U6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdbZGF0YS1maWVsZD0nICsgb3B0aW9ucy5maWVsZE5hbWUgKyAnXScsXG4gICAgICAgIGVycm9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpO1xuXG4gICAgICAgIGlmIChlcnJvckVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGNvbnRhY3RGb3JtW29wdGlvbnMuZmllbGROYW1lXS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuZXJyb3JDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNob3dTZW5kU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYnV0dG9uLCBidXR0b25UZXh0LCBzdWNjZXNzVGV4dCwgc3VjY2Vzc0NsYXNzO1xuICAgICAgICBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdF9fc2VuZCcpO1xuICAgICAgICBidXR0b25UZXh0ID0gYnV0dG9uLnRleHRDb250ZW50O1xuICAgICAgICBzdWNjZXNzVGV4dCA9ICdXaWFkbW/Fm8SHIHpvc3RhxYJhIHd5c8WCYW5hJztcbiAgICAgICAgc3VjY2Vzc0NsYXNzID0gJ2NvbnRhY3RfX3NlbmQtLXN1Y2Nlc3MnO1xuXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKHN1Y2Nlc3NDbGFzcyk7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHN1Y2Nlc3NUZXh0O1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoc3VjY2Vzc0NsYXNzKTtcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHQ7XG4gICAgICAgIH0sIDMwMDApXG4gICAgfSxcbiAgICBzaG93U2VuZEVycm9yOiBmdW5jdGlvbiAoc3RhdHVzQ29kZSkge1xuICAgICAgICB2YXIgdGhhdCwgYnV0dG9uLCBidXR0b25UZXh0LCBidXR0b25UZXh0RXJyb3IsIGVycm9yQ2xhc3MsIGVycm9yTWVzc2FnZSwgZXJyb3JDb2RlO1xuXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuICAgICAgICBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdF9fc2VuZCcpO1xuICAgICAgICBidXR0b25UZXh0ID0gYnV0dG9uLnRleHRDb250ZW50O1xuICAgICAgICBidXR0b25UZXh0RXJyb3IgPSAnQsWCxIVkISc7XG4gICAgICAgIGVycm9yQ2xhc3MgPSAnY29udGFjdF9fc2VuZC0tZXJyb3InO1xuICAgICAgICBlcnJvckNvZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3ItdGV4dF9fY29kZScpO1xuICAgICAgICBlcnJvck1lc3NhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250YWN0X19lcnJvci1kZXNjcmlwdGlvbicpWzBdO1xuXG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGVycm9yQ2xhc3MpO1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBidXR0b25UZXh0RXJyb3I7XG4gICAgICAgIGVycm9yQ29kZS50ZXh0Q29udGVudCA9IHN0YXR1c0NvZGU7XG4gICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKGVycm9yQ2xhc3MpO1xuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcbiAgICAgICAgICAgIGVycm9yQ29kZS50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhhdC5jbGVhckZvcm0oKTtcbiAgICAgICAgfSwgNTAwMClcbiAgICB9LFxuICAgIGNsZWFyRm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IGNvbnRhY3RTdGF0ZS5nZXRGb3JtKCksXG4gICAgICAgIGZpZWxkcyA9IGNvbnRhY3RTdGF0ZS5mb3JtRmllbGRzO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgZm9ybVtmaWVsZHNbaV1dLnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuY29udGFjdFN0YXRlLmluaXQoKTtcbiIsIndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvb3JkaW5hdGVzID0ge2xhdDogNTIuMjMwNDE1LCBsbmc6IDIwLjk5NzMzNn0sXG4gICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhjb29yZGluYXRlcy5sYXQsIGNvb3JkaW5hdGVzLmxuZyksXG4gICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgem9vbTogMTYsXG4gICAgICAgIHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcbiAgICAgICAgc2NhbGVDb250cm9sOiB0cnVlLFxuICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuICAgICAgICBjZW50ZXI6IG1hcFxuICAgIH0sXG4gICAgbWFwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ29vZ2xlLW1hcCcpWzBdLFxuICAgIGJhY2tncm91bmRNYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcENvbnRhaW5lciwgbWFwT3B0aW9ucyk7XG59O1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhhbWJ1cmdlci1idXR0b24nKSxcbiAgICBtYWluTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLW1lbnUnKSxcbiAgICBjbGFzc05hbWUgPSAnbWFpbi1tZW51LS1jb2xsYXBzZWQnO1xuXG4gICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBtYWluTWVudS5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdmYS1iYXJzJyk7XG4gICAgICAgIGJ0bi5jbGFzc0xpc3QudG9nZ2xlKCdmYS10aW1lcycpO1xuICAgIH0pXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGhlYWRlclZpZGVvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlYWRlci12aWRlbycpLFxuICAgIGZvcm1hdCA9ICd2aWRlby9tcDQnLFxuICAgIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fcGxheScpWzBdLFxuICAgIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX3BhdXNlLS1saWdodCcpWzBdLFxuICAgIHBsYXlpbmdOb3cgPSBmYWxzZTtcblxuICAgIGlmIChjYW5QbGF5VGVzdChoZWFkZXJWaWRlbywgZm9ybWF0KSkge1xuICAgICAgICBsb2FkSGVhZGVyVmlkZW8oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkVmlkZW9BbHRJbWFnZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblBsYXlUZXN0KHZpZGVvQ2xpcCwgZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB2aWRlb0NsaXAuY2FuUGxheVR5cGUoZm9ybWF0KS5sZW5ndGggPiAwIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyeVRvUGxheSgpIHtcbiAgICAgICAgaGVhZGVyVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsb2FkVmlkZW9BbHRJbWFnZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaGVhZGVyVmlkZW8ucGxheSgpO1xuICAgICAgICBoZWFkZXJWaWRlby5wYXVzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRIZWFkZXJWaWRlbygpIHtcbiAgICAgICAgdmFyIGhlYWRlclZpZGVvVXJsID0gJy4vdmlkZW8vdmlkZW8ubXA0I3Q9MSc7XG5cbiAgICAgICAgaGVhZGVyVmlkZW8uc3JjID0gaGVhZGVyVmlkZW9Vcmw7XG4gICAgICAgIGhlYWRlclZpZGVvLmxvYWQoKTtcbiAgICAgICAgdHJ5VG9QbGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZFZpZGVvQWx0SW1hZ2UoKSB7XG4gICAgICAgIHZhciB2aWRlb0FsdEltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLWFsdC1pbWcnKSxcbiAgICAgICAgdmlkZW9BbHRJbWFnZVNyYyA9ICcuL2ltZy92aWRlby1pbWcuanBnJztcblxuICAgICAgICBwbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB2aWRlb0FsdEltYWdlLnNyYyA9IHZpZGVvQWx0SW1hZ2VTcmM7XG4gICAgICAgIGhlYWRlclZpZGVvLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB2aWRlb0FsdEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUNvbnRyb2xzKCkge1xuICAgICAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fY29udGVudCcpWzBdO1xuICAgICAgICBjb250cm9scy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICAgICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUGxheSgpIHtcbiAgICAgICAgaWYgKHBsYXlpbmdOb3cpIHtcbiAgICAgICAgICAgIGhlYWRlclZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICBwbGF5aW5nTm93ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJWaWRlby5wbGF5KCk7XG4gICAgICAgICAgICBwbGF5aW5nTm93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhlYWRlclZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBsYXlpbmdOb3cgPSB0cnVlO1xuICAgIH0pO1xuXG5cbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGVDb250cm9scygpO1xuICAgICAgICB0b2dnbGVQbGF5KCk7XG4gICAgfSk7XG5cbiAgICBwYXVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9nZ2xlQ29udHJvbHMoKTtcbiAgICAgICAgdG9nZ2xlUGxheSgpO1xuICAgIH0pO1xufSkoKTtcblxuXG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==