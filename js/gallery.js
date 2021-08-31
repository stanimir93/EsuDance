/*

GALLERY 
    - find photo names in JSON, fetch them and load them
    - filter videos and photos
    - display photos fullscreen (bigger resolution images) on click
    - allow changing the images back and forth

How it works:

    LOADING SMALL IMAGES
    1. Fetch JSON with photo names and video urls
    2. Create divs wrapping and divs holding the images (as backgorund-image).

    FILTERING IMAGES
    1. The filter works by setting display none to the irrelevant media

    FULLSCREEN VIEW
    1. The background images are 
    1. The background image is found and its title is changed to match the bigger version of the same image
    2. The bigger image is fetched and loaded into a fullscreen div, which is rendered over the the rest of the elements

    CHANGE IMAGES IN FULLSCREEN
    6. Before and after elements work as arrows which change to next image
    5. Then parsing the title clicks
    5. Then it
*/









/* 

GALLERY {

    DATA

	FETCH DATA + BUILD 2 ARRAYS - BIG AND SMALL

	BUILD SMALL GALLERY FROM SMALL ARRAY

	BUILD BIG GALLERY - empty + ADD LISTENERS 
    - each img will have data-index
    - there will be scroll snap
    - there will be intersection observer - when img into view - load src
    - ther will be arrows
    - there will be counter of the index +1 / total






	ON CLICK - 
    1. get indices of current image
    2. make fullscreen visible
    3. scroll right image into view
    4. load image src

    4.4 fetch the 2 images




    5. fetch 2 large images (next and prev)
	
    




	FILTER SMALL GALLERY


*/


