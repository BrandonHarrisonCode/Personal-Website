"use strict";

import "./index.html";
import "./style.css";

/**
 * Handles changes to the screen width.
 * @param {window.matchMedia} screensize The criteria for changing formats.
 */
function WidthChange(screensize) {
  const intro = document.getElementById("intro");
  const logo = document.getElementById("logo");
  const resume = document.getElementById("resume");

  if (screensize.matches) {
    intro.style.width = "100%";
    resume.style.width = "100%";
    logo.style.width = "100%";
  } else {
    intro.style.width = "100vw";
    resume.style.width = "100vw";
    logo.style.width = "100vw";
  }
}

const largeScreen = window.matchMedia("(min-device-width: 40em)");
largeScreen.addListener(WidthChange);

/*
 * Initial loading of resources and screen layout.
 */
window.onload = async function portraitLoad() {
  const intro = document.getElementById("intro");
  const logo = document.getElementById("logo");
  const resume = document.getElementById("resume");
  const resumetext = document.getElementById("resumetext");
  const bio = document.getElementById("bio");

  if (!largeScreen.matches) {
    const intro = document.getElementById("intro");
    intro.style.visibility = "visible";

    resumetext.style.visibility = "visible";
    logo.style.visibility = "hidden";
    document.body.classList.remove("noscroll");

    return;
  }

  if ("hasCodeRunBefore" in localStorage) {
    resume.style.width = "100%";
    resume.style.overflowX = "hidden";
    document.body.classList.remove("noscroll");

    resumetext.style.visibility = "visible";
    bio.style.visibility = "visible";
    intro.style.visibility = "visible";
    logo.style.visibility = "hidden";
    return;
  }
  localStorage.setItem("hasCodeRunBefore", true);
  window.scrollTo(0, 0);

  await sleep(2000);

  intro.style.visibility = "visible";
  addClass(intro, "slide-to-right");

  addClass(resume, "push-to-right");
  addClass(logo, "push-to-right");

  addClass(bio, "grow-text");

  await sleep(1000);

  resume.style.width = "100%";
  logo.style.width = "100%";

  await sleep(500);

  document.body.classList.remove("noscroll");
  addClass(logo, "fade-out");
  await sleep(400);

  resumetext.style.visibility = "visible";
  addClass(resumetext, "fade-in");

  await sleep(600);
  logo.style.visibility = "hidden";
};

/**
 * Updates the age counter in the about section.
 */
function updateAge() {
  const yearsOld = dateDiffInYears(
    new Date(Date.UTC(1997, 0, 9, 7, 12)),
    new Date()
  ).toFixed(18);
  document.getElementById("age").textContent = yearsOld;
  setTimeout(updateAge, 100);
}
setTimeout(updateAge, 100);

/**
 * Calculates the difference between two dates in years.
 * @param {Date} date0 The earlier date.
 * @param {Date} date1 The later date.
 * @return {number} Date1-Date0 in years.
 */
function dateDiffInYears(date0, date1) {
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.24;

  return (date1.getTime() - date0.getTime()) / millisecondsPerYear;
}

/**
 * Adds a class to an element.
 * @param {object} elem The element to add the class to.
 * @param {string} className The class to add.
 */
function addClass(elem, className) {
  if (elem.classList) elem.classList.add(className);
  else elem.className += " " + className;
}

/**
 * Sleeps for x miliseconds.
 * @param {number} ms The amount of milliseconds to sleep for.
 * @return {promise} A promise that will resolve in x miliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
