define(function () {
    var entityId = 0;

    var Entity = function (type) {
        this.type = type;
        this.id = entityId;
        this.parent = null;
        this.children = [];
        this.components = [];

        entityId++;
    };

    Entity.prototype.addChildEntity = function (entity) {
        entity.parent = this;
        this.children.push(entity);
    };

    Entity.prototype.addComponent = function (component) {
        this.components.push(component);
    };

    Entity.prototype.hasComponents = function (types) {
        var entity = this;
        var matchingTypes = [];

        for (var i = 0; i < entity.components.length; i++) {
            for (var j = 0; j < types.length; j++) {
                if (entity.components[i].type === types[j]) {
                    matchingTypes.push(entity.components[i].type);
                }
            }
        }

        //TODO: Need to handle this better instead of just checking if both arrays are same length. Entity could accidently have 2 of the same components.
        return matchingTypes.length == types.length ? true : false;
    };

    Entity.prototype.getComponentByType = function (Type) {
        return this.getComponentsByType(Type)[0] || null;
    };

    Entity.prototype.getComponentsByType = function (Type) {
        var matches = [];
        var component = null;

        for (var i = 0 ; i < this.components.length; i++) {
            component = this.components[i];
            if (component.type === Type) {
                matches.push(component);
            }
        }

        return matches;
    };

    Entity.prototype.filter = function (filter) {
        if (typeof filter !== "function") {
            filter = function () { return true; };
        }

        var results = [];
        var child = null;

        if (filter(this)) {
            results.push(this);
        }

        for (var i = 0 ; i < this.children.length; i++) {
            child = this.children[i];
            results = results.concat(child.filter(filter));
        }

        return results;
    };

    return Entity
});
