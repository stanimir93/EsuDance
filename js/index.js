/* 
1. Functions to load data on header and footer are created
2. MutationObserver is listenning of loading the header and footer
3a. Address and Classes data are fetched and parsed. 
3b. Header and Footer are fetched, parsed, rendered
4. Rendering triggers MutationObserver
    a. If data is ready, it is added to page and footer
    b. If data is not ready, we are waiting for an event to tell us the data is ready


Header and footer are fetched, so there is not need to add them to each html page manually
Address and Classes data are fetched, so there is not need to edit them on each page individually

*/



// OBSERVE FOR RENDERING OF HEADER AND FOOTER - to load addresses

let observer = new MutationObserver( function() {  

        // if data parsed, load email addresses

        if (dataParsed) {
            loadAddress();
            loadEmail();
            this.disconnect();
        } 
        
        // if data not parsed yet, create a listenner to run callback to load addresses

        else {
            document.addEventListener('dataReady', function(){
                loadAddress();
                loadEmail();
                this.disconnect();
            })
        }
})

// starting the observer

observer.observe(document.querySelector('footer'),{childList: true})




// FETCH AND PREPARE THE DATA


// varialbes storing the data

let contactDetails;
let danceClasses;

// variable to show that the data has been parsed

let dataParsed = false; 

// listenner to tell that the data has been parsed

const dataReady = new Event('dataReady');

// fetch and parse data
// once done mark it in a variable
// dispatch an event shouting that data is ready

fetch('json/data.json')
.then((response) => response.json())
.then((data => {
    contactDetails = data.contactDetails;
    danceClasses = data.classes;
    dataParsed = true;
    document.dispatchEvent(dataReady)
}));


// FETCH, PARSE, RENDER HEADER AND FOOTER

fetch(`navigation/header.html`)
.then( (response) => {return response.text()})
.then( (header) => {
    document.querySelector('header').innerHTML = header
})
fetch(`navigation/footer.html`)
.then( (response) => {return response.text()})
.then( (footer) => {
    document.querySelector('footer').innerHTML = footer
})


// Functions to populate addess and email fields in the footer and on the page

function loadAddress() {
    document.querySelectorAll('.address').forEach( (addressContainer) => {
        if (addressContainer.classList.contains('one-line')){
            addressContainer.innerHTML = 
            `${contactDetails.address_line1}, ${contactDetails.street}, ${contactDetails.postcode}, ${contactDetails.city}`;
        } else {
            addressContainer.innerHTML = 
            `${contactDetails.address_line1}<br>${contactDetails.street}<br>${contactDetails.postcode}<br>${contactDetails.city}`;
        }
    })
}
function loadEmail() {
    document.querySelectorAll('.email').forEach( (emailContainer) => {
        emailContainer.textContent = `${contactDetails.email}`;
        emailContainer.setAttribute('href', `mailto:${contactDetails.email}`)
    })
}



