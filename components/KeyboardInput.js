define(function () {
    var KeyboardInput = function () {
        this.type = "keyboardInput";
        this.isActive = true;
        this.pressed = {};
    };

    return KeyboardInput;
});
