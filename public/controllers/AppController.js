//const {FireMaterial} = require('babylonjs-materials');
//require('babylonjs-procedural-textures');

//console.log(BABYLON.FireMaterial);

const EventEmitter = require('events');

class AppController {

	constructor(){

		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

		this.eventsController = new EventEmitter();

		this.planets = {};

		// The following values have been modified for better viewing, since in the real universe, it would be very difficult to maintain fidelity

		this.SunSize = 20.0; //13.927;
		this.MercurySize = 0.4; //0.048;
		this.VenusSize = 1.0; //0.121;
		this.EarthSize = 1.1; //0.127;
		this.MoonSize = 0.2; //0.034;
		this.MarsSize = 0.7; //0.067;
		this.JupiterSize = 4.5; //1.398;
		this.SaturnSize = 4.1; //1.164;
		this.UranusSize = 2.5; //0.507;
		this.NeptuneSize = 2.1; //0.492;

		this.MercuryDistance = 20;
		this.VenusDistance = 35;
		this.EarthDistance = 60;
		this.MarsDistance = 85;
		this.JupiterDistance = 140;
		this.SaturnDistance = 260;
		this.UranusDistance = 380;
		this.NeptuneDistance = 620;

		this.MercuryVelocity = 48.92;
		this.VenusVelocity = 35.02;
		this.EarthVelocity = 29.78;
		this.MarsVelocity = 24.07;
		this.JupiterVelocity = 13.05;
		this.SaturnVelocity = 9.64;
		this.UranusVelocity = 6.81;
		this.NeptuneVelocity = 5.43;

		this.initializeScene();
		this.initializeStars();

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

		/*this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
		this.scene.fogDensity = 0.01;
		this.scene.fogColor = new BABYLON.Color3(0, 0, 0);*/

		this.devCamera = new BABYLON.FlyCamera("DevCamera", new BABYLON.Vector3(0, 0, -40), this.scene);
		this.devCamera.attachControl(this.canvas, true);

		this.devCamera.position = new BABYLON.Vector3(0, 220, 0);
		this.devCamera.rotation.x = Math.PI / 2;

		this.devCamera.fov = 0.5;

		this.scene.clearColor = new BABYLON.Color3(0,0,0).toLinearSpace();

	}

	initializeStars(){

		this.createUniverseBox();

		this.initSun();
		this.initEarth();
		this.initMars();
		this.initVenus();
		this.initMercury();
		this.initJupiter();
		this.initSaturn();
		this.initUranus();
		this.initNeptune();

		//this.adjustProportion();

		//this.initKuilperBelt();

		this.controlAtmospheres();
		//this.createShadows();

		this.createOrbits();

		this.animateCamera();

	}

	initSun(){

		let sunMaterial = new BABYLON.StandardMaterial('sunMaterial', this.scene);
		sunMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Sun/surface.jpg', this.scene);
		//sunMaterial.distortionTexture = new BABYLON.Texture(__dirname + './../textures/Sun/distortion.png', this.scene);
		//sunMaterial.opacityTexture = new BABYLON.Texture(__dirname + './../textures/Sun/opacity.png', this.scene);

		sunMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
		sunMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
		sunMaterial.linkEmissiveWithDiffuse = true;
		//sunMaterial.speed = 0.15;

		this.sun = new BABYLON.MeshBuilder.CreateSphere('sun', {diameter: this.SunSize}, this.scene);


		// Glow Effect
		/*let glowEffect = new BABYLON.GlowLayer("glow", this.scene, {mainTextureFixedSize: 256, blurKernelSize: 128, mainTextureSamples: 4});

		glowEffect.intensity = 2.2;
		glowEffect.addIncludedOnlyMesh(this.sun);*/

		this.sun.material = sunMaterial;

		//this.sunLight = new BABYLON.PointLight('sunLight', new BABYLON.Vector3(0,0,0), this.scene);
		//this.sunLight.intensity = 100;

		//this.sun.renderingGroupId = 20;

		//let vls = new BABYLON.VolumetricLightScatteringPostProcess('vls', { postProcessRatio: 1.0, passRatio: 1.0 }, this.devCamera, this.sun, 75, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.engine, false, this.scene);
		//vls.useDiffuseColor = true;

		/*let sunParticles = new BABYLON.GPUParticleSystem('sunParticles', {capacity: 1000}, this.scene);
		sunParticles.particleTexture = new BABYLON.Texture(__dirname + './../textures/Sun/particle.jpg', this.scene);

		sunParticles.emitter = this.sun;

		sunParticles.minScaleY = 1.6;
		sunParticles.maxScaleY = 2.0;
		sunParticles.minScaleX = 1.3;
		sunParticles.maxScaleX = 2.6;

		sunParticles.minAngularSpeed = 0;
		sunParticles.maxAngularSpeed = Math.PI;

		sunParticles.emitRate = 100;

		sunParticles.direction1 = new BABYLON.Vector3(-8, -8, -8);
		sunParticles.direction2 = new BABYLON.Vector3(8, 8, 8);

		sunParticles.start();*/

	}

