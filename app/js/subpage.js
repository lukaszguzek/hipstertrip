/*window.onload = function () {*/
'use strict';
var offersList = {};

offersList = {
    totalPages: null,
    currentPage: 1,
    baseUrl: '//camp.efigence.com/camp/api/places?page=',
    buttonsLimit: 3,
    activeButtonIndex: 0,
    init: function () {
        this.getData()
            .done(function (data) {
                this.totalPages = data.total_pages;
                this.renderOffersList(data);
                this.showPaginationButtons();
                this.changePaginationClasses();
                this.addPaginationListeners();
                var x = document.getElementsByClassName('pagination__wrap')[0]
x.scrollIntoViewIfNeeded(true);
            })
            .error(function (data) {
                this.renderOffersError(data);
            });
    },
    getData: function () {
        return $.ajax({
            context: offersList,
            method: 'GET',
            url: this.baseUrl + this.currentPage
        });
    },
    renderOffersList: function (data) {
        renderView({
            templateId: 'offers-template',
            data: data,
            targetId: 'offers'
        });
    },
    renderOffersError: function (data) {
        renderView({
            templateId: 'offers-template--error',
            data: data,
            targetId: 'offers'
        });
    },
    showPaginationButtons: function () {
        var maxButtons = Math.min(this.totalPages, this.buttonsLimit),
        buttonsNextPrev = document.getElementsByClassName('buttons-next-prev__wrap'),
        tempArray = Array.apply(null, new Array(maxButtons)).map(Number.prototype.valueOf, 0);

        for (var i = 0, l = buttonsNextPrev.length; i < l; i++) {
            buttonsNextPrev[i].classList.remove('hidden');
        }

        renderView({
            templateId: 'pagination-button',
            data: {buttonsCount: tempArray},
            targetId: 'pagination__buttons-list'
        });
    },
    goToPage: function (options) { /*{page: number, offset: number}*/
        if (!this.checkPageRange(options)) {
            return false;
        } else {
            this.getData()
                .done(function (data) {
                    this.renderOffersList(data);
                    this.renumberButtons();
                    this.changePaginationClasses();
                })
                .error(function (data) {
                    this.renderOffersError(data);
                });
        }
    },
    checkPageRange: function (options) {
        var targetPage;

        if ((options.page && options.offset) || (!options.page && !options.offset)) {
            return false;
        }

        targetPage = options.page || this.currentPage + options.offset;

        switch (true) {
            case (targetPage === this.currentPage):
                return false;
            case (targetPage > this.totalPages):
                return false;
            case (targetPage < 1):
                return false;
            default:
                this.currentPage = targetPage;
                return true;
        }
    },
    changePaginationClasses: function () {
        var paginationButtons = document.getElementsByClassName('pagination__button'),
        buttonPrev = document.getElementsByClassName('buttons-next-prev__wrap')[0],
        buttonNext = document.getElementsByClassName('buttons-next-prev__wrap')[1],
        classInactive = 'buttons-next-prev__wrap--inactive',
        activeButtonIndex;

        for (var i = 0, l = paginationButtons.length; i < l; i++) {
            paginationButtons[i].classList.remove('pagination__button--active');
        };

        activeButtonIndex = (this.currentPage - 1) % this.buttonsLimit;
        paginationButtons[activeButtonIndex].classList.add('pagination__button--active');

        if (this.currentPage === 1) {
            buttonPrev.classList.add(classInactive);
        } else if (this.currentPage === this.totalPages) {
            buttonNext.classList.add(classInactive);
        } else {
            buttonPrev.classList.remove(classInactive);
            buttonNext.classList.remove(classInactive);
        }
    },
    renumberButtons: function () {
        var paginationButtons = document.getElementsByClassName('pagination__button'),
        activeButtonIndex = (this.currentPage - 1) % this.buttonsLimit;

/*        console.log(activeButtonIndex);
        if (this.currentPage > 1 || this.currentPage !== this.totalPages) {
            return false;
        };*/

        var maxPage = Math.min((this.totalPages - this.currentPage), this.buttonsLimit);
        console.log('total: ' + this.totalPages + ' current: ' + this.currentPage + ' limit: ' + this.buttonsLimit + ' maxPAge: ' + maxPage);

        var off = 0;

        for (var i = paginationButtons.length - 1; i >= 0; i--) {
            console.log('huj: ' + (this.currentPage + maxPage + off));
            paginationButtons[i].contexText = this.currentPage + maxPage + off;
            off--;
        };

    },
    addPaginationListeners: function () {
        var paginationButtonsList = document.getElementById('pagination__buttons-list'),
        buttonPrev = document.getElementsByClassName('buttons-next-prev__wrap')[0],
        buttonNext = document.getElementsByClassName('buttons-next-prev__wrap')[1],
        that = this;

        paginationButtonsList.addEventListener('click', function (e) {
            that.goToPage({
                page: parseInt(e.target.dataset.page)
            });
        });
        buttonPrev.addEventListener('click', function (e) {
            that.goToPage({
                offset: -1
            });
        });
        buttonNext.addEventListener('click', function (e) {
            that.goToPage({
                offset: 1
            });
        });
    }
};

