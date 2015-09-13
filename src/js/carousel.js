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

