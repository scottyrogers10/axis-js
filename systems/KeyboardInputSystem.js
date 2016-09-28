define(function () {
    var KeyboardInputSystem = function () {
        this.type = "keyboardInput";
        this.game = null;
        this.isReady = false;

        this.pressed = {};
    };

    KeyboardInputSystem.prototype.onKeyDown = function (event) {
        this.pressed[event.keyCode] = true;
    };

    KeyboardInputSystem.prototype.onKeyUp = function (event) {
        this.pressed[event.keyCode] = false;
    };

    KeyboardInputSystem.prototype.activate = function (game) {
        var self = this;

        window.addEventListener("keydown", function (event) {
           self.onKeyDown(event);
       });

       window.addEventListener("keyup", function (event) {
           self.onKeyUp(event);
       });

       self.game = game;
       self.isReady = true;
    };

    KeyboardInputSystem.prototype.update = function () {
        var self = this;
        var rootEntity = self.game.world.rootEntity;

        var keyboardInputEntities = rootEntity.getChildrenWithActiveComponentByType("keyboardInput");

        for (var i = 0; i < keyboardInputEntities.length; i++) {
            var keyboardInputComponent = keyboardInputEntities[i].getActiveComponentByType("keyboardInput");
            keyboardInputComponent.pressed = self.pressed;
        }
    };

    return KeyboardInputSystem;
});
