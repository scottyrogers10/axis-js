define(function () {
    var RenderSystem = function () {
        this.type = "render";
        this.game = null;
        this.isReady = false;
    };

    RenderSystem.prototype.getRenderableEntities = function () {
        var self = this;
        var rootEntity = self.game.world.rootEntity;

        return rootEntity.getChildrenWithActiveComponentsByTypes(["position", "size", "sprite"]);
    };

    RenderSystem.prototype.clearCameraRender = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    RenderSystem.prototype.getSpriteSheetImgByName = function (name) {
        var spriteSheetsImgs = this.game.spriteSheets.imgs;

        for (var i = 0; i < spriteSheetsImgs.length; i++) {
            if (name == spriteSheetsImgs[i].name) {
                return spriteSheetsImgs[i];
            }
        }
    };

    RenderSystem.prototype.drawEntities = function (renderableEntities, activeCamera) {
        var self = this;

        for (var i = 0; i < renderableEntities.length; i++) {
            var entity = renderableEntities[i];
            var sprite = entity.getActiveComponentByType("sprite");
            var position = entity.getActiveComponentByType("position");
            var size = entity.getActiveComponentByType("size");
            var spriteImg = self.getSpriteSheetImgByName(sprite.imgSrc);

            activeCamera.ctx.drawImage(spriteImg,
                        sprite.srcX, sprite.srcY,
                        sprite.srcW, sprite.srcH,
                        (position.x - activeCamera.offsetX), (position.y - activeCamera.offsetY),
                        size.width, size.height);
        }
    };

    RenderSystem.prototype.activate = function (game) {
        this.game = game;
        this.isReady = true;
    };

    RenderSystem.prototype.update = function () {
        var self = this;
        var renderableEntities = this.getRenderableEntities();
        var activeCamera = this.game.getActiveCamera();

        this.clearCameraRender.call(activeCamera);
        this.drawEntities(renderableEntities, activeCamera);
    };

    return RenderSystem;
});
