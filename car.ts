type ControlType = "USER" | "BOT";

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

  sensor: Sensor | null;
  controls: Controls;

  damaged: boolean;
  polygon: { x: number; y: number }[];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    controlType: ControlType,
    maxSpeed: number = 3
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.acceleration = 0.1;
    this.friction = 0.05;

    this.angle = 0;

    this.color = color;

    if (controlType === "USER") {
      this.sensor = new Sensor(this);
    } else {
      this.sensor = null;
    }

    this.controls = new Controls(controlType);

    this.damaged = false;
    this.polygon = this.#createPolygon();
  }

  update(roadBorders: RoadBorder[], traffic: Car[] = []) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  #assessDamage(borders: [Coord, Coord][], traffic: Car[]) {
    for (const border of borders) {
      if (polygonIntersection(this.polygon, border)) {
        return true;
      }
    }
    for (const car of traffic) {
      if (polygonIntersection(this.polygon, car.polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const angle = Math.atan2(this.width, this.height);

    //Top right
    points.push({
      x: this.x - Math.sin(this.angle - angle) * radius,
      y: this.y - Math.cos(this.angle - angle) * radius,
    });

    //Top left
    points.push({
      x: this.x - Math.sin(this.angle + angle) * radius,
      y: this.y - Math.cos(this.angle + angle) * radius,
    });

    //Bottom left
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - angle) * radius,
    });

    //Bottom right
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + angle) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + angle) * radius,
    });
    return points;
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
    if (this.damaged) {
      ctx.fillStyle = "grey";
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.closePath();
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }
}
