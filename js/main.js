const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// Update frame count based on the files (ezgif-frame-001.png to ezgif-frame-284.png)
const frameCount = 284;
const currentFrame = index => (
  `assets/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.webp`
);

const images = [];
let imagesLoaded = 0;

// Preload all images to avoid flickering and ensure smooth scrolling
const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) {
            // Draw the first frame as soon as it's ready
            drawFrame(0);
        }
    };
    images.push(img);
  }
};

// Set canvas dimensions based on typical video/image size (16:9 ratio)
// The object-fit: contain in CSS will ensure it scales correctly
canvas.width = 1920;
canvas.height = 1080;

const drawFrame = (frameIndex) => {
    if (images[frameIndex] && images[frameIndex].complete) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    }
};

let targetFrame = 0;
let currentDrawnFrame = 0;

window.addEventListener('scroll', () => {  
  const html = document.documentElement;
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  
  if (maxScrollTop <= 0) return;
  
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Map the scroll fraction to the frame index
  targetFrame = Math.min(
    frameCount - 1,
    Math.max(0, Math.floor(scrollFraction * frameCount))
  );
});

const render = () => {
    // Apply a simple easing function for "liquid" scrolling
    currentDrawnFrame += (targetFrame - currentDrawnFrame) * 0.08;
    
    // Draw the nearest integer frame
    drawFrame(Math.round(currentDrawnFrame));
    
    requestAnimationFrame(render);
};

preloadImages();
render();

// Intersection Observer to fade in the Glass Cards
const cards = document.querySelectorAll('.glass-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Remove the class when scrolled out of view to re-animate when scrolling back
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.3 });

cards.forEach(card => observer.observe(card));
