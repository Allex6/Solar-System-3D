const EventEmitter = require('events');
const BABYLON_GUI = require('babylonjs-gui');

class AppController {

	constructor(){

		this.canvas = document.getElementById("renderCanvas");
		let options = {
			stencil: true,
			doNotHandleContextLost: true,
			useGeometryIdsMap: true,
			useMaterialMeshMap: true,
			useClonedMeshMap: true
		};
		let antialising = true;
		this.engine = new BABYLON.Engine(this.canvas, antialising, options, true);
		this.engine.enableOfflineSupport = false;

		this.cameraInitialSpeed = 5.0;

		this.eventsController = new EventEmitter();

		this.planets = {};
		this.planetsGUIs = [];

		this.timesPresented = 0;

		this.cameraInitialPosition = new BABYLON.Vector3(0, 220, 0);
		this.cameraInitialRotation = Math.PI / 2;

		this.SunSize = 928.4;
		this.MercurySize = 3.259;
		this.VenusSize = 8.069;
		this.EarthSize = 8.494;
		this.MoonSize = 2.316;
		this.MarsSize = 4.519;
		this.JupiterSize = 93.21;
		this.SaturnSize = 77.64;
		this.UranusSize = 33.816;
		this.NeptuneSize = 32.829;

		this.MercuryDistance = 0.66 + this.SunSize;
		this.VenusDistance = 122 + this.SunSize;
		this.EarthDistance = 281 + this.SunSize;
		this.MarsDistance = 563.3 + this.SunSize
		this.JupiterDistance = 1438.66 + this.SunSize;
		this.SaturnDistance = 2142.9 + this.SunSize;
		this.UranusDistance = 2833.9 + this.SunSize;
		this.NeptuneDistance = 3702.8 + this.SunSize;

		this.MercuryVelocity = 47.362;
		this.VenusVelocity = 35.02;
		this.EarthVelocity = 29.78;
		this.MarsVelocity = 24.07;
		this.JupiterVelocity = 13.07;
		this.SaturnVelocity = 9.68;
		this.UranusVelocity = 6.80;
		this.NeptuneVelocity = 5.43;

		this.planetsRotations = {
			'mercury': 0.0000072613,
			'venus': 0.0000043467,
			'earth': 0.00107289,
			'mars': 0.00057881,
			'jupiter': 0.03038108,
			'saturn': 0.02456,
			'uranus': 0.0098640458,
			'neptune': 0.00647933
		};

		this.SunRotationSpeed = 0.0047928;

		this.initializeScene();

		this.controlLoadingItems();
		this.initializeStars();
		this.initGUI();
		this.createPlanetsViews();

		this.engine.runRenderLoop(()=>{
			this.scene.render();
		});

		window.addEventListener("resize", ()=>{
			this.engine.resize();
		});

	}

	initializeScene(){

		this.scene = new BABYLON.Scene(this.engine);
		this.initLoadingScreen();
		this.scene.ambientColor = new BABYLON.Color3(1,1,1);

		this.mainCamera = new BABYLON.FlyCamera("mainCamera", new BABYLON.Vector3(0, 0, -40), this.scene);
		this.mainCamera.attachControl(this.canvas, true);
		this.mainCamera.position = this.cameraInitialPosition;
		this.mainCamera.speed = this.cameraInitialSpeed;
		this.mainCamera.rotation.x = this.cameraInitialRotation;
		this.mainCamera.ellipsoid = new BABYLON.Vector3(0,0,0);
		this.mainCamera.fov = 0.9;

		this.scene.clearColor = new BABYLON.Color3(0,0,0).toLinearSpace();
		this.scene.autoClearDepthAndStencil = false;

		this.createUniverseBox();

		this.ambientSound = new BABYLON.Sound('ambientSound', __dirname + './../sound-effects/space-ambient.mp3', this.scene, null, {
			autoplay: true,
			loop: true,
			volume: 0.4
		});

		this.highlightMeshes = new BABYLON.HighlightLayer('hl', this.scene);
		this.highlightMeshes.outerGlow = true;
		this.highlightMeshes.innerGlow = false;

		this.highlightMeshes.blurHorizontalSize = 0.2;
		this.highlightMeshes.blurVerticalSize = 0.2;

	}

