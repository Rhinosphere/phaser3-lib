import phaser from 'phaser/src/phaser.js';
import DynamicTextPlugin from '../../plugins/dynamictext-plugin.js';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {

    }

    create() {
        var text = this.add.rexDynamicText(
            {
                x: 400, y: 300,

                background: {
                    stroke: 'white',
                    cornerRadius: 20
                },
                innerBounds: {
                    stroke: '#A52A2A'
                },
                padding: 20,
                style: {
                    fontSize: '20px',
                },
            }
        )

        text.appendText('Phaser is a fast, free, and fun open source HTML5 game framework');
        var result = text.runWordWrap({
            lineHeight: 30,
            maxLines: 0,       // Set maxLines to 0
            padding: { bottom: 10 },
        });
        var children = result.children;
        for (var i = 0, cnt = children.length; i < cnt; i++) {
            children[i]
                .setAngle(Math.random() * 30 - 15)
                .modifyStyle({ fontSize: Phaser.Math.Between(16, 24) })
        }
    }

    update() { }
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
        global: [{
            key: 'rexDynamicText',
            plugin: DynamicTextPlugin,
            start: true
        }]
    }
};

var game = new Phaser.Game(config);