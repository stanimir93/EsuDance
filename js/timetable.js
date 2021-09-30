/*  
WHAT IT DOES
    Hide and show all dates on clicking a button

*/

const TIMETABLE = {
    toggleDates: function(ev){
        ev.preventDefault();
        ev.target.closest('.class-container').querySelector('.all-dates').classList.toggle('visible')
    },

    init: function () {
        
        document.querySelectorAll('.view-more a').forEach( link => {
            link.addEventListener('click', this.toggleDates)
        })
    }
}

TIMETABLE.init()