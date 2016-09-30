define(function (require) {
    var Entity = require("axis/core/Entity");

    var Game = function () {
        this.dt = 0;
        this.tick = 0;

        this.world = {
            rootEntity: new Entity("rootEntity"),
            width: 0,
            height: 0
        };

        this.spriteSheets = {
            imgs: [],
            srcs: []
        };

        this.cameras = [];
        this.systems = [];
    };

    Game.prototype.addCamera = function (camera) {
        this.cameras.push(camera);
    };

    Game.prototype.getCameraById = function (id) {
        var self = this;

        for (var i = 0; i < self.cameras.length; i++) {
            if (id == self.cameras[i].id) {
                return self.cameras[i];
            }
        }
    };

    Game.prototype.getActiveCamera = function () {
        var self = this;

        for (var i = 0; i < self.cameras.length; i++) {
            if (self.cameras[i].isActive) {
                return self.cameras[i];
            }
        }
    };

    Game.prototype.addSpriteSheet = function (src) {
        this.spriteSheets.srcs.push(src);
    };

    Game.prototype.addSystem = function (system) {
        this.addSystems([system]);
    };

    Game.prototype.addSystems = function (systems) {
        var self = this;

        for (var i = 0; i < systems.length; i++) {
            var system = new systems[i]();
            self.systems.push(system);

            if (typeof system.activate === "function") {
                system.activate(self);
            }
        }
    };

    Game.prototype.getSystemByType = function (type) {
        var self = this;

        for (var i = 0; i < self.systems.length; i++) {
            if (self.systems[i].type === type) {
                return self.systems[i];
            }
        }
    };

    Game.prototype.checkAllSystemsReady = function () {
        var self = this;

        return self.systems.every(function (system) {
            return system.isReady;
        });
    };

    Game.prototype.updateSystems = function () {
        var self = this;

        for (var i = 0; i < self.systems.length; i++) {
            if (typeof self.systems[i].update === "function") {
                self.systems[i].update();
            }
        }
    };

    Game.prototype.pause = function () {
        cancelAnimationFrame(this.tick);
    };

    Game.prototype.play = function () {
        var self = this;
        var lastTime = null;

        var loop = function () {
            if (self.checkAllSystemsReady()) {
                var now = new Date().getTime();
                self.dt = now - (lastTime || now);

                lastTime = now;
                self.tick = requestAnimationFrame(loop);

                self.updateSystems();
            }

        };

        loop();
    };

    return Game;
});
