window.onload = function () {
    'use strict';

    var baseUrl = '//camp.efigence.com/camp/api/places?page=1';

    function renderView(templateId, data, targetId) {
        var source = document.getElementById(templateId).textContent,
            template = Handlebars.compile(source),
            context = data,
            target = document.getElementById(targetId),
            html = template(context);

        target.innerHTML = html;
    }

    $.ajax({
        url: baseUrl,
        crossDomain: true,
        success: function (data) {
            renderView('places-template', data, 'offers');
        },
        error: function () {
            alert('blad polaczenia');
        }
    });
};

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJoYW5kbGViYXJzLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzdWJwYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYmFzZVVybCA9ICcvL2NhbXAuZWZpZ2VuY2UuY29tL2NhbXAvYXBpL3BsYWNlcz9wYWdlPTEnO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVyVmlldyh0ZW1wbGF0ZUlkLCBkYXRhLCB0YXJnZXRJZCkge1xuICAgICAgICB2YXIgc291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZCkudGV4dENvbnRlbnQsXG4gICAgICAgICAgICB0ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpLFxuICAgICAgICAgICAgY29udGV4dCA9IGRhdGEsXG4gICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXRJZCksXG4gICAgICAgICAgICBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XG5cbiAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGh0bWw7XG4gICAgfVxuXG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBiYXNlVXJsLFxuICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHJlbmRlclZpZXcoJ3BsYWNlcy10ZW1wbGF0ZScsIGRhdGEsICdvZmZlcnMnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdibGFkIHBvbGFjemVuaWEnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndGltZXMnLCBmdW5jdGlvbiAobnVtYmVyLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhcnIgPSBuZXcgQXJyYXkobnVtYmVyICsgMSksXG4gICAgICAgIHJlc3VsdCA9IGFyci5qb2luKGVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzY29yZURlc2NyaXB0aW9uJywgZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdGlvbiA9ICcnO1xuXG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPD0gMyk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnRmF0YWxueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDMgJiYgc2NvcmUgPD0gNSk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnTmllIG5hamxlcHN6eSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDUgJiYgc2NvcmUgPCA2LjQpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1ByemVjacSZdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlID4gNSAmJiBzY29yZSA8PSA2LjUpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1ByemVjacSZdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlID4gNi41ICYmIHNjb3JlIDw9IDgpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ0JhcmR6byBkb2JyeSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDggJiYgc2NvcmUgPCA5KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdabmFrb21pdHknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdXeWJpdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXNjcmlwdGlvbiArICcgJyArIHNjb3JlO1xuICAgIH0pO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignaXNFcXVhbCcsIGZ1bmN0aW9uIChwcmljZVJlZ3VsYXIsIHByaWNlUHJvbW8pIHtcbiAgICAgICAgcmV0dXJuIHByaWNlUmVndWxhciA9PT0gcHJpY2VQcm9tbztcbiAgICB9KTtcbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=