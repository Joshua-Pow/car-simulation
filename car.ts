class Car {
  x: number; //This is the center x dimension of the car
  y: number; //This is the center y dimenison of the car
  width: number;
  height: number;

  maxSpeed: number;
  speed: number;
  acceleration: number;
  friction: number;

  angle: number;

  color: string;

  sensor: Sensor;
  controls: Controls;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.maxSpeed = 3;
    this.acceleration = 0.1;
    this.friction = 0.05;

    this.angle = 0;

    this.color = color;

    this.sensor = new Sensor(this);
    this.controls = new Controls();
  }

  update(roadBorders: RoadBorder[]) {
    this.#move();
    this.sensor.update(roadBorders);
  }

  #move() {
    if (this.controls.up) {
      this.speed += this.acceleration;
    }
    if (this.controls.down) {
      this.speed -= this.acceleration;
    }

    // Forward max speed
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    // Backward max speed
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    // Friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }

    // Edge case to check when the car slows down and slowly starts to move backwards
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const isForward = this.speed > 0;
      if (this.controls.left) {
        this.angle += 0.01 * (isForward ? 1 : -1);
      }
      if (this.controls.right) {
        this.angle -= 0.01 * (isForward ? 1 : -1);
      }
    }

    this.x -= this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();

    ctx.restore();

    this.sensor.draw(ctx);
  }
}
