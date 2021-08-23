// Variables to store addresses and dance classes

let contactDetails
let danceClasses

// Fetch JSON - address and dance classes

fetch('json/data.json')
.then((response) => response.json())
.then((data => {
    contactDetails = data.contactDetails;
    danceClasses = data.classes;
}));




