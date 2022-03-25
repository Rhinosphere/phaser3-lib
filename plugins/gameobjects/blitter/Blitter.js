import Render from './render/Render.js';
import Methods from './methods/Methods.js';
import PoolManager from './poolmanager/PoolManager.js';

const GameObject = Phaser.GameObjects.GameObject;
const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;
const List = Phaser.Structs.List;

class Blitter extends GameObject {
    constructor(scene, x, y, texture, frame, config) {
        if (IsPlainObject(x)) {
            config = x;
            x = GetValue(config, 'x', 0);
            y = GetValue(config, 'y', 0);
            texture = GetValue(config, 'texture');
            frame = GetValue(config, 'frame');
        }

        super(scene, 'rexBlitter');

        this.children = new List();
        this.renderList = [];
        this.displayListDirty = false;
        this.lastAppendedChildren = [];
        this.poolManager = new PoolManager(config);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline();

    }

    preDestroy() {
        this.children.destroy();
        this.renderList.length = 0;
    }

    childCanRender(child) {
        return (child.active && child.visible && (child.alpha > 0));
    }

    getRenderList() {
        if (this.displayListDirty) {
            this.renderList = this.children.list.filter(this.childCanRender, this);
            this.displayListDirty = false;
        }

        return this.renderList;
    }
}

const Components = Phaser.GameObjects.Components;
Phaser.Class.mixin(Blitter,
    [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render,

        Methods
    ]
);


export default Blitter;