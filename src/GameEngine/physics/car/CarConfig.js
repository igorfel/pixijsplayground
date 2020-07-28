import { Clamp } from '../../math/index.js'

export default class CarConfig {
  constructor(opts) {
    opts = opts || {};
    //  Defaults approximate a lightweight sports-sedan.
    this.gravity = opts.gravity || 9.81;  // m/s^2
    this.mass = opts.mass || 120.0;  // kg
    this.inertiaScale = opts.inertiaScale || 1.0;  // Multiply by mass for inertia
    this.halfWidth = opts.halfWidth || 0.08; // Centre to side of chassis (metres)
    this.cgToFront = opts.cgToFront || 0.20; // Centre of gravity to front of chassis (metres)
    this.cgToRear = opts.cgToRear || 0.20;   // Centre of gravity to rear of chassis
    this.cgToFrontAxle = opts.cgToFrontAxle || 0.125;  // Centre gravity to front axle
    this.cgToRearAxle = opts.cgToRearAxle || 0.125;  // Centre gravity to rear axle
    this.cgHeight = opts.cgHeight || 0.055;  // Centre gravity height
    this.wheelRadius = opts.wheelRadius || 0.03;  // Includes tire (also represents height of axle)
    this.wheelWidth = opts.wheelWidth || 0.02;  // Used for render only
    this.tireGrip = opts.tireGrip || 0.2;  // How much grip tires have
    this.lockGrip = (typeof opts.lockGrip === 'number') ? Clamp(opts.lockGrip, 0.01, 1.0) : 0.7;  // % of grip available when wheel is locked
    this.engineForce = opts.engineForce || 800.0;
    this.brakeForce = opts.brakeForce || 1200.0;
    this.eBrakeForce = opts.eBrakeForce || this.brakeForce / 2.5;
    this.weightTransfer = (typeof opts.weightTransfer === 'number') ? opts.weightTransfer : 0.02;  // How much weight is transferred during acceleration/braking
    this.maxSteer = opts.maxSteer || 0.06;  // Maximum steering angle in radians
    this.cornerStiffnessFront = opts.cornerStiffnessFront || 0.5;
    this.cornerStiffnessRear = opts.cornerStiffnessRear || 0.52;
    this.airResist = (typeof opts.airResist === 'number') ? opts.airResist : 0.25;	// air resistance (* vel)
    this.rollResist = (typeof opts.rollResist === 'number') ? opts.rollResist : 0.8;	// rolling resistance force (* vel)
  }
}