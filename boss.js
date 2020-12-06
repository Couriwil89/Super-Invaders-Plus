class Boss extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
      super(scene, config.width / 2, config.height + 730, "boss");     
      scene.add.existing(this);
      this.play("boss_idle");
      
      scene.physics.world.enableBody(true);
    }
  
  
    deactivate() {
      this.disableBody(true, true);
    }
  
    explode() {
      this.scene.sound.play('enemyDeath');
      this.deactivate();
    }
  
  
  }