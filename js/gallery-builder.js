/*

-------------------- HOW TO USE --------------------

Import GALLERY_BUILDER and call GALLERY_BUILDER.init() and pass parameters:

    1. path json file holding image titles, 
    2. query selector for container to hold the gallery, 
    3. path to folder storing the images
    4. (optional) array specifying media type to be hidden by default e.g. ['photos', 'videos']
    5. (optional) array of callbacks to be run once the gallery has been build (e.g. to add extra functionality)
    6. CSS needs to be added to each page using the gallery
        - CSS specific to the page telling how to display small photos and videos
        - CCS for fullscreen mode - fullscreen-gallery.css

-------------------- HOW IT WORKS --------------------

    * GALLERY_BUILDER stores arrays with urls of videos, small photos, large photos (same photo but higher resolution), the folder storing the photos
    * getData() fetches the photo and video urls and populates the arrays
    
    (The index of large and small photos are matching. The div elements which show the photos (large and small) hava data-index that matches as well)
    
    * buildSmallImageGallery() adds to DOM the HTML elements to hold each video and photo (background images)
    * buildFullScrenView() adds to DOM the HTML elements to hold larger photos. 
    * addFullScreenFunctionalities():
        - when small photo is clicked a fullscreen gallery  is opened and the div with same data-index as data-index of small photo div is scrolled into view
        - when a certain fullscreen div is into view its background photo is fetched and rendered
        - keyboard arrows and scrolling/swipping change the div into view and therefor its background photo is also fetched and set

        - when 'X' is clicked or escape key is pressed, the gallery is closed
        - the counter on the top indicates which number of photo we are on (data-index + 1)
        
    * init() 
        - runs getData() and builds arrays of urls
        - runs buildSmallImageGallery(), buildFullScrenView(), addFullScreenFunctionalities()
        - hides photos or videos if required not to be visible on page load
        - runs callbacks once gallery has been built to add extra functionalities (e.g. filter)

    * CSS 
        - specific css for each page to tell how the small photo and video gallery to be displayed
        - fullscreen-gallery.css tells how fullscreen mode to be displayed

*/


