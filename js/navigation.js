


// Shrink navigation menu on scroll

window.addEventListener('scroll', debounce(shrinkNav));

function shrinkNav() {
    if (window.scrollY > 80) {
        document.querySelector('header .logo').style.maxWidth = '120px'
        document.querySelector('header .logo').style.padding = '0.75rem 1.5rem 0.25rem'
    } else {
        document.querySelector('header .logo').style.maxWidth = '140px'
        document.querySelector('header .logo').style.padding = '1rem 1.5rem 0.5rem'
    }
}

/* Reduce firing rate of shringNav on scrolling */

function debounce(func){
    let timer;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(func, 25);
    };
}


// Sub-menu - hide and how
// document.getElementById('classes-nav-button').addEventListener('click', displayNavSubMenu);

// function displayNavSubMenu(ev){
//     ev.preventDefault();
//     document.querySelector('header .sub-menu').classList.toggle('show')
// }

