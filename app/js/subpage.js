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
    maxNumberOfButtons: 3,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhhbmRsZWJhcnMtaGVscGVycy5qcyIsIm1haW4tc3VicGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InN1YnBhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3RpbWVzJywgZnVuY3Rpb24gKG51bWJlciwgZWxlbWVudCkge1xuICAgICAgICB2YXIgYXJyID0gbmV3IEFycmF5KG51bWJlciArIDEpLFxuICAgICAgICByZXN1bHQgPSBhcnIuam9pbihlbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignaW5jcmVhc2UnLCBmdW5jdGlvbiAodmFsdWUsIHN0ZXApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICsgc3RlcDtcbiAgICB9KTtcblxuXG4gICAgSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignc2NvcmVEZXNjcmlwdGlvbicsIGZ1bmN0aW9uIChzY29yZSkge1xuICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSAnJztcblxuICAgICAgICBzd2l0Y2ggKHRydWUpIHtcbiAgICAgICAgICAgIGNhc2UgKHNjb3JlIDw9IDMpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ0ZhdGFsbnknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiAzICYmIHNjb3JlIDw9IDUpOlxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ05pZSBuYWpsZXBzenknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiA1ICYmIHNjb3JlIDwgNi40KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdQcnplY2nEmXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDUgJiYgc2NvcmUgPD0gNi41KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdQcnplY2nEmXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIChzY29yZSA+IDYuNSAmJiBzY29yZSA8PSA4KTpcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdCYXJkem8gZG9icnknO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAoc2NvcmUgPiA4ICYmIHNjb3JlIDwgOSk6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnWm5ha29taXR5JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSAnV3liaXRueSc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVzY3JpcHRpb24gKyAnICcgKyBzY29yZTtcbiAgICB9KTtcblxuICAgIEhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2lzRXF1YWwnLCBmdW5jdGlvbiAocHJpY2VSZWd1bGFyLCBwcmljZVByb21vKSB7XG4gICAgICAgIHJldHVybiBwcmljZVJlZ3VsYXIgPT09IHByaWNlUHJvbW87XG4gICAgfSk7XG59KSgpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvZmZlcnNEYXRhLCBvZmZlcnNWaWV3LCBvZmZlcnNTdGF0ZTtcblxub2ZmZXJzRGF0YSA9IHtcbiAgICBiYXNlVXJsOiAnLy9jYW1wLmVmaWdlbmNlLmNvbS9jYW1wL2FwaS9wbGFjZXM/cGFnZT0nLFxuICAgIGdldERhdGE6IGZ1bmN0aW9uIChwYWdlTnVtYmVyKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgY3Jvc3NEb21haW46IHRydWUsXG4gICAgICAgICAgICB1cmw6IHRoYXQuYmFzZVVybCArIHBhZ2VOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxub2ZmZXJzU3RhdGUgPSB7XG4gICAgdG90YWxQYWdlczogbnVsbCxcbiAgICBjdXJyZW50UGFnZTogMSxcbiAgICBtYXhOdW1iZXJPZkJ1dHRvbnM6IDMsXG4gICAgbnVtYmVyT2ZWaXNpYmxlQnV0dG9uczogbnVsbCxcbiAgICB2aXNpYmxlUGFnZXM6IFtdLFxuXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIG9mZmVyc0RhdGEuZ2V0RGF0YSgpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoYXQudG90YWxQYWdlcyA9IGRhdGEudG90YWxfcGFnZXM7XG4gICAgICAgICAgICAgICAgdGhhdC5udW1iZXJPZlZpc2libGVCdXR0b25zID0gTWF0aC5taW4odGhhdC50b3RhbFBhZ2VzLCB0aGF0Lm1heE51bWJlck9mQnV0dG9ucyk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXQubnVtYmVyT2ZWaXNpYmxlQnV0dG9uczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudmlzaWJsZVBhZ2VzLnB1c2goaSArIDEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9mZmVyc1ZpZXcudXBkYXRlVmlldyh7XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VOdW1iZXI6IDEsXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUJ1dHRvbkluZGV4OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgb2ZmZXJzVmlldy5yZW5kZXJQYWdpbmF0aW9uKHRoYXQubnVtYmVyT2ZWaXNpYmxlQnV0dG9ucyk7XG4gICAgICAgICAgICAgICAgdGhhdC5hZGRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG4gICAgdXBkYXRlVmlzaWJsZVBhZ2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidXR0b25zQ291bnQgPSB0aGlzLm51bWJlck9mVmlzaWJsZUJ1dHRvbnMsXG4gICAgICAgIGJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYWdpbmF0aW9uX19idXR0b24nKSxcbiAgICAgICAgb2Zmc2V0O1xuXG4gICAgICAgIGlmICh0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnZpc2libGVQYWdlc1swXSA+IHRoaXMuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IE1hdGgubWF4KC10aGlzLmN1cnJlbnRQYWdlLCAtYnV0dG9uc0NvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IE1hdGgubWluKGJ1dHRvbnNDb3VudCwgdGhpcy50b3RhbFBhZ2VzIC0gdGhpcy5jdXJyZW50UGFnZSArIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBidXR0b25zQ291bnQ7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVBhZ2VzW2ldID0gdGhpcy52aXNpYmxlUGFnZXNbaV0gKyBvZmZzZXQ7XG4gICAgICAgICAgICBidXR0b25zW2ldLnRleHRDb250ZW50ID0gdGhpcy52aXNpYmxlUGFnZXNbaV07XG4gICAgICAgICAgICBidXR0b25zW2ldLmRhdGFzZXQucGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzW2ldO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVTdGF0dXM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB0YXJnZXRQYWdlLCBhY3RpdmVCdXR0b247XG5cbiAgICAgICAgaWYgKChvcHRpb25zLnBhZ2UgJiYgb3B0aW9ucy5vZmZzZXQpIHx8ICghb3B0aW9ucy5wYWdlICYmICFvcHRpb25zLm9mZnNldCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRQYWdlID0gb3B0aW9ucy5wYWdlIHx8IHRoaXMuY3VycmVudFBhZ2UgKyBvcHRpb25zLm9mZnNldDtcbiAgICAgICAgc3dpdGNoICh0cnVlKSB7XG4gICAgICAgICAgICBjYXNlICh0YXJnZXRQYWdlID09PSB0aGlzLmN1cnJlbnRQYWdlKTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBjYXNlICh0YXJnZXRQYWdlID4gdGhpcy50b3RhbFBhZ2VzKTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBjYXNlICh0YXJnZXRQYWdlIDwgMSk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGFyZ2V0UGFnZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVQYWdlcygpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZUJ1dHRvbiA9IHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGFyZ2V0UGFnZSk7XG4gICAgICAgICAgICAgICAgb2ZmZXJzVmlldy51cGRhdGVWaWV3KHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZU51bWJlcjogdGFyZ2V0UGFnZSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQnV0dG9uSW5kZXg6IGFjdGl2ZUJ1dHRvbixcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQYWdlczogdGhpcy50b3RhbFBhZ2VzXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGFkZExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFnaW5hdGlvbkJ1dHRvbnNMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2luYXRpb25fX2J1dHRvbnMtbGlzdCcpLFxuICAgICAgICBidXR0b25QcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAnKVswXSxcbiAgICAgICAgYnV0dG9uTmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMtbmV4dC1wcmV2X193cmFwJylbMV0sXG4gICAgICAgIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHBhZ2luYXRpb25CdXR0b25zTGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB0aGF0LnVwZGF0ZVN0YXR1cyh7XG4gICAgICAgICAgICAgICAgcGFnZTogcGFyc2VJbnQoZS50YXJnZXQuZGF0YXNldC5wYWdlKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBidXR0b25QcmV2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHRoYXQudXBkYXRlU3RhdHVzKHtcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IC0xXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJ1dHRvbk5leHQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdGhhdC51cGRhdGVTdGF0dXMoe1xuICAgICAgICAgICAgICAgIG9mZnNldDogMVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbm9mZmVyc1ZpZXcgPSB7XG4gICAgcmVuZGVyVGVtcGxhdGU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLnRlbXBsYXRlSWQpLnRleHRDb250ZW50LFxuICAgICAgICAgICAgdGVtcGxhdGUgPSBIYW5kbGViYXJzLmNvbXBpbGUoc291cmNlKSxcbiAgICAgICAgICAgIGNvbnRleHQgPSBvcHRpb25zLmRhdGEsXG4gICAgICAgICAgICB0YXJnZXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb25zLnRhcmdldElkKSxcbiAgICAgICAgICAgIGh0bWwgPSB0ZW1wbGF0ZShjb250ZXh0KTtcblxuICAgICAgICB0YXJnZXQuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB9LFxuICAgIHJlbmRlck9mZmVyc0xpc3Q6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVGVtcGxhdGUoe1xuICAgICAgICAgICAgdGVtcGxhdGVJZDogJ29mZmVycy10ZW1wbGF0ZScsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgdGFyZ2V0SWQ6ICdvZmZlcnMnXG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcmVuZGVyT2ZmZXJzRXJyb3I6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVGVtcGxhdGUoe1xuICAgICAgICAgICAgdGVtcGxhdGVJZDogJ29mZmVycy10ZW1wbGF0ZS0tZXJyb3InLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIHRhcmdldElkOiAnb2ZmZXJzJ1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbmRlclBhZ2luYXRpb246IGZ1bmN0aW9uIChidXR0b25zQ291bnQpIHtcbiAgICAgICAgdmFyIGJ1dHRvbnNOZXh0UHJldiwgdGVtcGxhdGVBcnJheTtcblxuICAgICAgICBidXR0b25zTmV4dFByZXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b25zLW5leHQtcHJldl9fd3JhcCcpO1xuICAgICAgICB0ZW1wbGF0ZUFycmF5ID0gQXJyYXkuYXBwbHkobnVsbCwgbmV3IEFycmF5KGJ1dHRvbnNDb3VudCkpLm1hcChOdW1iZXIucHJvdG90eXBlLnZhbHVlT2YsIDApO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7XG4gICAgICAgICAgICBidXR0b25zTmV4dFByZXZbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlclRlbXBsYXRlKHtcbiAgICAgICAgICAgIHRlbXBsYXRlSWQ6ICdwYWdpbmF0aW9uLWJ1dHRvbicsXG4gICAgICAgICAgICBkYXRhOiB7YnV0dG9uc0NvdW50OiB0ZW1wbGF0ZUFycmF5fSxcbiAgICAgICAgICAgIHRhcmdldElkOiAncGFnaW5hdGlvbl9fYnV0dG9ucy1saXN0J1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHVwZGF0ZVZpZXc6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgb2ZmZXJzRGF0YS5nZXREYXRhKG9wdGlvbnMucGFnZU51bWJlcilcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhhdC5yZW5kZXJPZmZlcnNMaXN0KGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoYXQubWFya0FjdGl2ZUJ1dHRvbihvcHRpb25zLmFjdGl2ZUJ1dHRvbkluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGF0LnNob3dIaWRlTmF2QnV0dG9ucyhvcHRpb25zKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZXJyb3IoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGF0LnJlbmZlck9mZmVyc0Vycm9yKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBtYXJrQWN0aXZlQnV0dG9uOiBmdW5jdGlvbiAoYnV0dG9uSW5kZXgpIHtcbiAgICAgICAgdmFyIGNsYXNzQWN0aXZlID0gJ3BhZ2luYXRpb25fX2J1dHRvbi0tYWN0aXZlJyxcbiAgICAgICAgYnV0dG9uc0FjdGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NBY3RpdmUpLFxuICAgICAgICBidXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFnaW5hdGlvbl9fYnV0dG9uJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBidXR0b25zQWN0aXZlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgYnV0dG9uc0FjdGl2ZVtpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzQWN0aXZlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1dHRvbnNbYnV0dG9uSW5kZXhdLmNsYXNzTGlzdC5hZGQoY2xhc3NBY3RpdmUpO1xuICAgIH0sXG4gICAgc2hvd0hpZGVOYXZCdXR0b25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgYnV0dG9uc05leHRQcmV2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYnV0dG9ucy1uZXh0LXByZXZfX3dyYXAnKSxcbiAgICAgICAgY2xhc3NJbmFjdGl2ZSA9ICdidXR0b25zLW5leHQtcHJldl9fd3JhcC0taW5hY3RpdmUnLFxuICAgICAgICBidXR0b25zTmV4UHJldkluYWN0aXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc0luYWN0aXZlKTtcblxuICAgICAgICBpZiAob3B0aW9ucy5wYWdlTnVtYmVyID4gMSAmJiBvcHRpb25zLnBhZ2VOdW1iZXIgPCBvcHRpb25zLnRvdGFsUGFnZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnV0dG9uc05leFByZXZJbmFjdGl2ZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBidXR0b25zTmV4UHJldkluYWN0aXZlW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NJbmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5wYWdlTnVtYmVyID09PSAxKSB7XG4gICAgICAgICAgICBidXR0b25zTmV4dFByZXZbMF0uY2xhc3NMaXN0LmFkZChjbGFzc0luYWN0aXZlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJ1dHRvbnNOZXh0UHJldlsxXS5jbGFzc0xpc3QuYWRkKGNsYXNzSW5hY3RpdmUpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxub2ZmZXJzU3RhdGUuaW5pdCgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9