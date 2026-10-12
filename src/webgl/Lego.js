import { CylinderGeometry, Mesh, MeshPhongMaterial, BoxGeometry, Object3D , MeshNormalMaterial} from 'three';


export default class Lego extends Object3D {
    constructor(options = {}) {
        super();

        this.size = Math.max(options.size, 1);

        this.addLegoBox = this.createBox();
        this.addLegoCylinder1 = this.createCylinders();

    }

    createBox() {
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);

        mesh.scale.x = this.size;

        mesh.position.x = (this.size - 1) / 2;

        this.add(mesh);

        return mesh;
    }

    createCylinders(){
        const cylinders = [];

        for (let i = 1; i <= this.size; i++) {
            const cylinder = this.createCylinder();
            cylinder.position.x = i - 1;
        }

        return cylinders;
    }

    createCylinder() {
        const geometry = new CylinderGeometry(1, 1, 1, 32, 1);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);

        mesh.scale.set(0.2, 0.3, 0.2);
        mesh.position.y = 0.5;

        this.add(mesh);

        return mesh;
    }
    

}
