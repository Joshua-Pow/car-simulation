const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 400;

const ctx = canvas.getContext("2d")!;

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "green", "USER");
const traffic = [
  new Car(road.getLaneCenter(0), 200, 30, 50, "red", "BOT", 2),
  new Car(road.getLaneCenter(2), 300, 30, 50, "blue", "BOT", 2),
];

car.draw(ctx);

animate();

function animate() {
  for (const botCar of traffic) {
    botCar.update(road.borders);
  }
  car.update(road.borders, traffic);

  canvas.height = window.innerHeight;
  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.8);
  road.draw(ctx);
  for (const botCar of traffic) {
    botCar.draw(ctx);
  }
  car.draw(ctx);
  ctx.restore();
  requestAnimationFrame(animate);
}
