define(function () {
    var StateSystem = function () {
        this.type = "state";
        this.game = null;
        this.isReady = false;
    };

    StateSystem.prototype.activate = function (game) {
        this.game = game;
        this.isReady = true;
    };

    StateSystem.prototype.update = function () {
        var rootEntity = this.game.world.rootEntity;
        var stateComponentEntities = rootEntity.getChildrenWithActiveComponentByType("state");

        for (var i = 0; i < stateComponentEntities.length; i++) {
            var stateComponent = stateComponentEntities[i].getActiveComponentByType("state");

            for (var j = 0; j < stateComponentEntities[i].components.length; j++) {
                stateComponentEntities[i].components[j].isActive = false;
            }

            for (var k = 0; k < stateComponent.states[stateComponent.currentState].length; k++) {
                stateComponent.states[stateComponent.currentState][k].isActive = true;
            }
        }
    };

    return StateSystem;
});
