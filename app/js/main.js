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


window.onload = function () {
    var coordinates = {lat: 52.230415, lng: 20.997336},
    map = new google.maps.LatLng(coordinates.lat, coordinates.lng),
    mapOptions = {
        zoom: 16,
        streetViewControl: false,
        scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: map
    },
    mapContainer = document.getElementsByClassName('google-map')[0],
    backgroundMap = new google.maps.Map(mapContainer, mapOptions);
};

(function () {
    var btn = document.querySelector('.hamburger-button'),
    mainMenu = document.querySelector('.main-menu'),
    className = 'main-menu--collapsed';

    btn.addEventListener('click', function () {
        mainMenu.classList.toggle(className);
        btn.classList.toggle('fa-bars');
        btn.classList.toggle('fa-times');
    })
})();

(function () {
    'use strict';
    var headerVideo = document.getElementById('header-video'),
    format = 'video/mp4',
    playButton = document.getElementsByClassName('controls__play')[0],
    pauseButton = document.getElementsByClassName('controls__pause--light')[0],
    playingNow = false;

    if (canPlayTest(headerVideo, format)) {
        loadHeaderVideo();
    } else {
        loadVideoAltImage();
    }

    function canPlayTest(videoClip, format) {
        return videoClip.canPlayType(format).length > 0 || false;
    }

    function tryToPlay() {
        headerVideo.addEventListener('error', function () {
            loadVideoAltImage();
        });
        headerVideo.play();
        headerVideo.pause();
    }

    function loadHeaderVideo() {
        var headerVideoUrl = './video/video.mp4#t=1';

        headerVideo.src = headerVideoUrl;
        headerVideo.load();
        tryToPlay();
    }

    function loadVideoAltImage() {
        var videoAltImage = document.getElementById('video-alt-img'),
        videoAltImageSrc = './img/video-img.jpg';

        playButton.classList.add('hidden');
        videoAltImage.src = videoAltImageSrc;
        headerVideo.classList.add('hidden');
        videoAltImage.classList.remove('hidden');
    }

    function toggleControls() {
        var controls = document.getElementsByClassName('controls__content')[0];
        controls.classList.toggle('hidden');
        pauseButton.classList.toggle('hidden');
    }

    function togglePlay() {
        if (playingNow) {
            headerVideo.pause();
            playingNow = false;
        } else {
            headerVideo.play();
            playingNow = true;
        }
    }

    headerVideo.addEventListener('playing', function () {
        playingNow = true;
    });


    playButton.addEventListener('click', function () {
        toggleControls();
        togglePlay();
    });

    pauseButton.addEventListener('click', function () {
        toggleControls();
        togglePlay();
    });
})();




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2VsLmpzIiwiZ29vZ2xlLW1hcHMtYmFja2dyb3Vucy5qcyIsInRvb2dsZS1tZW51LmpzIiwidmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJvd1ByZXYgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzbGlkZXJfX2Fycm93LS1wcmV2JylbMF07XG4gICAgdmFyIGFycm93TmV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NsaWRlcl9fYXJyb3ctLW5leHQnKVswXTtcblxuICAgICQoJy5zbGlkZXMtY29udGFpbmVyJykuc2xpY2soe1xuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICBhcnJvd3M6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICBwcmV2QXJyb3c6IGFycm93UHJldixcbiAgICAgICAgbmV4dEFycm93OiBhcnJvd05leHQsXG4gICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjYwLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMzAsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogM1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0pXG59KTtcblxuIiwid2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29vcmRpbmF0ZXMgPSB7bGF0OiA1Mi4yMzA0MTUsIGxuZzogMjAuOTk3MzM2fSxcbiAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNvb3JkaW5hdGVzLmxhdCwgY29vcmRpbmF0ZXMubG5nKSxcbiAgICBtYXBPcHRpb25zID0ge1xuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuICAgICAgICBzY2FsZUNvbnRyb2w6IHRydWUsXG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG4gICAgICAgIGNlbnRlcjogbWFwXG4gICAgfSxcbiAgICBtYXBDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdnb29nbGUtbWFwJylbMF0sXG4gICAgYmFja2dyb3VuZE1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwQ29udGFpbmVyLCBtYXBPcHRpb25zKTtcbn07XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgIHZhciBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGFtYnVyZ2VyLWJ1dHRvbicpLFxuICAgIG1haW5NZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tbWVudScpLFxuICAgIGNsYXNzTmFtZSA9ICdtYWluLW1lbnUtLWNvbGxhcHNlZCc7XG5cbiAgICBidG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1haW5NZW51LmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2ZhLWJhcnMnKTtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2ZhLXRpbWVzJyk7XG4gICAgfSlcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgaGVhZGVyVmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyLXZpZGVvJyksXG4gICAgZm9ybWF0ID0gJ3ZpZGVvL21wNCcsXG4gICAgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19wbGF5JylbMF0sXG4gICAgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fcGF1c2UtLWxpZ2h0JylbMF0sXG4gICAgcGxheWluZ05vdyA9IGZhbHNlO1xuXG4gICAgaWYgKGNhblBsYXlUZXN0KGhlYWRlclZpZGVvLCBmb3JtYXQpKSB7XG4gICAgICAgIGxvYWRIZWFkZXJWaWRlbygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxvYWRWaWRlb0FsdEltYWdlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuUGxheVRlc3QodmlkZW9DbGlwLCBmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHZpZGVvQ2xpcC5jYW5QbGF5VHlwZShmb3JtYXQpLmxlbmd0aCA+IDAgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJ5VG9QbGF5KCkge1xuICAgICAgICBoZWFkZXJWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvYWRWaWRlb0FsdEltYWdlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBoZWFkZXJWaWRlby5wbGF5KCk7XG4gICAgICAgIGhlYWRlclZpZGVvLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZEhlYWRlclZpZGVvKCkge1xuICAgICAgICB2YXIgaGVhZGVyVmlkZW9VcmwgPSAnLi92aWRlby92aWRlby5tcDQjdD0xJztcblxuICAgICAgICBoZWFkZXJWaWRlby5zcmMgPSBoZWFkZXJWaWRlb1VybDtcbiAgICAgICAgaGVhZGVyVmlkZW8ubG9hZCgpO1xuICAgICAgICB0cnlUb1BsYXkoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkVmlkZW9BbHRJbWFnZSgpIHtcbiAgICAgICAgdmFyIHZpZGVvQWx0SW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW8tYWx0LWltZycpLFxuICAgICAgICB2aWRlb0FsdEltYWdlU3JjID0gJy4vaW1nL3ZpZGVvLWltZy5qcGcnO1xuXG4gICAgICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHZpZGVvQWx0SW1hZ2Uuc3JjID0gdmlkZW9BbHRJbWFnZVNyYztcbiAgICAgICAgaGVhZGVyVmlkZW8uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgIHZpZGVvQWx0SW1hZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlQ29udHJvbHMoKSB7XG4gICAgICAgIHZhciBjb250cm9scyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19jb250ZW50JylbMF07XG4gICAgICAgIGNvbnRyb2xzLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuICAgICAgICBwYXVzZUJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVQbGF5KCkge1xuICAgICAgICBpZiAocGxheWluZ05vdykge1xuICAgICAgICAgICAgaGVhZGVyVmlkZW8ucGF1c2UoKTtcbiAgICAgICAgICAgIHBsYXlpbmdOb3cgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhlYWRlclZpZGVvLnBsYXkoKTtcbiAgICAgICAgICAgIHBsYXlpbmdOb3cgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGVhZGVyVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcGxheWluZ05vdyA9IHRydWU7XG4gICAgfSk7XG5cblxuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZUNvbnRyb2xzKCk7XG4gICAgICAgIHRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcblxuICAgIHBhdXNlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGVDb250cm9scygpO1xuICAgICAgICB0b2dnbGVQbGF5KCk7XG4gICAgfSk7XG59KSgpO1xuXG5cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9