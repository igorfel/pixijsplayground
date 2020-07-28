const BlueCarConfig = {
  smoothSteer: true,
  safeSteer: true,
  config: {
    gravity: 9.81,  // m/s^2
    mass: 120.0,  // kg
    inertiaScale: 1,  // Multiply by mass for inertia
    halfWidth: 0.05, // Centre to side of chassis (metres)
    cgToFront: 0.02, // Centre of gravity to front of chassis (metres)
    cgToRear: 0.02,   // Centre of gravity to rear of chassis
    cgToFrontAxle: 0.0125,  // Centre gravity to front axle
    cgToRearAxle: 0.0125,  // Centre gravity to rear axle
    cgHeight: 0.1,  // Centre gravity height
    wheelRadius: 0.03,  // Includes tire (also represents height of axle)
    wheelWidth: 0.02,  // Used for render only
    tireGrip: 0.2,  // How much grip tires have
    lockGrip: 0.07,  // % of grip available when wheel is locked
    engineForce: 800.0,
    brakeForce: 100.0,
    eBrakeForce: 2,
    weightTransfer: 0.5,  // How much weight is transferred during acceleration/braking
    maxSteer: 0.02,  // Maximum steering angle in radians
    cornerStiffnessFront: 0.5,
    cornerStiffnessRear: 0.52,
    airResist: 0.06,	// air resistance (* vel)
    rollResist: 0.8
  }
}

export default BlueCarConfig