import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

// renderer.setClearColor(0xFFEA00)

const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars
])

const sphere2Geometry = new THREE.SphereGeometry(2)
const sphere2Material = new THREE.MeshBasicMaterial({
  map: textureLoader.load(nebula)
})
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material)
scene.add(sphere2)
sphere2.position.set(5, 5, -10)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(8)
scene.add(axesHelper)
const gridHelper = new THREE.GridHelper(20)
scene.add(gridHelper)

camera.position.set(0, 2, 8)
orbit.update()

const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00})
const box = new THREE.Mesh(boxGeometry, boxMaterial)

scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(20, 20)
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF, 
  side: THREE.DoubleSide})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true

const sphereGeometry = new THREE.SphereGeometry(2)
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff,
  wireframe: false
})
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 5, 0)
sphere.castShadow = true

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xFFFFF, 0.8)
// scene.add(directionalLight)
// directionalLight.position.set(-10, 10, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -12

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

const spotLight = new THREE.SpotLight(0xFFFFFF)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = 0.2

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

// scene.fog = new THREE.Fog(0xFFFFFF, 0 , 200)
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

const gui = new dat.GUI()

let options = {
  sphereColor: '#ffea00',
  wireframe: false,
  speed: 0.02,
  angle: 0,
  penumbra: 0,
  intensity: 1
}

gui.addColor(options, 'sphereColor').onChange((e) => {
  sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange((e) => {
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 0.1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)

let step = 0

const animate = (time) => {
  box.rotation.x = time / 1000
  box.rotation.y = time / 1000

  step += options.speed
  sphere.position.y = 10 * Math.abs(Math.sin(step))

  spotLight.angle = options.angle
  spotLight.penumbra = options.penumbra
  spotLight.intensity = options.intensity
  sLightHelper.update()

  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)