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




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2dsZS1tZW51LmpzIiwidmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXItYnV0dG9uJyksXG4gICAgbWFpbk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1tZW51JyksXG4gICAgY2xhc3NOYW1lID0gJ21haW4tbWVudS0tY29sbGFwc2VkJztcblxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFpbk1lbnUuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtYmFycycpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtdGltZXMnKTtcbiAgICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBoZWFkZXJWaWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItdmlkZW8nKSxcbiAgICBmb3JtYXQgPSAndmlkZW8vbXA0JyxcbiAgICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX3BsYXknKVswXSxcbiAgICBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19wYXVzZS0tbGlnaHQnKVswXSxcbiAgICBwbGF5aW5nTm93ID0gZmFsc2U7XG5cbiAgICBpZiAoY2FuUGxheVRlc3QoaGVhZGVyVmlkZW8sIGZvcm1hdCkpIHtcbiAgICAgICAgbG9hZEhlYWRlclZpZGVvKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbG9hZFZpZGVvQWx0SW1hZ2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5QbGF5VGVzdCh2aWRlb0NsaXAsIGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdmlkZW9DbGlwLmNhblBsYXlUeXBlKGZvcm1hdCkubGVuZ3RoID4gMCB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cnlUb1BsYXkoKSB7XG4gICAgICAgIGhlYWRlclZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9hZFZpZGVvQWx0SW1hZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGhlYWRlclZpZGVvLnBsYXkoKTtcbiAgICAgICAgaGVhZGVyVmlkZW8ucGF1c2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkSGVhZGVyVmlkZW8oKSB7XG4gICAgICAgIHZhciBoZWFkZXJWaWRlb1VybCA9ICcuL3ZpZGVvL3ZpZGVvLm1wNCN0PTEnO1xuXG4gICAgICAgIGhlYWRlclZpZGVvLnNyYyA9IGhlYWRlclZpZGVvVXJsO1xuICAgICAgICBoZWFkZXJWaWRlby5sb2FkKCk7XG4gICAgICAgIHRyeVRvUGxheSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRWaWRlb0FsdEltYWdlKCkge1xuICAgICAgICB2YXIgdmlkZW9BbHRJbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby1hbHQtaW1nJyksXG4gICAgICAgIHZpZGVvQWx0SW1hZ2VTcmMgPSAnLi9pbWcvdmlkZW8taW1nLmpwZyc7XG5cbiAgICAgICAgcGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgdmlkZW9BbHRJbWFnZS5zcmMgPSB2aWRlb0FsdEltYWdlU3JjO1xuICAgICAgICBoZWFkZXJWaWRlby5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgdmlkZW9BbHRJbWFnZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVDb250cm9scygpIHtcbiAgICAgICAgdmFyIGNvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX2NvbnRlbnQnKVswXTtcbiAgICAgICAgY29udHJvbHMuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG4gICAgICAgIHBhdXNlQnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVBsYXkoKSB7XG4gICAgICAgIGlmIChwbGF5aW5nTm93KSB7XG4gICAgICAgICAgICBoZWFkZXJWaWRlby5wYXVzZSgpO1xuICAgICAgICAgICAgcGxheWluZ05vdyA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGVhZGVyVmlkZW8ucGxheSgpO1xuICAgICAgICAgICAgcGxheWluZ05vdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkZXJWaWRlby5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBwbGF5aW5nTm93ID0gdHJ1ZTtcbiAgICB9KTtcblxuXG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9nZ2xlQ29udHJvbHMoKTtcbiAgICAgICAgdG9nZ2xlUGxheSgpO1xuICAgIH0pO1xuXG4gICAgcGF1c2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRvZ2dsZUNvbnRyb2xzKCk7XG4gICAgICAgIHRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcbn0pKCk7XG5cblxuXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=