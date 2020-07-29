import { Vector2, Clamp, Sign } from '../../math/index.js'
import InputState from './InputState.js'
import CarConfig from './CarConfig.js'

class Car {
  constructor(opts) {
    opts = opts || {};

    //  Car state variables
    this.heading = opts.heading || 1;  // angle car is pointed at (radians)
    this.position = new Vector2(opts.x, opts.y);  // metres in world coords
    this.velocity = new Vector2();  // m/s in world coords
    this.velocity_c = new Vector2();  // m/s in local car coords (x is forward y is sideways)
    this.accel = new Vector2();  // acceleration in world coords
    this.accel_c = new Vector2();   // accleration in local car coords
    this.absVel = 0.0;  // absolute velocity m/s
    this.yawRate = 0.0;   // angular velocity in radians
    this.steer = 0.0;	// amount of steering input (-1.0..1.0)
    this.steerAngle = 0.0;  // actual front wheel steer angle (-maxSteer..maxSteer)

    //  State of inputs
    this.inputs = new InputState();

    //  Use input smoothing (on by default)
    this.smoothSteer = (opts.smoothSteer === undefined) ? true : !!opts.smoothSteer;
    //  Use safe steering (angle limited by speed)
    this.safeSteer = (opts.safeSteer === undefined) ? true : !!opts.safeSteer;

    //  Stats object we can use to ouptut info
    // this.stats = opts.stats;

    //  Other static values to be computed from config
    this.inertia = 0.0;  // will be = mass
    this.wheelBase = 0.0;  // set from axle to CG lengths
    this.axleWeightRatioFront = 0.0;  // % car weight on the front axle
    this.axleWeightRatioRear = 0.0;  // % car weight on the rear axle

    //  Setup car configuration
    this.config = new CarConfig(opts.config);
    this.setConfig();

  }

  setInputs(inputs) {
    this.inputs = inputs
  }
  
  setConfig(config) {
    if(config) this.config = config

    // Re-calculate these
    this.inertia = this.config.mass * this.config.inertiaScale;
    this.wheelBase = this.config.cgToFrontAxle + this.config.cgToRearAxle;
    this.axleWeightRatioFront = this.config.cgToRearAxle / this.wheelBase; // % car weight on the front axle
    this.axleWeightRatioRear = this.config.cgToFrontAxle / this.wheelBase; // % car weight on the rear axle
  }

