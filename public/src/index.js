import Keyboard from "./engine/keyboard.js"

let app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x112233,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)
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
  left: Keyboard("ArrowLeft")
}
let car_engine = {
  topSpeed: 5,
  reverse: 2,
  acceleration: 0.1,
  deceleration: 0.025,
  brakeForce: 0.05,
  accelerate: false,
  braking: false,
  handbraking: false,
  reversing: false
}
let car_steering = {
  handling: 0.005,
  turningRight: false,
  turningLeft: false
}

app.loader.add(car_sprite_path).load(start)

function setupController() {
  controller.up.press = () => {
    car_engine.accelerate = true
  }

  controller.up.release = () => {
    car_engine.accelerate = false
  }

  controller.down.press = () => {
    car_engine.braking = true
    car_engine.accelerate = false
  }

  controller.down.release = () => {
    car_engine.braking = false
    if (controller.up.isDown) car_engine.accelerate = true
  }

  controller.right.press = () => {
    car_steering.turningRight = true
    car_steering.turningLeft = false
  }

  controller.right.release = () => {
    car_steering.turningRight = false
  }

  controller.left.press = () => {
    car_steering.turningLeft = true
    car_steering.turningRight = false
  }

  controller.left.release = () => {
    car_steering.turningLeft = false
  }
}

function start() {
  car = PIXI.Sprite.from(car_actions.lights)
  car.scale.set(0.1, 0.1)
  car.anchor.set(0.5)

  car.x = 200
  car.y = 200
  car.vx = 0
  car.vy = 0
  app.stage.addChild(car)

  setupController()

  state = play
  app.ticker.add(delta => update(delta))
}

function update(delta) {
  state(delta)
}

function play(delta) {
  car.x += car.vx * delta
  car.y += car.vy * delta

  loopPosition(car, app.renderer.screen)
  carEngineAccelerate(car_engine.accelerate && !car_engine.braking)
  carEngineDecelerate(!car_engine.accelerate, car_engine.braking)
  carEngineReverse(car.vx <= 0 && car_engine.braking)

  if (car.vx != 0) {
    turnRight(car_steering.turningRight)
    turnLeft(car_steering.turningLeft)
  }
  // console.log(car.vx, car_engine)
}

function loopPosition(car, screen) {
  if (car.x > screen.width + car.width) car.x = 0
  if (car.y > screen.height + car.height) car.y = 0
  if (car.x < 0 - car.width) car.x = screen.width
  if (car.y < 0 - car.height) car.x = screen.height
}

function carEngineAccelerate(accelerate) {
  if (accelerate)
    if (car.vx < car_engine.topSpeed) car.vx += car_engine.acceleration
}

function carEngineDecelerate(decelerate, braking) {
  const brakingForce = braking
    ? car_engine.deceleration + car_engine.brakeForce
    : car_engine.deceleration
  if (decelerate) {
    if (car.vx > 0.1) car.vx -= brakingForce
    else if (car.vx < -0.051) car.vx += brakingForce
    else car.vx = 0
  }
}

function carEngineReverse(accelerate) {
  if (accelerate)
    if (car.vx > -car_engine.reverse) car.vx -= car_engine.acceleration
}

function turnRight(canTurn) {
  if (canTurn) car.rotation += car_steering.handling * car.vx
}

function turnLeft(canTurn) {
  if (canTurn) car.rotation -= car_steering.handling * car.vx
}
