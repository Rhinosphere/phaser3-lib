import {
    SlideLeft, SlideRight, SlideUp, SlideDown,
} from './Modes.js';

var AddSlideModes = function (image) {
    image
        .addTransitionMode(SlideLeft, {
            duration: 1000, ease: 'Linear', dir: 'in', mask: true,

            onStart: function (parent, currentImage, nextImage, t) {
            },
            onProgress: function (parent, currentImage, nextImage, t) {
                var x = nextImage.width * (t - 1);
                parent.setChildLocalPosition(nextImage, x, 0);
            },
            onComplete: function (parent, currentImage, nextImage, t) {
                parent.setChildLocalPosition(nextImage, 0, 0);
            },
        })
        .addTransitionMode(SlideRight, {
            duration: 1000, ease: 'Linear', dir: 'in', mask: true,

            onStart: function (parent, currentImage, nextImage, t) {
            },
            onProgress: function (parent, currentImage, nextImage, t) {
                var x = nextImage.width * (1 - t);
                parent.setChildLocalPosition(nextImage, x, 0);
            },
            onComplete: function (parent, currentImage, nextImage, t) {
                parent.setChildLocalPosition(nextImage, 0, 0);
            },
        })
        .addTransitionMode(SlideUp, {
            duration: 1000, ease: 'Linear', dir: 'in', mask: true,

            onStart: function (parent, currentImage, nextImage, t) {
            },
            onProgress: function (parent, currentImage, nextImage, t) {
                var y = nextImage.height * (t - 1);
                parent.setChildLocalPosition(nextImage, 0, y);
            },
            onComplete: function (parent, currentImage, nextImage, t) {
                parent.setChildLocalPosition(nextImage, 0, 0);
            },
        })
        .addTransitionMode(SlideDown, {
            duration: 1000, ease: 'Linear', dir: 'in', mask: true,

            onStart: function (parent, currentImage, nextImage, t) {
            },
            onProgress: function (parent, currentImage, nextImage, t) {
                var y = nextImage.height * (1 - t);
                parent.setChildLocalPosition(nextImage, 0, y);
            },
            onComplete: function (parent, currentImage, nextImage, t) {
                parent.setChildLocalPosition(nextImage, 0, 0);
            },
        })
}

export default AddSlideModes;