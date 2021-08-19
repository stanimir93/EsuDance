// Fetch data - address and classes

let contactDetails
let classes

fetch('json/data.json')
.then((response) => response.json())
.then((data => {
    contactDetails = data.contactDetails;
    classes = data.classes;
}));



