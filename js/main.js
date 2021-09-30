// 1. download images when needed

// 2.
// replace hash events with history api - pushstate and popstate - to prevent page from scrolling

// 3. make breadcrubs to fascilitate navigation

// 3. try using /classes (not #classes)
// for this use pathname
// esudance.html/classes



// 4. create a loading spinner that fades in in a few seconds if the page is loading slowly
// spinning ballet shoes



/* HOW IT WORKS

NAV MENU
From all div.page generate navigation menu. The text content of nav links comes from the data-page attribute of all pages
When clicked on a nav button the location.hash changes. Then the hash is parsed and the page the relevant page is shown

    page data-page --> nav.textContent + nav data-target
    nav data-target --> location.pathname --> parsed--> data-page (page to be made visible)


INDIVIDUAL CLASSES
When loaded in location.hash the link for a dance class a function is run that finds the class details in data.js and generates the class page.

ADDRESS
The address is stored in data.js and loaded on all places automatically

*/

const APP = {

    init: function(){
        
        //populate nav menus
        document.querySelectorAll('ul.menu').forEach( menu => this.createNavMenu(menu));

        //event listeners to menu items
        document.querySelectorAll('.menu-item').forEach( item => {item.addEventListener('click', this.changeLocation);})
        
        //populate addresses
        document.querySelectorAll('.address').forEach( el => this.addAddress(el))

        //event listeners on window locations
        window.addEventListener('hashchange', () => this.displayPage())
            
        //dispatch event upon page load - this will trigger the listeners to window.location to display the right page
        window.dispatchEvent(new HashChangeEvent('hashchange'))

        //hero button - navigation
        document.getElementById('hero-button').addEventListener('click', this.changeLocation)

        document.querySelectorAll('.card button').forEach(button=> button.addEventListener('click', this.changeLocation))
    },

    // build navigation menu in header and footer - find pages (.page) and add them to the menu
    createNavMenu: function(ul) { 
        let df = new DocumentFragment();
        document.querySelectorAll('.in-menu').forEach( page =>  {
            let li = document.createElement('li');
            li.classList.add('menu-item');
            li.dataset.target = page.dataset.page
            li.textContent = page.dataset.page[0].toUpperCase() + page.dataset.page.substr(1);
            df.appendChild(li);
        })
        ul.appendChild(df)
    },

    //change window location after clicking a button
    changeLocation: function(ev) {
        ev.preventDefault();
        let page = ev.currentTarget.dataset.target
        if (page === 'home'){ 
            history.replaceState(null, 'EsuDance',location.origin + '/esudance.html')
            window.dispatchEvent(new HashChangeEvent('hashchange'))
        }     
        else {location.hash = `#${ev.currentTarget.dataset.target}` }
    },
    
    //hide and display pages
    displayPage: function() {

        //parse the url
        let pathname = location.hash.replace('#', '')
        pathname = pathname.toLowerCase();
        let pathname_arr = pathname.split('/')

        //ID of page to be displays (id is the last page)
        let page = pathname_arr[0]; 
        //Dance class to open
        let danceClass = pathname_arr[1]

        //if we have a dance class to display page and populate with content
        if (page === 'classes' && all_classes[danceClass]){
            document.querySelector('.active')?.classList.remove('active');
            document.querySelector('div[data-page="individual-class"').classList.add('active');   

            //change page title
            let classTitle = danceClass.replaceAll('-', ' ')
            document.title = 'EsuDance - ' + classTitle;
            
            this.populateClassPage(danceClass);
            
            
            // setTimeout(()=>window.scrollTo(0,0),0);

        }
        //if we don't have a dance class hide page
        else {
            // if no pathname - pick page with ID HOME
            if (!page) {page = 'home';}
            // if pathname not existing - pick page with ID 404
            if (!document.querySelector(`div[data-page="${page}"]`)) {page = '404'} 

            document.querySelector('.active')?.classList.remove('active');
            document.querySelector(`div[data-page="${page}"]`).classList.add('active');   
            setTimeout(()=>window.scrollTo(0,0),0)
            
            //change page title
            if (page ==='home') {
                document.title = ' EsuDance - Dance Classes in North West London';
            } 
            else {
                document.title = 'EsuDance - ' + page[0].toUpperCase() + page.substr(1);
            }
        }


        
    },
    
    //builds individual dance class page
    populateClassPage: function(danceClass) {
        //clear individual class page
        document.querySelector('[data-page="individual-class"]').innerHTML =''

        //create individual class page
        let df = new DocumentFragment()

        let section1 = document.createElement('section')
        section1.classList.add("class-banner")
        section1.style.backgroundImage = "url(" + all_classes[danceClass].bannerImage + ")";


        let title = document.createElement('h1')
        title.textContent = all_classes[danceClass].title;
        section1.appendChild(title)
        
        let ageGroup = document.createElement('h6')
        ageGroup.textContent = all_classes[danceClass].ageSubtitle;
        section1.appendChild(ageGroup)

        df.appendChild(section1)
        
        let section2 = document.createElement('section')

        let description = document.createElement('p')
        description.textContent = all_classes[danceClass].description;
        section2.appendChild(description)

        let timetable = document.createElement('p')
        timetable.innerHTML = all_classes[danceClass].timetable;
        section2.appendChild(timetable)

        let price = document.createElement('p')
        price.textContent = all_classes[danceClass].price;
        section2.appendChild(price)

        let howToBook = document.createElement('p')
        howToBook.innerHTML = all_classes[danceClass].howToBook;
        section2.appendChild(howToBook)

        let dressCode = document.createElement('p')
        dressCode.textContent = all_classes[danceClass].dressCode;
        section2.appendChild(dressCode)

        let nextTerm = document.createElement('p')
        nextTerm.textContent = all_classes[danceClass].nextTerm;  
        section2.appendChild(nextTerm)
        
        df.appendChild(section2)

        //append individual class page
        document.querySelector('[data-page="individual-class"]').appendChild(df)


    },
    // add address of studio to the website. the address can be edited from one place - data.js
    addAddress: function(p) {
        let address_text
        if (p.classList.contains('one-line')){ 
            address_text = `${address.line1}, ${address.line2}, ${address.city}, ${address.postcode}`
            p.textContent = address_text
        } else if (p.classList.contains('two-line')){
            address_text = `${address.line1}, ${address.line2},<br>${address.city}, ${address.postcode}`
            p.innerHTML = address_text
        }else {
            address_text = `${address.line1},<br>${address.line2},<br>${address.city}, ${address.postcode}`
            p.innerHTML = address_text
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    APP.init();
});
