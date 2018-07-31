"use strict";

async function portraitLoad() {
    await sleep(2000);

    var intro = document.getElementById('intro')
    var headshot = document.getElementById('headshot')
    intro.style.visibility = 'visible';
    addClass(intro, 'slide-to-right');
    addClass(headshot, 'slide-to-right');

    var logo = document.getElementById('logo');
    var resume = document.getElementById('resume');
    var resumetext = document.getElementById('resumetext');
    addClass(resume, 'push-to-right')
    addClass(logo, 'push-to-right')

    var bio = document.getElementById('bio');
    addClass(bio, 'grow-text');

    await sleep(1000);

    resume.style.width = '50vw';
    logo.style.width = '50vw';

    await sleep(500);

    addClass(logo, 'fade-out');
    await sleep(400);

    resumetext.style.visibility = 'visible';
    addClass(resumetext, 'fade-in');

    await sleep(600);
    logo.style.visibility = 'hidden';
}

function addClass(elem, className) {
    if (elem.classList)
        elem.classList.add(className);
    else
        elem.className += ' ' + className;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