export let GALLERY_BUILDER = {

    // urls of videos, small photos, large photos, folder storing the photos
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

    // Build HTML elements to hold and show videos and images
    buildSmallImageGallery: function(selectorGalleryContainer, hideMedia) {

        // Build photo gallery
        let imageBuilder = function() {
            GALLERY_BUILDER.smallPhotos?.forEach( (photoName) => {
                let wrapper = document.createElement('div');
                wrapper.classList.add('gallery-media-wrapper');
                if (!hideMedia.includes('photos')) {
                    wrapper.classList.add('visible')
                }
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
                if (!hideMedia.includes('videos')) {
                    wrapper.classList.add('visible')
                }
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

        // Call functions to build the elements
        imageBuilder();
        videoBuilder();

        // Add df to DOM 
        document.querySelector(selectorGalleryContainer).appendChild(df);
    },

    // Build HTML elemetns for fullscren view of photos 
    buildFullScreenView: function(selectorGalleryContainer) {

        let df = new DocumentFragment();

        // Create the full screen HTML elements

        // container
        let fullscreenContainer = document.createElement('div');
        fullscreenContainer.classList.add('fullscreen-container')

        // buttons
        let fullscreenButtons = document.createElement('div');
        fullscreenButtons.classList.add('fullscreen-buttons');
        fullscreenButtons.innerHTML = `
                <div class="download-button"><a href="" download=""><i class="fas fa-download"></i></a></div>
                <div class="gallery-location-counter"></div>
                <div class="close-button">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve"><g><path d="M569.3,498.4L975.5,94.2c19.2-19.1,19.3-50.1,0.2-69.3c-19.2-19.3-50.1-19.3-69.3-0.2L500,428.9L97.2,24.8C78.1,5.7,47.1,5.6,27.9,24.7C8.7,43.8,8.7,74.9,27.8,94.1l402.7,404L24.5,902c-19.2,19.1-19.3,50.1-0.2,69.3c9.6,9.6,22.1,14.5,34.7,14.5c12.5,0,25-4.7,34.6-14.3l406.2-404l406.5,407.7c9.6,9.6,22.1,14.4,34.7,14.4c12.5,0,25-4.8,34.6-14.3c19.2-19.1,19.2-50.1,0.1-69.3L569.3,498.4L569.3,498.4z"/></g></svg>
                </div>`
        fullscreenContainer.appendChild(fullscreenButtons);

        // arrows
        let fullscreenArrows = document.createElement('div');
        fullscreenArrows.classList.add('fullscreen-arrows');
        fullscreenArrows.innerHTML = `
        <div onclick="" class="left arrow"><i class="fas fa-chevron-left"></i></div>
        <div class="right arrow"><i class="fas fa-chevron-right"></i></div>
        `
        fullscreenContainer.appendChild(fullscreenArrows);

        // div to images
        let fullscreenImages = document.createElement('div');
        fullscreenImages.classList.add('fullscreen-images-container');
        
        fullscreenContainer.appendChild(fullscreenImages);

        // divs for each photo in the gallery (the images will be set as background later)
        GALLERY_BUILDER.largePhotos.forEach( (photo) => {

            let wrapper = document.createElement('div');
            wrapper.classList.add('fullscreen-image');
            wrapper.dataset.index = GALLERY_BUILDER.largePhotos.indexOf(photo);

            // loading spinner to indicate that a photo is being fetched
            let spinner = document.createElement('div');
            spinner.classList.add('spinner', 'active');
            wrapper.appendChild(spinner);

            fullscreenImages.appendChild(wrapper);
        })
        df.appendChild(fullscreenContainer);

        // Append gallery HTML to DOM
        document.querySelector(selectorGalleryContainer).appendChild(df);
        

        // Add listenners to arrows (to press the keyboard's left and right arrows)
        document.querySelector('.arrow.left').addEventListener('click', function(){
            document.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowLeft'}))
        })
        document.querySelector('.arrow.right').addEventListener('click', function(){
            document.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowRight'}))
        })
    },
    
    // Add functionalities to fullscreen gallery
    addFullScreenFunctionalities: function(gallerySelector) {

        // Open fullscreen mode and scroll into view the chosen photo
        let openFullScreen = function(ev, gallerySelector) {

            document.querySelector('.fullscreen-container').classList.add('active');

            let index = ev.target.dataset.index;
            let photo = document.querySelector(`.fullscreen-image[data-index="${index}"]`)

            setBackgroundImage(index, photo)

            // Open Fullscreen in browser if on mobile
            if(navigator.userAgent.toLowerCase().match(/mobile/i)) { 

                if (document.body.requestFullscreen) {
                    document.body.requestFullscreen();
                } else if (document.body.webkitRequestFullscreen) { /* Safari */
                    document.body.webkitRequestFullscreen();
                } else if (document.body.msRequestFullscreen) { /* IE11 */
                    document.body.msRequestFullscreen();
                }
            }
                
            // Prevents up and down scrolling
            document.querySelectorAll('main > *').forEach( elem => {
                if(elem !== document.querySelector('.' + gallerySelector)) {
                    elem.style.visibility = 'hidden';
                    elem.style.height = 0;
                }
            });
            document.querySelector('.small-images-container').style.display = 'none'; 
            document.querySelector('footer').style.display = 'none'
            document.querySelector('header').style.display = 'none'

            // Scroll right photo into view 
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
                        let counter = document.querySelector('.gallery-location-counter');
                        counter.textContent = `${1 + Number(entry.target.dataset.index)} / ${GALLERY_BUILDER.largePhotos.length}`              
                    }
                })
            };

            let observer = new IntersectionObserver(beShowing, options)
            document.querySelectorAll('.fullscreen-image').forEach( container => observer.observe(container));
            
        }
        // Hide and show counter (used on mobile landscape mode only)
        let hideShowArrowsAndCounter = function () {
            document.querySelectorAll('.fullscreen-images-container').forEach( image => {
                image.addEventListener('click', () => {
                    document.querySelector('.gallery-location-counter').classList.toggle('hiddenOnMobileLandscape');
                    document.querySelectorAll('.arrow').forEach( arrow => {
                        arrow.classList.toggle('hiddenOnMobileLandscape')
                    })
                })
                
            });

        }
        // Close fullscreen mode 

        let closeFullScreen = function(gallerySelector) {

            document.querySelectorAll('main > *').forEach( elem => {
                if(elem !== document.querySelector('.' + gallerySelector)) {
                    elem.style.visibility = 'null';
                    elem.style.height = 'null';
                }
            });
            document.querySelector('.fullscreen-container').classList.remove('active');
            document.querySelector('.small-images-container').style.display = 'grid';
            document.querySelector('footer').style.display = 'flex'
            document.querySelector('header').style.display = 'flex'

            // Close fullscreen on mobile only
            if(navigator.userAgent.toLowerCase().match(/mobile/i)) { 
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }

        }

        // Use keyboard arrows to change photos
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
        hideShowArrowsAndCounter();
    },

    // Initialize Gallery

    init: function(jsonFile, selectorGalleryContainer, imagesFolder, hideMedia=[], callbacks=[]) {

        //Get the data
        this.getData(jsonFile);

        //Where images are stored
        this.imagesFolder = imagesFolder
        
        // Build the gallery + fullscreen view
        document.addEventListener('galleryDataReady', ()=> {
            this.buildSmallImageGallery(selectorGalleryContainer, hideMedia);
            this.buildFullScreenView(selectorGalleryContainer);
            this.addFullScreenFunctionalities(selectorGalleryContainer);
            callbacks.forEach( fun => fun());
        })
        
    }
}

