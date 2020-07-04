const {FireMaterial} = require('babylonjs-materials');
//require('babylonjs-procedural-textures');

//console.log(BABYLON.FireMaterial);

class AppController {

	constructor(){

		this.canvas = document.getElementById("renderCanvas");
		this.engine = new BABYLON.Engine(this.canvas, true);

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

		// Glow Effect
		this.glowEffect = new BABYLON.GlowLayer("glow", this.scene, {mainTextureFixedSize: 256, blurKernelSize: 128, mainTextureSamples: 4});

		this.glowEffect.intensity = 2.2;



		/*		EXEMPLO 02		*/

		/*let ground = new BABYLON.Mesh.CreateGround('ground', 512, 512, 32, scene);

		let waterMaterial = new BABYLON.WaterMaterial('waterMaterial', scene);
		waterMaterial.bumpTexture = new BABYLON.Texture('https://1.bp.blogspot.com/-RkeeOAt_YJY/V2HQdu89ntI/AAAAAAAARGc/1EbHUE27Wn4mQxilNqejG8V8gxntjOpnACLcB/s1600/seamles_white_plaster_stucco_texture.jpg-displacement.jpg', scene);

		ground.material = waterMaterial;

		waterMaterial.windForce = 180; // Represents the wind force applied on the water surface
		waterMaterial.waveHeight = 1.3; // Represents the height of the waves
		waterMaterial.bumpHeight = 1.3; // According to the bump map, represents the pertubation of reflection and refraction
		
		waterMaterial.waterColor = new BABYLON.Color3(0.0, 0.2, 0.2); // Represents the water color mixed with the reflected and refracted world
		waterMaterial.waveLength = 0.1; // The lenght of waves. With smaller values, more waves are generated

		*/

		/*		EXEMPLO 02		*/


		/*		EXEMPLO 03		*/

		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

		light.diffuse = new BABYLON.Color3(1, 1, 1);


		let sphere2 = new BABYLON.MeshBuilder.CreateSphere('sphere2', {diameter: 1}, scene);
		sphere2.material = new BABYLON.StandardMaterial('sphere2Material', scene);
		sphere2.position = new BABYLON.Vector3(0,0,-2.5);
		sphere2.material.emissiveColor = new BABYLON.Color3(0.5,0,0.5);


		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);
		sphere.material = new BABYLON.StandardMaterial('sphereMaterial', scene);

		sphere.material.reflectionFresnelParameters = new BABYLON.FresnelParameters();


		sphere.material.reflectionFresnelParameters.leftColor = BABYLON.Color3.Black();
		sphere.material.reflectionFresnelParameters.rightColor = BABYLON.Color3.White();
		sphere.material.reflectionFresnelParameters.power = 10;*/


		// O material precisa ser reflexivo, aparentemente. no .txt tem dois exemplos completos.



		/*		EXEMPLO 03		*/


		/*		EXEMPLO 04		*/


		/*let light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 2, 0), scene);

		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let path = [];
		let p1 = new BABYLON.Vector3(-1, 0, 0);
		let p2 = new BABYLON.Vector3(0, 1, 0);
		let p3 = new BABYLON.Vector3(0, 1, 5);
		let p4 = new BABYLON.Vector3(1, 0, 0);
		path.push(p1);
		path.push(p2);
		path.push(p3);
		path.push(p4);
		path.push(p1);

		let mat = new BABYLON.StandardMaterial('ribbonMat', scene);
		mat.alpha = 1.0;
		mat.emissiveColor = new BABYLON.Color3(0.5, 0.5, 1.0);
		mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
		mat.backFaceCulling = false;

		/*let mat = new BABYLON.FireMaterial('fireMaterial', scene);
		mat.diffuseTexture = new BABYLON.Texture("fire-diffuse.jpg", scene);
		mat.distortionTexture = new BABYLON.Texture("distortion-texture.png", scene);
		mat.opacityTexture = new BABYLON.Texture("opacity-texture.png", scene);
		//mat.emissiveColor = new BABYLON.Color3(1,1,0);*/

		/*let ribbon = BABYLON.MeshBuilder.CreateRibbon('Ribbon', {pathArray: [path], offset: 10}, scene);
		ribbon.material = mat;


		let gl = new BABYLON.GlowLayer("glow", scene, {mainTextureFixedSize: 256, blurKernelSize: 256, mainTextureSamples: 4});

		gl.addIncludedOnlyMesh(ribbon);
		gl.intensity = 1;

		// A função abaixo serve para mudar a cor de acordo com o objeto

		/*gl.customEmissiveColorSelector = function(mesh, subMesh, material, result) {
		    if (mesh.name === "Ribbon" || mesh.name == "ribbonMat") {
		        result.set(0, 1, 1, 1);
		        // COR
		    } else {
		        result.set(0, 0, 0, 0);
		    }
		}*/


