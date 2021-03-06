import Keyboard from "./src/GameEngine/keyboard.js"
import CarEngine from "./src/GameEngine/physics/car/index.js"

const carEngine = new CarEngine()
console.log(carEngine.engine)

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
    changeCarTexture(car_actions.lights)
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

  controller.handbrake.press = () => {
    car_engine.handbraking = true
  }

  controller.handbrake.release = () => {
    car_engine.handbraking = false
  }
}

function changeCarTexture(newTexture) {
  car.texture = PIXI.Texture.from(newTexture)
}

function start() {
  car = PIXI.Sprite.from(car_actions.lights)
  car.scale.set(0.1, 0.1)
  car.anchor.set(0.5)

  car.x = 400
  car.y = 300
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
  if (car.rotation > Math.PI * 2 || car.rotation < -Math.PI * 2)
    car.rotation = 0
  const rot = car.rotation + ifHandbraking(car_engine)
  console.log(
    car_engine.handbraking,
    car.rotation,
    car.rotation * ifHandbraking(car_engine)
  )
  car.x += car.vx * Math.cos(rot) * delta
  car.y += car.vy * Math.sin(rot) * delta

  loopPosition(car, app.renderer.screen)
  carEngineAccelerate(car_engine.accelerate && !car_engine.braking)
  carEngineDecelerate(!car_engine.accelerate, car_engine.braking)
  carEngineReverse(car.vx <= 0 && car_engine.braking)

  if (car.vx != 0 && car.vy != 0) {
    turnRight(car_steering.turningRight)
    turnLeft(car_steering.turningLeft)
  }
  // console.log(car.vx, car_engine)
}

function loopPosition(car, screen) {
  if (car.x > screen.width + car.width) car.x = 0
  if (car.y > screen.height + car.height) car.y = 0
  if (car.x < 0 - car.width) car.x = screen.width
  if (car.y < 0 - car.height) car.y = screen.height
}

function carEngineAccelerate(accelerate) {
  if (accelerate) {
    if (car.vx < car_engine.topSpeed) car.vx += car_engine.acceleration
    if (car.vy < car_engine.topSpeed) car.vy += car_engine.acceleration
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
  return car.handbraking ? 0.9 : 0
}
