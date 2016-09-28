define(function () {
    var SpriteSheetSystem = function () {
        this.type = "spriteSheet";
        this.game = null;
        this.isReady = false;
    };

    SpriteSheetSystem.prototype.createSpriteSheetImgs = function () {
        var self = this;
        var spriteSheets = self.game.spriteSheets;
        var imagesLoaded = 0;

        for (var i = 0; i < spriteSheets.srcs.length; i++) {
            var img = new Image();
            img.src = img.name = spriteSheets.srcs[i];

            img.addEventListener("load", function () {
                imagesLoaded++;
                spriteSheets.imgs.push(img);

                if (imagesLoaded >= spriteSheets.srcs.length) {
                    self.isReady = true;
                }
            });
        }
    };

    SpriteSheetSystem.prototype.activate = function (game) {
        this.game = game;
        this.createSpriteSheetImgs();
    };

    return SpriteSheetSystem;
});
