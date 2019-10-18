import Vector2 from '../../math/index.js'

class Engine {
  constructor() {
    this.topSpeed = 5
    this.reverse = 2
    this.acceleration = 0.1
    this.deceleration = 0.025
    this.brakeForce = 0.05
    this.accelerate = false
    this.braking = false
    this.handbraking = false
    this.reversing = false

    this.engineForce = 5
    this.velocity = new Vector2(0, 0)

    this.ftraction = new Vector2(1, 0).mult(this.engineForce)

    this.drag = 0.4
    this.fdrag = new Vector2(this.velocity.x, this.velocity.y).mult(-this.drag * this.velocity.magnitude())

    this.rollingResistance = this.drag * 30
    this.froling = this.velocity.mult(-this.rollingResistance)

    this.flong = this.fdrag.add(this.froling.add(this.ftraction))
    console.log(this.ftraction, this.fdrag, this.froling)
    console.log(this.flong)
  }

  update() {

  }
}

export default Engine