		/*		EXEMPLO 04		*/


		/*		EXEMPLO 05		*/



		/*let light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 2, 0), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let particleSystem = new BABYLON.GPUParticleSystem('particles', {capacity: 2000}, scene);
		particleSystem.particleTexture = new BABYLON.Texture('./fire-diffuse-rounded.png', scene);

		particleSystem.emitter = new BABYLON.Vector3.Zero();

		//particleSystem.minSize = 0.1;
		//particleSystem.maxSize = 0.2;
		particleSystem.addSizeGradient(0, 0.1);
		particleSystem.addSizeGradient(0.1, 0.11);
		particleSystem.addSizeGradient(0.2, 0.12);
		particleSystem.addSizeGradient(0.3, 0.13);
		particleSystem.addSizeGradient(0.4, 0.14);
		particleSystem.addSizeGradient(0.5, 0.15);
		particleSystem.addSizeGradient(0.6, 0.16);
		particleSystem.addSizeGradient(0.7, 0.17);
		particleSystem.addSizeGradient(0.8, 0.18);
		particleSystem.addSizeGradient(0.9, 0.19);
		particleSystem.addSizeGradient(1.0, 0.6);


		particleSystem.emitRate = 500;

		particleSystem.direction1 = new BABYLON.Vector3(-1.5, 2, 1);
		particleSystem.direction2 = new BABYLON.Vector3(1.5, 2, -1);

		//particleSystem.gravity = new BABYLON.Vector3(0, -2.81, 0);

		particleSystem.start(2000);*/



		/*		EXEMPLO 05		*/