const GALLERY = {

    videos: [],
    smallPhotos: [],
    largePhotos: [],
    
    // Fetch the gallery data (photo names and video urls) and save it in the variables above
    getData: function() {

        // Shout out when Gallery Data is ready so other functions can take it and build the gallery
        let galleryDataReady = new Event('galleryDataReady');
        
        // Fetches names of small photos and video urls. Saves them into arrays + large photos array
        let getPhotoNamesAndVideoURLS = function() {
            fetch('json/gallery.json')
            .then( response => response.json())
            .then ( data => {
                GALLERY.videos = data["video_urls"];
                GALLERY.smallPhotos = data["photo_names"];
                createLargePhotosArray();
                document.dispatchEvent(galleryDataReady);
            })  
        };

        // Creates an array of larger photos
        let createLargePhotosArray = function() {
            GALLERY.smallPhotos.forEach( photo => GALLERY.largePhotos.push(photo.replace('(Small)', '(Large)')) )
        };

        getPhotoNamesAndVideoURLS();

    },

    // Create elements and render gallery
    buildGallery: function() {

        // Build photo gallery

        let imageBuilder = function() {
            GALLERY.smallPhotos?.forEach( (photoName) => {
                let wrapper = document.createElement('div');
                wrapper.classList.add('gallery-media-wrapper', 'visible');
                wrapper.dataset.type = 'photo'
    
                let container = document.createElement('div');
                container.classList.add('gallery-image-container');
                container.dataset.index = GALLERY.smallPhotos.indexOf(photoName);
                container.style.backgroundImage = `url('images/gallery/${photoName}')`;
    
                wrapper.appendChild(container)
    
                df.appendChild(wrapper)  
            })
        }

        // Build video gallery

        let videoBuilder = function() {
            GALLERY.videos?.forEach( (videoURL) => {
                let wrapper = document.createElement('div');
                wrapper.classList.add('gallery-media-wrapper');
                wrapper.dataset.type = 'video'

                let container = document.createElement('div');
                container.classList.add('gallery-video-container');
                container.innerHTML = `<iframe src="${videoURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                
                wrapper.appendChild(container)

            df.appendChild(wrapper)
            })
        }

        let df = new DocumentFragment();

        imageBuilder();
        videoBuilder();

        // Add df to DOM 
        document.querySelector('.gallery-grid').appendChild(df);
    },

    // Create empty <img> elements to be used in fullscreen mode. 
    buildFullScreenView: function() {

        let createAndAppendToDOM = function(){
    
            let df = new DocumentFragment();
    
            // Append photos to df
            GALLERY.largePhotos.forEach( (photo) => {
                // let img = document.createElement('img');
                // img.classList.add('large-image');
                // img.dataset.index = GALLERY.largePhotos.indexOf(photo);

                let wrapper = document.createElement('div');
                wrapper.classList.add('large-image-container');
                wrapper.dataset.index = GALLERY.largePhotos.indexOf(photo);

                let spinner = document.createElement('div');
                spinner.classList.add('spinner', 'active');
                wrapper.appendChild(spinner);

                // wrapper.appendChild(img)

                df.appendChild(wrapper);
            })
    
            // Append df to images wrapper
            document.querySelector('.large-images-wrapper').appendChild(df);
        }

        createAndAppendToDOM();
     
    },
    
    addFullScreenFunctionalities: function() {
        
        // Open fullscreen mode and scroll into view the chosen photo
        let openFullScreen = function(ev) {
            document.querySelector('.full-screen-container').classList.add('active');

            let index = ev.target.dataset.index;
            let photo = document.querySelector(`.large-image-container[data-index="${index}"]`)

            setBackgroundImage(index, photo)
            document.body.style.position = 'fixed';
            photo.scrollIntoView(false);
        }


        // Fetch image. Set it as background image and remove the loading spinner
        let setBackgroundImage = function(index, photo) {

            let shareButtonFuctionality = function(){

            }

            
            fetch(`images/gallery/${GALLERY.largePhotos[index]}`)
                .then(response => response.blob())
                .then(imageBlob => {
                    // Then create a local URL for that image and print it 
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    photo.style.backgroundImage = `url('${imageObjectURL}')`;
                    console.log(imageBlob);
                    
                    document.querySelector(`[data-index="${index}"] .spinner`).classList.remove('active');

                    let downloadButton = document.querySelector('.download-button a');
                    downloadButton.href = imageObjectURL;
                    downloadButton.download = GALLERY.largePhotos[index].replace(' (Large)', '');
                    
                });

                
                // photo.style.backgroundImage = `url('images/gallery/${GALLERY.largePhotos[index]}')`
        } 

        // Watch for image containers when coming into view and fetch and set background image
        let setBackgroundImageOnSwipe = function(){ 

            let options = {
                root: null,
                rootMargin: "0px 0px" ,
                threshold: 0.05
            };

            let beShowing = function(entries) {
                entries.forEach( entry => {
                    if (entry.isIntersecting) {
                        setBackgroundImage(entry.target.dataset.index, entry.target)
                    }
                })
            };
            
            let observer = new IntersectionObserver(beShowing, options)
            document.querySelectorAll('.large-image-container').forEach( container => observer.observe(container));
            
        }
        
        // Count Locations
        let imageCounter = function() {
            let options = {
                root: null,
                rootMargin: "0px 0px" ,
                threshold: 0.5
            };
            
            let beShowing = function(entries) {
                entries.forEach( entry => {
                    if (entry.isIntersecting) {
                        let counter = document.querySelector('.gallery-location-counter')
                        counter.textContent = `${1 + Number(entry.target.dataset.index)} / ${GALLERY.largePhotos.length}`              
                    }
                })
            };

            let observer = new IntersectionObserver(beShowing, options)
            document.querySelectorAll('.large-image-container').forEach( container => observer.observe(container));
            
        }
        // Close fullscreen mode 

        let closeFullScreen = function() {
            document.querySelector('.full-screen-container').classList.remove('active');
            document.body.style.position = 'static';

        }


        let changePhotosWithArrows = function() {

            
            let moveImages = function(ev) {
                if (document.querySelector('.full-screen-container.active')) {
                    let imagesWrapper = document.querySelector('.large-images-wrapper');
                    let optionsRight = {
                        top: 0,
                        left: imagesWrapper.scrollWidth / GALLERY.largePhotos.length,
                        behavior: 'smooth'
                        };
                    let optionsLeft = {
                        top: 0,
                        left: -1 * imagesWrapper.scrollWidth / GALLERY.largePhotos.length,
                        behavior: 'smooth'
                        };
                    switch (ev.code) {
                        case 'ArrowRight':
                            imagesWrapper.scrollBy(optionsRight)
                            break;
                            case 'ArrowLeft':
                            imagesWrapper.scrollBy(optionsLeft)
                            break;
                        case 'Escape':
                            closeFullScreen();
                            break;
                    
                        default:
                            break;
                    }
                }

            }
            
            
            document.addEventListener('keyup', moveImages)
        }
        
        document.querySelectorAll('.gallery-image-container').forEach(photo => photo.addEventListener('click', openFullScreen ));  
        document.querySelector('.close-button').addEventListener('click', closeFullScreen )
        setBackgroundImageOnSwipe();
        imageCounter();
        changePhotosWithArrows();
    },

    // Filter Gallery - Video / Photos 
    filterGallery: function(ev) {
        ev.preventDefault();

        let mediaTarget = ev.currentTarget.dataset.target;
        document.querySelector('.active').classList.remove('active');
        ev.currentTarget.classList.add('active');
        
        // Find all gallery types (the ones that match the data-type of the button get shown, the others get hidden)

        document.querySelectorAll('[data-type]')
            .forEach( media => {
                if (media.dataset.type === mediaTarget) {
                    media.classList.add('visible');
                } else {
                    media.classList.remove('visible');
                }
            })
    },


    // Initialize Gallery

    init: function() {

        //Get the data
        this.getData();

        // Build the gallery + fullscreen view
        document.addEventListener('galleryDataReady', ()=> {
            this.buildGallery();
            this.buildFullScreenView();
            this.addFullScreenFunctionalities();
        })


        // Attach listeners to filter button
        document.querySelectorAll('.tabs > button ')
            .forEach( button => button.addEventListener('click', this.filterGallery))

    }
}

GALLERY.init();
