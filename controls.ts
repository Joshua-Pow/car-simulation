class Controls {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;

  constructor(type: ControlType) {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    switch (type) {
      case "USER":
        this.#addKeyboardListeners();
        break;
      case "BOT":
        this.up = true;
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.up = true;
          break;
        case "ArrowDown":
          this.down = true;
          break;
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
      }
    };

    document.onkeyup = (e) => {
      switch (e.key) {
        case "ArrowUp":
          this.up = false;
          break;
        case "ArrowDown":
          this.down = false;
          break;
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
      }
    };

    console.table(this);
  }
}
