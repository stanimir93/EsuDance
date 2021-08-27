// Fetch list of images to be loaded

let videos;
let photos;

fetch('json/gallery.json')
.then( response => response.json())
.then ( data => {
    videos = data["video_urls"];
    photos = data["photo_names"];
    buildGallery(photos, videos);
})


// Build gallery images
function buildGallery(photos, videos) {
    let df = new DocumentFragment();
    
    photos?.forEach( (photoName) => {
        let wrapper = document.createElement('div');
        wrapper.classList.add('gallery-image-wrapper', 'visible');
        wrapper.dataset.type = 'photo'

        let container = document.createElement('div');
        container.classList.add('gallery-image-container');
        container.style.backgroundImage = `url('images/gallery/${photoName}')`;

        wrapper.appendChild(container)

        df.appendChild(wrapper)
        
     
    })

    videos?.forEach( (videoURL) => {
        let wrapper = document.createElement('div');
        wrapper.classList.add('gallery-video-wrapper', 'visible');
        wrapper.dataset.type = 'video'

        let container = document.createElement('div');
        container.classList.add('gallery-video-container');
        container.innerHTML = `<iframe src="${videoURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        
        
        wrapper.appendChild(container)

        df.appendChild(wrapper)
        console.log(container)
    })
    
    document.querySelector('.gallery-grid').appendChild(df)
}

// Filter Gallery

document.querySelectorAll('.tab')
    .forEach( button => button.addEventListener('click', filterGallery))

function filterGallery(ev) {
    ev.preventDefault();
    let mediaTarget = ev.target.dataset.target;
    
    /* If selected all - add class visible and after time out make them hidden
    I use timeout so the animation gets triggered on all photos*/

    if (mediaTarget === 'all') {
        document.querySelectorAll('.gallery-image-wrapper')
        .forEach( media => {
            media.classList.remove('visible'); 
            setTimeout( () => media.classList.add('visible'), 0) 
        })

    } 
   
    //If selected a sertain media type - hide the other and show the current one 

    else {
        document.querySelectorAll('.gallery-image-wrapper')
            .forEach( media => {
                if (media.dataset.type === mediaTarget) {
                    media.classList.add('visible');
                } else {
                    media.classList.remove('visible');
                    console.log(media.dataset.type)
                }
            })
    }
}

// Create Gallery