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




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2VsLmpzIiwiY29udGFjdC5qcyIsImdvb2dsZS1tYXBzLWJhY2tncm91bnMuanMiLCJ0b29nbGUtbWVudS5qcyIsInZpZGVvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJvd1ByZXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzbGlkZXJfX2Fycm93LS1wcmV2JylbMF07XG4gICAgdmFyIGFycm93TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NsaWRlcl9fYXJyb3ctLW5leHQnKVswXTtcblxuICAgICQoJy5zbGlkZXMtY29udGFpbmVyJykuc2xpY2soe1xuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICBwcmV2QXJyb3c6IGFycm93UHJldixcbiAgICAgICAgbmV4dEFycm93OiBhcnJvd05leHQsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjYwLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMzAsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG59KTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29udGFjdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFjdC1mb3JtJyk7XG5jb250YWN0Rm9ybS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKHRydWUpO1xuXG5cbmNvbnRhY3RTdGF0ZSA9IHtcbiAgICBmb3JtRmllbGRzOiBbJ25hbWUnLCAnZW1haWwnLCAnbWVzc2FnZSddLFxuICAgIGZvcm1JZDogJ2NvbnRhY3QtZm9ybScsXG4gICAgZ2V0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhY3QtZm9ybScpO1xuICAgIH0sXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmdldEZvcm0oKTtcbiAgICAgICAgcmV0dXJuICQoZm9ybSkuc2VyaWFsaXplKCk7XG4gICAgfSxcbiAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcywgZGF0YSwgdXJsO1xuXG4gICAgICAgIGlmICh0aGlzLnZhbGlkYXRlRm9ybSgpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHh0ID0gdGhpcy5nZXRGb3JtRGF0YSgpO1xuICAgICAgICB1cmwgPSAnaHR0cDovL2NhbXAuZWZpZ2VuY2UuY29tL2NhbXAvYXBpL2NvbnRhY3QnO1xuXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHR4dCxcbiAgICAgICAgICAgIHVybDogdXJsXG4gICAgICAgIH0pXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb250YWN0Vmlldy5jbGVhckZvcm0oKTtcbiAgICAgICAgICAgIGNvbnRhY3RWaWV3LnNob3dTZW5kU3VjY2VzcygpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICB0aGF0LmNoZWNrRm9yUmVzcG9uc2VFcnJvcnMoZGF0YSk7XG4gICAgICAgICAgICBpZiAodGhhdC5jaGVja0ZvclJlc3BvbnNlRXJyb3JzKGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5wYXJzZVJlc3BvbnNlRXJyb3JzKGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICBjb250YWN0Vmlldy5zaG93U2VuZEVycm9yKGRhdGEuc3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcbiAgICB9LFxuICAgIGFkZExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9ybSA9IHRoaXMuZ2V0Rm9ybSgpLFxuICAgICAgICB0aGF0ID0gdGhpcztcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuZm9ybUZpZWxkcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGZvcm1bdGhpcy5mb3JtRmllbGRzW2ldXS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnZhbGlkYXRlRmllbGQoe1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBlLnRhcmdldC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBlLnRhcmdldC5uYW1lXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5zZW5kKCk7XG4gICAgICAgIH0pXG4gICAgfSxcbiAgICB2YWxpZGF0ZUZpZWxkOiBmdW5jdGlvbiAob3B0aW9ucykgeyAvLyB7dGV4dDosIGZpZWxkTmFtZX1cbiAgICAgICAgdmFyIGZvcm0sIGlzVmFsaWQ7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZmllbGROYW1lID09PSAnZW1haWwnKSB7XG4gICAgICAgICAgICBpc1ZhbGlkID0gaXNFbWFpbChvcHRpb25zLnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXNWYWxpZCA9IGlzTm90RW1wdHkob3B0aW9ucy50ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgY29udGFjdFZpZXcuc2hvd0ludmFsaWRNZXNzYWdlKG9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGFjdFZpZXcuaGlkZUludmFsaWRNZXNzYWdlKG9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0VtYWlsKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAvW15AXStAW15AXSsvLnRlc3QodGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc05vdEVtcHR5KHRleHQpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4ocGFyc2VJbnQodGV4dCkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dC5sZW5ndGggPiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICB2YWxpZGF0ZUZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmdldEZvcm0oKSxcbiAgICAgICAgaW52YWxpZENvdW50ZXIgPSAwLFxuICAgICAgICBpc1ZhbGlkO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5mb3JtRmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaXNWYWxpZCA9IHRoaXMudmFsaWRhdGVGaWVsZCh7XG4gICAgICAgICAgICAgICAgdGV4dDogZm9ybVt0aGlzLmZvcm1GaWVsZHNbaV1dLnZhbHVlLFxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogdGhpcy5mb3JtRmllbGRzW2ldXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZENvdW50ZXIrKztcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBpbnZhbGlkQ291bnRlcjtcbiAgICB9LFxuICAgIGNoZWNrRm9yUmVzcG9uc2VFcnJvcnM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gNDIyKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKGRhdGEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnZXJyb3JzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBhcnNlUmVzcG9uc2VFcnJvcnM6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoZGF0YS5yZXNwb25zZVRleHQpLFxuICAgICAgICBlcnJvcnNBcnJheSA9IFtdO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5lcnJvcnMpO1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiByZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgIGVycm9yc0FycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgIGZpZWxkTmFtZToga2V5LFxuICAgICAgICAgICAgICAgIGVycm9yVGV4dDogcmVzcG9uc2UuZXJyb3JzW2tleV0uam9pbignICcpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGVycm9yc0FycmF5Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgY29udGFjdFZpZXcuc2hvd0ludmFsaWRNZXNzYWdlKGVycm9yc0FycmF5W2ldKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5jb250YWN0VmlldyA9IHtcbiAgICBlcnJvckNsYXNzOiAnY29udGFjdF9faW5wdXQtLWVycm9yJyxcbiAgICBzaG93SW52YWxpZE1lc3NhZ2U6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICdbZGF0YS1maWVsZD0nICsgb3B0aW9ucy5maWVsZE5hbWUgKyAnXScsXG4gICAgICAgIGVycm9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocXVlcnkpLFxuICAgICAgICBlcnJvckRlc2NyaXB0aW9uRWxlbWVudCA9IGVycm9yRWxlbWVudC5jaGlsZE5vZGVzWzFdLFxuICAgICAgICBlcnJvclRleHQ7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZmllbGROYW1lID09PSAnZW1haWwnKSB7XG4gICAgICAgICAgICBlcnJvclRleHQgPSAnQWRyZXMgZW1haWwgamVzdCBuaWVwcmF3aWTFgm93eSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvclRleHQgPSAnUG9sZSBuaWUgbW/FvGUgYnnEhyBwdXN0ZSc7XG4gICAgICAgIH1cblxuICAgICAgICBlcnJvclRleHQgPSBvcHRpb25zLmVycm9yVGV4dCB8fCBlcnJvclRleHQ7XG5cbiAgICAgICAgZXJyb3JFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICBjb250YWN0Rm9ybVtvcHRpb25zLmZpZWxkTmFtZV0uY2xhc3NMaXN0LmFkZCh0aGlzLmVycm9yQ2xhc3MpO1xuICAgICAgICBlcnJvckRlc2NyaXB0aW9uRWxlbWVudC50ZXh0Q29udGVudCA9IGVycm9yVGV4dDtcbiAgICB9LFxuICAgIGhpZGVJbnZhbGlkTWVzc2FnZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJ1tkYXRhLWZpZWxkPScgKyBvcHRpb25zLmZpZWxkTmFtZSArICddJyxcbiAgICAgICAgZXJyb3JFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihxdWVyeSk7XG5cbiAgICAgICAgaWYgKGVycm9yRWxlbWVudCkge1xuICAgICAgICAgICAgZXJyb3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgY29udGFjdEZvcm1bb3B0aW9ucy5maWVsZE5hbWVdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5lcnJvckNsYXNzKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2hvd1NlbmRTdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidXR0b24sIGJ1dHRvblRleHQsIHN1Y2Nlc3NUZXh0LCBzdWNjZXNzQ2xhc3M7XG4gICAgICAgIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0X19zZW5kJyk7XG4gICAgICAgIGJ1dHRvblRleHQgPSBidXR0b24udGV4dENvbnRlbnQ7XG4gICAgICAgIHN1Y2Nlc3NUZXh0ID0gJ1dpYWRtb8WbxIcgem9zdGHFgmEgd3lzxYJhbmEnO1xuICAgICAgICBzdWNjZXNzQ2xhc3MgPSAnY29udGFjdF9fc2VuZC0tc3VjY2Vzcyc7XG5cbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoc3VjY2Vzc0NsYXNzKTtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gc3VjY2Vzc1RleHQ7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LnJlbW92ZShzdWNjZXNzQ2xhc3MpO1xuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gYnV0dG9uVGV4dDtcbiAgICAgICAgfSwgMzAwMClcbiAgICB9LFxuICAgIHNob3dTZW5kRXJyb3I6IGZ1bmN0aW9uIChzdGF0dXNDb2RlKSB7XG4gICAgICAgIHZhciB0aGF0LCBidXR0b24sIGJ1dHRvblRleHQsIGJ1dHRvblRleHRFcnJvciwgZXJyb3JDbGFzcywgZXJyb3JNZXNzYWdlLCBlcnJvckNvZGU7XG5cbiAgICAgICAgdGhhdCA9IHRoaXM7XG4gICAgICAgIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWN0X19zZW5kJyk7XG4gICAgICAgIGJ1dHRvblRleHQgPSBidXR0b24udGV4dENvbnRlbnQ7XG4gICAgICAgIGJ1dHRvblRleHRFcnJvciA9ICdCxYLEhWQhJztcbiAgICAgICAgZXJyb3JDbGFzcyA9ICdjb250YWN0X19zZW5kLS1lcnJvcic7XG4gICAgICAgIGVycm9yQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci10ZXh0X19jb2RlJyk7XG4gICAgICAgIGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRhY3RfX2Vycm9yLWRlc2NyaXB0aW9uJylbMF07XG5cbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoZXJyb3JDbGFzcyk7XG4gICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGJ1dHRvblRleHRFcnJvcjtcbiAgICAgICAgZXJyb3JDb2RlLnRleHRDb250ZW50ID0gc3RhdHVzQ29kZTtcbiAgICAgICAgZXJyb3JNZXNzYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoZXJyb3JDbGFzcyk7XG4gICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBidXR0b25UZXh0O1xuICAgICAgICAgICAgZXJyb3JDb2RlLnRleHRDb250ZW50ID0gJyc7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGF0LmNsZWFyRm9ybSgpO1xuICAgICAgICB9LCA1MDAwKVxuICAgIH0sXG4gICAgY2xlYXJGb3JtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmb3JtID0gY29udGFjdFN0YXRlLmdldEZvcm0oKSxcbiAgICAgICAgZmllbGRzID0gY29udGFjdFN0YXRlLmZvcm1GaWVsZHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBmb3JtW2ZpZWxkc1tpXV0udmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5jb250YWN0U3RhdGUuaW5pdCgpO1xuIiwid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSB7bGF0OiA1Mi4yMzA0MTUsIGxuZzogMjAuOTk3MzM2fSxcbiAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNvb3JkaW5hdGVzLmxhdCwgY29vcmRpbmF0ZXMubG5nKSxcbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG4gICAgICAgIGNlbnRlcjogbWFwXG4gICAgfSxcbiAgICBtYXBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdnb29nbGUtbWFwJylbMF0sXG4gICAgYmFja2dyb3VuZE1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ29udGFpbmVyLCBtYXBPcHRpb25zKTtcbn07XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIHZhciBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyLWJ1dHRvbicpLFxuICAgIG1haW5NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tbWVudScpLFxuICAgIGNvbGxhcHNlQ2xhc3MgPSAnbWFpbi1tZW51LS1jb2xsYXBzZWQnLFxuICAgIGFuaW1hdGlvbkV4cGFuZCA9ICdhbmltYXRlZC0tc2NhbGVJbic7XG4gICAgYW5pbWF0aW9uQ29sbGFwc2UgPSAnYW5pbWF0ZWQtLXNjYWxlT3V0JyxcbiAgICBhbmltYXRpb25EZWxheSA9IDMwMDtcblxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG1haW5NZW51LmNsYXNzTGlzdC5jb250YWlucyhjb2xsYXBzZUNsYXNzKSkge1xuICAgICAgICAgICAgbWFpbk1lbnUuY2xhc3NMaXN0LnRvZ2dsZShjb2xsYXBzZUNsYXNzKTtcbiAgICAgICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoYW5pbWF0aW9uRXhwYW5kKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoYW5pbWF0aW9uRXhwYW5kKTtcbiAgICAgICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoYW5pbWF0aW9uQ29sbGFwc2UpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbWFpbk1lbnUuY2xhc3NMaXN0LnRvZ2dsZShjb2xsYXBzZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBtYWluTWVudS5jbGFzc0xpc3QudG9nZ2xlKGFuaW1hdGlvbkNvbGxhcHNlKTtcbiAgICAgICAgICAgIH0sIGFuaW1hdGlvbkRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtYmFycycpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtdGltZXMnKTtcbiAgICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBoZWFkZXJWaWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItdmlkZW8nKSxcbiAgICBmb3JtYXQgPSAndmlkZW8vbXA0JyxcbiAgICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX3BsYXknKVswXSxcbiAgICBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19wYXVzZS0tbGlnaHQnKVswXSxcbiAgICBwbGF5aW5nTm93ID0gZmFsc2U7XG5cbiAgICBpZiAoY2FuUGxheVRlc3QoaGVhZGVyVmlkZW8sIGZvcm1hdCkpIHtcbiAgICAgICAgbG9hZEhlYWRlclZpZGVvKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZFZpZGVvQWx0SW1hZ2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5QbGF5VGVzdCh2aWRlb0NsaXAsIGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdmlkZW9DbGlwLmNhblBsYXlUeXBlKGZvcm1hdCkubGVuZ3RoID4gMCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cnlUb1BsYXkoKSB7XG4gICAgICAgIGhlYWRlclZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9hZFZpZGVvQWx0SW1hZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGhlYWRlclZpZGVvLnBsYXkoKTtcbiAgICAgICAgaGVhZGVyVmlkZW8ucGF1c2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkSGVhZGVyVmlkZW8oKSB7XG4gICAgICAgIHZhciBoZWFkZXJWaWRlb1VybCA9ICcuL3ZpZGVvL3ZpZGVvLm1wNCN0PTEnO1xuXG4gICAgICAgIGhlYWRlclZpZGVvLnNyYyA9IGhlYWRlclZpZGVvVXJsO1xuICAgICAgICBoZWFkZXJWaWRlby5sb2FkKCk7XG4gICAgICAgIHRyeVRvUGxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRWaWRlb0FsdEltYWdlKCkge1xuICAgICAgICB2YXIgdmlkZW9BbHRJbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby1hbHQtaW1nJyksXG4gICAgICAgIHZpZGVvQWx0SW1hZ2VTcmMgPSAnLi9pbWcvdmlkZW8taW1nLmpwZyc7XG5cbiAgICAgICAgcGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgdmlkZW9BbHRJbWFnZS5zcmMgPSB2aWRlb0FsdEltYWdlU3JjO1xuICAgICAgICBoZWFkZXJWaWRlby5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgdmlkZW9BbHRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVDb250cm9scygpIHtcbiAgICAgICAgdmFyIGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX2NvbnRlbnQnKVswXTtcbiAgICAgICAgY29udHJvbHMuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVBsYXkoKSB7XG4gICAgICAgIGlmIChwbGF5aW5nTm93KSB7XG4gICAgICAgICAgICBoZWFkZXJWaWRlby5wYXVzZSgpO1xuICAgICAgICAgICAgcGxheWluZ05vdyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVyVmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgcGxheWluZ05vdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkZXJWaWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwbGF5aW5nTm93ID0gdHJ1ZTtcbiAgICB9KTtcblxuXG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9nZ2xlQ29udHJvbHMoKTtcbiAgICAgICAgdG9nZ2xlUGxheSgpO1xuICAgIH0pO1xuXG4gICAgcGF1c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZUNvbnRyb2xzKCk7XG4gICAgICAgIHRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcbn0pKCk7XG5cblxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=