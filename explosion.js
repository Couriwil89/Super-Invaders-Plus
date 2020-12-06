class Explosion extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "explosion");
		scene.add.existing(this);
		this.play("explode");
	}




}

class BigExplosion extends Explosion {
	constructor(scene, x, y) {
		super(scene, x, y, "bigExplosion");
			scene.add.existing(this);
			this.play("bigExplode");
		}
	}