define(function () {
    var State = function () {
        this.type = "state";
        this.isActive = true;
        this.currentState = null;
        this.states = {};
    };

    return State;
});
