define(function () {
    var RenderSystem = function () {
        this.game = null;
        this.activeViewPort = null;
        this.renderableEntities = [];
    };

    RenderSystem.prototype.getActiveViewPort = function () {
        var renderSystem = this;

        for (var i = 0; i < renderSystem.game.viewports.length; i++) {
            if (renderSystem.game.viewports[i].active) {
                renderSystem.activeViewPort = renderSystem.game.viewports[i];
                break;
            }
        }
    };

    RenderSystem.prototype.getRenderableEntities = function () {
        var renderSystem = this;
        var rootEntity = renderSystem.game.world.rootEntity;

        var renderableEntities = function (entity) {
            return entity.hasComponents(["position", "size", "sprite"]);
        };

        this.renderableEntities = rootEntity.filter(renderableEntities);
    };

    RenderSystem.prototype.clearViewPort = function () {
        this.activeViewPort.ctx.clearRect(0, 0, this.activeViewPort.canvas.width, this.activeViewPort.canvas.height);
    };

    RenderSystem.prototype.drawEntity = function (entity) {
        var sprite = entity.getComponentByType("sprite");
        var position = entity.getComponentByType("position");
        var size = entity.getComponentByType("size");

        this.activeViewPort.ctx.drawImage(sprite.img,
                    sprite.srcX, sprite.srcY,
                    sprite.srcW, sprite.srcH,
                    position.x - this.activeViewPort.offset.x, position.y - this.activeViewPort.offset.y,
                    size.w, size.h);
    };

    RenderSystem.prototype.activated = function (game) {
        this.game = game;
    };

    RenderSystem.prototype.update = function () {
        var renderSystem = this;

        this.getActiveViewPort();
        this.getRenderableEntities();
        this.clearViewPort();

        for (var i = 0; i < renderSystem.renderableEntities.length; i++) {
            renderSystem.drawEntity(renderSystem.renderableEntities[i]);
        }

    };

    return RenderSystem;
});
