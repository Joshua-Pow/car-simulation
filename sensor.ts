type Ray = [Coord, Coord];
type Reading = Coord | null;
type Intersection = Coord & { offset: number };

class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: Ray[];
  readings: (Intersection | null)[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 8;
    this.rayLength = 450;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: RoadBorder[], traffic: Car[] = []) {
    this.#castRays();
    this.readings = this.rays.map((ray) =>
      this.#getReading(ray, roadBorders, traffic)
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.rays.forEach((ray, index) => {
      let end = this.readings[index]
        ? { x: this.readings[index]!.x, y: this.readings[index]!.y }
        : ray[1];
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(ray[0].x, ray[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      if (this.readings[index]) {
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(ray[1].x, ray[1].y);
        ctx.stroke();
      }
    });
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const angle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = {
        x: this.car.x,
        y: this.car.y,
      };

      const end = {
        x: this.car.x - Math.sin(angle) * this.rayLength,
        y: this.car.y - Math.cos(angle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  #getReading(
    ray: Ray,
    roadBorders: RoadBorder[],
    traffic: Car[]
  ): Intersection | null {
    let touches: Intersection[] = [];

    roadBorders.forEach((border) => {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);
      if (touch) {
        touches.push(touch);
      }
    });

    traffic.forEach((car) => {
      if (car !== this.car) {
        car.polygon.forEach((point, index) => {
          const nextPoint = car.polygon[(index + 1) % car.polygon.length];
          const touch = getIntersection(ray[0], ray[1], point, nextPoint);
          if (touch) {
            touches.push(touch);
          }
        });
      }
    });

    if (touches.length === 0) {
      return null;
    } else {
      touches.sort((a, b) => a.offset - b.offset);
      return touches[0];
    }
  }
}
