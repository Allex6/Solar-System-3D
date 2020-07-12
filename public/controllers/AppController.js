const EventEmitter = require('events');
const BABYLON_GUI = require('babylonjs-gui');

class AppController {

	constructor(){

		this.canvas = document.getElementById("renderCanvas");
		let options = {
			stencil: true,
			doNotHandleContextLost: false,
			useGeometryIdsMap: true,
			useMaterialMeshMap: true,
			useClonedMeshMap: true
		};
		let antialising = true;
		this.engine = new BABYLON.Engine(this.canvas, antialising, options, true);

		this.cameraInitialSpeed = 1.5;

		this.eventsController = new EventEmitter();

		this.planets = {};
		this.planetsGUIs = [];

		this.timesPresented = 0;
		this.actualStatus = 'loading-scene';

		// The following values have been modified for better viewing, since in the real universe, it would be very difficult to maintain fidelity
		// real values are being divided by 15 thousand

		this.SunSize = 92.84; //20.0
		this.MercurySize = 0.3259; //0.4
		this.VenusSize = 0.8069; //1.0
		this.EarthSize = 0.8494; //1.1
		this.MoonSize = 0.2316; //0.2
		this.MarsSize = 0.4519; //0.7
		this.JupiterSize = 9.321; //4.5
		this.SaturnSize = 7.764; //4.1
		this.UranusSize = 3.3816; //2.5
		this.NeptuneSize = 3.2829; //2.1

		// real values are being divided by 1 million and 500 thousand

		this.MercuryDistance = 38.66 + this.SunSize; //20;
		this.VenusDistance = 72 + this.SunSize; //35;
		this.EarthDistance = 100 + this.SunSize; //60;
		this.MarsDistance = 153.3 + this.SunSize;//85;
		this.JupiterDistance = 518.66 + this.SunSize; //140;
		this.SaturnDistance = 952.9 + this.SunSize; //260;
		this.UranusDistance = 1913.9 + this.SunSize; //380;
		this.NeptuneDistance = 3002.8 + this.SunSize; //620;

		this.MercuryVelocity = 47.362;
		this.VenusVelocity = 35.02;
		this.EarthVelocity = 29.78;
		this.MarsVelocity = 24.07;
		this.JupiterVelocity = 13.07;
		this.SaturnVelocity = 9.68;
		this.UranusVelocity = 6.80;
		this.NeptuneVelocity = 5.43;

		this.initializeScene();

		this.controlLoadingItems();
		this.initializeStars();
		this.initGUI();

		this.engine.runRenderLoop(()=>{
			this.scene.render();
		});

		window.addEventListener("resize", ()=>{
			this.engine.resize();
		});

	}

	initializeScene(){

		this.scene = new BABYLON.Scene(this.engine);
		this.scene.debugLayer.show({
			embedMode: true
		});

		this.scene.ambientColor = new BABYLON.Color3(1,1,1);

		this.devCamera = new BABYLON.FlyCamera("DevCamera", new BABYLON.Vector3(0, 0, -40), this.scene);
		this.devCamera.attachControl(this.canvas, true);

		this.devCamera.position = new BABYLON.Vector3(0, 220, 0);
		this.devCamera.speed = this.cameraInitialSpeed;
		this.devCamera.rotation.x = Math.PI / 2;
		this.devCamera.ellipsoid = new BABYLON.Vector3(0,0,0);
		this.devCamera.fov = 0.9;

		this.scene.clearColor = new BABYLON.Color3(0,0,0).toLinearSpace();

		this.scene.autoClearDepthAndStencil = false;

		this.createUniverseBox();

		this.ambientSound = new BABYLON.Sound('ambientSound', __dirname + './../sound-effects/space-ambient.mp3', this.scene, null, {
			autoplay: true,
			loop: true,
			volume: 0.5
		});

	}

	controlLoadingItems(){

		this.scene.whenReadyAsync().then(()=>{
			console.log("aqui");

			alert("Todos os objetos foram carregados");
		});

		let check = ()=>{

			console.log(this.scene.getWaitingItemsCount());

			if (this.scene.getWaitingItemsCount() == 0) {
				this.scene.unregisterBeforeRender(check);
			}

		};

		this.scene.registerBeforeRender(check);

	}