	controlLoadingItems(){

		this.engine.loadingScreen.displayLoadingUI();

		this.scene.whenReadyAsync().then(()=>{

			this.engine.loadingScreen.hideLoadingUI();

			let options = new BABYLON.SceneOptimizerOptions();
			options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 2));
			options.addOptimization(new BABYLON.TextureOptimization(0, 2048));
			options.addOptimization(new BABYLON.RenderTargetsOptimization(0));
			options.addOptimization(new BABYLON.MergeMeshesOptimization(0));

			BABYLON.SceneOptimizer.OptimizeAsync(this.scene, options, ()=>{
				this.presentPlanets();
			});

		});

		let check = ()=>{

			window.document.getElementById("items-remaining-to-be-loaded").innerHTML = this.scene.getWaitingItemsCount();

			if (this.scene.getWaitingItemsCount() == 0) {
				this.scene.unregisterBeforeRender(check);
			}

		};

		this.scene.registerBeforeRender(check);

	}

	initLoadingScreen(){

		let loadingScreenDiv = window.document.getElementById("loading-screen");
		let t = this;

		class LoadingScreen {

			displayLoadingUI(){
				loadingScreenDiv.innerHTML = `
					<h1>Loading...</h1> 
					<p style='font-size: 24px;'><span id='items-remaining-to-be-loaded'>${t.scene.getWaitingItemsCount()}</span> Items remaining...</p>
				`;
				loadingScreenDiv.style.display = 'flex';
				t.canvas.style.display = 'none';
			}

			hideLoadingUI(){
				loadingScreenDiv.style.display = "none";
            	t.canvas.style.display = 'block';
			}

		}

        let loadScreen = new LoadingScreen();
        this.engine.loadingScreen = loadScreen;

        this.engine.displayLoadingUI();

	}

	initializeStars(){

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

		let glowEffect = new BABYLON.GlowLayer("glow", this.scene, {mainTextureFixedSize: 64, blurKernelSize: 16, mainTextureSamples: 4});

		glowEffect.intensity = 1.5;
		glowEffect.addIncludedOnlyMesh(this.sun);

		this.sun.material = sunMaterial;

		this.sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0,0,0), this.scene);
		this.sunLight.intensity = 0.4;

		this.scene.registerBeforeRender(()=>{
			this.sun.rotation.y += this.SunRotationSpeed;
		});

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

			this.createMoon('moon', this.MoonSize, (__dirname + './../textures/Moon/surface.jpg'), (__dirname + './../textures/Moon/normal.png'), this.planets['earth'], 0.002316333, 2.562667 + this.EarthSize);

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

			let marsMoons = [

				{
					name: 'Phobos',
					size: 0.15,
					texture: (__dirname + './../textures/Mars/moons/Phobos/surface.jpg'),
					normal: (__dirname + './../textures/Mars/moons/Phobos/normal.png'),
					velocity: 0.005131133,
					distance:  0.625133  + this.MarsSize
				},
				{
					name: 'Deimos',
					size: 0.08, 
					texture: (__dirname + './../textures/Mars/moons/Deimos/surface.jpg'),
					normal: (__dirname + './../textures/Mars/moons/Deimos/normal.png'),
					velocity: 0.0032432,
					distance:  3.5624  + this.MarsSize
				}


			];

			marsMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, moon.normal, this.planets['mars'], moon.velocity, moon.distance);

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

			let jupiterMoons = [

				{
					name: 'Io',
					size: 2.1,
					texture: (__dirname + './../textures/Jupiter/moons/Io/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Io/normal.png'),
					velocity: 0.00416154,
					distance:  2.0 + this.JupiterSize
				},
				{
					name: 'Europa',
					size: 1.8,
					texture: (__dirname + './../textures/Jupiter/moons/Europa/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Europa/normal.png'),
					velocity: 0.00329,
					distance:  6.474 + this.JupiterSize
				},
				{
					name: 'Ganimedes',
					size: 3.1, 
					texture: (__dirname + './../textures/Jupiter/moons/Ganimedes/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Ganimedes/normal.png'),
					velocity: 0.0026,
					distance:  15.136 + this.JupiterSize
				},
				{
					name: 'Callisto',
					size: 2.8, 
					texture: (__dirname + './../textures/Jupiter/moons/Callisto/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Callisto/normal.png'),
					velocity: 0.0019,
					distance:  29.5 + this.JupiterSize
				},
				{
					name: 'Amalthea',
					size: 0.01, 
					texture: (__dirname + './../textures/Jupiter/moons/Amalthea/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Amalthea/normal.png'),
					velocity: 0.006,
					distance:  1.09 + this.JupiterSize
				},
				{
					name: 'Himalia',
					size: 0.011, 
					texture: (__dirname + './../textures/Jupiter/moons/Himalia/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Himalia/normal.png'),
					velocity: 0.0007,
					distance:  78.4 + this.JupiterSize
				},
				{
					name: 'Elara',
					size: 0.0056, 
					texture: (__dirname + './../textures/Jupiter/moons/Elara/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Elara/normal.png'),
					velocity: 0.0007798,
					distance:  83.27 + this.JupiterSize
				},
				{
					name: 'Pasiphae',
					size: 0.0052, 
					texture: (__dirname + './../textures/Jupiter/moons/Pasiphae/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Pasiphae/normal.png'),
					velocity: 0.0005,
					distance:  160.49 + this.JupiterSize
				},
				{
					name: 'Lysithea',
					size: 0.0021, 
					texture: (__dirname + './../textures/Jupiter/moons/Lysithea/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Lysithea/normal.png'),
					velocity: 0.0007,
					distance:  75.11 + this.JupiterSize
				},
				{
					name: 'Carme',
					size: 0.0030, 
					texture: (__dirname + './../textures/Jupiter/moons/Carme/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Carme/normal.png'),
					velocity: 0.000547,
					distance:  150 + this.JupiterSize
				},
				{
					name: 'Ananke',
					size: 0.0019, 
					texture: (__dirname + './../textures/Jupiter/moons/Ananke/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Ananke/normal.png'),
					velocity: 0.00058,
					distance:  137.84 + this.JupiterSize
				},
				{
					name: 'Leda',
					size: 0.0015, 
					texture: (__dirname + './../textures/Jupiter/moons/Leda/surface.png'),
					normal: (__dirname + './../textures/Jupiter/moons/Leda/normal.png'),
					velocity: 0.0008,
					distance:  70.4 + this.JupiterSize
				},
				{
					name: 'Thebe',
					size: 0.0060,
					texture: (__dirname + './../textures/Jupiter/moons/Thebe/surface.jpg'),
					normal: (__dirname + './../textures/Jupiter/moons/Thebe/normal.png'),
					velocity: 0.0057,
					distance:  1.8 + this.JupiterSize
				},
				{
					name: 'Adrastea',
					size: 0.00152,
					texture: (__dirname + './../textures/Jupiter/moons/Adrastea/surface.png'),
					normal: (__dirname + './../textures/Jupiter/moons/Adrastea/normal.png'),
					velocity: 0.0075,
					distance:  1 + this.JupiterSize
				}


			];

			jupiterMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, moon.normal, this.planets['jupiter'], moon.velocity, moon.distance);

			});

		});

	}

	initMercury(){

		let texturePath = (__dirname + './../textures/Mercury/surface.jpg');
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
			
			let saturnRing = new BABYLON.MeshBuilder.CreateTorus("saturnRing", {thickness: 7.0, tessellation: 96, diameter: 100}, this.scene);
	    	saturnRing.scaling = new BABYLON.Vector3(1, 0.1, 1);

	    	let ringMaterial = new BABYLON.StandardMaterial('saturnRingMat', this.scene);
	    	ringMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Saturn/ring.png', this.scene);
	    	ringMaterial.emissiveColor = new BABYLON.Color3(1,1,1);

	    	saturnRing.material = ringMaterial;
	    	saturnRing.position = this.planets['saturn'].position;

	    	saturnRing.addLODLevel(7500, null);

	    	this.scene.registerBeforeRender(()=>{
				saturnRing.rotation.y += 1.5;
			});

			let saturnMoons = [

				{
					name: 'Mimas',
					size: 0.25, 
					texture: (__dirname + './../textures/Saturn/moons/Mimas/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Mimas/normal.png'),
					velocity: 0.0034,
					distance:  1.23 + this.SaturnSize
				},
				{
					name: 'Enceladus',
					size: 0.28, 
					texture: (__dirname + './../textures/Saturn/moons/Enceladus/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Enceladus/normal.png'),
					velocity: 0.00303,
					distance:  2.18 + this.SaturnSize
				},
				{
					name: 'Thetys',
					size: 0.92, 					
					texture: (__dirname + './../textures/Saturn/moons/Thetys/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Thetys/normal.png'),
					velocity: 0.00272,
					distance:  2.96 + this.SaturnSize
				},
				{
					name: 'Dione',
					size: 0.95, 
					texture: (__dirname + './../textures/Saturn/moons/Dione/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Dione/normal.png'),
					velocity: 0.00240,
					distance:  3.91 + this.SaturnSize
				},
				{
					name: 'Rhea',
					size: 1.1,  
					texture: (__dirname + './../textures/Saturn/moons/Rhea/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Rhea/normal.png'),
					velocity: 0.00203,
					distance:  5.51 + this.SaturnSize
				},
				{
					name: 'Titan',
					size: 3.05, 
					texture: (__dirname + './../textures/Saturn/moons/Titan/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Titan/normal.png'),
					velocity: 0.0013,
					distance:  8.14 + this.SaturnSize
				},
				{
					name: 'Iapetus',
					size: 1.05, 
					texture: (__dirname + './../textures/Saturn/moons/Iapetus/surface.jpg'),
					normal: (__dirname + './../textures/Saturn/moons/Iapetus/normal.png'),
					velocity: 0.0007,
					distance:  23.7 + this.SaturnSize
				}


			];

			saturnMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, moon.normal, this.planets['saturn'], moon.velocity, moon.distance);

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
			
			let uranusRing = new BABYLON.MeshBuilder.CreateTorus("uranusRing", {thickness: 3.0, tessellation: 96, diameter: 50}, this.scene);
	    	uranusRing.scaling = new BABYLON.Vector3(1, 0.1, 1);
	    	let ringMaterial = new BABYLON.StandardMaterial('uranusRingMat', this.scene);
	    	ringMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Uranus/ring.png', this.scene);
	    	ringMaterial.emissiveColor = new BABYLON.Color3(1,1,1);
	    	uranusRing.material = ringMaterial;
	    	uranusRing.position = this.planets['uranus'].position;
	    	uranusRing.addLODLevel(7500, null);

	    	this.scene.registerBeforeRender(()=>{
				uranusRing.rotation.y += 1.0;
			});

			let uranusMoons = [

				{
					name: 'Miranda',
					size: 0.25,
					texture: (__dirname + './../textures/Uranus/moons/Miranda/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Miranda/normal.png'),
					velocity: 0.016,
					distance:  1 + this.UranusSize
				},
				{
					name: 'Ariel',
					size: 0.9,
					texture: (__dirname + './../textures/Uranus/moons/Ariel/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Ariel/normal.png'),
					velocity: 0.013,
					distance:  2.27 + this.UranusSize
				},
				{
					name: 'Umbriel',
					size: 0.91,
					texture: (__dirname + './../textures/Uranus/moons/Umbriel/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Umbriel/normal.png'),
					velocity: 0.0112,
					distance:  3.77 + this.UranusSize
				},
				{
					name: 'Titania',
					size: 1.11,
					texture: (__dirname + './../textures/Uranus/moons/Titania/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Titania/normal.png'),
					velocity: 0.008,
					distance:  5.9 + this.UranusSize
				},
				{
					name: 'Oberon',
					size: 1.1,
					texture: (__dirname + './../textures/Uranus/moons/Oberon/surface.jpg'),
					normal: (__dirname + './../textures/Uranus/moons/Oberon/normal.png'),
					velocity: 0.007566,
					distance:  7.89 + this.UranusSize
				}

			];

			uranusMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, moon.normal, this.planets['uranus'], moon.velocity, moon.distance);

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
					name: 'Galatea',
					size: 0.58,
					texture: (__dirname + './../textures/Neptune/moons/Galatea/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Galatea/normal.png'),
					velocity: 0.025,
					distance:  1 + this.NeptuneSize
				},
				{
					name: 'Triton',
					size: 1.7,
					texture: (__dirname + './../textures/Neptune/moons/Triton/surface.jpg'),
					normal: (__dirname + './../textures/Neptune/moons/Triton/normal.png'),
					velocity: 0.0105,
					distance:  4.365 + this.NeptuneSize
				}

			];

			neptuneMoons.forEach(moon=>{

				this.createMoon(moon.name, moon.size, moon.texture, moon.normal, this.planets['neptune'], moon.velocity, moon.distance);

			});

		});

	}

	createPlanet(name, size, texturePath, position, normal = null, atmosphere = null, atmosphereLevel = 1, atmosphereColor = new BABYLON.Color3(1,1,1)){

		return new Promise((resolve, reject)=>{

			this.planets[name] = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size, updatable: true}, this.scene);

			let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
			mat.roughness = 10000;
			mat.indexOfRefraction = 0;
			mat.reflectionFresnelParameters = 0;

			if (normal) {
				mat.bumpTexture = new BABYLON.Texture(normal, this.scene);
				mat.bumpTexture.level = 1;
			}

			if (atmosphere) {
				mat.lightmapTexture = new BABYLON.Texture(atmosphere, this.scene);
				mat.lightmapTexture.level = atmosphereLevel;

				this.scene.registerBeforeRender(()=>{

					this.planets[name].material.lightmapTexture.uOffset -= 0.00007;
					this.planets[name].material.lightmapTexture.vOffset -= 0.00007;

				});

				this.highlightMeshes.addMesh(this.planets[name], atmosphereColor);

			} else {
				mat.freeze();
			}


			mat.diffuseColor = new BABYLON.Color3(1,1,1);
			mat.emissiveTexture = new BABYLON.Texture(texturePath, this.scene);
			this.planets[name].material = mat;

			let variationY = Math.random();

			if (name == 'earth' || name == 'mars') variationY = 0;

			position.y = variationY;

			this.planets[name].position = position;
			this.planets[name].receiveShadows = true;

			this.planets[name].addLODLevel(7500, null);

			this.scene.registerBeforeRender(()=>{

				this.planets[name].rotation.y += this.planetsRotations[name];

			});

			this.planets[name].convertToUnIndexedMesh();

			mat.emissiveTexture.onLoadObservable.add(()=>{
				resolve();
			});

		});

	}

	createMoon(name, size, texturePath, normalPath, parent, velocity, distanceFromPlanet = 1.5){

		let moon = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);
		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
		mat.bumpTexture = new BABYLON.Texture(normalPath, this.scene);
		mat.emissiveColor = new BABYLON.Vector3(1,1,1);
		mat.freeze();

		moon.material = mat;
		let variationY = Math.random();
		if (name == 'moon' || name == 'Phobos' || name == 'Deimos') variationY = 0;

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
		parent.billboardMode = BABYLON.BILLBOARDMODE_NONE;
		moon.billboardMode = BABYLON.BILLBOARDMODE_NONE;

		moon.addLODLevel(3500, null);

		if (this.highlightMeshes) {
	    	this.highlightMeshes.addExcludedMesh(moon);
	    }

		let alpha = 0;

		this.scene.registerBeforeRender(()=>{

	        moon.position.x = xValue * Math.cos(alpha);
	        moon.position.z = zValue * Math.sin(alpha);
	        alpha += velocity;

	    });

	}

	createUniverseBox(){

		this.universeBox = new BABYLON.MeshBuilder.CreateBox("universeBox", {size: 15000.0}, this.scene);
		let universeBoxMaterial = new BABYLON.StandardMaterial("universeBoxMaterial", this.scene);
		universeBoxMaterial.backFaceCulling = false;
		universeBoxMaterial.disableLighting = true;
		this.universeBox.material = universeBoxMaterial;
		this.universeBox.infiniteDistance = true;
		universeBoxMaterial.reflectionTexture = new BABYLON.CubeTexture(__dirname + './../textures/UniverseBox/skybox', this.scene);
		universeBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

	}

	createOrbits(){

		this.eventsController.once('presentation-ended', ()=>{

			this.mainCamera.rotation.x = (Math.PI / 2);
			this.mainCamera.position = new BABYLON.Vector3(0, 2000, 0);

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
						velocity = (this.MercuryVelocity / 15000);
						break;

					case 'venus':
						alpha = 0;
						velocity = 0;
						xValue = this.VenusDistance;
						zValue = this.VenusDistance * -1;
						velocity = (this.VenusVelocity / 15000);
						break;

					case 'earth':
						alpha = 0;
						velocity = 0;
						xValue = this.EarthDistance;
						zValue = this.EarthDistance;
						velocity = (this.EarthVelocity / 15000) * -1;
						break;

					case 'mars':
						alpha = 0;
						velocity = 0;
						xValue = this.MarsDistance * -1;
						zValue = this.MarsDistance;
						velocity = (this.MarsVelocity / 15000);
						break;

					case 'jupiter':
						alpha = 0;
						velocity = 0;
						xValue = this.JupiterDistance;
						zValue = this.JupiterDistance;
						velocity = (this.JupiterVelocity / 15000) * -1;
						break;

					case 'saturn':
						alpha = 0;
						velocity = 0;
						xValue = this.SaturnDistance;
						zValue = this.SaturnDistance * -1;
						velocity = (this.SaturnVelocity / 15000);
						break;

					case 'uranus':
						alpha = 0;
						velocity = 0;
						xValue = this.UranusDistance * -1;
						zValue = this.UranusDistance;
						velocity = (this.UranusVelocity / 15000);
						break;

					case 'neptune':
						alpha = 0;
						velocity = 0;
						xValue = this.NeptuneDistance * -1;
						zValue = this.NeptuneDistance;
						velocity = (this.NeptuneVelocity / 15000);
						break;

				}
				
			    this.scene.registerBeforeRender(()=>{

			        this.planets[name].position.x = xValue * Math.cos(alpha);
			        this.planets[name].position.z = zValue * Math.sin(alpha);
			        alpha += velocity;

			    });

			}

		});

	}

	disableCameraInputs(){

		this.mainCamera.inputs.attached.keyboard.keysBackward = [];
		this.mainCamera.inputs.attached.keyboard.keysDown = [];
		this.mainCamera.inputs.attached.keyboard.keysLeft = [];
		this.mainCamera.inputs.attached.keyboard.keysRight = [];
		this.mainCamera.inputs.attached.keyboard.keysUp = [];

	}

	enableCameraInputs(){

		this.mainCamera.inputs.attached.keyboard.keysBackward = [83];
		this.mainCamera.inputs.attached.keyboard.keysDown = [81];
		this.mainCamera.inputs.attached.keyboard.keysLeft = [65];
		this.mainCamera.inputs.attached.keyboard.keysRight = [68];
		this.mainCamera.inputs.attached.keyboard.keysUp = [69];

	}

	presentPlanets(){

		this.disableCameraInputs();

		this.mainCamera.rotation.x = (Math.PI * 2);
		this.mainCamera.rotation.y = Math.PI / 2;

		this.mainCameraVelocityX = 0.5;

		let presentFN = ()=>{

			if (this.timesPresented == 0) {

				if (this.mainCamera.position.y > 2.0) {

					this.mainCamera.position.y -= this.mainCameraVelocityX;
					
				} else {
					this.mainCameraVelocityX = 1.50;
				}

				if (this.mainCamera.position.y <= 2.5) {

					if (this.mainCamera.position.x <= (this.MercuryDistance - 2) && this.mainCamera.position.x >= (this.MercuryDistance - 5) && this.timesPresented == 0) {

						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 0.06;
						this.mainCamera.setTarget(this.planets['mercury'].position);


					} else if (this.mainCamera.position.x <= (this.VenusDistance - 2) && this.mainCamera.position.x >= (this.VenusDistance - 5) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 0.2;
						this.mainCamera.setTarget(this.planets['venus'].position);


					} else if (this.mainCamera.position.x <= (this.EarthDistance - 2) && this.mainCamera.position.x >= (this.EarthDistance - 5) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 0.23;
						this.mainCamera.setTarget(this.planets['earth'].position);


					} else if (this.mainCamera.position.x <= (this.MarsDistance - 2) && this.mainCamera.position.x >= (this.MarsDistance - 5) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 0.24;
						this.mainCamera.setTarget(this.planets['mars'].position);


					} else if (this.mainCamera.position.x <= (this.JupiterDistance - 65) && this.mainCamera.position.x >= (this.JupiterDistance - 70) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 2.47;
						this.mainCamera.setTarget(this.planets['jupiter'].position);


					} else if (this.mainCamera.position.x <= (this.SaturnDistance - 65) && this.mainCamera.position.x >= (this.SaturnDistance - 70) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 3.9;
						this.mainCamera.setTarget(this.planets['saturn'].position);


					} else if (this.mainCamera.position.x <= (this.UranusDistance - 65) && this.mainCamera.position.x >= (this.UranusDistance - 70) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 3.9;
						this.mainCamera.setTarget(this.planets['uranus'].position);


					} else if (this.mainCamera.position.x <= (this.NeptuneDistance - 65) && this.mainCamera.position.x >= (this.NeptuneDistance - 70) && this.timesPresented == 0) {
						
						this.mainCameraVelocityX = 0.006;
						this.mainCamera.position.z += 4.2;
						this.mainCamera.setTarget(this.planets['neptune'].position);


					} else {

						this.mainCamera.rotation.x = (Math.PI * 2);
						this.mainCamera.rotation.y = Math.PI / 2;
						this.mainCamera.position.z = 10.0;

					}

					if (this.timesPresented == 0 && this.mainCamera.position.x >= this.NeptuneDistance) {
						this.mainCameraVelocityX = 0;
						this.endPresentation();
						this.scene.unregisterBeforeRender(presentFN);
					}

					this.mainCamera.position.x += this.mainCameraVelocityX;

				}

			} else {
				this.mainCameraVelocityX = 0;
				this.scene.unregisterBeforeRender(presentFN);
			}

		}

		this.scene.registerBeforeRender(presentFN);

	}

	endPresentation(){

		this.enableCameraInputs();

		this.mainCameraVelocityX = 0;
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
						this.mainCamera.speed = 50;
						break;
				
				}

			} else if (e.event.type == 'keyup') {
				
				switch (e.event.key.toUpperCase()) {

					case 'SHIFT':
						this.mainCamera.speed = this.cameraInitialSpeed;
						break;

					case 'V':
						this.toggleCamera();
						break;
				
				}

			}

		});

		this.controlPlanetsGUI();

	}

	controlPlanetsGUI(){

		let maxDistanceToVisibleGUI = 7500;
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

				if (this.mainCamera.position.equalsWithEpsilon(this.planets[planet].position, minDistanceToVisibleGUI) || !this.mainCamera.position.equalsWithEpsilon(this.planets[planet].position, maxDistanceToVisibleGUI)) {

					this.planetsGUIs[planet].box.isVisible = false;

				} else {
					this.planetsGUIs[planet].box.isVisible = true;
				}

			}

		});

	}

	createPlanetsViews(){

		this.sceneCams = [];

		for(let planet in this.planets){

			this.sceneCams.push({
				name: planet,
				camera: new BABYLON.ArcFollowCamera(planet+"FollowCam", 0, 0, 20, this.planets[planet], this.scene)
			});

		}

		this.sceneCams.push({
			name: 'mainCamera',
			camera: this.mainCamera
		});

	}

	toggleCamera(){

		let element = this.sceneCams.shift();

		if (element.name != 'mainCamera') {

			switch (element.name) {

				case 'neptune':
				case 'uranus':
				case 'saturn':
				case 'jupiter':
					element.camera.radius = 160;
					element.camera.heightOffset = 280;
					break;

			}

			this.planets[element.name].billboardMode = BABYLON.BILLBOARDMODE_NONE;
			element.camera.billboardMode = BABYLON.BILLBOARDMODE_NONE;
			element.camera.lockedTarget = this.planets[element.name];

		}

		this.scene.activeCamera = element.camera;
		this.scene.activeCamera.attachControl(this.canvas, true);
		this.sceneCams.push(element);

	}

}

module.exports = AppController;