define([
    "lib/axis-js/core/Game.js",
    "lib/axis-js/core/World.js",
    "lib/axis-js/core/Viewport.js",
    "lib/axis-js/core/Entity.js",
    "lib/axis-js/core/System.js",
    "lib/axis-js/core/Component.js"
], function (Game, World, Viewport, Entity, System, Component) {
    var Axis = {};
    Axis.Game = Game;
    Axis.World = World;
    Axis.Viewport = Viewport;
    Axis.Entity = Entity;
    Axis.System = System;
    Axis.Component = Component;

    return Axis;
});
