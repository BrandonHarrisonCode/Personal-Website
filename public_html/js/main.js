"use strict";

function portraitLoad() {
    var intro = document.getElementById('intro')
    var headshot = document.getElementById('headshot')
    intro.style.visibility = 'visible';
    addClass(intro, 'slide-to-right');
    addClass(headshot, 'slide-to-right');

    var resume = document.getElementById('resume');
    addClass(resume, 'push-to-right')

    var bio = document.getElementById('bio');
    addClass(bio, 'grow-text');
}

function addClass(elem, className) {
    if (elem.classList)
        elem.classList.add(className);
    else
        elem.className += ' ' + className;
}