		/*		EXEMPLO 06		*/


		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 2, 0), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);

		let mat = new BABYLON.StandardMaterial('sphereMaterial', scene);
		//mat.bumpTexture = new BABYLON.Texture('./normal-map.png', scene);
		//mat.diffuseTexture = new BABYLON.Texture('./fire-diffuse.jpg', scene);

		let texture = new BABYLON.NoiseProceduralTexture("texture", 1024, scene);

		texture.updateURL('./fire-diffuse.jpg');

		texture.octaves = 8;
		texture.brightness = 0.5;
		texture.persistence = 1;
		//texture.animationSpeedFactor = 2;

		mat.diffuseTexture = texture;

		sphere.material = mat;*/


		/*		EXEMPLO 06		*/



		/*		EXEMPLO 07		*/

		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 2, 0), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);

		/*let v = sphere.getVerticesData(BABYLON.VertexBuffer.PositionKind);

		let count = 0;

		scene.registerBeforeRender(function () {

			v[count] = count * 0.2;

			sphere.setVerticesData(BABYLON.VertexBuffer.PositionKind, v);

			count++;

		});*/

		/*sphere.material = new BABYLON.StandardMaterial('sphereMat', scene);
		sphere.material.emissiveColor = new BABYLON.Color3(1,1,1);

		let videoTexture = new BABYLON.VideoTexture('video', './video-sample.mp4', scene, true);
		//let videoTexture = new BABYLON.VideoTexture('video', './Imagine Dragons.mp3', scene, true);

		sphere.material.diffuseTexture = videoTexture;

		scene.onPointerDown = ()=>{
			videoTexture.video.play();
		};*/

		/*		EXEMPLO 07		*/




		/*		EXEMPLO 08		*/


		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 2, 0), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);


		let particleSystem = new BABYLON.GPUParticleSystem('particles', {capacity: 2000}, scene);
		particleSystem.particleTexture = new BABYLON.Texture('./fire-diffuse-rounded.png', scene);

		particleSystem.emitter = sphere;

		//particleSystem.minSize = 0.1;
		//particleSystem.maxSize = 0.2;
		particleSystem.addSizeGradient(0, 0.1);
		particleSystem.addSizeGradient(0.1, 0.11);
		particleSystem.addSizeGradient(0.2, 0.12);
		particleSystem.addSizeGradient(0.3, 0.13);
		particleSystem.addSizeGradient(0.4, 0.14);
		particleSystem.addSizeGradient(0.5, 0.15);
		particleSystem.addSizeGradient(0.6, 0.16);
		particleSystem.addSizeGradient(0.7, 0.17);
		particleSystem.addSizeGradient(0.8, 0.18);
		particleSystem.addSizeGradient(0.9, 0.19);
		particleSystem.addSizeGradient(1.0, 0.6);


		particleSystem.emitRate = 500;

		particleSystem.direction1 = new BABYLON.Vector3(-1.5, 2, 1);
		particleSystem.direction2 = new BABYLON.Vector3(1.5, 2, -1);

		//particleSystem.gravity = new BABYLON.Vector3(0, -2.81, 0);

		particleSystem.start(2000);


		let pipeline = new BABYLON.DefaultRenderingPipeline('defaultPipeline', false, scene, [camera]);

		//MSAA
		pipeline.samples = 8;

		//FXAA
		pipeline.fxaaEnabled = true;

		//SHARPENING
		pipeline.sharpenEnabled = true;
		pipeline.sharpen.edgeAmount = 0.9;
		pipeline.sharpen.colorAmount = 0.9;

		//DEPTH OF FIELD
		pipeline.depthOfFieldEnabled = true;
		pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
		pipeline.depthOfField.focusDistance = 2000;
		pipeline.depthOfField.focalLenght = 50;
		pipeline.depthOfField.fStop = 1.4;

		//BLOOM
		pipeline.bloomEnabled = true;
		pipeline.bloomThreshold = 0.9;
		pipeline.bloomWeight = 0.8;
		pipeline.bloomKernel = 128;
		pipeline.bloomScale = 0.9;

		//IMAGE PROCESSING
		pipeline.imageProcessingEnabled = true;

		//CHROMATIC ABERRATION
		pipeline.chromaticAberrationEnabled = true;
		pipeline.chromaticAberration.aberrationAmount = 600;
		pipeline.chromaticAberration.radialIntensity = 3;

		//GRAIN
		pipeline.grainEnabled = true;
		pipeline.grain.intensity = 100;
		pipeline.grain.animated = true;



		//FOG ----
		scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
		scene.fogDensity = 0.1;*/



		/*		EXEMPLO 08		*/


		/*		EXEMPLO 09		*/


		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 2, 0), scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, scene);

		let music = new BABYLON.Sound('Music', './Believer.mp3', scene, null, {
			autoplay: true,
			loop: false,
			volume: 0.2,
			maxDistance: 200,
			spatialSound: true
		});

		music.attachToMesh(sphere);

		/*scene.registerBeforeRender(()=>{

			sphere.position.z += 0.01;

		});*/

		/*let soundTrack = new BABYLON.SoundTrack(scene);
		soundTrack.AddSound(music);

		let analyzer = new BABYLON.Analyser(scene);
		soundTrack.connectToAnalyser(analyzer);
		analyzer.drawDebugCanvas();

		scene.registerBeforeRender(()=>{

		    let workingArray = analyzer.getByteFrequencyData();
		
		    for (let i = 0; i < analyzer.getFrequencyBinCount() ; i++) {
		        sphere.scaling.y =  workingArray[i] / 40;
		        sphere.scaling.x =  workingArray[i] / 40;
		        sphere.scaling.z =  workingArray[i] / 40;
		    }

		});


		/*		EXEMPLO 09		*/


		/*		EXEMPLO 10		*/

		/*let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 2, 0), this.scene);
		light.diffuse = new BABYLON.Color3(1, 1, 1);

		let sphere = new BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 2}, this.scene);

		//INSPECTOR 

		

		sphere.updateFacetData();
		console.log(sphere.facetNb);
		*/

		/*		EXEMPLO 10		*/

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

		this.glowEffect.addIncludedOnlyMesh(this.sun);

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
		this.createMoon('moon', 0.5, (__dirname + './../textures/Moon/surface.jpg'), this.planets['earth'], 0.009);

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

	}

	createMoon(name, size, texturePath, parent, velocity, distanceFromPlanet = new BABYLON.Vector3(3.5,0,0)){

		let moon = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: size}, this.scene);
		let mat = new BABYLON.StandardMaterial(name+'Material', this.scene);
		mat.diffuseTexture = new BABYLON.Texture(texturePath, this.scene);

		mat.emissiveColor = new BABYLON.Vector3(1,1,1);

		moon.material = mat;
		moon.position = distanceFromPlanet;
		moon.parent = parent;

		let alpha = 0;

		this.scene.registerBeforeRender(()=>{

	        moon.position.x = 2 * Math.cos(alpha);
	        moon.position.z = 2 * Math.sin(alpha);
	        alpha += velocity;

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

}

module.exports = AppController;