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
    pauseButton = document.getElementsByClassName('controls__pause')[0],
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




//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2dsZS1tZW51LmpzIiwidmlkZW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXItYnV0dG9uJyksXG4gICAgbWFpbk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1tZW51JyksXG4gICAgY2xhc3NOYW1lID0gJ21haW4tbWVudS0tY29sbGFwc2VkJztcblxuICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbWFpbk1lbnUuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtYmFycycpO1xuICAgICAgICBidG4uY2xhc3NMaXN0LnRvZ2dsZSgnZmEtdGltZXMnKTtcbiAgICB9KVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBoZWFkZXJWaWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXItdmlkZW8nKSxcbiAgICBmb3JtYXQgPSAndmlkZW8vbXA0JyxcbiAgICBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udHJvbHNfX3BsYXknKVswXSxcbiAgICBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRyb2xzX19wYXVzZScpWzBdLFxuICAgIHBsYXlpbmdOb3cgPSBmYWxzZTtcblxuICAgIGlmIChjYW5QbGF5VGVzdChoZWFkZXJWaWRlbywgZm9ybWF0KSkge1xuICAgICAgICBsb2FkSGVhZGVyVmlkZW8oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsb2FkVmlkZW9BbHRJbWFnZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblBsYXlUZXN0KHZpZGVvQ2xpcCwgZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB2aWRlb0NsaXAuY2FuUGxheVR5cGUoZm9ybWF0KS5sZW5ndGggPiAwIHx8IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyeVRvUGxheSgpIHtcbiAgICAgICAgaGVhZGVyVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsb2FkVmlkZW9BbHRJbWFnZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgaGVhZGVyVmlkZW8ucGxheSgpO1xuICAgICAgICBoZWFkZXJWaWRlby5wYXVzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRIZWFkZXJWaWRlbygpIHtcbiAgICAgICAgdmFyIGhlYWRlclZpZGVvVXJsID0gJy4vdmlkZW8vdmlkZW8ubXA0I3Q9MSc7XG5cbiAgICAgICAgaGVhZGVyVmlkZW8uc3JjID0gaGVhZGVyVmlkZW9Vcmw7XG4gICAgICAgIGhlYWRlclZpZGVvLmxvYWQoKTtcbiAgICAgICAgdHJ5VG9QbGF5KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZFZpZGVvQWx0SW1hZ2UoKSB7XG4gICAgICAgIHZhciB2aWRlb0FsdEltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLWFsdC1pbWcnKSxcbiAgICAgICAgdmlkZW9BbHRJbWFnZVNyYyA9ICcuL2ltZy92aWRlby1pbWcuanBnJztcblxuICAgICAgICBwbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB2aWRlb0FsdEltYWdlLnNyYyA9IHZpZGVvQWx0SW1hZ2VTcmM7XG4gICAgICAgIGhlYWRlclZpZGVvLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICB2aWRlb0FsdEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUNvbnRyb2xzKCkge1xuICAgICAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjb250cm9sc19fY29udGVudCcpWzBdO1xuICAgICAgICBjb250cm9scy5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbiAgICAgICAgcGF1c2VCdXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUGxheSgpIHtcbiAgICAgICAgaWYgKHBsYXlpbmdOb3cpIHtcbiAgICAgICAgICAgIGhlYWRlclZpZGVvLnBhdXNlKCk7XG4gICAgICAgICAgICBwbGF5aW5nTm93ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoZWFkZXJWaWRlby5wbGF5KCk7XG4gICAgICAgICAgICBwbGF5aW5nTm93ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhlYWRlclZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBsYXlpbmdOb3cgPSB0cnVlO1xuICAgIH0pO1xuXG5cbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0b2dnbGVDb250cm9scygpO1xuICAgICAgICB0b2dnbGVQbGF5KCk7XG4gICAgfSk7XG5cbiAgICBwYXVzZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdG9nZ2xlQ29udHJvbHMoKTtcbiAgICAgICAgdG9nZ2xlUGxheSgpO1xuICAgIH0pO1xufSkoKTtcblxuXG5cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==