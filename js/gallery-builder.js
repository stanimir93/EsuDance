/*

GALLERY_BUILDER 
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

GALLERY_BUILDER {

    DATA

	FETCH DATA + BUILD 2 ARRAYS - BIG AND SMALL

	BUILD SMALL GALLERY_BUILDER FROM SMALL ARRAY

	BUILD BIG GALLERY_BUILDER - empty + ADD LISTENERS 
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
	
    




	FILTER SMALL GALLERY_BUILDER


*/


export let GALLERY_BUILDER = {

    videos: [],
    smallPhotos: [],
    largePhotos: [],
    imagesFolder: '',
    
    // Fetch the gallery data (photo names and video urls) and save it in the variables above
    getData: function(jsonFile) {

        // Shout out when Gallery Data is ready so other functions can take it and build the gallery
        let galleryDataReady = new Event('galleryDataReady');
        
        // Fetches names of small photos and video urls. Saves them into arrays + large photos array
        fetch(jsonFile)
        .then( response => response.json())
        .then ( data => {
            GALLERY_BUILDER.videos = data["video_urls"];
            GALLERY_BUILDER.smallPhotos = data["photo_names"];
            GALLERY_BUILDER.smallPhotos.forEach( photo => GALLERY_BUILDER.largePhotos.push(photo.replace('(Small)', '(Large)')) )  // Array with names of large photos
            document.dispatchEvent(galleryDataReady);
        })  
    },

    // Create elements and render gallery
    buildSmallImageGallery: function(selectorGalleryContainer) {

        // Build photo gallery

        let imageBuilder = function() {
            GALLERY_BUILDER.smallPhotos?.forEach( (photoName) => {
                let wrapper = document.createElement('div');
                wrapper.classList.add('gallery-media-wrapper', 'visible');
                wrapper.dataset.type = 'photos'
    
                let container = document.createElement('div');
                container.classList.add('gallery-image-container');
                container.dataset.index = GALLERY_BUILDER.smallPhotos.indexOf(photoName);
                container.style.backgroundImage = `url('${GALLERY_BUILDER.imagesFolder}/${photoName}')`;
    
                wrapper.appendChild(container)
    
                galleryContainer.appendChild(wrapper)  
            })
        }

        // Build video gallery

        let videoBuilder = function() {
            GALLERY_BUILDER.videos?.forEach( (videoURL) => {
                let wrapper = document.createElement('div');
                wrapper.classList.add('gallery-media-wrapper');
                wrapper.dataset.type = 'videos'

                let container = document.createElement('div');
                container.classList.add('gallery-video-container');
                container.innerHTML = `<iframe src="${videoURL}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                
                wrapper.appendChild(container)

            galleryContainer.appendChild(wrapper)
            })
        }

        
        let galleryContainer = document.createElement('div');
        galleryContainer.classList.add('small-images-container');
        
        let df = new DocumentFragment();
        df.appendChild(galleryContainer);

        imageBuilder();
        videoBuilder();

        // Add df to DOM 
        document.querySelector(selectorGalleryContainer).appendChild(df);
    },

    // Create buttons and empty <img> elements to be used in fullscreen mode. 
    buildFullScreenView: function(selectorGalleryContainer) {

        let df = new DocumentFragment();

        let fullscreenContainer = document.createElement('div');
        fullscreenContainer.classList.add('fullscreen-container')

        let fullscreenButtons = document.createElement('div');
        fullscreenButtons.classList.add('fullscreen-buttons');
        fullscreenButtons.innerHTML = `
                <div class="download-button"><a href="" download=""><i class="fas fa-download"></i></a></div>
                <div class="gallery-location-counter"></div>
                <div class="close-button">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M569.3,498.4L975.5,94.2c19.2-19.1,19.3-50.1,0.2-69.3c-19.2-19.3-50.1-19.3-69.3-0.2L500,428.9L97.2,24.8C78.1,5.7,47.1,5.6,27.9,24.7C8.7,43.8,8.7,74.9,27.8,94.1l402.7,404L24.5,902c-19.2,19.1-19.3,50.1-0.2,69.3c9.6,9.6,22.1,14.5,34.7,14.5c12.5,0,25-4.7,34.6-14.3l406.2-404l406.5,407.7c9.6,9.6,22.1,14.4,34.7,14.4c12.5,0,25-4.8,34.6-14.3c19.2-19.1,19.2-50.1,0.1-69.3L569.3,498.4L569.3,498.4z"/></g></svg>
                </div>`
        fullscreenContainer.appendChild(fullscreenButtons);

        let fullscreenArrows = document.createElement('div');
        fullscreenArrows.classList.add('fullscreen-arrows');
        fullscreenArrows.innerHTML = `
        <div onclick="" class="left arrow"><i class="fas fa-chevron-left"></i></div>
        <div class="right arrow"><i class="fas fa-chevron-right"></i></div>
        `
        fullscreenContainer.appendChild(fullscreenArrows);


        let fullscreenImages = document.createElement('div');
        fullscreenImages.classList.add('fullscreen-images-container');
        
        fullscreenContainer.appendChild(fullscreenImages);

        // Append photos to df
        GALLERY_BUILDER.largePhotos.forEach( (photo) => {
            // let img = document.createElement('img');
            // img.classList.add('large-image');
            // img.dataset.index = GALLERY_BUILDER.largePhotos.indexOf(photo);

            let wrapper = document.createElement('div');
            wrapper.classList.add('fullscreen-image');
            wrapper.dataset.index = GALLERY_BUILDER.largePhotos.indexOf(photo);

            let spinner = document.createElement('div');
            spinner.classList.add('spinner', 'active');
            wrapper.appendChild(spinner);

            fullscreenImages.appendChild(wrapper);
        })
        df.appendChild(fullscreenContainer);

        // Append df to images wrapper
        document.querySelector(selectorGalleryContainer).appendChild(df);
        

        // Add listenners to arrows
        document.querySelector('.arrow.left').addEventListener('click', function(){
            document.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowLeft'}))
        })
        document.querySelector('.arrow.right').addEventListener('click', function(){
            document.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowRight'}))
        })
    },
    
    addFullScreenFunctionalities: function() {

        
        // Open fullscreen mode and scroll into view the chosen photo
        let openFullScreen = function(ev) {

            document.querySelector('.fullscreen-container').classList.add('active');

            let index = ev.target.dataset.index;
            let photo = document.querySelector(`.fullscreen-image[data-index="${index}"]`)

            setBackgroundImage(index, photo)
            document.body.style.position = 'fixed'; // Prevents up and down scrolling
            photo.scrollIntoView(false);
        }


        // Fetch image. Set it as background image and remove the loading spinner
        let setBackgroundImage = function(index, photo) {


           
            fetch(`${GALLERY_BUILDER.imagesFolder}/${GALLERY_BUILDER.largePhotos[index]}`)
                .then(response => response.blob())
                .then(imageBlob => {
                    // Then create a local URL for that image and print it 
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    photo.style.backgroundImage = `url('${imageObjectURL}')`;
                    
                    document.querySelector(`[data-index="${index}"] .spinner`).classList.remove('active');

                    let downloadButton = document.querySelector('.download-button a');
                    downloadButton.href = imageObjectURL;
                    downloadButton.download = GALLERY_BUILDER.largePhotos[index].replace(' (Large)', '');
                    
                });

      
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

                    if (entry.isIntersecting && !entry.target.style['background-image']) {
                        setBackgroundImage(entry.target.dataset.index, entry.target)
                    }
                })
            };
            
            let observer = new IntersectionObserver(beShowing, options)
            document.querySelectorAll('.fullscreen-image').forEach( container => observer.observe(container));
            
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
                        counter.textContent = `${1 + Number(entry.target.dataset.index)} / ${GALLERY_BUILDER.largePhotos.length}`              
                    }
                })
            };

            let observer = new IntersectionObserver(beShowing, options)
            document.querySelectorAll('.fullscreen-image').forEach( container => observer.observe(container));
            
        }
        // Close fullscreen mode 

        let closeFullScreen = function() {
            document.querySelector('.fullscreen-container').classList.remove('active');
            document.body.style.position = 'static';

        }


        let changePhotosWithArrows = function() {

            
            let moveImages = function(ev) {
                if (document.querySelector('.fullscreen-container.active')) {
                    let imagesWrapper = document.querySelector('.fullscreen-images-container');
                    let optionsRight = {
                        top: 0,
                        left: imagesWrapper.scrollWidth / GALLERY_BUILDER.largePhotos.length,
                        behavior: 'smooth'
                        };
                    let optionsLeft = {
                        top: 0,
                        left: -1 * imagesWrapper.scrollWidth / GALLERY_BUILDER.largePhotos.length,
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
        document.querySelector('.close-button').addEventListener('click', closeFullScreen );
        setBackgroundImageOnSwipe();
        imageCounter();
        changePhotosWithArrows();
    },

    // Initialize Gallery. The callback functions are functions that need to be applied to the gallery once it is built

    init: function(jsonFile, selectorGalleryContainer, imagesFolder, callbacks) {

        //Get the data
        this.getData(jsonFile);

        //Where images are stored
        this.imagesFolder = imagesFolder

        
        // Build the gallery + fullscreen view
        document.addEventListener('galleryDataReady', ()=> {
            this.buildSmallImageGallery(selectorGalleryContainer);
            this.buildFullScreenView(selectorGalleryContainer);
            this.addFullScreenFunctionalities();
            callbacks.forEach( fun => fun())
        })
        
    }
}

