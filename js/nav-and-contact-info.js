/* 
NAV_AND_CONTACT_INFO_APP will fetch and render header footer and website data 

How it works:
    1. Fetch website data (contact details) that will be used throughout the website
    2. Fetch and rended header and footer html files
    3. Once header and footer are rendered a mutation observer will trigger and will:
        3.1. load the contact details on the DOM using '.address' or '.email' class names.
        3.2. if contact details are not fetched yet, it start listenning for the addressaddressDataReady event, and load the details onces fetched
    4. Pa
*/

const NAV_AND_CONTACT_INFO_APP = {

    // WEBSITE DATA (contact details)

    contactDetails: null,
    dataParsed: false, // shows the data has been parsed, so funcitons needing it can use it straight away

    // Fetch website data and anounce data is ready
    fetchData: function () {

        // In case data is still not ready for use, functions will listen for 'addressDataReady' event
        let addressDataReady = new Event('addressDataReady'); 
        
        // Fetch and parse
        fetch('json/contact-details.json')
        .then((response) => response.json())
        .then((data => {
            this.contactDetails = data;
            this.dataParsed = true;
            document.dispatchEvent(addressDataReady);
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
    If contact details has not been fetched, listen for "addressDataReady" event */
    loadContactInfo: {

        start: function(){

            // if contact datails are fetched and parsed, insert them into the DOM
            if (NAV_AND_CONTACT_INFO_APP.dataParsed) { 
                
                NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadAddress();
                NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadEmail();
                NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadMessenger();
                this.disconnect();
            } 
            // if contact datails are not fetched and parsed, create a listenner to load them into DOM, once they are ready
            else { 
                document.addEventListener('addressDataReady', () =>{
                    NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadAddress();
                    NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadEmail();
                    NAV_AND_CONTACT_INFO_APP.loadContactInfo.loadMessenger();
                    this.disconnect();
                })
            }
        },
        // Functions that load the contact details (address and email) onto the website
        loadAddress: function() {
            document.querySelectorAll('.address').forEach( (addressContainer) => {
                if (addressContainer.classList.contains('one-line')){
                    addressContainer.innerHTML = 
                    `${NAV_AND_CONTACT_INFO_APP.contactDetails.address_line1}, ${NAV_AND_CONTACT_INFO_APP.contactDetails.street}, ${NAV_AND_CONTACT_INFO_APP.contactDetails.postcode}, ${NAV_AND_CONTACT_INFO_APP.contactDetails.city}`;
                } else {
                    addressContainer.innerHTML = 
                    `${NAV_AND_CONTACT_INFO_APP.contactDetails.address_line1}<br>${NAV_AND_CONTACT_INFO_APP.contactDetails.street}<br>${NAV_AND_CONTACT_INFO_APP.contactDetails.postcode}<br>${NAV_AND_CONTACT_INFO_APP.contactDetails.city}`;
                }
            })
        },
        loadEmail: function() {
            document.querySelectorAll('.email').forEach( (emailContainer) => {
                emailContainer.textContent = `${NAV_AND_CONTACT_INFO_APP.contactDetails.email}`;
                emailContainer.setAttribute('href', `mailto:${NAV_AND_CONTACT_INFO_APP.contactDetails.email}`)
            })
        },
        loadMessenger: function() {
            document.querySelectorAll('.messenger').forEach( (messengerLink) => {
                messengerLink.setAttribute('target', '_blank');
                messengerLink.setAttribute('href', NAV_AND_CONTACT_INFO_APP.contactDetails.messenger)
            })
        }
        
        
    },
    
    // PAGE NOT FOUND

    
    // Load the following html if window.location is not recognized
    pageNotFound: function () {
        let div = document.createElement('div');
        div.classList.add('not-found');
        div.innerHTML = `
        <h1>Page not found</h1> 
        <p>Sorry, the page <strong>${window.location.host + window.location.pathname + window.location.hash}</strong> could not be found.</p>`
        document.querySelector('main').NAV_AND_CONTACT_INFO_APPendChild(div)        
    },
    

    // INITIALIZE NAV_AND_CONTACT_INFO_APP
    
    init: function() {
        
        this.fetchData();
        
        this.loadNavigation();
        
        

        //OBSERVE for header and footer rendering (then add the contact details to the address elements)
        let observer = new MutationObserver(this.loadContactInfo.start)
        
        // starting the observer
        observer.observe(document.querySelector('footer'),{childList: true});
    }
}

NAV_AND_CONTACT_INFO_APP.init();
