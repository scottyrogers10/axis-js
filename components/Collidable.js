define(function () {
    var Collidable = function () {
        this.type = "collidable";
        this.isActive = true;
        this.isStatic = false;
        this.collidingEntities = [];
    };

    return Collidable;
});