	initEarth(){

		let texturePath = (__dirname + './../textures/Earth/surface.jpg');
		let normalPath = (__dirname + './../textures/Earth/normal.jpg');
		let cloudsTexture = (__dirname + './../textures/Earth/clouds.jpg');

		this.createPlanet(
			'earth', 
			this.EarthSize, 
			texturePath,
			new BABYLON.Vector3(this.EarthDistance, 0, 0),
			normalPath,
			cloudsTexture
		);

		this.createMoon('moon', this.MoonSize, (__dirname + './../textures/Moon/surface.jpg'), this.planets['earth'], 0.015);

	}

	initMars(){

		let texturePath = (__dirname + './../textures/Mars/surface.jpg');
		let normalPath = (__dirname + './../textures/Mars/normal.jpg');
		let cloudsTexture = (__dirname + './../textures/Earth/clouds.jpg');

		this.createPlanet('mars', 
			this.MarsSize, 
			texturePath,
			new BABYLON.Vector3(this.MarsDistance, 0, 0), 
			normalPath,
			cloudsTexture
		);

	}

	initVenus(){

		let texturePath = (__dirname + './../textures/Venus/surface.jpg');
		let normalPath = (__dirname + './../textures/Venus/normal.jpg');
		let atmosphere = (__dirname + './../textures/Venus/atmosphere.jpg');

		this.createPlanet('venus', 
			this.VenusSize, 
			texturePath,
			new BABYLON.Vector3(this.VenusDistance, 0, 0),
			normalPath,
			atmosphere
		);

	}

	initJupiter(){
		
		let texturePath = (__dirname + './../textures/Jupiter/surface.jpg');
		this.createPlanet('jupiter',
			this.JupiterSize,
			texturePath,
			new BABYLON.Vector3(this.JupiterDistance, 0, 0)
		);

		for (let i = 0; i <= 10; i++) {

			let distance = Math.random() * 8.5;
			
			this.createMoon('jupiterMoon'+i, (Math.random() * 0.5), (__dirname + './../textures/Moon/surface.jpg'), this.planets['jupiter'], (Math.random() * 0.02), new BABYLON.Vector3(distance, 0, 0));

		}

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
			new BABYLON.Vector3(this.SaturnDistance, 0, 0),
			normalPath
		);

		let saturnRing = new BABYLON.MeshBuilder.CreateTorus("saturnRing", {thickness: 0.9, tessellation: 96, diameter: 6}, this.scene);
    	saturnRing.scaling = new BABYLON.Vector3(1, 0.1, 1);

    	let ringMaterial = new BABYLON.StandardMaterial('saturnRingMat', this.scene);
    	ringMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Saturn/ring1.png', this.scene);
    	ringMaterial.emissiveColor = new BABYLON.Color3(1,1,1);

    	saturnRing.material = ringMaterial;
    	saturnRing.position = this.planets['saturn'].position;

    	this.scene.registerBeforeRender(()=>{

			saturnRing.rotation.y += 0.01;

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
		);

	}

