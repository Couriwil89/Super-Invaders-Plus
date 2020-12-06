class Scene3 extends Phaser.Scene {

    init (data)
    {try{
        if (data.scoreSettings != null){
            this.scoreSettingdata = data.scoreSettings;
        }
        if (data.level != null){
            this.levelData = data.level;
        }

        if (data.stage != null) {
            this.stageData = data.stage;
        }
        if(data.missile != null){
            this.missiledata = data.missile;
        }
    }catch(err){
console.log(err);
    }
      }

    constructor(config) {
        super('newGame');
    }

    preload(){

        


        
        var musicConfig ={
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        


        
        this.stageMusic = this.sound.add('stage', musicConfig);
        this.stageMusic.play();
    }


    create() {
        

        this.background = this.add.tileSprite(0, 0, config.width, config.height, "stage1Screen");

        this.background.setOrigin(0, 0);
        
        this.spawnPlayer();
        this.powerup = null;

        this.createText();

        if (this.levelData == null || this.levelData == undefined){
            this.level = 1;
        }else{
            this.level = this.levelData;
        }
        

        if (this.stagedata == null || this.stagedata == undefined){
            this.stage = 1;
        }else{
            this.stage = this.stageData;
        }

        if (this.missiledata == null || this.missiledata == undefined){
            this.player.missiles = 0;
        }else{
            this.player.missiles = this.missiledata;
        }

        this.shotSound = this.sound.add("lasershot");
        this.playerDeathSound = this.sound.add("playerDeath");
        this.enemyDeathSound = this.sound.add("enemyDeath");
        this.spaceshipSound = this.sound.add("spaceshipAlert");
        this.powerupSound = this.sound.add("powerup");

        //player spawn
        //this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.keyboard.on("keydown", this.fireMissile, this);

        //this.enemy1 = this.add.sprite(config.width / 2 - 8, config.height - 500, "enemy1");

        //enemy spawn
        /*  this.enemyGroup = this.physics.add.group();
         this.enemyGroup.enableBody = true;
         this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
  */
        //this.enemies.add(this.enemy1);

        

      /*   this.shots = this.physics.add.group({
            maxSize: 20,
            classType: Shot,
            runChildUpdate: true
        }); */
        this.shots = new Shots(this);

        this.bombs = this.physics.add.group({
            maxSize: 5000,
            classType: Bomb,
            runChildUpdate: true
        });


        this.alienSettings = new AlienSettings(this, this.level);

        this.scoreSettings = new ScoreSettings(this);
        if (this.scoreSettings.score != 0){
            this.scoreSettings = this.scoreSettingdata;
        }
        this.scoreSettings.print();
        this.state = 'stateRunning';

        this.missileDisplay = new MissileDisplay(this);
        this.missileDisplay.print();



        //this.enemy1.play("enemy_1_idle");
        //this.enemy1.setInteractive();






        //this.projectiles = this.add.group();

        /* this.physics.add.collider(this.projectiles, this.enemyGroup, function(projectile, powerUp){
        	
            projectile.destroy();
        	
        }); */

        //this.physics.add.overlap(this.projectiles, this.enemyGroup, this.hitEnemy, null, this);




        this.physics.world.on('worldbounds', this.onWorldbounds, this);
        
        
        this.alienSettings.addColider(this.shots, this.hitEnemy, this);
        this.alienSettings.addColider(this.player, this.enemyContact, this);
        this.physics.add.collider(this.bombs, this.player, this.bombHitEvent, null, this);

        //this.player.play("ship_1_idle");
        //this.player.setInteractive();
        //this.player.setCollideWorldBounds(true);



        //this.physics.add.overlap(this.player, this.enemyGroup, this.touchEnemy, null, this);


        //this.createEnemies();
        this.spawnSpaceShip();

        this.delay = Phaser.Math.Between(10000,16000);
    }

    createText() {
        const sizeY = this.game.canvas.height;
        const sizeX = this.game.canvas.width;
        const textConfig =
            { fontSize: '44px', fontFamily: 'Pixel', fill: "#ffffff" };

        this.gameoverText = this.add.text(sizeX / 2, sizeY / 2 - 100,
            'GAME OVER', textConfig)
            .setVisible(false)
            .setDepth(1);
        this.gameoverText.setOrigin(0.5);

        this.beginText = this.add.text(sizeX / 2, (sizeY / 2) - 60,
            'PRESS ANY KEY TO RESTART', textConfig)
            .setVisible(false)
            .setDepth(1);
        this.beginText.setOrigin(0.5);
    }

    onWorldbounds(body) {
        const isShot = this.shots.contains(body.gameObject);
        if (isShot) {
            body.gameObject.deactivate();
        }

        const isBomb = this.bombs.contains(body.gameObject);
        if (isBomb) {
            body.gameObject.deactivate();
        }

        if (this.state == 'stateRunning') {
            if (this.alienSettings.onWorldbounds(body)) {
                this.gameover();
            }
        };
    };

    spawnPlayer(){
        this.player = playerCreate.create(this);
        this.player.play("ship_1_idle");
    }



    update() {

        this.playerMovement();

        this.background.tilePositionY -= 0.5;
        
        this.physics.add.collider(this.spaceship, this.shots, this.hitBonusShip, null, this);
        this.physics.add.collider(this.player, this.powerup, this.grantMissiles, null, this);





        /* if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active) {
                this.shootLaser();
            }
        } */

        //for (var i = 0; i < this.projectiles.getChildren().length; i++) {
        //    var shot = this.projectiles.getChildren()[i];
        //    shot.update();
        //}

        //this.enemyMovement();

    }
    

    playerMovement() {

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        }else if (this.cursorKeys.left.isUp || this.cursorKeys.right.isUp) {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        }
    }

    /*  enemyMovement() {
         this.enemyGroup.setVelocityX(20);
         if (this.enemyGroup.x < 32 || this.enemyGroup.x > (config.width - 32)) {
             this.descend(this.enemyGroup);
         } */

    //enemyMove.onLoop.add(this.descend, this);

    //}

    /* descend(enemy) {

        enemyGroup.y += 10;

    } */

    fireMissile(e){

                if (e.code == "ArrowDown" && this.player.missiles > 0) {
        this.missileObject = this.physics.add.sprite(this.player.x, this.player.y - 28, "missile");
        this.missileObject.play("player_missile");
        this.missileObject.setInteractive();
        this.missileObject.setVelocityY(-350);
                }

    }
    shootLaser() {    
        try {           
                this.shots.fireShot(this.player.x, this.player.y - 28);
                this.shotSound.play();
        } catch (err) {
            console.log(err);
        }
    }

    spawnSpaceShip(){
        this.spaceshipSound.play();
        this.spaceship = this.physics.add.sprite(-100, 30, "bonus_spaceship");
        this.spaceship.play("bonus_ship_idle");
        this.spaceship.setInteractive();
        
        this.spaceship.setVelocityX(125);
        if (this.spaceship.x > 800) {
			this.spaceship.destroy();
		}

    }



    /*  hitEnemy(projectile, enemy) {
         this.enemyDeathSound.play();
         var explosion = new Explosion(this, enemy.x, enemy.y);
         projectile.destroy();
         enemy.destroy();
     } */
    hitEnemy(enemy, projectile) {
        if (this.state == 'stateRunning' && enemy.active && projectile.active) {
            
            var randomBonusNum = Math.floor(Math.random() * (21- 1)) + 1;

            this.enemyDeathSound.play();
            projectile.destroy();
            enemy.destroy();
            if (randomBonusNum == 20){
            this.bonusShipTrigger = this.time.delayedCall(this.delay, this.spawnSpaceShip());
            }
            var explosion = new Explosion(this, enemy.x, enemy.y);
            this.scoreSettings.point();
            if (this.alienSettings.testAllAliensDead()) {               
                
                this.levelUp();
            }
        }
    }

    hitBonusShip(enemy, projectile){
        this.enemyDeathSound.play();
        projectile.destroy();
        
        

        this.powerup = this.physics.add.sprite(enemy.x, enemy.y, "missile_powerup");
        this.powerup.setVelocityY(200);

        if (this.powerup.y > 600) {
			this.powerup.destroy();
        }
        
        var explosion = new Explosion(this, enemy.x, enemy.y);
        enemy.destroy();

        
    }

    grantMissiles(player, pwup){

        player.missiles = player.missiles + 3;
        
        this.missileDisplay.missileExpand();
        this.powerupSound.play();

        pwup.destroy();
        //this.updateBombCount(player.missiles);

    }
    

    enemyContact(enemy, player) {
        if (this.state == 'stateRunning' && enemy.active) {
            this.gameover();
        }
    }

    bombHitEvent(bomb, player) {
        if (this.state == 'stateRunning') {
            this.gameover();
        }
    }

    levelUp() {
        this.level++;
        this.stage++;
        this.time.addEvent(
            { delay: 2000, callback: this.reloadenemies(), callbackScope: this });
            if (this.stage != 1 && ((this.stage % 3)=== 0)){
                
                this.stageMusic.stop();
                this.scene.start('bossLevel', {scoreSettings: this.scoreSettings, level: this.level, stage: this.stage, missile: this.player.missiles});
            }
    }

    reloadenemies(){
        
        this.alienSettings.restart(this.level);

    }

    restart() {
        if (this.state == 'stateRunning'){            
            this.scene.start('newGame');
        }
        
    }

    gameover() {
        this.state = 'stateGameOver';
        this.stageMusic.stop();
        this.touchEnemy();
        this.time.removeAllEvents();
        this.alienSettings.gameover();
        this.shots.getChildren().forEach(
            function (shot) { shot.destroy(); }
        );
        this.bombs.setVelocityX(0);
        this.bombs.setVelocityY(0);
        this.gameoverText.setVisible(true);
        this.aliensStartVelocity = 40;

        this.time.addEvent({
            delay: 3000,
            callback: function () { this.ready(); },
            callbackScope: this
        });
    }

    ready() {
        this.state = 'stateReady'
        this.beginText.setVisible(true);
    }

    restartGame() {
        this.state = 'stateRunning';
        this.level = 1;
        this.stage = 1;        
        this.data = null;
        this.scoreSettings.setHiScore();

        this.player.play('ship_1_idle');
        this.beginText.setVisible(false);
        this.gameoverText.setVisible(false);
        this.bombs.getChildren().forEach(
            function (bomb) { bomb.destroy(); }
        );
        this.restart();
    }


    touchEnemy() {
        
/* 
            if (this.player.alpha < 1) {
                return;
            } */
            this.playerDeathSound.play();
            var explosion = new Explosion(this, this.player.x, this.player.y);
            this.player.disableBody(true, true);

             /* this.time.addEvent({
                delay: 1000,
                callback: this.resetPlayer,
                callbackScope: this,
                loop: false
            }); */
 

            //this.gameover();

        
    }


    handleKey(e) {
        switch (this.state) {
            case 'stateRunning':
                if (e.code == "Space") {
                    this.shootLaser();
                }
                break;
            case 'stateReady':
                this.restartGame();
                break;
        }
    }

     resetPlayer() {
        var x = config.width / 2 - 8;
        var y = config.height + 64;
        this.player.enableBody(true, x, y, true, true);

        this.player.alpha = 0.5;

        var tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: 'Power1',
            duration: 1500,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    } 


    /* createEnemies() {



        for (var y = 1; y < 5; y++) {
            for (var x = 1; x < 15; x++) {
                var enemy = this.enemyGroup.create(x * 48, y * 50, 'enemy1');
                enemy.play('enemy_1_idle');
                this.setCollideWorldBounds(true);
            }

        }


        this.enemyMovement(this.enemyGroup, 20); */




    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    //var enemyMove = this.add.tween(this.enemyGroup).to( { y: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    //enemyMove.onLoop.add(this.descend, this);
    //}







}