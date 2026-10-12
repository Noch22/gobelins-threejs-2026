import { WebGLRenderer, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, AmbientLight, DirectionalLight, MeshPhongMaterial, DirectionalLightHelper, CylinderGeometry, PlaneGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { Pane } from 'tweakpane';
import Lego from './Lego.js';

export default class WebGLApplication {
    constructor() {
        console.log("WebGLApplication constructor called");

        this.renderWidth = window.innerWidth;
        this.renderHeight = window.innerHeight;

        this.renderer = this.createRenderer();
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.lights = this.createLight();
        this.floor = this.createFloor();
        
        // this.mesh = this.createMesh();
        // this.cylinder = this.createCylinder(0.5, 0.6);
        // this.cylinder2 = this.createCylinder(-0.5, 0.6);

        this.lego = this.createLego();

        this.debugger = this.createDebugger();


        this.resize();

        this.setupEventListeners();
    }

    createRenderer() {
        const renderer = new WebGLRenderer({
            canvas: document.querySelector('canvas'),
        });


        return renderer;
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera() {
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        camera.position.z = 5;

        return camera;
    }

    updateCameraPosition() {
        this.camera.position.set(0, 0, 5);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    createMesh() {
        const geometry = new BoxGeometry(2, 1, 1);
        const material = new MeshPhongMaterial({ color: 'white' });
        const mesh = new Mesh(geometry, material);

        this.scene.add(mesh);

        return mesh;
    }

    createCylinder(x, y) {
        const geometry = new CylinderGeometry(0.25, 0.25, 0.25);
        const material = new MeshPhongMaterial({ color: 'white' });
        const cylinder = new Mesh(geometry, material);

        cylinder.position.y = y;
        cylinder.position.x = x;

        this.scene.add(cylinder);

        return cylinder;
    }

    createLight() {
        const lights = {};

        lights.ambient = new AmbientLight(0xffffff, 1);
        lights.directional = new DirectionalLight(0xffffff, 1);
        lights.directional.position.x = 10;
        lights.directional.position.y = 10;
        lights.directional.target.position.set(0, 0, 0);

        lights.directional.helper = new DirectionalLightHelper(lights.directional, 1, 0xff0000);
        lights.directional.controls = new TransformControls(this.camera, this.renderer.domElement);
        lights.directional.controls.attach(lights.directional);

        this.scene.add(lights.directional.controls.getHelper());
        this.scene.add(lights.ambient);
        this.scene.add(lights.directional);
        this.scene.add(lights.directional.helper);

        return lights;
    }

    createLego() {
        const lego = new Lego({
            size: 5,
            color: 'red',
        })

        this.scene.add(lego);

        return lego;
    }

    createFloor() {
        const geometry = new PlaneGeometry(1, 1, 1);
        const material = new MeshPhongMaterial();
        const floor = new Mesh(geometry, material);


        floor.scale.set(10, 10, 10);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.5;
        
        this.scene.add(floor);

        return floor;

    }

    createControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        const savedCameraPosition = JSON.parse(sessionStorage.getItem('cameraPosition'));
        const savedControlsTarget = JSON.parse(sessionStorage.getItem('controlsTarget'));

        if (savedCameraPosition && savedControlsTarget) {
        this.camera.position.set(savedCameraPosition.x, savedCameraPosition.y, savedCameraPosition.z);
        controls.target.set(savedControlsTarget.x, savedControlsTarget.y, savedControlsTarget.z);
        controls.update();
        }

        return controls;
    }

    resize() {
        this.renderer.setSize(this.renderWidth, this.renderHeight);
        this.camera.aspect = this.renderWidth / this.renderHeight;
        this.camera.updateProjectionMatrix();
    }

    update() {

    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.resizeHandler.bind(this));
        this.controls.addEventListener('change', this.controlsChangeHandler.bind(this));
        this.lights.directional.controls.addEventListener('change', this.lightsControlsChangeHandler.bind(this));

        this.tickHandler();
    }

    resizeHandler () {
        this.renderWidth = window.innerWidth;
        this.renderHeight = window.innerHeight;

        this.resize();
    }

    tickHandler() {
        window.requestAnimationFrame(this.tickHandler.bind(this));

        this.update();
        this.render();

    }

    controlsChangeHandler() {
        sessionStorage.setItem('cameraPosition', JSON.stringify(this.camera.position));
        sessionStorage.setItem('controlsTarget', JSON.stringify(this.controls.target));
    }

    lightsControlsChangeHandler() {
        this.lights.directional.target.position.set(0, 0, 0);
        this.lights.directional.helper.update();
    }

    createDebugger() {
        const pane = new Pane({ title: "WebGL App"});

        const cameraFolder = pane.addFolder({ title: "Camera" });

        const cameraChangeHandler = () => {
            this.camera.updateProjectionMatrix();
        };

        cameraFolder.addBinding(this.camera, 'fov', {min: 15, max: 100}).on('change',
            cameraChangeHandler
        );

        cameraFolder.addBinding(this.camera, 'near', {min: 0.1, max: 100}).on('change',
            cameraChangeHandler
        );

        cameraFolder.addBinding(this.camera, 'far', {min: 1, max: 1000}).on('change',
            cameraChangeHandler
        );

        cameraFolder.addBinding(this.controls, 'enabled')

        cameraFolder.addButton({ title: "Reset Camera" }).on('click', () => {
            sessionStorage.removeItem('cameraPosition');
            sessionStorage.removeItem('controlsTarget');
            this.updateCameraPosition();
        });

        return pane 
    }

}