import Vector2Like = Phaser.Types.Math.Vector2Like;

export class SubmarineTrail extends Phaser.GameObjects.Graphics {
  private readonly colors: number[] = [
    0x0973b6, 0xf9ca06, 0xff900b, 0xf2372e, 0xda3328,
  ];
  private readonly lineWidth: number = 18;
  //private submarine: Submarine
  private dy: number = 0;
  private positionsX: number[];
  private positionsY: number[];
  private path: Vector2Like[];

  constructor(scene: Phaser.Scene) {
    super(scene);
    //this.submarine = scene.submarine
    this.path = [];
    this.positionsX = [];
    this.positionsY = [];

    this.dy = -1;
    this.scene.tweens.add({
      targets: this,
      duration: 400,
      ease: Phaser.Math.Easing.Sine.InOut,
      dy: this.dy * -1,
      yoyo: true,
      repeat: -1,
    });

    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.update, this);
  }

  public update(delta: number): void {
    if (this.visible === false) {
      return;
    }

    this.updatePath();
    this.drawPath();
  }

  private updatePath() {
    this.positionsY.forEach((y, index) => {
      this.positionsY[index] = y + this.dy;
    });

    // this.positionsX.push(this.submarine.x)
    // this.positionsY.push(this.submarine.y - 27)

    let cameraLeft: number = this.scene.cameras.main.worldView.left;
    for (let i: number = this.positionsX.length - 1; i >= 0; i--) {
      let x = this.positionsX[i];
      if (x < cameraLeft) {
        this.positionsX = this.positionsX.slice(i);
        this.positionsY = this.positionsY.slice(i);
        break;
      }
    }

    this.path.length = 0;
    for (let i: number = 0; i <= 1; i += 1 / this.positionsX.length) {
      this.path.push({
        x: Phaser.Math.Interpolation.Bezier(this.positionsX, i),
        y: Phaser.Math.Interpolation.Bezier(this.positionsY, i),
      });
    }
  }

  private drawPath() {
    this.clear();

    if (this.path.length < 2) {
      return;
    }

    this.colors.forEach((color, index) => {
      this.drawLine(index * this.lineWidth, color);
    });
  }

  private drawLine(offsetY: number, color: number): void {
    this.lineStyle(this.lineWidth, color);
    this.beginPath();
    this.doDrawPath(this.path, offsetY);
    this.strokePath();
  }

  private doDrawPath(path: Vector2Like[], offsetY: number) {
    path.forEach((point, index) => {
      if (index === 0) {
        this.moveTo(point.x, point.y + offsetY);
      } else {
        this.lineTo(point.x, point.y + offsetY);
      }
    });
  }

  public show(): void {
    this.positionsX.length = 0;
    this.positionsY.length = 0;

    //this.revive();

    this.alpha = 0;
    this.scene.tweens.add({
      targets: this,
      duration: 200,
      ease: Phaser.Math.Easing.Cubic.Out,
      alpha: 1,
    });
  }

  public hide(): void {
    this.scene.tweens.add({
      targets: this,
      duration: 250,
      ease: Phaser.Math.Easing.Linear,
      alpha: 0,
      onComplete: () => {
        //this.kill();
      },
    });
  }
}
