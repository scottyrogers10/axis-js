define(function () {
    var Game = function (world) {
        // this.timer = timer;
        this.world = world;
        // this.gameState = null;
        // this.tick = null;

        this.viewports = [];
        this.systems = [];
    };

    Game.prototype.addViewport = function (viewport) {
        this.viewports.push(viewport);
    };

    Game.prototype.addSystem = function (system) {
        var game = this;
        this.systems.push(system);

        if (typeof system.activated === "function") {
            system.activated(game);
        }

    };

    Game.prototype.runGameLoop = function () {
        var game = this;

        var loop = function () {
            for (var i = 0; i < game.systems.length; i++) {
                game.systems[i].update(self);
            }

            window.requestAnimationFrame(loop);
        };

        loop();
    };

    return Game;
});