/*options: templateId, data, targetId*/
function renderView(options) {
    var source = document.getElementById(options.templateId).textContent,
        template = Handlebars.compile(source),
        context = options.data,
        target = document.getElementById(options.targetId),
        html = template(context);

    target.innerHTML = html;
}

offersList.init();



/*};*/

(function () {
    'use strict';

    Handlebars.registerHelper('times', function (number, element) {
        var arr = new Array(number + 1),
        result = arr.join(element);

        return result;
    });

    Handlebars.registerHelper('increase', function (value, step) {
        return value + step;
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXguanMiLCJoYW5kbGViYXJzLWhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic3VicGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHsqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIG9mZmVyc0xpc3QgPSB7fTtcblxub2ZmZXJzTGlzdCA9IHtcbiAgICB0b3RhbFBhZ2VzOiBudWxsLFxuICAgIGN1cnJlbnRQYWdlOiAxLFxuICAgIGJhc2VVcmw6ICcvL2NhbXAuZWZpZ2VuY2UuY29tL2NhbXAvYXBpL3BsYWNlcz9wYWdlPScsXG4gICAgYnV0dG9uc0xpbWl0OiAzLFxuICAgIGFjdGl2ZUJ1dHRvbkluZGV4OiAwLFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhKClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbFBhZ2VzID0gZGF0YS50b3RhbF9wYWdlcztcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9mZmVyc0xpc3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UGFnaW5hdGlvbkJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2luYXRpb25DbGFzc2VzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQYWdpbmF0aW9uTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgdmFyIHggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYWdpbmF0aW9uX193cmFwJylbMF1cbnguc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCh0cnVlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlck9mZmVyc0Vycm9yKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXREYXRhOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgICAgY29udGV4dDogb2ZmZXJzTGlzdCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmw6IHRoaXMuYmFzZVVybCArIHRoaXMuY3VycmVudFBhZ2VcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZW5kZXJPZmZlcnNMaXN0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZW5kZXJWaWV3KHtcbiAgICAgICAgICAgIHRlbXBsYXRlSWQ6ICdvZmZlcnMtdGVtcGxhdGUnLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRhcmdldElkOiAnb2ZmZXJzJ1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbmRlck9mZmVyc0Vycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZW5kZXJWaWV3KHtcbiAgICAgICAgICAgIHRlbXBsYXRlSWQ6ICdvZmZlcnMtdGVtcGxhdGUtLWVycm9yJyxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB0YXJnZXRJZDogJ29mZmVycydcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBzaG93UGFnaW5hdGlvbkJ1dHRvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1heEJ1dHRvbnMgPSBNYXRoLm1pbih0aGlzLnRvdGFsUGFnZXMsIHRoaXMuYnV0dG9uc0xpbWl0KSxcbiAgICAgICAgYnV0dG9uc05leHRQcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAnKSxcbiAgICAgICAgdGVtcEFycmF5ID0gQXJyYXkuYXBwbHkobnVsbCwgbmV3IEFycmF5KG1heEJ1dHRvbnMpKS5tYXAoTnVtYmVyLnByb3RvdHlwZS52YWx1ZU9mLCAwKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJ1dHRvbnNOZXh0UHJldi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGJ1dHRvbnNOZXh0UHJldltpXS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlclZpZXcoe1xuICAgICAgICAgICAgdGVtcGxhdGVJZDogJ3BhZ2luYXRpb24tYnV0dG9uJyxcbiAgICAgICAgICAgIGRhdGE6IHtidXR0b25zQ291bnQ6IHRlbXBBcnJheX0sXG4gICAgICAgICAgICB0YXJnZXRJZDogJ3BhZ2luYXRpb25fX2J1dHRvbnMtbGlzdCdcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnb1RvUGFnZTogZnVuY3Rpb24gKG9wdGlvbnMpIHsgLyp7cGFnZTogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcn0qL1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tQYWdlUmFuZ2Uob3B0aW9ucykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0RGF0YSgpXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPZmZlcnNMaXN0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbnVtYmVyQnV0dG9ucygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2luYXRpb25DbGFzc2VzKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJPZmZlcnNFcnJvcihkYXRhKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY2hlY2tQYWdlUmFuZ2U6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB0YXJnZXRQYWdlO1xuXG4gICAgICAgIGlmICgob3B0aW9ucy5wYWdlICYmIG9wdGlvbnMub2Zmc2V0KSB8fCAoIW9wdGlvbnMucGFnZSAmJiAhb3B0aW9ucy5vZmZzZXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRQYWdlID0gb3B0aW9ucy5wYWdlIHx8IHRoaXMuY3VycmVudFBhZ2UgKyBvcHRpb25zLm9mZnNldDtcblxuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgKHRhcmdldFBhZ2UgPT09IHRoaXMuY3VycmVudFBhZ2UpOlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgKHRhcmdldFBhZ2UgPiB0aGlzLnRvdGFsUGFnZXMpOlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgKHRhcmdldFBhZ2UgPCAxKTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0YXJnZXRQYWdlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjaGFuZ2VQYWdpbmF0aW9uQ2xhc3NlczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFnaW5hdGlvbkJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYWdpbmF0aW9uX19idXR0b24nKSxcbiAgICAgICAgYnV0dG9uUHJldiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwJylbMF0sXG4gICAgICAgIGJ1dHRvbk5leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b25zLW5leHQtcHJldl9fd3JhcCcpWzFdLFxuICAgICAgICBjbGFzc0luYWN0aXZlID0gJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwLS1pbmFjdGl2ZScsXG4gICAgICAgIGFjdGl2ZUJ1dHRvbkluZGV4O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcGFnaW5hdGlvbkJ1dHRvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBwYWdpbmF0aW9uQnV0dG9uc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdwYWdpbmF0aW9uX19idXR0b24tLWFjdGl2ZScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFjdGl2ZUJ1dHRvbkluZGV4ID0gKHRoaXMuY3VycmVudFBhZ2UgLSAxKSAlIHRoaXMuYnV0dG9uc0xpbWl0O1xuICAgICAgICBwYWdpbmF0aW9uQnV0dG9uc1thY3RpdmVCdXR0b25JbmRleF0uY2xhc3NMaXN0LmFkZCgncGFnaW5hdGlvbl9fYnV0dG9uLS1hY3RpdmUnKTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PT0gMSkge1xuICAgICAgICAgICAgYnV0dG9uUHJldi5jbGFzc0xpc3QuYWRkKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT09IHRoaXMudG90YWxQYWdlcykge1xuICAgICAgICAgICAgYnV0dG9uTmV4dC5jbGFzc0xpc3QuYWRkKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnV0dG9uUHJldi5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICAgICAgYnV0dG9uTmV4dC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW51bWJlckJ1dHRvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhZ2luYXRpb25CdXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFnaW5hdGlvbl9fYnV0dG9uJyksXG4gICAgICAgIGFjdGl2ZUJ1dHRvbkluZGV4ID0gKHRoaXMuY3VycmVudFBhZ2UgLSAxKSAlIHRoaXMuYnV0dG9uc0xpbWl0O1xuXG4vKiAgICAgICAgY29uc29sZS5sb2coYWN0aXZlQnV0dG9uSW5kZXgpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA+IDEgfHwgdGhpcy5jdXJyZW50UGFnZSAhPT0gdGhpcy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07Ki9cblxuICAgICAgICB2YXIgbWF4UGFnZSA9IE1hdGgubWluKCh0aGlzLnRvdGFsUGFnZXMgLSB0aGlzLmN1cnJlbnRQYWdlKSwgdGhpcy5idXR0b25zTGltaXQpO1xuICAgICAgICBjb25zb2xlLmxvZygndG90YWw6ICcgKyB0aGlzLnRvdGFsUGFnZXMgKyAnIGN1cnJlbnQ6ICcgKyB0aGlzLmN1cnJlbnRQYWdlICsgJyBsaW1pdDogJyArIHRoaXMuYnV0dG9uc0xpbWl0ICsgJyBtYXhQQWdlOiAnICsgbWF4UGFnZSk7XG5cbiAgICAgICAgdmFyIG9mZiA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IHBhZ2luYXRpb25CdXR0b25zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaHVqOiAnICsgKHRoaXMuY3VycmVudFBhZ2UgKyBtYXhQYWdlICsgb2ZmKSk7XG4gICAgICAgICAgICBwYWdpbmF0aW9uQnV0dG9uc1tpXS5jb250ZXhUZXh0ID0gdGhpcy5jdXJyZW50UGFnZSArIG1heFBhZ2UgKyBvZmY7XG4gICAgICAgICAgICBvZmYtLTtcbiAgICAgICAgfTtcblxuICAgIH0sXG4gICAgYWRkUGFnaW5hdGlvbkxpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFnaW5hdGlvbkJ1dHRvbnNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2luYXRpb25fX2J1dHRvbnMtbGlzdCcpLFxuICAgICAgICBidXR0b25QcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAnKVswXSxcbiAgICAgICAgYnV0dG9uTmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwJylbMV0sXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHBhZ2luYXRpb25CdXR0b25zTGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB0aGF0LmdvVG9QYWdlKHtcbiAgICAgICAgICAgICAgICBwYWdlOiBwYXJzZUludChlLnRhcmdldC5kYXRhc2V0LnBhZ2UpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1dHRvblByZXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdGhhdC5nb1RvUGFnZSh7XG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b25OZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRoYXQuZ29Ub1BhZ2Uoe1xuICAgICAgICAgICAgICAgIG9mZnNldDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qb3B0aW9uczogdGVtcGxhdGVJZCwgZGF0YSwgdGFyZ2V0SWQqL1xuZnVuY3Rpb24gcmVuZGVyVmlldyhvcHRpb25zKSB7XG4gICAgdmFyIHNvdXJjZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMudGVtcGxhdGVJZCkudGV4dENvbnRlbnQsXG4gICAgICAgIHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSksXG4gICAgICAgIGNvbnRleHQgPSBvcHRpb25zLmRhdGEsXG4gICAgICAgIHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbnMudGFyZ2V0SWQpLFxuICAgICAgICBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XG5cbiAgICB0YXJnZXQuaW5uZXJIVE1MID0gaHRtbDtcbn1cblxub2ZmZXJzTGlzdC5pbml0KCk7XG5cblxuXG4vKn07Ki9cbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndGltZXMnLCBmdW5jdGlvbiAobnVtYmVyLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBhcnIgPSBuZXcgQXJyYXkobnVtYmVyICsgMSksXG4gICAgICAgIHJlc3VsdCA9IGFyci5qb2luKGVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdpbmNyZWFzZScsIGZ1bmN0aW9uICh2YWx1ZSwgc3RlcCkge1xuICAgICAgICByZXR1cm4gdmFsdWUgKyBzdGVwO1xuICAgIH0pO1xuXG5cbiAgICBIYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdzY29yZURlc2NyaXB0aW9uJywgZnVuY3Rpb24gKHNjb3JlKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdGlvbiA9ICcnO1xuXG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPD0gMyk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnRmF0YWxueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDMgJiYgc2NvcmUgPD0gNSk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnTmllIG5hamxlcHN6eSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDUgJiYgc2NvcmUgPCA2LjQpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1ByemVjacSZdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlID4gNSAmJiBzY29yZSA8PSA2LjUpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1ByemVjacSZdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlID4gNi41ICYmIHNjb3JlIDw9IDgpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ0JhcmR6byBkb2JyeSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDggJiYgc2NvcmUgPCA5KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdabmFrb21pdHknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdXeWJpdG55JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXNjcmlwdGlvbiArICcgJyArIHNjb3JlO1xuICAgIH0pO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignaXNFcXVhbCcsIGZ1bmN0aW9uIChwcmljZVJlZ3VsYXIsIHByaWNlUHJvbW8pIHtcbiAgICAgICAgcmV0dXJuIHByaWNlUmVndWxhciA9PT0gcHJpY2VQcm9tbztcbiAgICB9KTtcbn0pKCk7XG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==