var Wait = function (name) {
    // Already in typingPaused state
    if (this.isTypingPaused) {
        return this;
    }

    this.pauseTyping();
    if (name == null) {
        WaitEvent.call(this);
    } else if (typeof (name) === 'number') {
        WaitTime.call(this, name);
    } else if ((name.length > 1) && (name.indexOf('|') !== -1)) {
        WaitMultiple.call(this, name);
    } else if (name === 'click') {
        WaitClick.call(this);
    } else {
        WaitKey.call(this, name);
    }

    return this;
}

var ResumeTyping = function () {
    this.resumeTyping();
}

var WaitEvent = function () {
    this.dynamicText.emit('wait', ResumeTyping);
}

var WaitTime = function (time) {
    this.pauseTypingTimer = this.timeline.addTimer({
        target: this,
        duration: time,
        onComplete: function (target, t, timer) {
            target.pauseTypingTimer = undefined;
            target.resumeTyping(timer.remainder);
        }
    })

    // Canceled by other event
    this.once('resume-typing', function () {
        if (this.pauseTypingTimer) {
            this.pauseTypingTimer.remove();
        }
    }, this);

    this.dynamicText.emit('wait.time', time);
}

var WaitClick = function () {
    var touchEE;
    if (this.dynamicText.clickTarget) {
        touchEE = this.dynamicText.clickTarget.setInteractive();
    } else {
        touchEE = this.dynamicText.scene.input;
    }
    touchEE.once('pointerdown', ResumeTyping, this);

    // Canceled by other event
    this.once('resume-typing', function () {
        touchEE.off('pointerdown', ResumeTyping, this);
    }, this);

    this.dynamicText.emit('wait.click');
}

var WaitKey = function (keyName) {
    var eventName = `keydown-${keyName.toUpperCase()}`;
    var keyboard = this.dynamicText.scene.input.keyboard;
    keyboard
        .once(eventName, ResumeTyping, this);

    // Canceled by other event
    this.once('resume-typing', function () {
        keyboard.off(eventName, ResumeTyping, this);
    }, this);

    this.dynamicText.emit('wait.keydown', keyName);
}

var WaitMultiple = function (names) {
    names = names.split('|');
    for (var i = 0, cnt = names.length; i < cnt; i++) {
        var name = names[i];
        if (isNaN(name)) {
            if (name === 'click') {
                WaitClick.call(this);
            } else {
                WaitKey.call(this, name);
            }
        } else {
            WaitTime.call(this, parseFloat(name));
        }
    }
}

export default Wait;