import Action from '../Action.js';
import { SUCCESS, RUNNING } from '../../constants.js';

class Wait extends Action {

    constructor({
        duration = 0,
        title,
        name = 'Wait'
    } = {}) {

        super({
            title,
            name,
            properties: {
                duration
            },
        });

        this.durationExpression = this.addExpression(duration);
    }

    open(tick) {
        var nodeMemory = tick.getNodeMemory();

        nodeMemory.$startTime = tick.currentTime;
        nodeMemory.$duration = tick.evalExpression(this.durationExpression);
    }

    tick(tick) {
        var nodeMemory = tick.getNodeMemory();
        var currTime = tick.currentTime;
        var startTime = nodeMemory.$startTime;
        var duration = nodeMemory.$duration;

        if ((currTime - startTime) < duration) {
            return RUNNING;
        }

        return SUCCESS;
    }
};

export default Wait;
