
var SetBindingTarget = function (target) {
    var childrenMap = this.childrenMap;
    if (childrenMap.target) {
        this.unpin(childrenMap.target);
        childrenMap.target = undefined;

        this.stopMonitorTarget();
    }

    childrenMap.target = target;

    if (target) {
        this
            .setVisible(true)
            .setOrigin(target.originX, target.originY)
            .setPosition(target.x, target.y)
            .setAngle(target.angle)
            .setSize(target.displayWidth, target.displayHeight)

        this.pin(target);

        this
            .layout()
            .startMonitorTarget();

    } else {
        this.setVisible(false);

    }

    return this;
}

export default SetBindingTarget;