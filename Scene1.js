class Scene1 extends Phaser.Scene {
	constructor(){
		super("bootGame");
    }

    preload(){

        this.load.image("titleScreen", "assets/title_screen/title_screen.png");

        this.load.image("stage1Screen", "assets/background/stage_1/stage1_background.png");
        this.load.image("stageBScreen", "assets/background/stage_B/stageB_background.png");

        this.load.audio("lasershot", ["/assets/audio/lasershot.ogg"]);
        this.load.audio("playerDeath", ["/assets/audio/deathExplosion.ogg"]);
        this.load.audio("enemyDeath", ["/assets/audio/enemyExplosion.ogg"]);
        this.load.audio("enemyHurt", ["/assets/audio/enemyHurt.ogg"]);
        this.load.audio("spaceshipAlert", ["/assets/audio/spaceshipAlert.ogg"]);
        this.load.audio("powerup", ["/assets/audio/powerup.ogg"]);

        this.load.audio("title", ["/assets/audio/title.ogg"]);
        this.load.audio("stage", ["/assets/audio/stage.ogg"]);
        this.load.audio("boss", ["/assets/audio/boss.ogg"]);
        this.load.audio("victory", ["/assets/audio/victory.ogg"]);

        this.load.spritesheet("player_ship_1", "assets/spritesheets/player/player_ship1.png",{
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet("player_shot", "assets/spritesheets/projectile/bullets.png",{
            frameWidth: 8,
            frameHeight: 8
        });

        this.load.spritesheet("enemy1", "assets/spritesheets/enemy/enemy_ships/enemy1.png",{
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("enemy2", "assets/spritesheets/enemy/enemy_ships/enemy2.png",{
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("enemy3", "assets/spritesheets/enemy/enemy_ships/enemy3.png",{
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("enemy4", "assets/spritesheets/enemy/enemy_ships/enemy4.png",{
            frameWidth: 24,
            frameHeight: 24
        });

        this.load.spritesheet("bonus_spaceship", "assets/spritesheets/enemy/enemy_ships/spaceship.png",{
            frameWidth: 32,
            frameHeight: 30
        });

        this.load.spritesheet("explosion", "assets/spritesheets/explosion/explode.png",{
			frameWidth: 16,
			frameHeight: 16
        });
        
        this.load.spritesheet("missile", "assets/spritesheets/projectile/missile.png",{
			frameWidth: 16,
			frameHeight: 16
        });
        
        this.load.spritesheet("enemy_attack", "assets/spritesheets/enemy/attack/bomb.png",{
			frameWidth: 5,
			frameHeight: 12
        });
        
        this.load.spritesheet("boss", "assets/spritesheets/enemy/boss/boss.png",{
            frameWidth: 256,
            frameHeight: 128
        });


        this.load.spritesheet("missile_powerup", "assets/spritesheets/powerups/missiles_pwup.png",{
            frameWidth: 16,
            frameHeight: 16
        });


        


    }

    create(){
        this.add.text(20, 20, "Loading game...");
        this.scene.start('playGame');

        this.anims.create({
            key: "ship_1_idle",
            frames: this.anims.generateFrameNumbers("player_ship_1"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_1_idle",
            frames: this.anims.generateFrameNumbers("enemy1"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_2_idle",
            frames: this.anims.generateFrameNumbers("enemy2"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_3_idle",
            frames: this.anims.generateFrameNumbers("enemy3"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_4_idle",
            frames: this.anims.generateFrameNumbers("enemy4"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "bonus_ship_idle",
            frames: this.anims.generateFrameNumbers("bonus_spaceship"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "enemy_missile",
            frames: this.anims.generateFrameNumbers("enemy_attack"),
            frameRate: 60,
            repeat: -1
        });
        
        this.anims.create({
            key: "player_missile",
            frames: this.anims.generateFrameNumbers("missile"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "boss_idle",
            frames: this.anims.generateFrameNumbers("boss"),
            frameRate: 60,
            repeat: -1
        });

        this.anims.create({
            key: "missile_upgrade",
            frames: this.anims.generateFrameNumbers("missile_powerup"),
            frameRate: 60,
            repeat: -1
        });

        


        this.anims.create({
            key: "shot",
            frames: this.anims.generateFrameNumbers("player_shot",{
                start: 0,
				end: 1
            }),
            
            frameRate: 60,
            repeat: -1
        });


        this.anims.create({
			key: "explode",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 60,
			repeat: 0,
			hideOnComplete: true
        });
        

        

        
    }





}