type Coord = { x: number; y: number };
type RoadBorder = [Coord, Coord];

class Road {
  x: number;
  width: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  laneCount: number;
  borders: RoadBorder[];

  constructor(x: number, width: number, laneCount: number = 4) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft: Coord = { x: this.left, y: this.top };
    const topRight: Coord = { x: this.right, y: this.top };
    const bottomLeft: Coord = { x: this.left, y: this.bottom };
    const bottomRight: Coord = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "gray";

    //Draw the dotted lines
    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = linearInterpolation(this.left, this.right, i / this.laneCount);
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    //Draw the borders
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }

  getLaneCenter(lane: number) {
    const laneWidth = this.width / this.laneCount;
    return this.left + laneWidth * (Math.min(lane, this.laneCount - 1) + 0.5);
  }
}
