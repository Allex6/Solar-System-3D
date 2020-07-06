const {FireMaterial} = require('babylonjs-materials');
//require('babylonjs-procedural-textures');

//console.log(BABYLON.FireMaterial);

class AppController {

	constructor(){

		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

		this.planets = {};

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
		/*this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
		this.scene.fogDensity = 0.01;
		this.scene.fogColor = new BABYLON.Color3(0, 0, 0);*/

		this.devCamera = new BABYLON.FlyCamera("DevCamera", new BABYLON.Vector3(0, 0, -40), this.scene);
		this.devCamera.attachControl(this.canvas, true);

		this.scene.clearColor = new BABYLON.Color3(0,0,0).toLinearSpace();

	}

	initializeStars(){

		this.initSun();
		this.initEarth();
		this.initMars();
		this.initVenus();
		this.initMercury();
		this.initJupiter();
		this.initSaturn();
		this.initUranus();
		this.initNeptune();

		//this.initKuilperBelt();

		this.controlAtmospheres();

		for(let name in this.planets){

			// Rotação dos planetas
			let alpha = 0;
			let velocity = 0;
			let xValue = 0;
			let zValue = 0;

			switch (name) {

				case 'mercury':
					alpha = 0;
					velocity = 0;
					xValue = 20;
					zValue = 20;
					velocity = 0.009;
					break;

				case 'earth':
					alpha = 0;
					velocity = 0;
					xValue = 50;
					zValue = 50;
					velocity = 0.0058;
					break;

				case 'mars':
					alpha = 0;
					velocity = 0;
					xValue = 65;
					zValue = 65;
					velocity = 0.005;
					break;

				case 'venus':
					alpha = 0;
					velocity = 0;
					xValue = 35;
					zValue = 35;
					velocity = 0.007;
					break;
					
				case 'jupiter':
					alpha = 0;
					velocity = 0;
					xValue = 80;
					zValue = 80;
					velocity = 0.004;
					break;

				case 'saturn':
					alpha = 0;
					velocity = 0;
					xValue = 95;
					zValue = 95;
					velocity = 0.0035;
					break;

				case 'uranus':
					alpha = 0;
					velocity = 0;
					xValue = 110;
					zValue = 110;
					velocity = 0.003;
					break;

				case 'neptune':
					alpha = 0;
					velocity = 0;
					xValue = 125;
					zValue = 125;
					velocity = 0.0025;
					break;

			}
			
		    this.scene.registerBeforeRender(()=>{

		        this.planets[name].position.x = xValue * Math.cos(alpha);
		        //this.planets[name].position.y = 0;
		        this.planets[name].position.z = zValue * Math.sin(alpha);
		        alpha += velocity;

		    });

		}

	}

	initSun(){

		let sunMaterial = new FireMaterial('sunMaterial', this.scene);
		sunMaterial.diffuseTexture = new BABYLON.Texture(__dirname + './../textures/Sun/parti2.jpg', this.scene);
		sunMaterial.distortionTexture = new BABYLON.Texture(__dirname + './../textures/Sun/distortion.png', this.scene);
		//sunMaterial.opacityTexture = new BABYLON.Texture(__dirname + './../textures/Sun/opacity.png', this.scene);

		sunMaterial.emissiveColor = new BABYLON.Color3(1, 0.8, 0.8);
		sunMaterial.speed = 0.15;

		this.sun = new BABYLON.MeshBuilder.CreateSphere('sun', {diameter: 15}, this.scene);


		// Glow Effect
		let glowEffect = new BABYLON.GlowLayer("glow", this.scene, {mainTextureFixedSize: 256, blurKernelSize: 128, mainTextureSamples: 4});

		glowEffect.intensity = 2.2;
		glowEffect.addIncludedOnlyMesh(this.sun);

		this.sun.material = sunMaterial;

		let vls = new BABYLON.VolumetricLightScatteringPostProcess('vls', { postProcessRatio: 1.0, passRatio: 1.0 }, this.devCamera, this.sun, 100, BABYLON.Texture.BILINEAR_SAMPLINGMODE, this.engine, false, this.scene);


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

		let texturePath = (__dirname + './../textures/Earth/earth2.jpg');
		this.createPlanet('earth', 2.5, texturePath, new BABYLON.Vector3(50, 0, 0));
		this.createMoon('moon', 0.5, (__dirname + './../textures/Moon/surface.jpg'), this.planets['earth'], 0.015);

	}

	initMars(){

		let texturePath = (__dirname + './../textures/Mars/surface.jpg');
		this.createPlanet('mars', 1.5, texturePath, new BABYLON.Vector3(65, 0, 0));

	}

	initVenus(){

		let texturePath = (__dirname + './../textures/Venus/surface.jpg');
		this.createPlanet('venus', 2.4, texturePath, new BABYLON.Vector3(35, 0, 0));

	}

	initJupiter(){
		
		let texturePath = (__dirname + './../textures/Jupiter/surface.jpg');
		this.createPlanet('jupiter', 3.5, texturePath, new BABYLON.Vector3(80, 0, 0));

		for (let i = 0; i <= 10; i++) {

			let distance = Math.random() * 8.5;
			
			this.createMoon('jupiterMoon'+i, (Math.random() * 0.5), (__dirname + './../textures/Moon/surface.jpg'), this.planets['jupiter'], (Math.random() * 0.02), new BABYLON.Vector3(distance, 0, 0));

		}

	}

	initMercury(){

		let texturePath = (__dirname + './../textures/Mercury/surface.jpg');
		this.createPlanet('mercury', 1.0, texturePath, new BABYLON.Vector3(20, 0, 0));

	}

	initSaturn(){

		let texturePath = (__dirname + './../textures/Saturn/surface.jpg');
		this.createPlanet('saturn', 3.0, texturePath, new BABYLON.Vector3(95, 0, 0));

	}

	initUranus(){

		let texturePath = (__dirname + './../textures/Uranus/surface.jpg');
		this.createPlanet('uranus', 2.0, texturePath, new BABYLON.Vector3(110, 0, 0));

	}

	initNeptune(){

		let texturePath = (__dirname + './../textures/Neptune/surface.jpg');
		this.createPlanet('neptune', 2.0, texturePath, new BABYLON.Vector3(125, 0, 0));

	}

	createPlanet(name, size, texturePath, position){

		this.planets[name] = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);

		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);

		this.planets[name].material = mat;
		this.planets[name].position = position;

		this.planets[name].addLODLevel(500, null);

		this.scene.registerBeforeRender(()=>{

			this.planets[name].rotation.y += 0.01;

		});

	}

	createMoon(name, size, texturePath, parent, velocity, distanceFromPlanet = new BABYLON.Vector3(3.5,0,0)){

		let moon = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);
		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);

		moon.material = mat;
		moon.position = distanceFromPlanet;
		moon.parent = parent;

		moon.addLODLevel(500, null);

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

		let asteroid = new BABYLON.MeshBuilder.CreateSphere('asteroidModel', {diameter: 0.1}, this.scene);
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

		}

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

}

module.exports = AppController;