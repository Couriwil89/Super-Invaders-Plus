class Player {
    create(scene) {
      let player = scene.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player_ship_1")
        .setImmovable(true);
      player.setCollideWorldBounds(true);
      player.body.onWorldBounds = true;
      player.body.world.on('worldbounds', function(body) {
        if (body.gameObject === this) {
          this.setActive(false);
        }
      }, player);
  
      return player;
      
        //this.player.play("ship_1_idle");
        //this.player.setInteractive();
        //this.player.setCollideWorldBounds(true);
    }
  }
  
  const playerCreate = new Player();