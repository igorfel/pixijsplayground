const BlueCarConfig = {
  smoothSteer: true,
  safeSteer: true,
  config: {
    gravity: 9.81,  // m/s^2
    mass: 1200.0,  // kg
    inertiaScale: 1,  // Multiply by mass for inertia
    halfWidth: 0.4, // Centre to side of chassis (metres)
    cgToFront: 1, // Centre of gravity to front of chassis (metres)
    cgToRear: 1,   // Centre of gravity to rear of chassis
    cgToFrontAxle: 0.25,  // Centre gravity to front axle
    cgToRearAxle: 0.25,  // Centre gravity to rear axle
    cgHeight: 0.05,  // Centre gravity height
    wheelRadius: 0.08,  // Includes tire (also represents height of axle)
    wheelWidth: 0.05,  // Used for render only
    tireGrip: 2,  // How much grip tires have
    lockGrip: 0.7,  // % of grip available when wheel is locked
    engineForce: 8000,
    brakeForce: 12000,
    eBrakeForce: 4800,
    weightTransfer: 0.2,  // How much weight is transferred during acceleration/braking
    maxSteer: 0.6,  // Maximum steering angle in radians
    cornerStiffnessFront: 5,
    cornerStiffnessRear: 5.2,
    airResist: 2.5,	// air resistance (* vel)
    rollResist: 8
  }
}

export default BlueCarConfig