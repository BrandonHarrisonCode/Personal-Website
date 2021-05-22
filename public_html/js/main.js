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
    var intro = document.getElementById('intro')
    var headshot = document.getElementById('headshot')
    var logo = document.getElementById('logo');
    var resume = document.getElementById('resume');
    var resumetext = document.getElementById('resumetext');
    var bio = document.getElementById('bio');
    var tint = document.getElementById('tint');

    if(!largeScreen.matches) {
        var intro = document.getElementById('intro');
        intro.style.visibility = 'visible';

        resumetext.style.visibility = 'visible';
        logo.style.visibility = 'hidden';
        document.body.classList.remove("noscroll");

        return;
    }

    if ('hasCodeRunBefore' in localStorage) {
        resume.style.width = '50vw';
        resume.style.overflowX = 'hidden';
        headshot.style.width = '50vw';
        bio.fontSize = '1.6vw';
        document.body.classList.remove("noscroll");

        resumetext.style.visibility = 'visible';
        headshot.style.visibility = 'visible';
        bio.style.visibility = 'visible';
        tint.style.visibility = 'visible';
        logo.style.visibility = 'hidden';
        return;
    }
    localStorage.setItem("hasCodeRunBefore", true);
    window.scrollTo(0, 0);

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

    document.body.classList.remove("noscroll");
    addClass(logo, 'fade-out');
    await sleep(400);

    resumetext.style.visibility = 'visible';
    addClass(resumetext, 'fade-in');

    await sleep(600);
    logo.style.visibility = 'hidden';
}

function updateAge() {
  let yearsOld = dateDiffInYears(new Date(Date.UTC(1997, 0, 9, 7, 12)), new Date());
  document.getElementById('age').textContent = yearsOld;
  setTimeout(updateAge, 100);
}
setTimeout(updateAge, 100);

function dateDiffInYears(date0, date1) {
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.24;

  return (date1.getTime() - date0.getTime()) / millisecondsPerYear;
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