	initializeStars(){

		this.controlAtmospheres();

		this.initSun();
		this.initMercury();
		this.initVenus();
		this.initEarth();
		this.initMars();
		this.initJupiter();
		this.initSaturn();
		this.initUranus();
		this.initNeptune();

		this.createOrbits();

	}

	initSun(){

		let sunMaterial = new BABYLON.StandardMaterial('sunMaterial', this.scene);
		sunMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Sun/surface.jpg', this.scene);

		sunMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.3, 0);
		sunMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
		sunMaterial.linkEmissiveWithDiffuse = true;

		this.sun = new BABYLON.MeshBuilder.CreateSphere('sun', {diameter: this.SunSize}, this.scene);

		let glowEffect = new BABYLON.GlowLayer("glow", this.scene, {mainTextureFixedSize: 128, blurKernelSize: 64, mainTextureSamples: 4});

		glowEffect.intensity = 8.0;
		glowEffect.addIncludedOnlyMesh(this.sun);

		this.sun.material = sunMaterial;

		this.sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0,0,0), this.scene);
		this.sunLight.intensity = 0.4;

		//let vls = new BABYLON.VolumetricLightScatteringPostProcess('vls', { postProcessRatio: 1.0, passRatio: 1.0 }, this.devCamera, this.sun, 50, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.engine, false, this.scene);
		//vls.useDiffuseColor = true;

	}

	initEarth(){

		let texturePath = (__dirname + './../textures/Earth/surface.jpg');
		let normalPath = (__dirname + './../textures/Earth/normal.png');
		let cloudsTexture = (__dirname + './../textures/Earth/clouds.jpg');

		this.createPlanet(
			'earth', 
			this.EarthSize, 
			texturePath,
			new BABYLON.Vector3(this.EarthDistance, 0, 0),
			normalPath,
			cloudsTexture,
			1,
			new BABYLON.Color3(0, 0.5, 0.6)
		).then(()=>{

			this.createMoon('moon', this.MoonSize, (__dirname + './../textures/Moon/surface.jpg'), this.planets['earth'], 0.002316333);

			this.planets['earth'].material.lightmapTexture.uAng = Math.PI;
			this.planets['earth'].material.lightmapTexture.invertZ = true;

		});

	}

	initMars(){

		let texturePath = (__dirname + './../textures/Mars/surface.jpg');
		let normalPath = (__dirname + './../textures/Mars/normal.png');
		let cloudsTexture = (__dirname + './../textures/Earth/clouds.jpg');

		this.createPlanet('mars', 
			this.MarsSize, 
			texturePath,
			new BABYLON.Vector3(this.MarsDistance, 0, 0), 
			normalPath,
			cloudsTexture,
			0.3,
			new BABYLON.Color3(0.7, 0.5, 0)
		).then(()=>{

			// The following values have been modified for better viewing, since in the real universe, it would be very difficult to maintain fidelity. 

			let marsMoons = [

				{
					name: 'Phobos',
					size: 0.015,
					texture: (__dirname + './../textures/Mars/moons/Phobos/surface.jpg'),
					normal: (__dirname + './../textures/Mars/moons/Phobos/normal.png'),
					velocity: (7696.7 / 10000),
					distance:  1 
				},
				{
					name: 'Deimos',
					size: 0.008, 
					texture: (__dirname + './../textures/Mars/moons/Deimos/surface.jpg'),
					normal: (__dirname + './../textures/Mars/moons/Deimos/normal.png'),
					velocity: (4864.8 / 10000),
					distance:  5 
				}


			];

			marsMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, this.planets['mars'], moon.velocity/10000, moon.distance);

			});

		});

	}

	initVenus(){

		let texturePath = (__dirname + './../textures/Venus/surface.jpg');
		let normalPath = (__dirname + './../textures/Venus/normal.png');
		let atmosphere = (__dirname + './../textures/Venus/atmosphere.jpg');

		this.createPlanet('venus', 
			this.VenusSize, 
			texturePath,
			new BABYLON.Vector3(this.VenusDistance, 0, 0),
			normalPath,
			atmosphere,
			0.6,
			new BABYLON.Color3(0.8, 0.6, 0)
		).then(()=>{
			this.planets['venus'].material.lightmapTexture.uAng = Math.PI;
			this.planets['venus'].material.lightmapTexture.invertZ = true;
		});

	}

	initJupiter(){
		
		let texturePath = (__dirname + './../textures/Jupiter/surface.jpg');
		this.createPlanet('jupiter',
			this.JupiterSize,
			texturePath,
			new BABYLON.Vector3(this.JupiterDistance, 0, 0)
		).then(()=>{
			
			// The following values have been modified for better viewing, since in the real universe, it would be very difficult to maintain fidelity. 

			let jupiterMoons = [

				{
					name: 'Io',
					size: 0.21,
					texture: (__dirname + './../textures/Jupiter/moons/Io/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Io/normal.png'),
					velocity: (62424 / 10000),
					distance:  5
				},
				{
					name: 'Europa',
					size: 0.18, //3.121,6 km
					texture: (__dirname + './../textures/Jupiter/moons/Europa/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Europa/normal.png'),
					velocity: (49464 / 10000),
					distance:  7
				},
				{
					name: 'Ganimedes',
					size: 0.31, //5262 km
					texture: (__dirname + './../textures/Jupiter/moons/Ganimedes/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Ganimedes/normal.png'),
					velocity: (39165.6 / 10000),
					distance:  10
				},
				{
					name: 'Callisto',
					size: 0.28, //4821 km
					texture: (__dirname + './../textures/Jupiter/moons/Callisto/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Callisto/normal.png'),
					velocity: (29534.4 / 10000),
					distance:  12
				},
				{
					name: 'Amalthea',
					size: 0.001, //167 km
					texture: (__dirname + './../textures/Jupiter/moons/Amalthea/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Amalthea/normal.png'),
					velocity: (95652 / 10000),
					distance:  14
				},
				{
					name: 'Himalia',
					size: 0.0011, //170 km
					texture: (__dirname + './../textures/Jupiter/moons/Himalia/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Himalia/normal.png'),
					velocity: (11895.90 / 10000),
					distance:  16
				},
				{
					name: 'Elara',
					size: 0.00056, //86 km
					texture: (__dirname + './../textures/Jupiter/moons/Elara/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Elara/normal.png'),
					velocity: (11697.5 / 10000),
					distance:  18
				},
				{
					name: 'Pasiphae',
					size: 0.00052, //86 km
					texture: (__dirname + './../textures/Jupiter/moons/Pasiphae/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Pasiphae/normal.png'),
					velocity: (7957.40 / 10000),
					distance:  21
				},
				{
					name: 'Lysithea',
					size: 0.00021, //36 km
					texture: (__dirname + './../textures/Jupiter/moons/Lysithea/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Lysithea/normal.png'),
					velocity: (11844 / 10000),
					distance:  26
				},
				{
					name: 'Carme',
					size: 0.00030, //46 km
					texture: (__dirname + './../textures/Jupiter/moons/Carme/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Carme/normal.png'),
					velocity: (8110.8 / 10000),
					distance:  28
				},
				{
					name: 'Ananke',
					size: 0.00019, //28 km
					texture: (__dirname + './../textures/Jupiter/moons/Ananke/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Ananke/normal.png'),
					velocity: (8712.00 / 10000),
					distance:  30
				},
				{
					name: 'Leda',
					size: 0.00015, //16 km
					texture: (__dirname + './../textures/Jupiter/moons/Leda/surface.png'),
					normal: (__dirname + './../textures/Jupiter/moons/Leda/normal.png'),
					velocity: (43.2 / 10000),
					distance:  33
				},
				{
					name: 'Thebe',
					size: 0.00060, //96.8 km
					texture: (__dirname + './../textures/Jupiter/moons/Thebe/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Thebe/normal.png'),
					velocity: (86112 / 10000),
					distance:  35
				},
				{
					name: 'Adrastea',
					size: 0.000152, //16.4 km
					texture: (__dirname + './../textures/Jupiter/moons/Adrastea/surface.png'),
					normal: (__dirname + './../textures/Jupiter/moons/Adrastea/normal.png'),
					velocity: (112960.8 / 10000),
					distance:  37
				}


			];

			jupiterMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, this.planets['jupiter'], moon.velocity/10000, moon.distance);

			});

		});

	}

	initMercury(){

		let texturePath = (__dirname + './../textures/Mercury/surface3.jpg');
		let normalPath = (__dirname + './../textures/Mercury/normal.jpg');
		this.createPlanet('mercury', 
			this.MercurySize, 
			texturePath,
			new BABYLON.Vector3(this.MercuryDistance, 0, 0), 
			normalPath
		);

	}

	initSaturn(){

		let texturePath = (__dirname + './../textures/Saturn/surface.jpg');
		let normalPath = (__dirname + './../textures/Saturn/normal.jpg');
		this.createPlanet('saturn',
			this.SaturnSize,
			texturePath,
			new BABYLON.Vector3(this.SaturnDistance, 0, 0)
		).then(()=>{
			
			let saturnRing = new BABYLON.MeshBuilder.CreateTorus("saturnRing", {thickness: 0.9, tessellation: 96, diameter: 12}, this.scene);
	    	saturnRing.scaling = new BABYLON.Vector3(1, 0.1, 1);

	    	let ringMaterial = new BABYLON.StandardMaterial('saturnRingMat', this.scene);
	    	ringMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Saturn/ring1.png', this.scene);
	    	ringMaterial.emissiveColor = new BABYLON.Color3(1,1,1);

	    	saturnRing.material = ringMaterial;
	    	saturnRing.position = this.planets['saturn'].position;

	    	this.scene.registerBeforeRender(()=>{

				saturnRing.rotation.y += 0.1;

			});

			// The following values have been modified for better viewing, since in the real universe, it would be very difficult to maintain fidelity. 

			let saturnMoons = [

				{
					name: 'Mimas',
					size: 0.025, //396.4 km
					texture: (__dirname + './../textures/Saturn/moons/Mimas/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Mimas/normal.png'),
					velocity: (51552 / 10000),
					distance:  5 //1221 km
				},
				{
					name: 'Enceladus',
					size: 0.028, //396.4 km
					texture: (__dirname + './../textures/Saturn/moons/Enceladus/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Enceladus/normal.png'),
					velocity: (45487.3 / 10000),
					distance:  7 //1221 km
				},
				{
					name: 'Thetys',
					size: 0.092, //1062 km
					texture: (__dirname + './../textures/Saturn/moons/Thetys/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Thetys/normal.png'),
					velocity: (40086.3 / 10000),
					distance:  10 //1221 km
				},
				{
					name: 'Dione',
					size: 0.095, //1122,8 km
					texture: (__dirname + './../textures/Saturn/moons/Dione/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Dione/normal.png'),
					velocity: (36100.4 / 10000),
					distance:  12 //1221 km
				},
				{
					name: 'Rhea',
					size: 0.11, //1.527,6 km
					texture: (__dirname + './../textures/Saturn/moons/Rhea/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Rhea/normal.png'),
					velocity: (30541.4 / 10000),
					distance:  13 //1221 km
				},
				{
					name: 'Titan',
					size: 0.305, //5149.5 km
					texture: (__dirname + './../textures/Saturn/moons/Titan/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Titan/normal.png'),
					velocity: (20051.2 / 10000),
					distance:  17 //1221 km
				},
				{
					name: 'Iapetus',
					size: 0.105, //1.469 km
					texture: (__dirname + './../textures/Saturn/moons/Iapetus/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Iapetus/normal.png'),
					velocity: (11748.8 / 10000),
					distance:  19 //1221 km
				}


			];

			saturnMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, this.planets['saturn'], moon.velocity/10000, moon.distance);

			});

		});

	}

	initUranus(){

		let texturePath = (__dirname + './../textures/Uranus/surface.jpg');
		let normalPath = (__dirname + './../textures/Uranus/normal.jpg');
		this.createPlanet('uranus',
			this.UranusSize,
			texturePath,
			new BABYLON.Vector3(this.UranusDistance, 0, 0),
			normalPath
		).then(()=>{
			
			let uranusRing = new BABYLON.MeshBuilder.CreateTorus("uranusRing", {thickness: 0.2, tessellation: 96, diameter: 4}, this.scene);
	    	uranusRing.scaling = new BABYLON.Vector3(1, 0.1, 1);

	    	let ringMaterial = new BABYLON.StandardMaterial('uranusRingMat', this.scene);
	    	ringMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Uranus/ring.png', this.scene);
	    	ringMaterial.emissiveColor = new BABYLON.Color3(1,1,1);

	    	uranusRing.material = ringMaterial;
	    	uranusRing.position = this.planets['uranus'].position;

	    	this.scene.registerBeforeRender(()=>{

				uranusRing.rotation.y += 0.01;

			});

			let uranusMoons = [

				{
					name: 'Miranda',
					size: 0.025, //474 km
					texture: (__dirname + './../textures/Uranus/moons/Miranda/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Miranda/normal.png'),
					velocity: (24067.7 / 10000),
					distance:  1
				},
				{
					name: 'Ariel',
					size: 0.09, //1159 km
					texture: (__dirname + './../textures/Uranus/moons/Ariel/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Ariel/normal.png'),
					velocity: (19832.3 / 10000),
					distance:  3
				},
				{
					name: 'Umbriel',
					size: 0.091, //1169 km
					texture: (__dirname + './../textures/Uranus/moons/Umbriel/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Umbriel/normal.png'),
					velocity: (16804.6 / 10000),
					distance:  4
				},
				{
					name: 'Titania',
					size: 0.111, //1578 km
					texture: (__dirname + './../textures/Uranus/moons/Titania/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Titania/normal.png'),
					velocity: (13120.0 / 10000),
					distance:  6
				},
				{
					name: 'Oberon',
					size: 0.11, //1523 km
					texture: (__dirname + './../textures/Uranus/moons/Oberon/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Oberon/normal.png'),
					velocity: (11349.2 / 10000),
					distance:  7 //9376 km
				}

			];

			uranusMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, this.planets['uranus'], moon.velocity/10000, moon.distance);

			});

		});

	}

	initNeptune(){

		let texturePath = (__dirname + './../textures/Neptune/surface.jpg');
		let normalPath = (__dirname + './../textures/Neptune/normal.jpg');
		this.createPlanet('neptune',
			this.NeptuneSize,
			texturePath,
			new BABYLON.Vector3(this.NeptuneDistance, 0, 0),
			normalPath
		).then(()=>{
			
			let neptuneMoons = [

				{
					name: 'Proteus',
					size: 0.08, //420 km
					texture: (__dirname + './../textures/Neptune/moons/Proteus/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Proteus/normal.png'),
					velocity: (27450.7 / 10000),
					distance:  8
				},
				{
					name: 'Larissa',
					size: 0.06, //194 km
					texture: (__dirname + './../textures/Neptune/moons/Larissa/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Larissa/normal.png'),
					velocity: (34693.4 / 10000),
					distance:  6
				},
				{
					name: 'Galatea',
					size: 0.058, //176 km
					texture: (__dirname + './../textures/Neptune/moons/Galatea/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Galatea/normal.png'),
					velocity: (37807.1 / 10000),
					distance:  3
				},
				{
					name: 'Despina',
					size: 0.052, //150 km
					texture: (__dirname + './../textures/Neptune/moons/Despina/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Despina/normal.png'),
					velocity: (41048.6 / 10000),
					distance:  1
				},
				{
					name: 'Triton',
					size: 0.17, //2706 km
					texture: (__dirname + './../textures/Neptune/moons/Triton/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Triton/normal.png'),
					velocity: (15803.2 / 10000),
					distance:  12
				}

			];

			neptuneMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, this.planets['neptune'], moon.velocity/10000, moon.distance);

			});

		});

	}

	createPlanet(name, size, texturePath, position, normal = null, atmosphere = null, atmosphereLevel = 1, atmosphereColor = new BABYLON.Color3(1,1,1)){

		return new Promise((resolve, reject)=>{

			this.planets[name] = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);

			let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
			mat.roughness = 10000;
			mat.indexOfRefraction = 0;
			mat.reflectionFresnelParameters = 0;

			if (normal) {

				mat.bumpTexture = new BABYLON.Texture(normal, this.scene);
				mat.bumpTexture.level = 1;
				//mat.bumpTexture.scale(100);
				mat.useParallax = true;
			    mat.useParallaxOcclusion = true;
			   	mat.parallaxScaleBias = 0.2;
			    mat.specularPower = 1000.0;
			    mat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

			}

			//mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);

			if (atmosphere) {
				mat.lightmapTexture = new BABYLON.Texture(atmosphere, this.scene);
				mat.lightmapTexture.level = atmosphereLevel;

				this.scene.registerBeforeRender(()=>{

					this.planets[name].material.lightmapTexture.uOffset -= 0.0001;
					this.planets[name].material.lightmapTexture.vOffset -= 0.0001;

				});

				this.highlightMeshes.addMesh(this.planets[name], atmosphereColor);

			} else {
				mat.freeze();
			}

			//mat.emissiveColor = new BABYLON.Vector3(0.5,0.5,0.5);
			//mat.ambientColor = new BABYLON.Vector3(1,1,1);
			mat.diffuseColor = new BABYLON.Color3(1,1,1);

			mat.emissiveTexture = new BABYLON.Texture(texturePath, this.scene);

			this.planets[name].material = mat;

			let variationY = Math.random();

			if (name == 'earth' || name == 'mars') variationY = 0;

			position.y = variationY;

			this.planets[name].position = position;
			this.planets[name].receiveShadows = true;

			this.planets[name].addLODLevel(1500, null);

			this.scene.registerBeforeRender(()=>{

				this.planets[name].rotation.y += 0.001;

			});

			this.planets[name].convertToUnIndexedMesh();

			mat.emissiveTexture.onLoadObservable.add(()=>{
				resolve();
			});

		});

	}

	createMoon(name, size, texturePath, parent, velocity, distanceFromPlanet = 1.5){

		let moon = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);
		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
		mat.bumpTexture = new BABYLON.Texture((__dirname + './../textures/Moon/normal.jpg'), this.scene);

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);

		mat.freeze();

		moon.material = mat;
		let variationY = Math.random();
		if (name == 'earth' || name == 'mars') variationY = 30.5;

		let n = Math.floor(Math.random() * 11);

		let xValue = distanceFromPlanet;
		let zValue = distanceFromPlanet;

		if (n <= 5) {
			xValue *= -1;
		} else {
			zValue *= -1;
		}

		moon.position = new BABYLON.Vector3(distanceFromPlanet, variationY, 0);
		moon.parent = parent;

		moon.addLODLevel(500, null);

		if (this.highlightMeshes) {
	    	this.highlightMeshes.addExcludedMesh(moon);
	    }

		let alpha = 0;

		this.scene.registerBeforeRender(()=>{

	        moon.position.x = xValue * Math.cos(alpha);
	        moon.position.z = zValue * Math.sin(alpha);
	        alpha += velocity;

	        //moon.rotation.y += 0.000001;

	    });

	}

	controlAtmospheres(){

		this.highlightMeshes = new BABYLON.HighlightLayer('hl', this.scene);
		this.highlightMeshes.outerGlow = true;
		this.highlightMeshes.innerGlow = false;

		this.highlightMeshes.blurHorizontalSize = 0.2;
		this.highlightMeshes.blurVerticalSize = 0.2;

	}

	createUniverseBox(){

		let universeBox = new BABYLON.MeshBuilder.CreateBox("universeBox", {size: 15000.0}, this.scene);
		let universeBoxMaterial = new BABYLON.StandardMaterial("universeBoxMaterial", this.scene);
		universeBoxMaterial.backFaceCulling = false;
		universeBoxMaterial.disableLighting = true;
		universeBox.material = universeBoxMaterial;

		universeBox.infiniteDistance = true;

		universeBoxMaterial.reflectionTexture = new BABYLON.CubeTexture(__dirname + './../textures/UniverseBox/skybox', this.scene);
		universeBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

	}

	createOrbits(){

		this.eventsController.once('presentation-ended', ()=>{

			this.devCamera.rotation.x = (Math.PI / 2);
			//this.devCamera.rotation.y = Math.PI / 2;
			this.devCamera.position = new BABYLON.Vector3(0, 220, 0);

			for(let name in this.planets){

				let alpha = 0;
				let velocity = 0;
				let xValue = 0;
				let zValue = 0;

				switch (name) {

					case 'mercury':
						alpha = 0;
						velocity = 0;
						xValue = this.MercuryDistance * -1;
						zValue = this.MercuryDistance;
						velocity = (this.MercuryVelocity / 100000);
						break;

					case 'venus':
						alpha = 0;
						velocity = 0;
						xValue = this.VenusDistance;
						zValue = this.VenusDistance * -1;
						velocity = (this.VenusVelocity / 100000);
						break;

					case 'earth':
						alpha = 0;
						velocity = 0;
						xValue = this.EarthDistance;
						zValue = this.EarthDistance;
						velocity = (this.EarthVelocity / 100000) * -1;
						break;

					case 'mars':
						alpha = 0;
						velocity = 0;
						xValue = this.MarsDistance * -1;
						zValue = this.MarsDistance;
						velocity = (this.MarsVelocity / 100000);
						break;

					case 'jupiter':
						alpha = 0;
						velocity = 0;
						xValue = this.JupiterDistance;
						zValue = this.JupiterDistance;
						velocity = (this.JupiterVelocity / 100000) * -1;
						break;

					case 'saturn':
						alpha = 0;
						velocity = 0;
						xValue = this.SaturnDistance;
						zValue = this.SaturnDistance * -1;
						velocity = (this.SaturnVelocity / 100000);
						break;

					case 'uranus':
						alpha = 0;
						velocity = 0;
						xValue = this.UranusDistance * -1;
						zValue = this.UranusDistance;
						velocity = (this.UranusVelocity / 100000);
						break;

					case 'neptune':
						alpha = 0;
						velocity = 0;
						xValue = this.NeptuneDistance * -1;
						zValue = this.NeptuneDistance;
						velocity = (this.NeptuneVelocity / 100000);
						break;

				}
				
			    this.scene.registerBeforeRender(()=>{

			        this.planets[name].position.x = xValue * Math.cos(alpha);
			        //this.planets[name].position.y = 0;
			        this.planets[name].position.z = zValue * Math.sin(alpha);
			        alpha += velocity;

			    });

			}

		});

	}

	presentPlanets(){

		this.devCamera.rotation.x = (Math.PI * 2);
		this.devCamera.rotation.y = Math.PI / 2;

		this.devCameraVelocityX = 0.5;

		this.scene.registerBeforeRender(()=>{

			if (this.timesPresented == 0) {

				if (this.devCamera.position.y > 2.0) {

					this.devCamera.position.y -= this.devCameraVelocityX;
					
				} else {
					this.devCameraVelocityX = 1.00;
				}

				if (this.devCamera.position.y <= 2.5) {

					if (this.devCamera.position.x <= (this.MercuryDistance - 2) && this.devCamera.position.x >= (this.MercuryDistance - 5) && this.timesPresented == 0) {

						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.06;
						this.devCamera.setTarget(this.planets['mercury'].position);


					} else if (this.devCamera.position.x <= (this.VenusDistance - 2) && this.devCamera.position.x >= (this.VenusDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.1;
						this.devCamera.setTarget(this.planets['venus'].position);


					} else if (this.devCamera.position.x <= (this.EarthDistance - 2) && this.devCamera.position.x >= (this.EarthDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.13;
						this.devCamera.setTarget(this.planets['earth'].position);


					} else if (this.devCamera.position.x <= (this.MarsDistance - 2) && this.devCamera.position.x >= (this.MarsDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.14;
						this.devCamera.setTarget(this.planets['mars'].position);


					} else if (this.devCamera.position.x <= (this.JupiterDistance - 2) && this.devCamera.position.x >= (this.JupiterDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.27;
						this.devCamera.setTarget(this.planets['jupiter'].position);


					} else if (this.devCamera.position.x <= (this.SaturnDistance - 2) && this.devCamera.position.x >= (this.SaturnDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.5;
						this.devCamera.setTarget(this.planets['saturn'].position);


					} else if (this.devCamera.position.x <= (this.UranusDistance - 2) && this.devCamera.position.x >= (this.UranusDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.5;
						this.devCamera.setTarget(this.planets['uranus'].position);


					} else if (this.devCamera.position.x <= (this.NeptuneDistance - 2) && this.devCamera.position.x >= (this.NeptuneDistance - 5) && this.timesPresented == 0) {
						
						this.devCameraVelocityX = 0.006;
						this.devCamera.position.z += 0.75;
						this.devCamera.setTarget(this.planets['neptune'].position);


					} else {

						this.devCamera.rotation.x = (Math.PI * 2);
						this.devCamera.rotation.y = Math.PI / 2;
						this.devCamera.position.z = 2.5;

					}

					if (this.timesPresented == 0 && this.devCamera.position.x >= this.NeptuneDistance) {
						this.devCameraVelocityX = 0;
						this.endPresentation();
					}

					this.devCamera.position.x += this.devCameraVelocityX;

				}

			} else {
				this.devCameraVelocityX = 0;
			}

		});

	}

	endPresentation(){

		this.devCameraVelocityX = 0;
		this.eventsController.emit('presentation-ended');
		this.timesPresented = 1;

	}

	initGUI(){

		this.GUI = BABYLON_GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

		for(let planet in this.planets){

			let box = new BABYLON_GUI.Rectangle();
			box.width = 0.2;
			box.height = 0.04;
			box.background = 'rgba(0,0,0,0)';
			box.color = 'rgba(255,255,255,0)';
			box.cornerRadius = 20;

			this.GUI.addControl(box);

			let textBlock = new BABYLON_GUI.TextBlock();
			textBlock.text = planet.toUpperCase();
			textBlock.fontSizeInPixels = 16;
			textBlock.color = '#00BFFF';
			box.addControl(textBlock);

			box.linkWithMesh(this.planets[planet]);
			box.linkOffsetY = -50;

			this.planetsGUIs[planet] = {
				box,
				textBlock
			};

		}

		let button = new BABYLON_GUI.Button('skip-presentation');
		button.horizontalAlignment = BABYLON_GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		button.verticalAlignment = BABYLON_GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

		button.paddingBottom = '15px';
		button.paddingRight = '15px';
		
		button.width = 0.35;
		button.height = 0.07;
		button.background = 'rgba(0,0,0,0.5)';
		button.color = '#00BFFF';
		button.cornerRadius = 20;

		let textBlock = new BABYLON_GUI.TextBlock();
		textBlock.text = "SKIP PRESENTATION";
		textBlock.fontSizeInPixels = 16;
		textBlock.color = '#00BFFF';

		button.addControl(textBlock);
		this.GUI.addControl(button);

		button.onPointerClickObservable.add((e)=>{

			this.GUI.removeControl(button);
			this.endPresentation();

		});

		this.scene.onKeyboardObservable.add((e)=>{

			if (e.event.type == 'keydown') {

				switch (e.event.key.toUpperCase()) {

					case 'SHIFT':
						this.devCamera.speed = 50;
						break;
				
				}

			} else if (e.event.type == 'keyup') {
				
				switch (e.event.key.toUpperCase()) {

					case 'SHIFT':
						this.devCamera.speed = this.cameraInitialSpeed;
						break;
				
				}

			}

		});

		this.controlPlanetsGUI();
		this.presentPlanets();

	}

	controlPlanetsGUI(){

		let maxDistanceToVisibleGUI = 4000;
		let minDistanceToVisibleGUI = 0;

		this.scene.registerBeforeRender(()=>{

			for(let planet in this.planets){

				switch (planet) {

					case 'mercury':
						minDistanceToVisibleGUI = 10;
						break;

					case 'venus':
						minDistanceToVisibleGUI = 15;
						break;

					case 'earth':
						minDistanceToVisibleGUI = 25;
						break;

					case 'mars':
						minDistanceToVisibleGUI = 20;
						break;

					case 'jupiter':
						minDistanceToVisibleGUI = 55;
						break;

					case 'saturn':
						minDistanceToVisibleGUI = 55;
						break;

					case 'uranus':
						minDistanceToVisibleGUI = 55;
						break;

					case 'neptune':
						minDistanceToVisibleGUI = 55;
						break;
					
				}

				if (this.devCamera.position.equalsWithEpsilon(this.planets[planet].position, minDistanceToVisibleGUI) || !this.devCamera.position.equalsWithEpsilon(this.planets[planet].position, maxDistanceToVisibleGUI)) {

					this.planetsGUIs[planet].box.isVisible = false;

				} else {
					this.planetsGUIs[planet].box.isVisible = true;
				}

			}

		});

	}

}

module.exports = AppController;