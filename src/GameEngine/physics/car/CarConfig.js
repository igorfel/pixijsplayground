import { Clamp } from '../../math/index.js'

export default class CarConfig {
  constructor(opts) {
    opts = opts || {};
    //  Defaults approximate a lightweight sports-sedan.
    this.gravity = opts.gravity || 9.81;  // m/s^2
    this.mass = opts.mass || 1200.0;  // kg
    this.inertiaScale = opts.inertiaScale || 1.0;  // Multiply by mass for inertia
    this.halfWidth = opts.halfWidth || 0.8; // Centre to side of chassis (metres)
    this.cgToFront = opts.cgToFront || 2.0; // Centre of gravity to front of chassis (metres)
    this.cgToRear = opts.cgToRear || 2.0;   // Centre of gravity to rear of chassis
    this.cgToFrontAxle = opts.cgToFrontAxle || 1.25;  // Centre gravity to front axle
    this.cgToRearAxle = opts.cgToRearAxle || 1.25;  // Centre gravity to rear axle
    this.cgHeight = opts.cgHeight || 0.55;  // Centre gravity height
    this.wheelRadius = opts.wheelRadius || 0.3;  // Includes tire (also represents height of axle)
    this.wheelWidth = opts.wheelWidth || 0.2;  // Used for render only
    this.tireGrip = opts.tireGrip || 2;  // How much grip tires have
    this.lockGrip = (typeof opts.lockGrip === 'number') ? Clamp(opts.lockGrip, 0.01, 1.0) : 0.7;  // % of grip available when wheel is locked
    this.engineForce = opts.engineForce || 8000.0;
    this.brakeForce = opts.brakeForce || 12000.0;
    this.eBrakeForce = opts.eBrakeForce || this.brakeForce / 2.5;
    this.weightTransfer = (typeof opts.weightTransfer === 'number') ? opts.weightTransfer : 0.2;  // How much weight is transferred during acceleration/braking
    this.maxSteer = opts.maxSteer || 0.6;  // Maximum steering angle in radians
    this.cornerStiffnessFront = opts.cornerStiffnessFront || 5;
    this.cornerStiffnessRear = opts.cornerStiffnessRear || 5.2;
    this.airResist = (typeof opts.airResist === 'number') ? opts.airResist : 2.5;	// air resistance (* vel)
    this.rollResist = (typeof opts.rollResist === 'number') ? opts.rollResist : 8;	// rolling resistance force (* vel)
  }
}