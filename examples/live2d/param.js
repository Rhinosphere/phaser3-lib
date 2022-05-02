import phaser from 'phaser/src/phaser.js';
import Live2dPlugin from '../../plugins/live2d-plugin.js';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        this.load.script('live2d', 'assets/live2d/core/live2dcubismcore.js');
        this.load.rexLive2d('Haru', 'assets/live2d/Haru/Haru.model3.json');
    }

    create() {
        var x = 1920 / 2,
            y = 1080 / 2;

        this.character = this.add.rexLive2d(x, y, 'Haru')
            .setScale(0.6)
            .startMotion('TapBody', undefined, 'force')
            .on('motions.complete', function () {
                this.startMotion('TapBody', undefined, 'force')
            })

        var tween = this.tweens.add({
            targets: this.character.params,
            bodyAngleX: { start: -10, to: 10 },
            eyeBallX: { start: -1, to: 1 },
            // angleZ: { start: -30, to: 30 },
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 100,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
    }

    update() {


    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo,
    plugins: {
        global: [
            {
                key: 'rexLive2d',
                plugin: Live2dPlugin,
                start: true
            }
        ]
    }
};

var game = new Phaser.Game(config);