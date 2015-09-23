(function () {
    var btn = document.querySelector('.hamburger-button'),
    mainMenu = document.querySelector('.main-menu'),
    collapseClass = 'main-menu--collapsed',
    animationExpand = 'animated--scaleIn';
    animationCollapse = 'animated--scaleOut',
    animationDelay = 300;

    btn.addEventListener('click', function () {
        if (mainMenu.classList.contains(collapseClass)) {
            mainMenu.classList.toggle(collapseClass);
            mainMenu.classList.toggle(animationExpand);
        } else {
            mainMenu.classList.toggle(animationExpand);
            mainMenu.classList.toggle(animationCollapse);
            setTimeout(function () {
                mainMenu.classList.toggle(collapseClass);
                mainMenu.classList.toggle(animationCollapse);
            }, animationDelay);
        }
        btn.classList.toggle('fa-bars');
        btn.classList.toggle('fa-times');
    })
})();
