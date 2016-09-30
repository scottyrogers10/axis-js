define(function () {
    var StateSystem = function () {
        this.type = "state";
        this.game = null;
        this.isReady = false;
        this.statesHash = {};
    };

    StateSystem.prototype.activate = function (game) {
        this.game = game;
        this.isReady = true;
    };

    StateSystem.prototype.update = function () {
        var self = this;

        var rootEntity = self.game.world.rootEntity;
        var stateComponentEntities = rootEntity.getChildrenWithActiveComponentByType("state");

        for (var i = 0; i < stateComponentEntities.length; i++) {
            var stateComponent = stateComponentEntities[i].getActiveComponentByType("state");

            if (!self.statesHash[stateComponentEntities[i].id]) {
                self.statesHash[stateComponentEntities[i].id] = stateComponent.currentState;
            }

            if (self.statesHash[stateComponentEntities[i].id] !== stateComponent.currentState) {
                var allComponents = stateComponentEntities[i].components;
                var activeStateComponents = stateComponent.states[stateComponent.currentState];

                for (var j = 0; j < allComponents.length; j++) {
                    stateComponentEntities[i].deactivateComponent(allComponents[j]);
                }

                var filteredActiveStateComponents = activeStateComponents.filter(function (component) {
                    for (var k = 0; k < allComponents.length; k++) {
                        if (component === allComponents[k]) {
                            return component;
                        }
                    }
                });

                for (var l = 0; l < filteredActiveStateComponents.length; l++) {
                    stateComponentEntities[i].activateComponent(filteredActiveStateComponents[l]);
                }

                self.statesHash[stateComponentEntities[i].id] = stateComponent.currentState;
            }
        }
    };

    return StateSystem;
});
