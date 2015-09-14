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
