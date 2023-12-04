//===============================================================
// Import Library
//===============================================================
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {GUI} from 'dat.gui'
import Stats from 'stats.js'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light1 = new THREE.PointLight(0xffffff, 1000)
light1.position.set(2.5, 2.5, 2.5)
const light2 = new THREE.PointLight(0xffffff, 1000)
light2.position.set(-2.5, 2.5, 2.5)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0.8, 1.4, 1.0)
scene.add(light1)
scene.add(light2)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

const gltfLoader = new GLTFLoader()
const model_file = "../models/neon_genesis_evangelion_unit_01.glb"
THREE.Cache.enabled = true;
THREE.Cache.add("model_eva", model_file);
gltfLoader.load(
    model_file,
    function (gltf) {
        scene.add(gltf.scene);
        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.log("error happens: " + String(error));
    }
)

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
animationsFolder.open()

THREE.Cache.enabled = true;
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}

function render() {
    stats.begin()
    renderer.render(scene, camera)
    stats.end()
}

animate()