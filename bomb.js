class Bomb extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
      super(scene, 0, 0, 'enemy_attack');
      this.play('enemy_missile');
    }
  
    throw(x, y) {
      this.enableBody(true, x, y, true, true);
      this.setCollideWorldBounds(true);
      this.body.onWorldBounds = true;
      this.setVelocityY(300);
    }
  
    deactivate() {
      this.disableBody (true, true);
    }
  }