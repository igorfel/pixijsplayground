import { Vector2 } from '../../math/index.js';

export default class RigidBody {
  constructor() {
    this.p_halfSize = 0.5
    this.p_mass = 1
    this.p_inertia = 1

    // Linear
    this.p_position = new Vector2(0, 0)
    this.p_velocity = new Vector2(0, 0)
    this.p_forces = new Vector2(0, 0)

    // Angular
    this.p_angle = 0
    this.p_angularVelocity = 0
    this.p_torque = 0
  }

  setup(halfSize, mass) {
    this.p_mass = mass
    this.p_inertia = (1/12) * 
      (halfSize.x * halfSize.x) 
      * (halfSize.y * halfSize.y) 
      * mass    
  }

  getPosition() {
    return this.p_position;
  }

  update(delta) {
    // Linear
    const acceleration = this.p_forces.div(this.p_mass)
    this.p_velocity = this.p_velocity.add(acceleration.mult(delta))
    this.p_position = this.p_position.add(this.p_velocity.mult(delta))
    this.p_forces = new Vector2(0, 0)

    // Angular
    const angAcc = this.p_torque / this.p_inertia
    this.p_angularVelocity += angAcc * delta
    this.p_angle += this.p_angularVelocity * delta
    this.p_torque = 0
  }

  pointVel(worldOffset) {
    const tangent = new Vector2(-worldOffset.y, worldOffset.x)
    return tangent * this.p_angularVelocity + this.p_velocity
  }

  addForce(worldForce, worldOffset) {
    this.p_forces = this.p_forces.add(worldForce)
    this.p_torque = worldForce.cross(worldOffset)
  }
}