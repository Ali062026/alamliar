/* ======================================================
   ALAMLIAR.COM
   script.js
====================================================== */


/* ==========================================
   STICKY NAVBAR
========================================== */

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});


/* ==========================================
   HAMBURGER MENU
========================================== */

const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

if (hamburger) {

    hamburger.addEventListener("click", () => {

        menu.classList.toggle("show");

        hamburger.classList.toggle("active");

    });

}


/* ==========================================
   CLOSE MENU AFTER CLICK
========================================== */

document.querySelectorAll(".menu a").forEach(link => {

    link.addEventListener("click", () => {

        if (menu) {

            menu.classList.remove("show");

        }

        if (hamburger) {

            hamburger.classList.remove("active");

        }

    });

});


/* ==========================================
   FAQ ACCORDION
========================================== */

const accordions = document.querySelectorAll(".accordion");

accordions.forEach(item => {

    item.addEventListener("click", function () {

        this.classList.toggle("active");

        const panel = this.nextElementSibling;

        if (panel.style.display === "block") {

            panel.style.display = "none";

        } else {

            panel.style.display = "block";

        }

    });

});


/* ==========================================
   BACK TO TOP
========================================== */

const backTop = document.querySelector(".back-top");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

});

if (backTop) {

    backTop.addEventListener("click", () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}


/* ==========================================
   ACTIVE MENU
========================================== */

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".menu a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        const height = section.offsetHeight;

        if (pageYOffset >= top && pageYOffset < top + height) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});


/* ==========================================
   COUNTER ANIMATION
========================================== */

const counters = document.querySelectorAll(".counter");

const speed = 200;

function startCounter() {

    counters.forEach(counter => {

        const target = Number(counter.dataset.target);

        const update = () => {

            const value = Number(counter.innerText);

            const increment = Math.ceil(target / speed);

            if (value < target) {

                counter.innerText = value + increment;

                requestAnimationFrame(update);

            } else {

                counter.innerText = target;

            }

        };

        update();

    });

}

let counterStarted = false;

window.addEventListener("scroll", () => {

    const stats = document.querySelector(".statistics");

    if (!stats) return;

    const trigger = stats.offsetTop - 300;

    if (window.scrollY >= trigger && !counterStarted) {

        counterStarted = true;

        startCounter();

    }

});


/* ==========================================
   REVEAL ANIMATION
========================================== */

const reveals = document.querySelectorAll(

    ".card,.mountain,.stat-item"

);

function reveal() {

    reveals.forEach(item => {

        const top = item.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if (top < windowHeight - 100) {

            item.classList.add("visible");

        }

    });

}

window.addEventListener("scroll", reveal);

reveal();


/* ==========================================
   SMOOTH SCROLL
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target = document.querySelector(

            this.getAttribute("href")

        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


/* ==========================================
   LOADING COMPLETE
========================================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});