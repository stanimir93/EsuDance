import {GALLERY_BUILDER} from "./gallery-builder.js";


// Filter gallery based on hash
const GALLERY_FILTER = {

    // Show media corresponding to hash and hide media that does not
    filterGallery: function(target) {
        // If matches the target it will be visible, everything else will be display: none;
        document.querySelectorAll('[data-type]')
            .forEach( media => {
                if (media.dataset.type === target) {
                    media.classList.add('visible');
                } else {
                    media.classList.remove('visible');
                }
            })
    },
    
    // Filter button to change color based on hash
    changeButtonColor: function(target) {
        document.querySelectorAll('[data-target]').forEach( button => {
            
            if (button.dataset.target === target) {
                button.classList.add('active')
            } else {
                button.classList.remove('active')
            }
        })
    
    },

    init: function () {

        // On hashchange filter gallery and change filter button color, and keep same history
        window.addEventListener('hashchange', (ev) =>{
            ev.preventDefault();
            if (!window.location.hash) {
                this.filterGallery('photos');        
                this.changeButtonColor('photos');
            } 
            else {
                this.filterGallery(window.location.hash.toLowerCase().replace('#', ''));
                this.changeButtonColor(window.location.hash.toLowerCase().replace('#', ''));
            }
        });
        
        // Dispatch hashChange on page load
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        // Attach listeners to filter button to change hash
        document.querySelectorAll('.tabs > button ')
            .forEach( button => button.addEventListener('click', ev => {
                window.location.hash = ev.currentTarget.dataset.target
            }))
    }
}

// Gallery
GALLERY_BUILDER.init('json/gallery.json', '.gallery','images/gallery');

// Filter
GALLERY_FILTER.init();






