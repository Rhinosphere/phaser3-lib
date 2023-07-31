import phaser from 'phaser/src/phaser.js';
import UIPlugin from '../../templates/ui/ui-plugin.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() { }

    create() {
        var maxHeight = 135;
        var textArea = this.rexUI.add.textArea({
            x: 400,
            y: 300,
            width: 220,
            height: maxHeight,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),

            text: this.add.text(),

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                hideUnscrollableSlider: true,
            },

            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,

                text: 10,
                // text: {
                //     top: 20,
                //     bottom: 20,
                //     left: 20,
                //     right: 20,
                // },
                header: 0,
                footer: 0,
            },

            scroller: {
                // pointerOutRelease: false,
            },

        })
            .layout()


        var contentMode = 0;
        var ChangeContent = function () {
            textArea.setText(GetContent(contentMode))

            // Set min of textAreaHeight then layout it again
            var textAreaHeight = Math.min(textArea.childHeight, maxHeight);
            textArea.setMinHeight(textAreaHeight).layout();

            contentMode = (contentMode + 1) % 3;
        }

        ChangeContent();

        this.add.text(0, 400, 'Change content')
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', ChangeContent)

    }

    update() { }
}

var GetContent = function (mode) {
    switch (mode) {
        case 0:
            return 'Phaser is a fast, free, and fun open source HTML5 game framework';

        case 1:
            return 'Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers.';

        default:
            return 'Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.'
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo,
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
};

var game = new Phaser.Game(config);