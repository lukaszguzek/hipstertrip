/*window.onload = function () {*/
'use strict';
var offersList = {};

offersList = {
    totalPages: null,
    currentPage: 1,
    baseUrl: 'http://camp.efigence.com/camp/api/places?page=',
    buttonsLimit: 10,
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

        var l = paginationButtons.length;
        if (this.currentPage != l + 1) {
            console.log('nie zadzialam');
            return false;
        };

        var offset = 0;
        offset = Math.min(this.totalPages - this.currentPage + 1, this.buttonsLimit);
        console.log('OFFSET: ' + offset);


        for (var i = 0; i < l; i++) {
            paginationButtons[i].textContent = parseInt(paginationButtons[i].dataset.page) + offset;
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
