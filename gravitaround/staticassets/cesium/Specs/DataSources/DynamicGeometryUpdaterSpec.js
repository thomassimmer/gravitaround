defineSuite([
    'DataSources/DynamicGeometryUpdater',
    'DataSources/Entity',
    'DataSources/GeometryUpdater',
    'Scene/PrimitiveCollection',
    'Specs/createScene'
], function(
    DynamicGeometryUpdater,
    Entity,
    GeometryUpdater,
    PrimitiveCollection,
    createScene) {
    'use strict';

    var scene;

    beforeAll(function() {
        scene = createScene();
    });

    afterAll(function() {
        scene.destroyForSpecs();
    });

    it('Constructor throws with no updater', function() {
        expect(function() {
            return new DynamicGeometryUpdater(undefined, new PrimitiveCollection(), new PrimitiveCollection());
        }).toThrowDeveloperError();
    });

    it('Constructor throws with no primitives', function() {
        var updater = new GeometryUpdater({
            entity : new Entity(),
            scene : scene,
            geometryOptions : {},
            geometryPropertyName : 'box',
            observedPropertyNames  : ['availability', 'box']
        });
        expect(function() {
            return new DynamicGeometryUpdater(updater, undefined, new PrimitiveCollection());
        }).toThrowDeveloperError();
    });

    it('Constructor throws with no groundPrimitives', function() {
        var updater = new GeometryUpdater({
            entity : new Entity(),
            scene : scene,
            geometryOptions : {},
            geometryPropertyName : 'box',
            observedPropertyNames  : ['availability', 'box']
        });
        expect(function() {
            return new DynamicGeometryUpdater(updater, undefined, new PrimitiveCollection());
        }).toThrowDeveloperError();
    });

    it('update throws with no time', function() {
        var updater = new GeometryUpdater({
            entity : new Entity(),
            scene : scene,
            geometryOptions : {},
            geometryPropertyName : 'box',
            observedPropertyNames  : ['availability', 'box']
        });
        var dynamicUpdater = new DynamicGeometryUpdater(updater, new PrimitiveCollection(), new PrimitiveCollection());
        expect(function() {
            return dynamicUpdater.update();
        }).toThrowDeveloperError();
    });
});
