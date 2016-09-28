define(function () {
    var Restraint = function () {
        this.type = "restraint";
        this.isActive = "true";
        this.top = null;
        this.bottom = null;
        this.right = null;
        this.left = null;
        this.restraining = [];
    };

    return Restraint;
});
