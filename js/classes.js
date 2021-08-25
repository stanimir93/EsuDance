// Function to populate cards on page

// Object.keys(danceClasses).forEach((danceClass) => {

//     let card = document.querySelector('.card-wrapper').cloneNode(true);
//     card.querySelector('h3').textContent = danceClasses.Ballet_and_Tap_Dance_for_Minis.short_class_name;
//     card.querySelector('p').innerHTML = danceClasses.Ballet_and_Tap_Dance_for_Minis.short_description;
//     card.querySelector('.dance-class-button-container a').attributes.href.value = danceClasses.Ballet_and_Tap_Dance_for_Minis.url;
//     console.log(card)

// })


// LOOK FOR HAS ON PAGE LOAD

// Dispatch event upon page load - this will trigger the listeners to window.location to display the right page


// LISTEN ON HASHCHANGE

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


    // Remove class page div from the DOM and make the classes visible again.

    } else {
        document.querySelector('main').removeChild(document.querySelector('.classpage-container'))
        document.querySelector('.all-classes-container').classList.add('active');

    }
}