define(function () {
    var StateSystem = function () {
        this.type = "state";
        this.game = null;
        this.isReady = false;
        this.statesHash = {};
    };

    StateSystem.prototype.setStatesOnEntities = function (entities) {
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var stateComponent = entity.getActiveComponentByType("state");

            if (!this.statesHash[entity.id]) {
                this.statesHash[entity.id] = stateComponent.currentState;
            }

            if (this.statesHash[entity.id] !== stateComponent.currentState) {
                var entityComponents = entity.components;
                var activeStateComponents = stateComponent.states[stateComponent.currentState];

                // NOTE: Deactivate all components first.
                for (var j = 0; j < entityComponents.length; j++) {
                    var entityComponent = entityComponents[j];
                    entity.deactivateComponent(entityComponent);
                }

                var filteredActiveStateComponents = activeStateComponents.filter(function (component) {
                    for (var k = 0; k < entityComponents.length; k++) {
                        var entityComponent = entityComponents[k];

                        if (component === entityComponent) {
                            return component;
                        }
                    }
                });

                // NOTE: Activate only the components on the current state array.
                for (var l = 0; l < filteredActiveStateComponents.length; l++) {
                    var filteredActiveStateComponent = filteredActiveStateComponents[l];
                    entity.activateComponent(filteredActiveStateComponent);
                }

                this.statesHash[entity.id] = stateComponent.currentState;
            }
        }
    };

    StateSystem.prototype.activate = function (game) {
        this.game = game;
        this.isReady = true;
    };

    StateSystem.prototype.update = function () {
        var rootEntity = this.game.world.rootEntity;
        var stateComponentEntities = rootEntity.getChildrenWithActiveComponentByType("state");

        this.setStatesOnEntities(stateComponentEntities)
    };

    return StateSystem;
});
