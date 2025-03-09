document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");
    const downloadBtn = document.getElementById("downloadImage");
    const prevBtn = document.getElementById("prevImage");
    const nextBtn = document.getElementById("nextImage");
    const slideshowToggle = document.getElementById("slideshowToggle");
    const slideshowStatus = document.getElementById("slideshowStatus");
    
    // Theme buttons
    const lightTheme = document.getElementById("lightTheme");
    const darkTheme = document.getElementById("darkTheme");
    const forestTheme = document.getElementById("forestTheme");
    const oceanTheme = document.getElementById("oceanTheme");

    // Image descriptions (customize these for your images)
    const imageDescriptions = {
        "im1.jpg": "Beautiful field of flowers at sunset",
        "im2.jpg": "Magnificent sunlight through clouds",
        "im3.jpg": "Creative vertical bookshelf design",
        "im4.jpg": "Peaceful indoor garden retreat",
        "im5.jpg": "Treehouse nestled in forest",
        "im6.jpg": "Luxury cars on a scenic mountain road",
        "im7.jpg": "Cute puppy on a walk!",
        "im8.jpg": "Creative Wall photos hanger."
    };

    // List of image filenames in the "images" folder
    const imageList = ["im1.jpg", "im2.jpg", "im3.jpg", "im4.jpg", "im5.jpg", "im6.jpg", "im7.jpg", "im8.jpg"];
    let currentImageIndex = 0;
    let slideshowInterval = null;
    let isSlideshow = false;
    let imageCards = [];

    // Dynamically add images to the gallery with lazy loading
    imageList.forEach((imgName, index) => {
        const card = document.createElement("div");
        card.className = "image-card";
        card.dataset.index = index;
        
        // Add placeholder
        const placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        
        // Create image with lazy loading
        const img = document.createElement("img");
        img.dataset.src = `images/${imgName}`; // Use data-src for lazy loading
        img.alt = imageDescriptions[imgName] || "Gallery Image";
        img.addEventListener("click", () => openLightbox(img.dataset.src, index));
        
        // When image loads, remove placeholder and show image
        img.onload = function() {
            placeholder.style.display = "none";
            img.classList.add("loaded");
        };
        
        const overlay = document.createElement("div");
        overlay.className = "image-overlay";
        overlay.innerHTML = `<span>${imageDescriptions[imgName] || "Beautiful Image"}</span>`;
        
        card.appendChild(placeholder);
        card.appendChild(img);
        card.appendChild(overlay);
        gallery.appendChild(card);
        imageCards.push(card);
    });

    // Implement Intersection Observer for lazy loading
    const lazyLoadImages = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: "100px" });

            document.querySelectorAll(".gallery img").forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            document.querySelectorAll(".gallery img").forEach(img => {
                img.src = img.dataset.src;
            });
        }
    };

    // Start lazy loading
    lazyLoadImages();

    // Function to open lightbox
    function openLightbox(src, index) {
        currentImageIndex = index;
        lightbox.classList.add("active");
        lightboxImg.src = src;
        
        // If slideshow is on, pause it while lightbox is open
        if (isSlideshow) {
            pauseSlideshow();
        }
    }

    // Close lightbox on clicking the close button
    closeBtn.addEventListener("click", () => {
        lightbox.classList.remove("active");
        
        // If slideshow was on, resume it
        if (isSlideshow) {
            startSlideshow();
        }
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
            
            // If slideshow was on, resume it
            if (isSlideshow) {
                startSlideshow();
            }
        }
    });

    // Download current image
    downloadBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = lightboxImg.src;
        a.download = `gallery-image-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Previous image
    prevBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
        lightboxImg.src = `images/${imageList[currentImageIndex]}`;
    });

    // Next image
    nextBtn.addEventListener("click", () => {
        currentImageIndex = (currentImageIndex + 1) % imageList.length;
        lightboxImg.src = `images/${imageList[currentImageIndex]}`;
    });

    // Slideshow functionality
    function toggleSlideshow() {
        if (isSlideshow) {
            pauseSlideshow();
        } else {
            startSlideshow();
        }
    }

    function startSlideshow() {
        isSlideshow = true;
        slideshowToggle.innerHTML = "⏸️";
        slideshowStatus.textContent = "Slideshow On";
        
        // Remove any existing active-slide class
        imageCards.forEach(card => card.classList.remove("active-slide"));
        
        // Set initial active slide
        imageCards[currentImageIndex].classList.add("active-slide");
        
        // Start the slideshow interval
        slideshowInterval = setInterval(() => {
            // Remove active class from current slide
            imageCards[currentImageIndex].classList.remove("active-slide");
            
            // Update index
            currentImageIndex = (currentImageIndex + 1) % imageList.length;
            
            // Add active class to new slide
            imageCards[currentImageIndex].classList.add("active-slide");
            
            // Scroll to make sure the active slide is visible
            imageCards[currentImageIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 3000); // Change slide every 3 seconds
    }

    function pauseSlideshow() {
        isSlideshow = false;
        slideshowToggle.innerHTML = "▶️";
        slideshowStatus.textContent = "Slideshow Off";
        clearInterval(slideshowInterval);
        
        // Remove any existing active-slide class
        imageCards.forEach(card => card.classList.remove("active-slide"));
    }

    // Toggle slideshow on button click
    slideshowToggle.addEventListener("click", toggleSlideshow);

    // Theme toggles
    lightTheme.addEventListener("click", () => {
        document.body.className = "";
    });
    
    darkTheme.addEventListener("click", () => {
        document.body.className = "dark-mode";
    });
    
    forestTheme.addEventListener("click", () => {
        document.body.className = "forest-theme";
    });
    
    oceanTheme.addEventListener("click", () => {
        document.body.className = "ocean-theme";
    });
    
    // Check for saved theme
    const savedTheme = localStorage.getItem("gallery-theme");
    if (savedTheme) {
        document.body.className = savedTheme;
    }
    
    // Save theme preference
    function saveTheme() {
        localStorage.setItem("gallery-theme", document.body.className);
    }
    
    // Event listeners for theme saving
    lightTheme.addEventListener("click", saveTheme);
    darkTheme.addEventListener("click", saveTheme);
    forestTheme.addEventListener("click", saveTheme);
    oceanTheme.addEventListener("click", saveTheme);
    
    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
        if (lightbox.classList.contains("active")) {
            switch(e.key) {
                case "Escape":
                    lightbox.classList.remove("active");
                    break;
                case "ArrowLeft":
                    prevBtn.click();
                    break;
                case "ArrowRight":
                    nextBtn.click();
                    break;
            }
        }
    });
});