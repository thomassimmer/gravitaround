defineSuite([
        'DataSources/CorridorGeometryUpdater',
        'Core/Cartesian3',
        'Core/CornerType',
        'Core/JulianDate',
        'Core/TimeInterval',
        'Core/TimeIntervalCollection',
        'DataSources/ConstantProperty',
        'DataSources/CorridorGraphics',
        'DataSources/Entity',
        'DataSources/PropertyArray',
        'DataSources/SampledPositionProperty',
        'DataSources/SampledProperty',
        'DataSources/TimeIntervalCollectionProperty',
        'Scene/PrimitiveCollection',
        'Specs/createDynamicGeometryUpdaterSpecs',
        'Specs/createDynamicProperty',
        'Specs/createGeometryUpdaterSpecs',
        'Specs/createGeometryUpdaterGroundGeometrySpecs',
        'Specs/createScene'
    ], function(
        CorridorGeometryUpdater,
        Cartesian3,
        CornerType,
        JulianDate,
        TimeInterval,
        TimeIntervalCollection,
        ConstantProperty,
        CorridorGraphics,
        Entity,
        PropertyArray,
        SampledPositionProperty,
        SampledProperty,
        TimeIntervalCollectionProperty,
        PrimitiveCollection,
        createDynamicGeometryUpdaterSpecs,
        createDynamicProperty,
        createGeometryUpdaterSpecs,
        createGeometryUpdaterGroundGeometrySpecs,
        createScene) {
    'use strict';

    var scene;
    var time;

    beforeAll(function() {
        scene = createScene();
        time = JulianDate.now();
    });

    afterAll(function() {
        scene.destroyForSpecs();
    });

    function createBasicCorridor() {
        var corridor = new CorridorGraphics();
        corridor.positions = new ConstantProperty(Cartesian3.fromRadiansArray([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]));
        corridor.width = new ConstantProperty(1);
        corridor.height = new ConstantProperty(0);
        var entity = new Entity();
        entity.corridor = corridor;
        return entity;
    }

    function createDynamicCorridor() {
        var entity = createBasicCorridor();
        entity.corridor.positions = createDynamicProperty(Cartesian3.fromRadiansArray([0, 0, 1, 0, 1, 1, 0, 1]));
        return entity;
    }

    function createBasicCorridorWithoutHeight() {
        var corridor = new CorridorGraphics();
        corridor.positions = new ConstantProperty(Cartesian3.fromRadiansArray([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]));
        corridor.width = new ConstantProperty(1);
        var entity = new Entity();
        entity.corridor = corridor;
        return entity;
    }

    function createDynamicCorridorWithoutHeight() {
        var entity = createBasicCorridorWithoutHeight();
        entity.corridor.positions = createDynamicProperty(Cartesian3.fromRadiansArray([0, 0, 1, 0, 1, 1, 0, 1]));
        return entity;
    }

    it('A time-varying positions causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        var point1 = new SampledPositionProperty();
        point1.addSample(time, new Cartesian3());
        var point2 = new SampledPositionProperty();
        point2.addSample(time, new Cartesian3());
        var point3 = new SampledPositionProperty();
        point3.addSample(time, new Cartesian3());

        entity.corridor.positions = new PropertyArray();
        entity.corridor.positions.setValue([point1, point2, point3]);
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('A time-varying height causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        entity.corridor.height = new SampledProperty(Number);
        entity.corridor.height.addSample(time, 1);
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('A time-varying extrudedHeight causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        entity.corridor.extrudedHeight = new SampledProperty(Number);
        entity.corridor.extrudedHeight.addSample(time, 1);
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('A time-varying granularity causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        entity.corridor.granularity = new SampledProperty(Number);
        entity.corridor.granularity.addSample(time, 1);
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('A time-varying width causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        entity.corridor.width = new SampledProperty(Number);
        entity.corridor.width.addSample(time, 1);
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('A time-varying cornerType causes geometry to be dynamic', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        entity.corridor.cornerType = new TimeIntervalCollectionProperty();
        entity.corridor.cornerType.intervals.addInterval(new TimeInterval({
            start : JulianDate.now(),
            stop : JulianDate.now(),
            data : CornerType.ROUNDED
        }));
        updater._onEntityPropertyChanged(entity, 'corridor');

        expect(updater.isDynamic).toBe(true);
    });

    it('Creates geometry with expected properties', function() {
        var options = {
            height : 431,
            extrudedHeight : 123,
            granularity : 0.97,
            width : 12,
            cornerType : CornerType.MITERED
        };
        var entity = createBasicCorridor();

        var corridor = entity.corridor;
        corridor.outline = true;
        corridor.cornerType = new ConstantProperty(options.cornerType);
        corridor.width = new ConstantProperty(options.width);
        corridor.height = new ConstantProperty(options.height);
        corridor.extrudedHeight = new ConstantProperty(options.extrudedHeight);
        corridor.granularity = new ConstantProperty(options.granularity);

        var updater = new CorridorGeometryUpdater(entity, scene);

        var instance;
        var geometry;
        instance = updater.createFillGeometryInstance(time);
        geometry = instance.geometry;
        expect(geometry._width).toEqual(options.width);
        expect(geometry._height).toEqual(options.height);
        expect(geometry._granularity).toEqual(options.granularity);
        expect(geometry._extrudedHeight).toEqual(options.extrudedHeight);
        expect(geometry._cornerType).toEqual(options.cornerType);

        instance = updater.createOutlineGeometryInstance(time);
        geometry = instance.geometry;
        expect(geometry._width).toEqual(options.width);
        expect(geometry._height).toEqual(options.height);
        expect(geometry._granularity).toEqual(options.granularity);
        expect(geometry._extrudedHeight).toEqual(options.extrudedHeight);
        expect(geometry._cornerType).toEqual(options.cornerType);
    });

    it('dynamic updater sets properties', function() {
        var corridor = new CorridorGraphics();
        corridor.positions = createDynamicProperty(Cartesian3.fromRadiansArray([
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ]));
        corridor.show = createDynamicProperty(true);
        corridor.height = createDynamicProperty(3);
        corridor.extrudedHeight = createDynamicProperty(2);
        corridor.outline = createDynamicProperty(true);
        corridor.fill = createDynamicProperty(true);
        corridor.width = createDynamicProperty(6);
        corridor.granularity = createDynamicProperty(2);
        corridor.cornerType = createDynamicProperty(CornerType.MITERED);

        var entity = new Entity();
        entity.corridor = corridor;

        var updater = new CorridorGeometryUpdater(entity, scene);
        var dynamicUpdater = updater.createDynamicUpdater(new PrimitiveCollection(), new PrimitiveCollection());
        dynamicUpdater.update(time);

        var options = dynamicUpdater._options;
        expect(options.positions).toEqual(corridor.positions.getValue());
        expect(options.height).toEqual(corridor.height.getValue());
        expect(options.extrudedHeight).toEqual(corridor.extrudedHeight.getValue());
        expect(options.width).toEqual(corridor.width.getValue());
        expect(options.granularity).toEqual(corridor.granularity.getValue());
        expect(options.cornerType).toEqual(corridor.cornerType.getValue());
    });

    it('geometryChanged event is raised when expected', function() {
        var entity = createBasicCorridor();
        var updater = new CorridorGeometryUpdater(entity, scene);
        var listener = jasmine.createSpy('listener');
        updater.geometryChanged.addEventListener(listener);

        entity.corridor.positions = new ConstantProperty([]);
        updater._onEntityPropertyChanged(entity, 'corridor');
        expect(listener.calls.count()).toEqual(1);

        entity.corridor.height = new ConstantProperty(82);
        updater._onEntityPropertyChanged(entity, 'corridor');
        expect(listener.calls.count()).toEqual(2);

        entity.availability = new TimeIntervalCollection();
        updater._onEntityPropertyChanged(entity, 'availability');
        expect(listener.calls.count()).toEqual(3);

        entity.corridor.positions = undefined;
        updater._onEntityPropertyChanged(entity, 'corridor');
        expect(listener.calls.count()).toEqual(4);

        //Since there's no valid geometry, changing another property should not raise the event.
        entity.corridor.height = undefined;
        updater._onEntityPropertyChanged(entity, 'corridor');

        //Modifying an unrelated property should not have any effect.
        entity.viewFrom = new ConstantProperty(Cartesian3.UNIT_X);
        updater._onEntityPropertyChanged(entity, 'viewFrom');
        expect(listener.calls.count()).toEqual(4);
    });

    function getScene() {
        return scene;
    }

    createGeometryUpdaterSpecs(CorridorGeometryUpdater, 'corridor', createBasicCorridor, getScene);

    createDynamicGeometryUpdaterSpecs(CorridorGeometryUpdater, 'corridor', createDynamicCorridor, getScene);

    createGeometryUpdaterGroundGeometrySpecs(CorridorGeometryUpdater, 'corridor', createBasicCorridorWithoutHeight, createDynamicCorridorWithoutHeight, getScene);
}, 'WebGL');
