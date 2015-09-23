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


'use strict';

var offersData, offersView, offersState;

offersData = {
    baseUrl: '//camp.efigence.com/camp/api/places?page=',
    getData: function (pageNumber) {
        var that = this;
        return $.ajax({
            method: 'GET',
            crossDomain: true,
            url: that.baseUrl + pageNumber
        });
    }
};

offersState = {
    totalPages: null,
    currentPage: 1,
    maxNumberOfButtons: 10,
    numberOfVisibleButtons: null,
    visiblePages: [],

    init: function () {
        var that = this;
        offersData.getData()
            .done(function (data) {
                that.totalPages = data.total_pages;
                that.numberOfVisibleButtons = Math.min(that.totalPages, that.maxNumberOfButtons);

                for (var i = 0; i < that.numberOfVisibleButtons; i++) {
                    that.visiblePages.push(i + 1);
                }

                offersView.updateView({
                    pageNumber: 1,
                    activeButtonIndex: 0
                });
                offersView.renderPagination(that.numberOfVisibleButtons);
                that.addListeners();
            });
    },
    updateVisiblePages: function () {
        var buttonsCount = this.numberOfVisibleButtons,
        buttons = document.getElementsByClassName('pagination__button'),
        offset;

        if (this.visiblePages.indexOf(this.currentPage) > -1) {
            return false;
        }

        if (this.visiblePages[0] > this.currentPage) {
            offset = Math.max(-this.currentPage, -buttonsCount);
        } else {
            offset = Math.min(buttonsCount, this.totalPages - this.currentPage + 1);
        }

        for (var i = 0, l = buttonsCount; i < l; i++) {
            this.visiblePages[i] = this.visiblePages[i] + offset;
            buttons[i].textContent = this.visiblePages[i];
            buttons[i].dataset.page = this.visiblePages[i];
        }
    },
    updateStatus: function (options) {
        var targetPage, activeButton;

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
                this.updateVisiblePages();
                activeButton = this.visiblePages.indexOf(targetPage);
                offersView.updateView({
                    pageNumber: targetPage,
                    activeButtonIndex: activeButton,
                    totalPages: this.totalPages
                });
                break;
        }
    },
    addListeners: function () {
        var paginationButtonsList = document.getElementById('pagination__buttons-list'),
        buttonPrev = document.getElementsByClassName('buttons-next-prev__wrap')[0],
        buttonNext = document.getElementsByClassName('buttons-next-prev__wrap')[1],
        that = this;

        paginationButtonsList.addEventListener('click', function (e) {
            that.updateStatus({
                page: parseInt(e.target.dataset.page)
            });
        });
        buttonPrev.addEventListener('click', function (e) {
            that.updateStatus({
                offset: -1
            });
        });
        buttonNext.addEventListener('click', function (e) {
            that.updateStatus({
                offset: 1
            });
        });
    }
};

offersView = {
    renderTemplate: function (options) {
        var source = document.getElementById(options.templateId).textContent,
            template = Handlebars.compile(source),
            context = options.data,
            target = document.getElementById(options.targetId),
            html = template(context);

        target.innerHTML = html;
    },
    renderOffersList: function (data) {
        this.renderTemplate({
            templateId: 'offers-template',
            data: data,
            targetId: 'offers'
        });
    },
    renderOffersError: function (data) {
        this.renderTemplate({
            templateId: 'offers-template--error',
            data: data,
            targetId: 'offers'
        });
    },
    renderPagination: function (buttonsCount) {
        var buttonsNextPrev, templateArray;

        buttonsNextPrev = document.getElementsByClassName('buttons-next-prev__wrap');
        templateArray = Array.apply(null, new Array(buttonsCount)).map(Number.prototype.valueOf, 0);

        for (var i = 0; i < 2; i++) {
            buttonsNextPrev[i].classList.remove('hidden');
        }

        this.renderTemplate({
            templateId: 'pagination-button',
            data: {buttonsCount: templateArray},
            targetId: 'pagination__buttons-list'
        });
    },
    updateView: function (options) {
        var that = this;
        offersData.getData(options.pageNumber)
            .done(function (data) {
                that.renderOffersList(data);
                that.markActiveButton(options.activeButtonIndex);
                that.showHideNavButtons(options);
            })
            .error(function (data) {
                that.renferOffersError(data);
            });
    },
    markActiveButton: function (buttonIndex) {
        var classActive = 'pagination__button--active',
        buttonsActive = document.getElementsByClassName(classActive),
        buttons = document.getElementsByClassName('pagination__button');

        for (var i = 0, l = buttonsActive.length; i < l; i++) {
            buttonsActive[i].classList.remove(classActive);
        }

        buttons[buttonIndex].classList.add(classActive);
    },
    showHideNavButtons: function (options) {
        var buttonsNextPrev = document.getElementsByClassName('buttons-next-prev__wrap'),
        classInactive = 'buttons-next-prev__wrap--inactive',
        buttonsNexPrevInactive = document.getElementsByClassName(classInactive);

        if (options.pageNumber > 1 && options.pageNumber < options.totalPages) {
            for (var i = 0, l = buttonsNexPrevInactive.length; i < l; i++) {
                buttonsNexPrevInactive[i].classList.remove(classInactive);
            }
        } else if (options.pageNumber === 1) {
            buttonsNextPrev[0].classList.add(classInactive);
        } else {
            buttonsNextPrev[1].classList.add(classInactive);
        }
    }
};

