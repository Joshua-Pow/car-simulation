const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 400;

const ctx = canvas.getContext("2d")!;
const car = new Car(100, 100, 30, 50, "red");

car.draw(ctx);

animate();

function animate() {
 car.update();
 canvas.height = window.innerHeight;
 car.draw(ctx);
 requestAnimationFrame(animate);
}
