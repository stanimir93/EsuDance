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
            document.querySelector('header .logo').style.padding = '7.5px 15px 2.5px'
            document.querySelector('header .logo').style.padding = '7.5px 15px 2.5px'
        } else if (window.scrollY < 80 && document.body.clientWidth < 750) {
            document.querySelector('header .logo').style.maxWidth = '140px'
            document.querySelector('header .logo').style.padding = '10px 15px 5px'
        } else if (window.scrollY < 80 && document.body.clientWidth > 750) {
            document.querySelector('header .logo').style.maxWidth = '150px'
            document.querySelector('header .logo').style.padding = '10px 15px 5px'
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
