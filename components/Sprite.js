define(function () {
    var Sprite = function () {
        this.type = "sprite";
        this.isActive = true;
        this.imgSrc = null;
        this.srcX = 0;
        this.srcY = 0;
        this.srcW = 0;
        this.srcH = 0;
    };

    return Sprite;
});
