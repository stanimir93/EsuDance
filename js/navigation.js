// MutationObserver on the footer - once footer has been updated - it will populate the addresses

const observer = new MutationObserver( function() {
    loadAddress();
    loadEmail();
    this.disconnect();
})

observer.observe(document.querySelector('footer'),{childList: true})

// Fetch header and footer

fetch(`navigation/header.html`)
.then( (resposnse) => {return resposnse.text()})
.then( (header) => {
    document.querySelector('header').innerHTML = header
})
fetch(`navigation/footer.html`)
.then( (resposnse) => {return resposnse.text()})
.then( (footer) => {
    document.querySelector('footer').innerHTML = footer
})


// Populate addess and email fields

function loadAddress() {
    document.querySelectorAll('.address').forEach( (addressContainer) => {
        addressContainer.innerHTML = 
        `${contactDetails.address_line1}<br>${contactDetails.street}<br>${contactDetails.postcode}<br>${contactDetails.city}`;
    })
}
function loadEmail() {
    document.querySelectorAll('.email').forEach( (emailContainer) => {
        emailContainer.textContent = `${contactDetails.email}`;
        emailContainer.setAttribute('href', `mailto:${contactDetails.email}`)
    })
}




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

