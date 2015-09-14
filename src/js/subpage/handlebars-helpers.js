(function () {
    'use strict';

    Handlebars.registerHelper('times', function (number, element) {
        var arr = new Array(number + 1),
        result = arr.join(element);

        return result;
    });

    Handlebars.registerHelper('scoreDescription', function (score) {
        var description = '';

        switch (true) {
            case (score <= 3):
                description = 'Fatalny';
                break;
            case (score > 3 && score <= 5):
                description = 'Nie najlepszy';
                break;
            case (score > 5 && score < 6.4):
                description = 'Przeciętny';
                break;
            case (score > 5 && score <= 6.5):
                description = 'Przeciętny';
                break;
            case (score > 6.5 && score <= 8):
                description = 'Bardzo dobry';
                break;
            case (score > 8 && score < 9):
                description = 'Znakomity';
                break;
            default:
                description = 'Wybitny';
                break;
        }

        return description + ' ' + score;
    });

    Handlebars.registerHelper('isEqual', function (priceRegular, pricePromo) {
        return priceRegular === pricePromo;
    });
})();
