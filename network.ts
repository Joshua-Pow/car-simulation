class NeuralNetwork {
  levels: Level[];
  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(inputs: number[], network: NeuralNetwork) {
    let outputs = inputs;
    for (let i = 0; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }
}

class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];
  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < outputCount; i++) {
      this.weights[i] = new Array(inputCount);
    }

    Level.randomize(this);
  }

  static randomize(level: Level) {
    for (let i = 0; i < level.outputs.length; i++) {
      level.biases[i] = Math.random() * 2 - 1; //values between -1 and 1
      for (let j = 0; j < level.inputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; //values between -1 and 1
      }
    }
  }

  static feedForward(inputs: number[], level: Level) {
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += inputs[j] * level.weights[i][j];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}
