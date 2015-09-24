(function () {
    'use strict';

    var contactState, contactView;

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
            var that = this, txt, url;

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
            contactForm = contactState.getForm(),
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
            form = contactState.getForm(),
            errorElement = document.querySelector(query);

            if (errorElement) {
                errorElement.classList.add('hidden');
                form[options.fieldName].classList.remove(this.errorClass);
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
})();