	initNeptune(){

		let texturePath = (__dirname + './../textures/Neptune/surface.jpg');
		let normalPath = (__dirname + './../textures/Neptune/normal.jpg');
		this.createPlanet('neptune',
			this.NeptuneSize,
			texturePath,
			new BABYLON.Vector3(this.NeptuneDistance, 0, 0),
			normalPath
		);

	}

	createPlanet(name, size, texturePath, position, normal = null, atmosphere = null){

		this.planets[name] = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);

		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);

		if (normal) {
			mat.bumpTexture = new BABYLON.Texture(normal, this.scene);
			//mat.bumpTexture.level = 100;
		}

		if (atmosphere) {
			mat.lightmapTexture = new BABYLON.Texture(atmosphere, this.scene);

			this.scene.registerBeforeRender(()=>{

				this.planets[name].material.lightmapTexture.uOffset -= 0.0001;
				this.planets[name].material.lightmapTexture.vOffset -= 0.0001;

			});

		}

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);
		//mat.ambientColor = new BABYLON.Vector3(1,1,1);
		//mat.diffuseColor = new BABYLON.Color3(1,1,1);

		/*mat.useParallax = true;
		mat.useParallaxOcclusion = true;
		mat.parallaxScaleBias = 0.1;
		mat.specularPower = 1000;
		mat.specularColor = new BABYLON.Color3(0.2,0.2,0.2);*/

		this.planets[name].material = mat;
		this.planets[name].position = position;
		this.planets[name].receiveShadows = true;

		this.planets[name].addLODLevel(1200, null);

		//this.planets[name].renderingGroupId = 10;

		/**/this.scene.registerBeforeRender(()=>{

			this.planets[name].rotation.y += 0.001;

		});

	}

	createMoon(name, size, texturePath, parent, velocity, distanceFromPlanet = new BABYLON.Vector3(3.5,0,0)){

		let moon = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);
		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);
		mat.bumpTexture = new BABYLON.Texture((__dirname + './../textures/Moon/normal.jpg'), this.scene);

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);

		moon.material = mat;
		moon.position = distanceFromPlanet;
		moon.parent = parent;

		moon.addLODLevel(500, null);

		//moon.renderingGroupId = 5;

		if (this.highlightMeshes) {
	    	this.highlightMeshes.addExcludedMesh(moon);
	    }

		let alpha = 0;

		this.scene.registerBeforeRender(()=>{

	        moon.position.x = 2.5 * Math.cos(alpha);
	        moon.position.z = 2.5 * Math.sin(alpha);
	        alpha += velocity;

	        moon.rotation.y += 0.000001;

	    });

	}

	initKuilperBelt(){

		/*let asteroid = new BABYLON.MeshBuilder.CreateSphere('asteroidModel', {diameter: 0.1}, this.scene);
		let asteroidMaterial = new BABYLON.StandardMaterial('asteroidMaterial', this.scene);
		asteroidMaterial.emissiveColor = new BABYLON.Color3(1,1,1);
		asteroidMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Asteroid/surface.jpg', this.scene);

		asteroid.material = asteroidMaterial;

		//asteroid.position = new BABYLON.Vector3(10,0,0);

		asteroid.addLODLevel(10, null);

		let distance = 130;
		let alpha = 0;
		let velocity = 0.01;

		for (let i = 0; i <= 5000; i++) {

			switch (i) {

				case 1000:
					distance = 131;
					break;

				case 2000:
					distance = 132;
					break;

				case 3000:
					distance = 133;
					break;

				case 4000:
					distance = 134;
					break;

			}
			
			let newInstance = asteroid.createInstance('asteroid'+i);

			newInstance.position.x = distance * Math.cos(alpha);
		    newInstance.position.z = distance * Math.sin(alpha);
		    alpha += velocity;

		}*/

		let belt = new BABYLON.MeshBuilder.CreateTorus("belt", {thickness: 100, tessellation: 64, diameter: 360}, this.scene);
    	belt.scaling = new BABYLON.Vector3(1, 0.1, 1);

    	let beltMaterial = new BABYLON.StandardMaterial('beltMat', this.scene);
    	beltMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/KuiperBelt/belt3.png', this.scene);
    	beltMaterial.opacityTexture = new BABYLON.Texture(__dirname + './../textures/KuiperBelt/belt3.png', this.scene);
    	beltMaterial.emissiveColor = new BABYLON.Color3(1,1,1);

    	belt.material = beltMaterial;
    	belt.position = this.sun.position;

    	this.scene.registerBeforeRender(()=>{

			belt.rotation.y += 0.01;

		});

	}

	controlAtmospheres(){

		this.highlightMeshes = new BABYLON.HighlightLayer('hl', this.scene);
		this.highlightMeshes.outerGlow = true;
		this.highlightMeshes.innerGlow = false;

		this.highlightMeshes.blurHorizontalSize = 0.2;
		this.highlightMeshes.blurVerticalSize = 0.2;

		this.highlightMeshes.addMesh(this.planets['earth'], new BABYLON.Color3(0, 0.5, 0.6));
		this.highlightMeshes.addMesh(this.planets['mars'], new BABYLON.Color3(0.7, 0.5, 0));
		this.highlightMeshes.addMesh(this.planets['venus'], new BABYLON.Color3(0.8, 0.6, 0));

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

		//universeBox.renderingGroupId = 0;

	}

	createShadows(){

		/*this.scene.registerBeforeRender(()=>{

			this.sunLight.shadowMinZ -= 0.0001;
			this.sunLight.shadowMaxZ -= 0.0001;

		});*/

		this.shadowGenerator = new BABYLON.ShadowGenerator(256, this.sunLight);

		this.sun.receiveShadows = false;
		this.shadowGenerator.transparencyShadow = false;
		this.shadowGenerator.setDarkness(0.01);
		//this.shadowGenerator.usePoissonSampling = true;
		//this.shadowGenerator.useExponentialShadowMap = true;
		//this.shadowGenerator.useBlurExponentialShadowMap = true;
		//this.shadowGenerator.useKernelBlur = true;
		//this.shadowGenerator.blurKernel = 16;
		this.shadowGenerator.bias = 0.00005;

		this.shadowGenerator.forceBackFacesOnly = true;
		this.shadowGenerator.frustumEdgeFalloff = 1.0;

		//this.shadowGenerator.bias = 0.001;
		//this.shadowGenerator.normalBias = 0.02;
		//this.sunLight.shadowMaxZ = 100;
		//this.sunLight.shadowMinZ = 10;
		//this.shadowGenerator.useContactHardeningShadow = true;
		//this.shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;

		/*let testBox = new BABYLON.MeshBuilder.CreateBox('box', {size: 1}, this.scene);
		testBox.material = new BABYLON.StandardMaterial('materialbox', this.scene);
		testBox.material.diffuseColor = new BABYLON.Color3.Red();
		testBox.material.emissiveColor = new BABYLON.Color3.Red();
		testBox.position = new BABYLON.Vector3(10,0,0);

		this.shadowGenerator.getShadowMap().renderList.push(testBox);*/

		for(let name in this.planets){

			this.shadowGenerator.getShadowMap().renderList.push(this.planets[name]);
			//this.shadowGenerator.addShadowCaster(this.planets[name]);

		}

	}

	adjustProportion(){

		/*
			100 mil KM = 1 Unidade

			// O diâmetro deve ser aumentado para melhor visualização

			Sol = 13.927
			Terra = 0.127
			Lua = 0.034
			Mercúrio = 0.048
			Vênus = 0.121
			Marte = 0.067
			Júpiter = 1.398
			Saturno = 1.164
			Uranu = 0.507
			Netuno = 0.492
	
			// A distância deve ser diminuída para melhor visualização
	
			mercúrio => sol
			579.1

			venus => sol
			1082

			terra => sol
			1496

			terra => lua
			3.844

			marte => sol
			2279.4

			jupiter => sol
			7783.3

			saturno => sol
			14294

			urano => sol
			28709.9

			netuno => sol
			45043

			Plutão => sol
			59135.2


		*/

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
						xValue = this.MercuryDistance;
						zValue = this.MercuryDistance;
						velocity = (this.MercuryVelocity / 10000) * -1;
						break;

					case 'venus':
						alpha = 0;
						velocity = 0;
						xValue = this.VenusDistance;
						zValue = this.VenusDistance;
						velocity = (this.VenusVelocity / 10000) * -1;
						break;

					case 'earth':
						alpha = 0;
						velocity = 0;
						xValue = this.EarthDistance;
						zValue = this.EarthDistance;
						velocity = (this.EarthVelocity / 10000) * -1;
						break;

					case 'mars':
						alpha = 0;
						velocity = 0;
						xValue = this.MarsDistance;
						zValue = this.MarsDistance;
						velocity = (this.MarsVelocity / 10000) * -1;
						break;

					case 'jupiter':
						alpha = 0;
						velocity = 0;
						xValue = this.JupiterDistance;
						zValue = this.JupiterDistance;
						velocity = (this.JupiterVelocity / 10000) * -1;
						break;

					case 'saturn':
						alpha = 0;
						velocity = 0;
						xValue = this.SaturnDistance;
						zValue = this.SaturnDistance;
						velocity = (this.SaturnVelocity / 10000) * -1;
						break;

					case 'uranus':
						alpha = 0;
						velocity = 0;
						xValue = this.UranusDistance;
						zValue = this.UranusDistance;
						velocity = (this.UranusVelocity / 10000) * -1;
						break;

					case 'neptune':
						alpha = 0;
						velocity = 0;
						xValue = this.NeptuneDistance;
						zValue = this.NeptuneDistance;
						velocity = (this.NeptuneVelocity / 10000) * -1;
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

	animateCamera(){

		this.devCamera.rotation.x = (Math.PI * 2);
		this.devCamera.rotation.y = Math.PI / 2;

		let velocity = 0.5;

		this.scene.registerBeforeRender(()=>{

			if (this.devCamera.position.y > 2.0) {

				this.devCamera.position.y -= velocity;
				
			} else {

				velocity = 2.5;

			}

			if (this.devCamera.position.y <= 2.5) {

				if (this.devCamera.position.x <= (this.MercuryDistance - 2) && this.devCamera.position.x >= (this.MercuryDistance - 5)) {

					velocity = 0.006;
					this.devCamera.position.z += 0.06;
					this.devCamera.setTarget(this.planets['mercury'].position);


				} else if (this.devCamera.position.x <= (this.VenusDistance - 2) && this.devCamera.position.x >= (this.VenusDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.1;
					this.devCamera.setTarget(this.planets['venus'].position);


				} else if (this.devCamera.position.x <= (this.EarthDistance - 2) && this.devCamera.position.x >= (this.EarthDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.13;
					this.devCamera.setTarget(this.planets['earth'].position);


				} else if (this.devCamera.position.x <= (this.MarsDistance - 2) && this.devCamera.position.x >= (this.MarsDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.14;
					this.devCamera.setTarget(this.planets['mars'].position);


				} else if (this.devCamera.position.x <= (this.JupiterDistance - 2) && this.devCamera.position.x >= (this.JupiterDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.27;
					this.devCamera.setTarget(this.planets['jupiter'].position);


				} else if (this.devCamera.position.x <= (this.SaturnDistance - 2) && this.devCamera.position.x >= (this.SaturnDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.5;
					this.devCamera.setTarget(this.planets['saturn'].position);


				} else if (this.devCamera.position.x <= (this.UranusDistance - 2) && this.devCamera.position.x >= (this.UranusDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.5;
					this.devCamera.setTarget(this.planets['uranus'].position);


				} else if (this.devCamera.position.x <= (this.NeptuneDistance - 2) && this.devCamera.position.x >= (this.NeptuneDistance - 5)) {
					
					velocity = 0.006;
					this.devCamera.position.z += 0.75;
					this.devCamera.setTarget(this.planets['neptune'].position);


				} else {

					this.devCamera.rotation.x = (Math.PI * 2);
					this.devCamera.rotation.y = Math.PI / 2;
					this.devCamera.position.z = 2.5;

				}

				if (this.devCamera.position.x >= this.NeptuneDistance) {
					velocity = 0;
					this.eventsController.emit('presentation-ended');
				}

				this.devCamera.position.x += velocity;

			}

		});

	}

}

module.exports = AppController;