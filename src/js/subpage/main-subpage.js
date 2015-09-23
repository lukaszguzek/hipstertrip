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
