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
    changeCarTexture(car_actions.lights)
    // CarEngine
    inputs.throttle = 1
  }

  controller.up.release = () => {
    // CarEngine
    inputs.throttle = 0
  }

  controller.down.press = () => {
    // CarEngine
    inputs.brake = 1
  }

  controller.down.release = () => {
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
  car.scale.set(0.5, 0.5)
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
  // if (car.rotation > Math.PI * 2 || car.rotation < -Math.PI * 2)
  //   car.rotation = 0
  // const rot = car.rotation * ifHandbraking(car_engine)

  carEngine.update(delta)
  // car.vx = carEngine.velocity.x
  // car.vy = carEngine.velocity.y
  car.rotation = carEngine.heading
  car.x += carEngine.velocity.x/10 * delta
  car.y += carEngine.velocity.y/10 * delta
  // car.x += car.vx * Math.cos(rot) * delta
  // car.y += car.vy * Math.sin(rot) * delta

  // carEngineAccelerate(car_engine.accelerate && !car_engine.braking)
  // carEngineDecelerate(!car_engine.accelerate, car_engine.braking)
  // carEngineReverse(car.vx <= 0 && car_engine.braking)

  // if (car.vx != 0 || car.vy != 0) {
  //   turnRight(car_steering.turningRight)
  //   turnLeft(car_steering.turningLeft)
  // }

  loopPosition(car, app.renderer.screen)
}

function loopPosition(car, screen) {
  if (car.x > screen.width + car.width) car.x = -car.width
  if (car.y > screen.height + car.height) car.y = -car.height
  if (car.x < 0 - car.width) car.x = screen.width + car.width/2
  if (car.y < 0 - car.height) car.y = screen.height + car.height/2
}

function carEngineAccelerate(accelerate) {
  if (accelerate) {
    if(car.vx < 5) car.vx += 5
    if(car.vy < 5) car.vy += 5
  }
}

function carEngineDecelerate(decelerate, braking) {
  const brakingForce = braking
    ? car_engine.deceleration + car_engine.brakeForce
    : car_engine.deceleration
  if (decelerate) {
    changeCarTexture(car_actions.break_lights)

    if (car.vx > 0.1) car.vx -= brakingForce
    else if (car.vx < -0.051) car.vx += brakingForce
    else car.vx = 0

    if (car.vy > 0.1) car.vy -= brakingForce
    else if (car.vy < -0.051) car.vy += brakingForce
    else car.vy = 0
  }
}

function carEngineReverse(accelerate) {
  if (accelerate) {
    if (car.vx > -car_engine.reverse) car.vx -= car_engine.acceleration
    if (car.vy > -car_engine.reverse) car.vy -= car_engine.acceleration
  }
}

function turnRight(canTurn) {
  if (canTurn) {
    const handling = car_steering.handling / 3

    if (car.vx + car.vy > 0) car.rotation += handling * car.vx * car.vy
    if (car.vx + car.vy < 0) car.rotation -= handling * 3 * car.vx * car.vy

    // const drift = car.rotation + 0.8
  }
}

function turnLeft(canTurn) {
  if (canTurn) {
    const handling = car_steering.handling / 3
    if (car.vx + car.vy > 0) car.rotation -= handling * car.vx * car.vy
    if (car.vx + car.vy < 0) car.rotation += handling * 3 * car.vx * car.vy

    //const drift = car.rotation + 0.8
  }
}

function ifHandbraking(car) {
  return car.handbraking ? 1.5 : 1
}