  doPhysics(dt) {
    // Shorthand
    var cfg = this.config;

    // Pre-calc heading vector
    var sn = Math.sin(this.heading);
    var cs = Math.cos(this.heading);

    // Get velocity in local car coordinates
    this.velocity_c.x = cs * this.velocity.x + sn * this.velocity.y;
    this.velocity_c.y = cs * this.velocity.y - sn * this.velocity.x;

    // Weight on axles based on centre of gravity and weight shift due to forward/reverse acceleration
    var axleWeightFront = cfg.mass * (this.axleWeightRatioFront * cfg.gravity - cfg.weightTransfer * this.accel_c.x * cfg.cgHeight / this.wheelBase);
    var axleWeightRear = cfg.mass * (this.axleWeightRatioRear * cfg.gravity + cfg.weightTransfer * this.accel_c.x * cfg.cgHeight / this.wheelBase);

    // Resulting velocity of the wheels as result of the yaw rate of the car body.
    // v = yawrate * r where r is distance from axle to CG and yawRate (angular velocity) in rad/s.
    var yawSpeedFront = cfg.cgToFrontAxle * this.yawRate;
    var yawSpeedRear = -cfg.cgToRearAxle * this.yawRate;

    // Calculate slip angles for front and rear wheels (a.k.a. alpha)
    var slipAngleFront = Math.atan2(this.velocity_c.y + yawSpeedFront, Math.abs(this.velocity_c.x)) - Sign(this.velocity_c.x) * this.steerAngle;
    var slipAngleRear  = Math.atan2(this.velocity_c.y + yawSpeedRear,  Math.abs(this.velocity_c.x));

    var tireGripFront = cfg.tireGrip;
    var tireGripRear = cfg.tireGrip * (1.0 - this.inputs.ebrake * (1.0 - cfg.lockGrip)); // reduce rear grip when ebrake is on

    var frictionForceFront_cy = Clamp(-cfg.cornerStiffnessFront * slipAngleFront, -tireGripFront, tireGripFront) * axleWeightFront;
    var frictionForceRear_cy = Clamp(-cfg.cornerStiffnessRear * slipAngleRear, -tireGripRear, tireGripRear) * axleWeightRear;

    //  Get amount of brake/throttle from our inputs
    var brake = Math.min(this.inputs.brake * cfg.brakeForce + this.inputs.ebrake * cfg.eBrakeForce, cfg.brakeForce);
    var throttle = this.inputs.throttle * cfg.engineForce;

    //  Resulting force in local car coordinates.
    //  This is implemented as a RWD car only.
    var tractionForce_cx = throttle - brake * Sign(this.velocity_c.x);
    var tractionForce_cy = 0;

    var dragForce_cx = -cfg.rollResist * this.velocity_c.x - cfg.airResist * this.velocity_c.x * Math.abs(this.velocity_c.x);
    var dragForce_cy = -cfg.rollResist * this.velocity_c.y - cfg.airResist * this.velocity_c.y * Math.abs(this.velocity_c.y);

    // total force in car coordinates
    var totalForce_cx = dragForce_cx + tractionForce_cx;
    var totalForce_cy = dragForce_cy + tractionForce_cy + Math.cos(this.steerAngle) * frictionForceFront_cy + frictionForceRear_cy;

    // acceleration along car axes
    this.accel_c.x = totalForce_cx / cfg.mass;  // forward/reverse accel
    this.accel_c.y = totalForce_cy / cfg.mass;  // sideways accel

    // acceleration in world coordinates
    this.accel.x = cs * this.accel_c.x - sn * this.accel_c.y;
    this.accel.y = sn * this.accel_c.x + cs * this.accel_c.y;

    // update velocity
    this.velocity.x += this.accel.x * dt;
    this.velocity.y += this.accel.y * dt;

    this.absVel = this.velocity.magnitude();

    // calculate rotational forces
    var angularTorque = (frictionForceFront_cy + tractionForce_cy) * cfg.cgToFrontAxle - frictionForceRear_cy * cfg.cgToRearAxle;

    //  Sim gets unstable at very slow speeds, so just stop the car
    if( Math.abs(this.absVel) < 0.5 && !throttle )
    {
      this.velocity.x = this.velocity.y = this.absVel = 0;
      angularTorque = this.yawRate = 0;
    }

    var angularAccel = angularTorque / this.inertia;
    this.yawRate += angularAccel * dt;
    this.heading += this.yawRate * dt;
    console.log((180/Math.PI) * this.heading)

    //  finally we can update position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  applySmoothSteer (steerInput, dt) {
    var steer = 0;

    if (Math.abs(steerInput) > 0.001)
    {
      //  Move toward steering input
      steer = Clamp(this.steer + steerInput * dt * 4.0, -1.0, 1.0);
    }
    else
    {
      //  No steer input - move toward centre (0)
      if (this.steer > 0)
      {
        steer = Math.max(this.steer - dt * 2.0, 0);
      }
      else if (this.steer < 0)
      {
        steer = Math.min(this.steer + dt * 2.0, 0);
      }
    }

    return steer;
  };

  applySafeSteer (steerInput) {
    var avel = Math.min(this.absVel, 250.0);  // m/s
    var steer = steerInput * (1.0 - (avel / 280.0));
    return steer;
  };

  update (delta) {
    var dt = delta/100;  // delta T in seconds

    this.throttle = this.inputs.throttle;
    this.brake = this.inputs.brake;

    var steerInput = this.inputs.left - this.inputs.right;

    //  Perform filtering on steering...
    if( this.smoothSteer )
      this.steer = this.applySmoothSteer( steerInput, dt );
    else
      this.steer = steerInput;

    if( this.safeSteer )
      this.steer = this.applySafeSteer(this.steer);

    //  Now set the actual steering angle
    this.steerAngle = this.steer * this.config.maxSteer;

    //
    //  Now that the inputs have been filtered and we have our throttle,
    //  brake and steering values, perform the car physics update...
    //
    this.doPhysics(dt);
  };
}

export default Car