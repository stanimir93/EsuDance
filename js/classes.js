/* 
SPA which shows a page with all dance classes and then on hashchange shows a page with individual dance class details.

How it works: 
    1. Clicking on <a>Details</a> changes the hash. 
    2. The hash is matched to name of the dance class from a JSON file (APP.danceClasses from indes.js)
    3. The details for this class are copied into a copy of html template
    4. The template is rendered on the page 
    5. History API saves the SPA 'pages' onto the history array
*/

const DANCE_CLASSES = {

    // hashchange event starts this function
    updateDanceClassesPage: function(ev) {
        ev.preventDefault();
    
        // Name of dance class selected
        let danceClassName = location.hash.replace('#', '') 
    
        // If the there is a hash value(dance class name), we populate and rended a template showing details for the chosen dance class
        if (danceClassName) {
            document.querySelector('.all-classes-container').classList.remove('active');
            
            // Cleate a copy of the classpage template
            let clone = document.querySelector('template').content.cloneNode(true);
    
            // Fill up content of class page 
            clone.querySelector('.classpage-banner-container').style.backgroundImage = "url(" + APP.danceClasses[danceClassName].banner_url + ")"
            clone.querySelector('.classpage-banner-box h2').innerHTML = APP.danceClasses[danceClassName].class_name
            clone.querySelector('.classpage-banner-box h3').innerHTML = APP.danceClasses[danceClassName].age
            clone.querySelector('.class-description-container p').innerHTML = APP.danceClasses[danceClassName].description
            clone.querySelector('.class-price-container p').innerHTML = APP.danceClasses[danceClassName].price
            clone.querySelector('.class-dress-code-container p').innerHTML = APP.danceClasses[danceClassName].dress_code    

            // Append the cloned templace to main
            document.querySelector('main').appendChild(clone)
            document.querySelector('.classpage-container').classList.add('active');
    
        }

        // If hashChange does not give us a class name, we remove a previous class page and render all classes
        else {
            document.querySelector('main').removeChild(document.querySelector('.classpage-container'))
            document.querySelector('.all-classes-container').classList.add('active');
    
        }
    },

    // update classes page on hashchange
    init: function() {
        window.addEventListener('hashchange', updateDanceClassesPage);

        //hash change on page load
        window.dispatchEvent(new HashChangeEvent('hashchange'));

    }
}

DANCE_CLASSES.init()