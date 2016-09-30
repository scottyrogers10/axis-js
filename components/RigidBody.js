define(function () {
    var RigidBody = function () {
        this.type = "rigidBody";
        this.isActive = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.width = 0;
        this.height = 0;
    };

    return RigidBody;
});
