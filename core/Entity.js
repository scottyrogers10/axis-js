define(function () {
    var entityId = 0;

    var Entity = function (type) {
        this.id = entityId;
        this.type = type;
        this.parent = null;
        this.children = [];

        this.components = [];

        entityId++;
    };

    Entity.prototype.addChildEntity = function (entity) {
        entity.parent = this;
        this.children.push(entity);
    };

    Entity.prototype.removeChildEntityById = function (id) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id === id) {
                this.children.splice(i, 1);
                break;
            }
        }
    };

    Entity.prototype.getChildByType = function (type) {
        return this.getChildrenByType(type)[0];
    };

    Entity.prototype.getChildrenByType = function (type) {
        var self = this;

        var childrenWithType = [];

        for (var i = 0; i < self.children.length; i++) {
            if (self.children[i].type === type) {
                childrenWithType.push(self.children[i]);
            }
        }

        return childrenWithType;
    };

    Entity.prototype.getChildrenWithActiveComponentByType = function (type) {
        return this.getChildrenWithActiveComponentsByTypes([type]);
    };

    Entity.prototype.getChildrenWithActiveComponentsByTypes = function (types) {
        var self = this;
        var childrenWithComponents = [];

        for (var i = 0; i < self.children.length; i++) {
            if (self.children[i].hasActiveComponentsByTypes(types)) {
                childrenWithComponents.push(self.children[i]);
            }
        }

        return childrenWithComponents;
    };

    Entity.prototype.loadComponent = function (component) {
        this.loadComponents([component]);
    };

    Entity.prototype.loadComponents = function (components) {
        var self = this;

        for (var i = 0; i < components.length; i++) {
            self.components.push(components[i]);
        }
    };

    Entity.prototype.activateComponent = function (component) {
        component.isActive = true;
    };

    Entity.prototype.deactivateComponent = function (component) {
        component.isActive = false;
    };

    Entity.prototype.getActiveComponentByType = function (type) {
        var self = this;

        for (var i = 0 ; i < self.components.length; i++) {
            if (type === self.components[i].type && self.components[i].isActive) {
                return self.components[i];
            }
        }
    };

    Entity.prototype.hasActiveComponentByType = function (type) {
        return this.hasActiveComponentsByTypes([type]);
    };

    Entity.prototype.hasActiveComponentsByTypes = function (types) {
        var self = this;
        var matchingTypes = [];

        for (var i = 0; i < self.components.length; i++) {
            for (var j = 0; j < types.length; j++) {
                if (self.components[i].type == types[j] && self.components[i].isActive) {
                    matchingTypes.push(self.components[i].type);
                }
            }
        }

        return matchingTypes.length == types.length ? true : false;
    };

    return Entity
});
