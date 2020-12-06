class Alien extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, "enemy1");
    
  }

  activate(x, y) {
    const randomNumber = Math.floor(Math.random() * (5 - 1)) + 1;
    this.play("enemy_" + randomNumber +"_idle");
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.enableBody(true, x, y, true, true);
    //this.setImmovable(true);
  }

  deactivate() {
    this.disableBody(true, true);
  }

  explode() {
    this.scene.sound.play('enemyDeath');
    this.deactivate();
  }
}

class Alien1 extends Alien {

  constructor(scene) {

    const alienSkin1 = Math.random() * (4 - 1) + 1;
    super(scene, "enemy" + alienSkin1);
  }
}

class Alien2 extends Alien {
  constructor(scene) {  

  const alienSkin2 = Math.random() * (4 - 1) + 1;
    super(scene, "enemy1" + alienSkin2);
  }
}

class Alien3 extends Alien {
  constructor(scene) {
    
  const alienSkin3 = Math.random() * (4 - 1) + 1;
    super(scene, "enemy1" + alienSkin3);
  }
}