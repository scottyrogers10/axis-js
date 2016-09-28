define(function () {
    var RigidBody = function () {
        this.type = "rigidBody";
        this.isActive = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.w = 0;
        this.h = 0;
    };

    return RigidBody;
});
