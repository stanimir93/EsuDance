// Fetch data - address and classes

let contactDetails
let classes

fetch('json/data.json')
.then((response) => response.json())
.then((data => {
    contactDetails = data.contactDetails;
    classes = data.classes;
}));


// MutationObserver to listen for loading of the footer

const observer = new MutationObserver( function() {
    loadAddress();
    loadEmail();
    this.disconnect();
})

observer.observe(document.querySelector('footer'),{childList: true})


// Functions to populate addess fields

function loadAddress() {
    document.querySelectorAll('.address').forEach( (addressContainer) => {
        addressContainer.innerHTML = 
        `${contactDetails.address_line1}<br>${contactDetails.street}<br>${contactDetails.postcode}<br>${contactDetails.city}`;
    })
}

// Function to populate email fields

function loadEmail() {
    document.querySelectorAll('.email').forEach( (emailContainer) => {
        emailContainer.textContent = `${contactDetails.email}`;
        emailContainer.setAttribute('href', `mailto:${contactDetails.email}`)
    })
}
