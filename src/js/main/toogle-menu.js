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
