define(function() {
    var RigidCollisionSystem = function() {
        this.type = "rigidCollisionSystem";
        this.game = null;
        this.isReady = false;
        this.cellSize = 100;
    };

    RigidCollisionSystem.prototype.intersects = function(positionA, rigidBodyA, positionB, rigidBodyB) {
        positionA = {
            y: positionA.y + rigidBodyA.offsetY,
            x: positionA.x + rigidBodyA.offsetX
        };

        positionB = {
            y: positionB.y + rigidBodyB.offsetY,
            x: positionB.x + rigidBodyB.offsetX
        };

        var top = Math.max(positionA.y, positionB.y);
        var bottom = Math.min(positionA.y + rigidBodyA.height, positionB.y + rigidBodyB.height);
        var left = Math.max(positionA.x, positionB.x);
        var right = Math.min(positionA.x + rigidBodyA.width, positionB.x + rigidBodyB.width);

        return top < bottom && left < right;
    };

    RigidCollisionSystem.prototype.sweepAndPrune = function(entities) {
        var camera = this.game.getCameraById("main-camera");

        var gridWidth = Math.floor((camera.height) / this.cellSize);
        var gridHeight = Math.floor((camera.width) / this.cellSize);
        var left;
        var right;
        var top;
        var bottom;
        var i;
        var j;
        var entity;
        var cX;
        var cY;
        var gridCol;
        var gridCell;
        var size;
        var position;
        var grid;

        // construct grid
        // NOTE: this is a purposeful use of the Array() constructor
        grid = new Array(gridWidth);

        // insert all entities into grid
        for (i = 0; i < entities.length; i++) {
            entity = entities[i];
            collidable = entity.getActiveComponentByType("collidable");
            rigidBody = entity.getActiveComponentByType("rigidBody");
            position = entity.getActiveComponentByType("position");

            collidable.collidingEntities = [];

            position = {
                y: position.y + rigidBody.offsetY,
                x: position.x + rigidBody.offsetX
            };

            // if entity is outside the camera extents, then ignore it
            if (
                position.x + rigidBody.width < camera.offsetX || position.x > camera.width ||
                position.y + rigidBody.height < camera.offsetY || position.y > camera.height
            ) {
                continue;
            }

            // Find the cells that the entity overlap.
            left = Math.floor((position.x) / this.cellSize);
            right = Math.floor((position.x + rigidBody.width) / this.cellSize);
            top = Math.floor((position.y) / this.cellSize);
            bottom = Math.floor((position.y + rigidBody.height) / this.cellSize);

            // Insert entity into each cell it overlaps
            for (cX = left; cX <= right; cX++) {

                // Make sure a column exists, initialize if not to grid height length
                // NOTE: again, a purposeful use of the Array constructor
                if (!grid[cX]) {
                    grid[cX] = Array(gridHeight);
                }

                gridCol = grid[cX];

                // Loop through each cell in this column
                for (cY = top; cY <= bottom; cY++) {

                    // Ensure we have a bucket to put entities into for this cell
                    if (!gridCol[cY]) {
                        gridCol[cY] = [];
                    }

                    gridCell = gridCol[cY];

                    // Add entity to cell
                    gridCell.push(entity);
                }
            }
        }

        return grid;
    };

    RigidCollisionSystem.prototype.detectEntityCollisions = function(grid) {
        var entityA;
        var entityB;
        var hash;
        var i;
        var j;
        var k;
        var l;
        var gridCol;
        var gridCell;
        var collisionA;
        var collisionB;
        var rigidBodyA;
        var positionA;
        var rigidBodyB;
        var positionB;
        var top;
        var bottom;
        var left;
        var right;
        var collisionIndex;
        var entityIndex;

        // for every column in the grid...
        for (i = 0; i < grid.length; i++) {

            gridCol = grid[i];

            // ignore columns that have no cells
            if (!gridCol) {
                continue;
            }

            // for every cell within a column of the grid...
            for (j = 0; j < gridCol.length; j++) {

                gridCell = gridCol[j];

                // ignore cells that have no objects
                if (!gridCell) {
                    continue;
                }

                // for every object in a cell...
                for (k = 0; k < gridCell.length; k++) {

                    entityA = gridCell[k];

                    // for every other object in a cell...
                    for (l = k + 1; l < gridCell.length; l++) {
                        entityB = gridCell[l];

                        collidableA = entityA.getActiveComponentByType("collidable");
                        collidableB = entityB.getActiveComponentByType("collidable");

                        // We don't need to check static to other static objects.
                        if ((collidableA.isStatic && collidableB.isStatic)) {
                            continue;
                        }

                        positionA = entityA.getActiveComponentByType("position");
                        rigidBodyA = entityA.getActiveComponentByType("rigidBody");

                        positionB = entityB.getActiveComponentByType("position");
                        rigidBodyB = entityB.getActiveComponentByType("rigidBody");

                        if (this.intersects(positionA, rigidBodyA, positionB, rigidBodyB)) {
                            entityIndex = collidableA.collidingEntities.indexOf(entityB);

                            if (entityIndex === -1) {
                                collidableA.collidingEntities.push(entityB);
                            }

                            entityIndex = collidableB.collidingEntities.indexOf(entityA);

                            if (entityIndex === -1) {
                                collidableB.collidingEntities.push(entityA);
                            }
                        }
                    }
                }
            }
        }

    };

    RigidCollisionSystem.prototype.detectRestraintCollisions = function(entities) {
        for (var i = 0; i < entities.length; i++) {
            var rigidBodyComponent = entities[i].getActiveComponentByType("rigidBody");
            var positionComponent = entities[i].getActiveComponentByType("position");
            var restraintComponent = entities[i].getActiveComponentByType("restraint");

            restraintComponent.restrainingSides = [];

            if (positionComponent.x < restraintComponent.left) {
                restraintComponent.restrainingSides.push("left");
            }

            if (positionComponent.x + rigidBodyComponent.width > restraintComponent.right) {
                restraintComponent.restrainingSides.push("right");
            }

            if (positionComponent.y < restraintComponent.top) {
                restraintComponent.restrainingSides.push("top");
            }

            if (positionComponent.y + rigidBodyComponent.height > restraintComponent.bottom) {
                restraintComponent.restrainingSides.push("bottom");
            }
        }
    };

    RigidCollisionSystem.prototype.activate = function(game) {
        this.game = game;
        this.isReady = true;
    };

    RigidCollisionSystem.prototype.update = function() {
        var rootEntity = this.game.world.rootEntity;
        var collidableEntities = rootEntity.getChildrenWithActiveComponentsByTypes(["collidable", "position", "rigidBody"]);
        var restraintEntities = rootEntity.getChildrenWithActiveComponentsByTypes(["restraint", "position", "rigidBody"]);
        var grid = this.sweepAndPrune(collidableEntities);

        this.detectEntityCollisions(grid);
        this.detectRestraintCollisions(restraintEntities);
    };

    return RigidCollisionSystem;

});
