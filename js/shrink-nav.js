/* Shrink navigation on scroll

How it works:
    1. Listen for scroll events
    2. On scroll call setTimeout to shrink header at the end of the timer
    3. Each scroll resets timer if timer is still running. (this is used to limit the firing rate of the shrinkNav function and optimize performance)
    4. When the timer reaches the end the callback shinks the header.
*/

const NAVIGATION = {

    shrinkNav: function() {
        if (window.scrollY > 80) {
            document.querySelector('header .logo').style.maxWidth = '120px'
            document.querySelector('header .logo').style.padding = '0.75rem 1.5rem 0.25rem'
        } else {
            document.querySelector('header .logo').style.maxWidth = '140px'
            document.querySelector('header .logo').style.padding = '1rem 1.5rem 0.5rem'
        }
    },

    
    debounce: function(func){
        let timer;
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(func, 25);
        };
    },

    init: function() {
        window.addEventListener('scroll', this.debounce(this.shrinkNav));
    }
}

NAVIGATION.init();
