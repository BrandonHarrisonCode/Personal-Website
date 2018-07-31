"use strict";

function WidthChange(screensize) {
    var intro = document.getElementById('intro');
    var logo = document.getElementById('logo');
    var resume = document.getElementById('resume');
    var headshot = document.getElementById('headshot')

    if(screensize.matches) {
        intro.style.width = '50vw';
        resume.style.width = '50vw';
        logo.style.width = '50vw';
        headshot.style.width = '50vw';
    } else {
        intro.style.width = '100vw';
        resume.style.width = '100vw';
        logo.style.width = '100vw';
        headshot.style.width = '100vw';
    }
}

const largeScreen = window.matchMedia( "(min-device-width: 40em)" );
largeScreen.addListener(WidthChange);

async function portraitLoad() {
    if(!largeScreen.matches) {
        var intro = document.getElementById('intro');
        intro.style.visibility = 'visible';

        var logo = document.getElementById('logo');
        var resume = document.getElementById('resume');
        var resumetext = document.getElementById('resumetext');

        resumetext.style.visibility = 'visible';
        logo.style.visibility = 'hidden';

        return;
    }

    var intro = document.getElementById('intro')
    var headshot = document.getElementById('headshot')
    var logo = document.getElementById('logo');
    var resume = document.getElementById('resume');
    var resumetext = document.getElementById('resumetext');
    var bio = document.getElementById('bio');

    // Make it so there is no scroll bar during the loading screen
    var resumetemp = resumetext.innerHTML;
    resumetext.innerHTML = '';

    await sleep(2000);

    intro.style.visibility = 'visible';
    addClass(intro, 'slide-to-right');
    addClass(headshot, 'slide-to-right');

    addClass(resume, 'push-to-right')
    addClass(logo, 'push-to-right')

    addClass(bio, 'grow-text');

    await sleep(1000);

    resume.style.width = '50vw';
    logo.style.width = '50vw';

    await sleep(500);

    resumetext.innerHTML = resumetemp;
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
