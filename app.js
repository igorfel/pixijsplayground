import Keyboard from "./src/GameEngine/keyboard.js"
import CarEngine from "./src/GameEngine/physics/car/index.js"
import InputState from './src/GameEngine/physics/car/InputState.js'
import BlueCarConfig from './src/assets/scripts/BlueCarConfig.js'

let carEngine = new CarEngine(BlueCarConfig)
let inputs = new InputState()

let app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x112233,
  resolution: window.devicePixelRatio || 1
})
document.getElementById("main").appendChild(app.view)
const car_sprite_path = "./src/assets/images/blue_car.json"
const car_actions = {
  idle: "blue_car_idle.png",
  break: "blue_car_breaks.png",
  lights: "blue_car_light.png",
  break_lights: "blue_car_breaks_light.png"
}
let state, car
let controller = {
  up: Keyboard("ArrowUp"),
  right: Keyboard("ArrowRight"),
  down: Keyboard("ArrowDown"),
  left: Keyboard("ArrowLeft"),
  handbrake: Keyboard(" ")
}

app.loader.add(car_sprite_path).load(start)

function setupController() {
  controller.up.press = () => {
    // changeCarTexture(car_actions.lights)
    // CarEngine
    inputs.throttle = 1
  }

  controller.up.release = () => {
    // CarEngine
    inputs.throttle = 0
  }

  controller.down.press = () => {
    // changeCarTexture(car_actions.break_lights)

    // CarEngine
    inputs.brake = 1
  }

  controller.down.release = () => {
    // changeCarTexture(car_actions.lights)

    // CarEngine
    inputs.brake = 0

    if (controller.up.isDown) {
      // CarEngine
      inputs.throttle = 1
    }
  }

  controller.right.press = () => {
    // CarEngine
    inputs.right = 1
    inputs.left = 0
  }

  controller.right.release = () => {
    // CarEngine
    inputs.right = 0
  }

  controller.left.press = () => {
    // CarEngine
    inputs.right = 0
    inputs.left = 1
  }

  controller.left.release = () => {
    // CarEngine
    inputs.left = 0
  }

  controller.handbrake.press = () => {
    // CarEngine
    inputs.ebrake = 1
  }

  controller.handbrake.release = () => {
    // CarEngine
    inputs.ebrake = 0
  }
}

function changeCarTexture(newTexture) {
  car.texture = PIXI.Texture.from(newTexture)
}

function start() {
  car = PIXI.Sprite.from(car_actions.lights)
  // car = PIXI.Sprite.from('./src/assets/images/sprites/blue_car_lights_vr.png')
  car.scale.set(0.1, 0.1)
  car.anchor.set(0.5)

  car.x = 400
  car.y = 300
  car.vx = 0
  car.vy = 0
  app.stage.addChild(car)

  setupController()
  
  carEngine.setInputs(inputs)
  console.log(carEngine.config)
  
  state = play
  app.ticker.add(delta => update(delta))
}

function update(delta) {
  state(delta)
}

function play(delta) {
  carEngine.update(delta)

  car.rotation = carEngine.heading
  car.vx = carEngine.velocity.x
  car.vy = carEngine.velocity.y

  car.x += car.vx * delta
  car.y += car.vy * delta

  loopPosition(car, app.renderer.screen)
}

function loopPosition(car, screen) {
  if (car.x > screen.width + car.width) car.x = -car.width
  if (car.y > screen.height + car.height) car.y = -car.height
  if (car.x < 0 - car.width) car.x = screen.width + car.width/2
  if (car.y < 0 - car.height) car.y = screen.height + car.height/2
}
