class Shot extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene, 0, 0, 'player_shot');


		/* 
		scene.add.existing(this);
				
		this.play("shot");
		scene.physics.world.enableBody(this); */

	}


	fire(x, y) {
		try {

			this.body.reset(x, y);
			this.setActive(true);
			this.setVisible(true);
			this.body.velocity.y = -250;
		} catch (err) {
			console.log(err);
		}
	}


	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		if (this.y <= -32) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
	/* this.play("shot");
this.body.setCollideWorldBounds(true);
this.body.onWorldBounds = true;
this.body.velocity.y = -250; 

}*/

	deactivate() {
		this.disableBody(true, true);
	}

	update() {

		//The maximum number of shots that this Weapon is allowed to fire before it stops.
		//When the limit is his the `Weapon.onFireLimit` Signal is dispatched.



		if (this.y < 0) {
			this.destroy();
		}
	}
}


class Shots extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 5000,
            key: 'shot',
            active: false,
            visible: false,
            classType: Shot
        });
	}

	fireShot (x, y)
    {
        let shot = this.getFirstDead(false);

        if (shot)
        {
            shot.fire(x, y);
        }
    }
}