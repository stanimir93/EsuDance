
// LISTEN ON PAGE LOAD
// CREATE AUTOMATIC POPULATION OF ALL CLASSES

window.addEventListener('hashchange', updateClassesPage)


function updateClassesPage(ev) {
    ev.preventDefault();

    let danceClassName = location.hash.replace('#', '')

    // Hide and show all classes

    if (danceClassName) {
        document.querySelector('.all-classes-container').classList.remove('active');
        
        // Cleate a copy of the classpage template

        let clone = document.querySelector('template').content.cloneNode(true);

        // Fill up content of class page 

        clone.querySelector('.classpage-banner-container').style.backgroundImage = "url(" + danceClasses[danceClassName].banner_url + ")"
        clone.querySelector('.classpage-banner-box h2').innerHTML = danceClasses[danceClassName].class_name
        clone.querySelector('.classpage-banner-box h3').innerHTML = danceClasses[danceClassName].age
        clone.querySelector('.class-description-container p').innerHTML = danceClasses[danceClassName].description
        // clone.querySelector('.class-how-to-book-container p').innerHTML = danceClasses[danceClassName].description
        clone.querySelector('.class-price-container p').innerHTML = danceClasses[danceClassName].price
        clone.querySelector('.class-dress-code-container p').innerHTML = danceClasses[danceClassName].dress_code
        // clone.querySelector('.class-timetable-container p').innerHTML = danceClasses[danceClassName].description

        // Append clone
        
        document.querySelector('main').appendChild(clone)
        document.querySelector('.classpage-container').classList.add('active');

        
        


    } else {
        document.querySelector('.all-classes-container').classList.add('active');

    }
    console.log(danceClassName)
}