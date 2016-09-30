define(function() {
    var RigidCollisionSystem = function() {
        this.type = "rigidCollisionSystem";
        this.game = null;
        this.isReady = false;
        this.cellSize = 100;
    };

    RigidCollisionSystem.prototype.intersects = function(positionA, rigidBodyA, positionB, rigidBodyB) {
        positionA = {
            x: positionA.x + rigidBodyA.offsetX,
            y: positionA.y + rigidBodyA.offsetY
        };

        positionB = {
            x: positionB.x + rigidBodyB.offsetX,
            y: positionB.y + rigidBodyB.offsetY
        };

        var top = Math.max(positionA.y, positionB.y);
        var bottom = Math.min(positionA.y + rigidBodyA.height, positionB.y + rigidBodyB.height);
        var left = Math.max(positionA.x, positionB.x);
        var right = Math.min(positionA.x + rigidBodyA.width, positionB.x + rigidBodyB.width);

        return top < bottom && left < right;
    };

    RigidCollisionSystem.prototype.sweepAndPrune = function(entities) {
        var camera = this.game.getActiveCamera();
        var gridWidth = Math.floor((camera.height) / this.cellSize);
        var gridHeight = Math.floor((camera.width) / this.cellSize);

        // NOTE: This is a purposeful use of the Array() constructor.
        var grid = new Array(gridWidth);

        // NOTE: Insert all entities into grid.
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var collidableComponent = entity.getActiveComponentByType("collidable");
            var rigidBodyComponent = entity.getActiveComponentByType("rigidBody");
            var positionComponent = entity.getActiveComponentByType("position");

            collidableComponent.collidingEntities = [];

            positionComponent = {
                x: positionComponent.x + rigidBodyComponent.offsetX,
                y: positionComponent.y + rigidBodyComponent.offsetY
            };

            // NOTE: If entity is outside the camera, then ignore it.
            if (
                positionComponent.x + rigidBodyComponent.width < camera.offsetX || positionComponent.x > camera.width ||
                positionComponent.y + rigidBodyComponent.height < camera.offsetY || positionComponent.y > camera.height
            ) {
                continue;
            }

            // NOTE: Find the cells that the entity overlap.
            var left = Math.floor((positionComponent.x) / this.cellSize);
            var right = Math.floor((positionComponent.x + rigidBodyComponent.width) / this.cellSize);
            var top = Math.floor((positionComponent.y) / this.cellSize);
            var bottom = Math.floor((positionComponent.y + rigidBodyComponent.height) / this.cellSize);

            // NOTE: Insert entity into each cell it overlaps.
            for (var cX = left; cX <= right; cX++) {
                // NOTE: Make sure a column exists, initialize if not to grid height length.
                // NOTE: This is a purposeful use of the Array() constructor.
                if (!grid[cX]) {
                    grid[cX] = Array(gridHeight);
                }

                var gridCol = grid[cX];

                // NOTE: Loop through each cell in this column.
                for (var cY = top; cY <= bottom; cY++) {
                    // NOTE: Ensure we have a bucket to put entities into for this cell.
                    if (!gridCol[cY]) {
                        gridCol[cY] = [];
                    }

                    var gridCell = gridCol[cY];
                    gridCell.push(entity);
                }
            }
        }

        return grid;
    };

    RigidCollisionSystem.prototype.detectEntityCollisions = function(grid) {
        // NOTE: For every column in the grid...
        for (var i = 0; i < grid.length; i++) {
            var gridCol = grid[i];

            // NOTE: Ignore columns that have no cells.
            if (!gridCol) {
                continue;
            }

            // NOTE: For every cell within a column of the grid...
            for (var j = 0; j < gridCol.length; j++) {
                var gridCell = gridCol[j];

                // NOTE: Ignore cells that have no objects.
                if (!gridCell) {
                    continue;
                }

                // NOTE: For every object in a cell...
                for (var k = 0; k < gridCell.length; k++) {
                    var entityA = gridCell[k];

                    // NOTE: For every other object in a cell...
                    for (var l = k + 1; l < gridCell.length; l++) {
                        var entityB = gridCell[l];
                        var entityACollidableComponent = entityA.getActiveComponentByType("collidable");
                        var entityBCollidableComponent = entityB.getActiveComponentByType("collidable");

                        // NOTE: We don't need to check static objects to other static objects.
                        if ((entityACollidableComponent.isStatic && entityBCollidableComponent.isStatic)) {
                            continue;
                        }

                        var entityAPositionComponent = entityA.getActiveComponentByType("position");
                        var entityARigidBodyComponent = entityA.getActiveComponentByType("rigidBody");

                        var entityBPositionComponent = entityB.getActiveComponentByType("position");
                        var entityBRigidBodyComponent = entityB.getActiveComponentByType("rigidBody");

                        if (this.intersects(entityAPositionComponent, entityARigidBodyComponent, entityBPositionComponent, entityBRigidBodyComponent)) {
                            var entityIndex = entityACollidableComponent.collidingEntities.indexOf(entityB);

                            if (entityIndex === -1) {
                                entityACollidableComponent.collidingEntities.push(entityB);
                            }

                            entityIndex = entityBCollidableComponent.collidingEntities.indexOf(entityA);

                            if (entityIndex === -1) {
                                entityBCollidableComponent.collidingEntities.push(entityA);
                            }
                        }
                    }
                }
            }
        }
    };

    RigidCollisionSystem.prototype.detectRestraintCollisions = function(entities) {
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var rigidBodyComponent = entity.getActiveComponentByType("rigidBody");
            var positionComponent = entity.getActiveComponentByType("position");
            var restraintComponent = entity.getActiveComponentByType("restraint");

            positionComponent = {
                x: positionComponent.x + rigidBodyComponent.offsetX,
                y: positionComponent.y + rigidBodyComponent.offsetY
            };

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
