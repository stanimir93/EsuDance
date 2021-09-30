/* 
WHAT IT DOES:
    * fetches and renders header
    * fetches and renders footer
    * fetches and renders contact info (address, social media etc.)

HOW TO USE:
    * add this scriped to each HTML page 
    * use HTML classes ('address', 'address one-line', 'messenger', 'email' ) and the contact info will be rendred

HOW IT WORKS:
    * fetchData() fetches the contact details and tells listeners the data is ready to be added to DOM
        - contactDetails object holds contact details
        - contactDataReady - event (inside fetchData method) says data is ready to be rendered (the event is needed in case data is not fetched and parsed quickly enough)
    
    * loadNavigation() - fetches and ads to DOM header and footer

    * Mutation observer - waiting for header and footer to be rendered and then the contact details are rendered on whole page

    * afterNavigation.start() 
        - once contact details are ready and header and footer are rendered
        - runs methods that loads each type of contact detail (address, email, messenger) based on css classes
        - Decorates header link of current page and sets header links to have fixed width
*/

const LOAD_TO_PAGE = {

    contactDetails: null,

    // Fetch website data and anounce data is ready
    fetchData: function () {

        // In case data is still not ready for use, functions will listen for 'contactDataReady' event
        let contactDataReady = new Event('contactDataReady'); 
        
        fetch('json/contact-details.json')
        .then((response) => response.json())
        .then((data => {
            this.contactDetails = data;
            document.dispatchEvent(contactDataReady);
        }));
    },

    // Fetch and render header and footer
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
    
    // Load contact info on the page + add 
    afterNavigation: {

        start: function(){

            // if contact datails are fetched and parsed, insert them into the DOM
            if (LOAD_TO_PAGE.contactDetails) { 
                
                LOAD_TO_PAGE.afterNavigation.loadAddress();
                LOAD_TO_PAGE.afterNavigation.loadEmail();
                LOAD_TO_PAGE.afterNavigation.loadMessenger();
                LOAD_TO_PAGE.afterNavigation.decorateLinkOnCurrentPage();
                LOAD_TO_PAGE.afterNavigation.maintainHorizontalNavSize();
                this.disconnect();
            } 
            // if contact datails are not fetched and parsed, create a listenner to load them into DOM, once they are ready
            else { 
                document.addEventListener('contactDataReady', () =>{
                    LOAD_TO_PAGE.afterNavigation.loadAddress();
                    LOAD_TO_PAGE.afterNavigation.loadEmail();
                    LOAD_TO_PAGE.afterNavigation.loadMessenger();
                    LOAD_TO_PAGE.afterNavigation.decorateLinkOnCurrentPage();
                    LOAD_TO_PAGE.afterNavigation.maintainHorizontalNavSize();
                    this.disconnect();
                })
            }
        },
        loadAddress: function() {
            document.querySelectorAll('.address').forEach( (addressContainer) => {
                if (addressContainer.classList.contains('one-line')){
                    addressContainer.innerHTML = 
                    `${LOAD_TO_PAGE.contactDetails.address_line1}, ${LOAD_TO_PAGE.contactDetails.street}, ${LOAD_TO_PAGE.contactDetails.postcode}, ${LOAD_TO_PAGE.contactDetails.city}`;
                } else {
                    addressContainer.innerHTML = 
                    `${LOAD_TO_PAGE.contactDetails.address_line1}<br>${LOAD_TO_PAGE.contactDetails.street}<br>${LOAD_TO_PAGE.contactDetails.postcode}<br>${LOAD_TO_PAGE.contactDetails.city}`;
                }
            })
        },
        loadEmail: function() {
            document.querySelectorAll('.email').forEach( (emailContainer) => {
                emailContainer.textContent = `${LOAD_TO_PAGE.contactDetails.email}`;
                emailContainer.setAttribute('href', `mailto:${LOAD_TO_PAGE.contactDetails.email}`)
            })
        },
        loadMessenger: function() {
            document.querySelectorAll('.messenger').forEach( (messengerLink) => {
                messengerLink.setAttribute('target', '_blank');
                messengerLink.setAttribute('href', LOAD_TO_PAGE.contactDetails.messenger)
            })
        },

        // Get width of menu items and make it max width (this prevent menu items from pushing other items when they get bold and wider on hover)
        maintainHorizontalNavSize: function() {
           document.querySelectorAll('nav .menu li').forEach( li => {
               let itemWidth = li.offsetWidth;
               li.style.maxWidth = `${itemWidth}px`;
           })            
        },

         // Decorate navigation to match current page
        decorateLinkOnCurrentPage: function() {
            document.querySelectorAll('header nav li a').forEach( a => {
                let url = window.location.pathname.replace('/','');
                url = url.replace('.html', '')
                let button = new URL(a.href)
                button = button.pathname.replace('.html', '')
                button = button.replace('/','')
                if (button === url) {
                    a.parentElement.classList.add('current')
                    a.setAttribute('aria-current', 'page')
                }
            })
        },        
    },
 

    init: function() {
        
        this.fetchData();  
        this.loadNavigation();
        
        //OBSERVE for header and footer rendering (then add the contact details to the address elements)
        let observer = new MutationObserver(this.afterNavigation.start)
        
        // starting the observer
        observer.observe(document.querySelector('footer'),{childList: true});
    }
}

LOAD_TO_PAGE.init();
