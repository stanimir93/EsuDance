/* 
APP will fetch and render header footer and website data 

How it works:
    1. Fetch website data (dance classes, contact details) that will be used throughout the website
    2. Fetch and rended header and footer html files
    3. Once header and footer are rendered a mutation observer will trigger and will:
        3.1. load the contact details on the DOM using '.address' or '.email' class names.
        3.2. if contact details are not fetched yet, it start listenning for the dataReady event, and load the details onces fetched
    4. Pa
*/

const APP = {

    // WEBSITE DATA (dance classes and contact details)

    contactDetails: null,
    danceClasses: null,
    dataParsed: false, // shows the data has been parsed, so funcitons needing it can use it straight away

    // Fetch website data and anounce data is ready
    fetchData: function () {

        // In case data is still not ready for use, functions will listen for 'dataReady' event
        let dataReady = new Event('dataReady'); 
        
        // Fetch and parse
        fetch('json/data.json')
        .then((response) => response.json())
        .then((data => {
            this.contactDetails = data.contactDetails;
            this.danceClasses = data.classes;
            this.dataParsed = true;
            document.dispatchEvent(dataReady);
        }));
    },

    // HEADER & FOOTER HTML (fetch and render)

    loadNavigation: function(){

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
    },

    // LOAD CONTACT DETAILS
    
    /* Populate website with contact info once header and footer have been rendered
    If contact details has not been fetched, listen for "dataReady" event */
    loadContactInfo: function () {

        //OBSERVE for header and footer rendering (then add the contact details to the address elements)
        let observer = new MutationObserver( function() {  

            // if contact datails are fetched and parsed, insert them into the DOM
            if (APP.dataParsed) { 

                loadAddress();
                loadEmail();
                loadMessenger();

                this.disconnect();
            } 
            // if contact datails are not fetched and parsed, create a listenner to load them into DOM, once they are ready
            else { 
                document.addEventListener('dataReady', () =>{
                    loadAddress();
                    loadEmail();
                    loadMessenger();
                    this.disconnect();
                })
            }
        })

        // Functions that load the contact details (address and email) onto the website
        function loadAddress() {
            document.querySelectorAll('.address').forEach( (addressContainer) => {
                if (addressContainer.classList.contains('one-line')){
                    addressContainer.innerHTML = 
                    `${APP.contactDetails.address_line1}, ${APP.contactDetails.street}, ${APP.contactDetails.postcode}, ${APP.contactDetails.city}`;
                } else {
                    addressContainer.innerHTML = 
                    `${APP.contactDetails.address_line1}<br>${APP.contactDetails.street}<br>${APP.contactDetails.postcode}<br>${APP.contactDetails.city}`;
                }
            })
        }
        function loadEmail() {
            document.querySelectorAll('.email').forEach( (emailContainer) => {
                emailContainer.textContent = `${APP.contactDetails.email}`;
                emailContainer.setAttribute('href', `mailto:${APP.contactDetails.email}`)
            })
        }
        function loadMessenger() {
            document.querySelectorAll('.messenger').forEach( (messengerLink) => {
                messengerLink.setAttribute('target', '_blank');
                messengerLink.setAttribute('href', APP.contactDetails.messenger)
            })
        }

        // starting the observer
        observer.observe(document.querySelector('footer'),{childList: true});

    },

    // PAGE NOT FOUND


    // Load the following html if window.location is not recognized
    pageNotFound: function () {
        let div = document.createElement('div');
        div.classList.add('not-found');
        div.innerHTML = `
        <h1>Page not found</h1> 
        <p>Sorry, the page <strong>${window.location.host + window.location.pathname + window.location.hash}</strong> could not be found.</p>`
        document.querySelector('main').appendChild(div)        
    },
    

    // INITIALIZE APP

    init: function() {

        this.fetchData();

        this.loadNavigation();

        this.loadContactInfo();
    }
}

APP.init();
