define(function () {
    var Restraint = function () {
        this.type = "restraint";
        this.isActive = "true";
        this.top = null;
        this.right = null;
        this.bottom = null;
        this.left = null;

        this.restrainingSides = [];
    };

    return Restraint;
});