offersState.init();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1haW4tc3VicGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InN1YnBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RpbWVzJywgZnVuY3Rpb24gKG51bWJlciwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYXJyID0gbmV3IEFycmF5KG51bWJlciArIDEpLFxuICAgICAgICByZXN1bHQgPSBhcnIuam9pbihlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignaW5jcmVhc2UnLCBmdW5jdGlvbiAodmFsdWUsIHN0ZXApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICsgc3RlcDtcbiAgICB9KTtcblxuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc2NvcmVEZXNjcmlwdGlvbicsIGZ1bmN0aW9uIChzY29yZSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSAnJztcblxuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlIDw9IDMpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ0ZhdGFsbnknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiAzICYmIHNjb3JlIDw9IDUpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ05pZSBuYWpsZXBzenknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiA1ICYmIHNjb3JlIDwgNi40KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdQcnplY2nEmXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDUgJiYgc2NvcmUgPD0gNi41KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdQcnplY2nEmXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDYuNSAmJiBzY29yZSA8PSA4KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdCYXJkem8gZG9icnknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiA4ICYmIHNjb3JlIDwgOSk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnWm5ha29taXR5JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnV3liaXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb24gKyAnICcgKyBzY29yZTtcbiAgICB9KTtcblxuICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2lzRXF1YWwnLCBmdW5jdGlvbiAocHJpY2VSZWd1bGFyLCBwcmljZVByb21vKSB7XG4gICAgICAgIHJldHVybiBwcmljZVJlZ3VsYXIgPT09IHByaWNlUHJvbW87XG4gICAgfSk7XG59KSgpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvZmZlcnNEYXRhLCBvZmZlcnNWaWV3LCBvZmZlcnNTdGF0ZTtcblxub2ZmZXJzRGF0YSA9IHtcbiAgICBiYXNlVXJsOiAnLy9jYW1wLmVmaWdlbmNlLmNvbS9jYW1wL2FwaS9wbGFjZXM/cGFnZT0nLFxuICAgIGdldERhdGE6IGZ1bmN0aW9uIChwYWdlTnVtYmVyKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICB1cmw6IHRoYXQuYmFzZVVybCArIHBhZ2VOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxub2ZmZXJzU3RhdGUgPSB7XG4gICAgdG90YWxQYWdlczogbnVsbCxcbiAgICBjdXJyZW50UGFnZTogMSxcbiAgICBtYXhOdW1iZXJPZkJ1dHRvbnM6IDEwLFxuICAgIG51bWJlck9mVmlzaWJsZUJ1dHRvbnM6IG51bGwsXG4gICAgdmlzaWJsZVBhZ2VzOiBbXSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBvZmZlcnNEYXRhLmdldERhdGEoKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnRvdGFsUGFnZXMgPSBkYXRhLnRvdGFsX3BhZ2VzO1xuICAgICAgICAgICAgICAgIHRoYXQubnVtYmVyT2ZWaXNpYmxlQnV0dG9ucyA9IE1hdGgubWluKHRoYXQudG90YWxQYWdlcywgdGhhdC5tYXhOdW1iZXJPZkJ1dHRvbnMpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0Lm51bWJlck9mVmlzaWJsZUJ1dHRvbnM7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LnZpc2libGVQYWdlcy5wdXNoKGkgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvZmZlcnNWaWV3LnVwZGF0ZVZpZXcoe1xuICAgICAgICAgICAgICAgICAgICBwYWdlTnVtYmVyOiAxLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVCdXR0b25JbmRleDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG9mZmVyc1ZpZXcucmVuZGVyUGFnaW5hdGlvbih0aGF0Lm51bWJlck9mVmlzaWJsZUJ1dHRvbnMpO1xuICAgICAgICAgICAgICAgIHRoYXQuYWRkTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9LFxuICAgIHVwZGF0ZVZpc2libGVQYWdlczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYnV0dG9uc0NvdW50ID0gdGhpcy5udW1iZXJPZlZpc2libGVCdXR0b25zLFxuICAgICAgICBidXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFnaW5hdGlvbl9fYnV0dG9uJyksXG4gICAgICAgIG9mZnNldDtcblxuICAgICAgICBpZiAodGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA+IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy52aXNpYmxlUGFnZXNbMF0gPiB0aGlzLmN1cnJlbnRQYWdlKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBNYXRoLm1heCgtdGhpcy5jdXJyZW50UGFnZSwgLWJ1dHRvbnNDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBNYXRoLm1pbihidXR0b25zQ291bnQsIHRoaXMudG90YWxQYWdlcyAtIHRoaXMuY3VycmVudFBhZ2UgKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnV0dG9uc0NvdW50OyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2libGVQYWdlc1tpXSA9IHRoaXMudmlzaWJsZVBhZ2VzW2ldICsgb2Zmc2V0O1xuICAgICAgICAgICAgYnV0dG9uc1tpXS50ZXh0Q29udGVudCA9IHRoaXMudmlzaWJsZVBhZ2VzW2ldO1xuICAgICAgICAgICAgYnV0dG9uc1tpXS5kYXRhc2V0LnBhZ2UgPSB0aGlzLnZpc2libGVQYWdlc1tpXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlU3RhdHVzOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgdGFyZ2V0UGFnZSwgYWN0aXZlQnV0dG9uO1xuXG4gICAgICAgIGlmICgob3B0aW9ucy5wYWdlICYmIG9wdGlvbnMub2Zmc2V0KSB8fCAoIW9wdGlvbnMucGFnZSAmJiAhb3B0aW9ucy5vZmZzZXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0UGFnZSA9IG9wdGlvbnMucGFnZSB8fCB0aGlzLmN1cnJlbnRQYWdlICsgb3B0aW9ucy5vZmZzZXQ7XG4gICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgY2FzZSAodGFyZ2V0UGFnZSA9PT0gdGhpcy5jdXJyZW50UGFnZSk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY2FzZSAodGFyZ2V0UGFnZSA+IHRoaXMudG90YWxQYWdlcyk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY2FzZSAodGFyZ2V0UGFnZSA8IDEpOlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRhcmdldFBhZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlUGFnZXMoKTtcbiAgICAgICAgICAgICAgICBhY3RpdmVCdXR0b24gPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRhcmdldFBhZ2UpO1xuICAgICAgICAgICAgICAgIG9mZmVyc1ZpZXcudXBkYXRlVmlldyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXI6IHRhcmdldFBhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJ1dHRvbkluZGV4OiBhY3RpdmVCdXR0b24sXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXM6IHRoaXMudG90YWxQYWdlc1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBhZGRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhZ2luYXRpb25CdXR0b25zTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdpbmF0aW9uX19idXR0b25zLWxpc3QnKSxcbiAgICAgICAgYnV0dG9uUHJldiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwJylbMF0sXG4gICAgICAgIGJ1dHRvbk5leHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b25zLW5leHQtcHJldl9fd3JhcCcpWzFdLFxuICAgICAgICB0aGF0ID0gdGhpcztcblxuICAgICAgICBwYWdpbmF0aW9uQnV0dG9uc0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdGhhdC51cGRhdGVTdGF0dXMoe1xuICAgICAgICAgICAgICAgIHBhZ2U6IHBhcnNlSW50KGUudGFyZ2V0LmRhdGFzZXQucGFnZSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgYnV0dG9uUHJldi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB0aGF0LnVwZGF0ZVN0YXR1cyh7XG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAtMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b25OZXh0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRoYXQudXBkYXRlU3RhdHVzKHtcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IDFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5vZmZlcnNWaWV3ID0ge1xuICAgIHJlbmRlclRlbXBsYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgc291cmNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy50ZW1wbGF0ZUlkKS50ZXh0Q29udGVudCxcbiAgICAgICAgICAgIHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHNvdXJjZSksXG4gICAgICAgICAgICBjb250ZXh0ID0gb3B0aW9ucy5kYXRhLFxuICAgICAgICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9ucy50YXJnZXRJZCksXG4gICAgICAgICAgICBodG1sID0gdGVtcGxhdGUoY29udGV4dCk7XG5cbiAgICAgICAgdGFyZ2V0LmlubmVySFRNTCA9IGh0bWw7XG4gICAgfSxcbiAgICByZW5kZXJPZmZlcnNMaXN0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLnJlbmRlclRlbXBsYXRlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlSWQ6ICdvZmZlcnMtdGVtcGxhdGUnLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRhcmdldElkOiAnb2ZmZXJzJ1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbmRlck9mZmVyc0Vycm9yOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLnJlbmRlclRlbXBsYXRlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlSWQ6ICdvZmZlcnMtdGVtcGxhdGUtLWVycm9yJyxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB0YXJnZXRJZDogJ29mZmVycydcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICByZW5kZXJQYWdpbmF0aW9uOiBmdW5jdGlvbiAoYnV0dG9uc0NvdW50KSB7XG4gICAgICAgIHZhciBidXR0b25zTmV4dFByZXYsIHRlbXBsYXRlQXJyYXk7XG5cbiAgICAgICAgYnV0dG9uc05leHRQcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAnKTtcbiAgICAgICAgdGVtcGxhdGVBcnJheSA9IEFycmF5LmFwcGx5KG51bGwsIG5ldyBBcnJheShidXR0b25zQ291bnQpKS5tYXAoTnVtYmVyLnByb3RvdHlwZS52YWx1ZU9mLCAwKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgYnV0dG9uc05leHRQcmV2W2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJUZW1wbGF0ZSh7XG4gICAgICAgICAgICB0ZW1wbGF0ZUlkOiAncGFnaW5hdGlvbi1idXR0b24nLFxuICAgICAgICAgICAgZGF0YToge2J1dHRvbnNDb3VudDogdGVtcGxhdGVBcnJheX0sXG4gICAgICAgICAgICB0YXJnZXRJZDogJ3BhZ2luYXRpb25fX2J1dHRvbnMtbGlzdCdcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGRhdGVWaWV3OiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIG9mZmVyc0RhdGEuZ2V0RGF0YShvcHRpb25zLnBhZ2VOdW1iZXIpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoYXQucmVuZGVyT2ZmZXJzTGlzdChkYXRhKTtcbiAgICAgICAgICAgICAgICB0aGF0Lm1hcmtBY3RpdmVCdXR0b24ob3B0aW9ucy5hY3RpdmVCdXR0b25JbmRleCk7XG4gICAgICAgICAgICAgICAgdGhhdC5zaG93SGlkZU5hdkJ1dHRvbnMob3B0aW9ucyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5yZW5mZXJPZmZlcnNFcnJvcihkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG4gICAgbWFya0FjdGl2ZUJ1dHRvbjogZnVuY3Rpb24gKGJ1dHRvbkluZGV4KSB7XG4gICAgICAgIHZhciBjbGFzc0FjdGl2ZSA9ICdwYWdpbmF0aW9uX19idXR0b24tLWFjdGl2ZScsXG4gICAgICAgIGJ1dHRvbnNBY3RpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzQWN0aXZlKSxcbiAgICAgICAgYnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhZ2luYXRpb25fX2J1dHRvbicpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnV0dG9uc0FjdGl2ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGJ1dHRvbnNBY3RpdmVbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc0FjdGl2ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBidXR0b25zW2J1dHRvbkluZGV4XS5jbGFzc0xpc3QuYWRkKGNsYXNzQWN0aXZlKTtcbiAgICB9LFxuICAgIHNob3dIaWRlTmF2QnV0dG9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGJ1dHRvbnNOZXh0UHJldiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwJyksXG4gICAgICAgIGNsYXNzSW5hY3RpdmUgPSAnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAtLWluYWN0aXZlJyxcbiAgICAgICAgYnV0dG9uc05leFByZXZJbmFjdGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NJbmFjdGl2ZSk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGFnZU51bWJlciA+IDEgJiYgb3B0aW9ucy5wYWdlTnVtYmVyIDwgb3B0aW9ucy50b3RhbFBhZ2VzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJ1dHRvbnNOZXhQcmV2SW5hY3RpdmUubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uc05leFByZXZJbmFjdGl2ZVtpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMucGFnZU51bWJlciA9PT0gMSkge1xuICAgICAgICAgICAgYnV0dG9uc05leHRQcmV2WzBdLmNsYXNzTGlzdC5hZGQoY2xhc3NJbmFjdGl2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBidXR0b25zTmV4dFByZXZbMV0uY2xhc3NMaXN0LmFkZChjbGFzc0luYWN0aXZlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm9mZmVyc1N0YXRlLmluaXQoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==