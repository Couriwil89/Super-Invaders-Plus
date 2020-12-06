
class Scene4 extends Phaser.Scene {

    init(data) {
        try {
            if (data.scoreSettings !== null) {
                this.scoreSettingdata = data.scoreSettings;
            }
            if (data.level !== null) {
                this.levelData = data.level;
            }

            if (data.stage !== null) {
                this.stageData = data.stage;
            }
            if (data.missile !== null) {
                this.missiledata = data.missile;
            }
        } catch (err) {
            console.log(err);
        }
    }
    constructor(config) {
        super('bossLevel');

    }



    preload() {

        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.bossMusic = this.sound.add('boss', musicConfig);
        this.bossMusic.play();
    }
    create() {
        
        
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "stageBScreen");

        this.background.setOrigin(0, 0);

        this.spawnPlayer();

        this.level = this.levelData;
        this.stage = this.stageData;
        this.player.missiles = this.missiledata;
        this.missileObject;


        this.createVictoryText();
        this.createDefeatText();




        this.shotSound = this.sound.add("lasershot");
        this.playerDeathSound = this.sound.add("playerDeath");
        this.enemyDeathSound = this.sound.add("enemyDeath");
        this.powerupSound = this.sound.add("powerup");
        this.bigExplosionSound = this.sound.add("bigExplosion");
        this.enemyHurtSound = this.sound.add("enemyHurt");

        this.victorySound = this.sound.add("victory");

        //player spawn
        //this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on("keydown", this.handleKey, this);
        this.input.keyboard.on("keydown", this.fireMissile, this);

        this.bossEnemy = this.physics.add.sprite(config.width / 2, 50, "boss");
        this.bossEnemy.enableBody = true;
        this.bossEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        this.bossEnemy.setBounceX(1);
        this.bossEnemy.setBounceY(1);
        this.bossEnemy.setVelocityX(100);
        this.bossEnemy.setVelocityY(250);
        this.bossEnemy.setCollideWorldBounds(true);
        this.bossEnemy.health = 60;


        //enemy spawn
        /*  this.enemyGroup = this.physics.add.group();
         this.enemyGroup.enableBody = true;
         this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
  */
        //this.enemies.add(this.enemy1);


        this.shots = new Shots(this);

        this.bombs = this.physics.add.group({
            maxSize: 20,
            classType: Bomb,
            runChildUpdate: true
        });


        this.scoreSettings = new ScoreSettings(this);
          if (typeof this.scoreSettingdata !== "undefined") {
            this.scoreSettings = new RetrieveScoreSettings(this, this.scoreSettingdata);
            this.scoreSettings.print();
        }  

        
        
        this.physics.add.overlap(this.bossEnemy, this.player, this.gameover, null, this);
        this.physics.add.overlap(this.shots, this.bossEnemy, this.hitEnemy, null, this);
        
        


        

        //this.scoreSettings.print();
        this.state = 'stateRunning';

        this.missileDisplay = new MissileDisplay(this);
        if(typeof this.missiledata !== "undefined"){
            this.missileDisplay = new MissileDisplayCarryOver(this, this.missiledata);
            this.missileDisplay.print();
        }
        this.missileDisplay.print();


        


    }

    

    createVictoryText() {
        const sizeY = this.game.canvas.height;
        const sizeX = this.game.canvas.width;
        const textConfig =
            { fontSize: '44px', fontFamily: 'Pixel', fill: "#ffffff" };

        this.victoryText = this.add.text(sizeX / 2, sizeY / 2 - 100,
            'CONGRATULATIONS!', textConfig)
            .setVisible(false)
            .setDepth(1);
        this.victoryText.setOrigin(0.5);

        this.beginText = this.add.text(sizeX / 2, (sizeY / 2) - 60,
            'PRESS ANY KEY TO START A NEW GAME', textConfig)
            .setVisible(false)
            .setDepth(1);
        this.beginText.setOrigin(0.5);
    }

    createDefeatText() {
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




    touchEnemy() {

        this.playerDeathSound.play();
        var explosion = new Explosion(this, this.player.x, this.player.y);
        this.player.disableBody(true, true);

    }

    spawnPlayer() {
        this.player = playerCreate.create(this);
    }

    shootLaser() {

        try {

            this.shots.fireShot(this.player.x, this.player.y - 28);


        } catch (err) {
            console.log(err);

        }

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

            case 'stateGameWon':
                this.newGamePlus();
                break;
        }
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

    createMissile(){
        this.missileObject = this.physics.add.sprite(this.player.x, this.player.y - 28, "missile");
        this.missileObject.play("player_missile");
        this.missileObject.setInteractive();
        this.missileObject.body.onWorldBounds = true;
        return this.missileObject;

    }

    fireMissile(e) {

        if (e.code == "ArrowDown" && this.player.missiles > 0) {
            this.player.missiles = this.player.missiles - 1;
            this.completeMissile = this.createMissile();
            this.missileDisplay.missileDeplete();
            
            this.completeMissile.setVelocityY(-400);

            if(this.completeMissile.y < 0)
            {
                this.completeMissile.destroy();
            }

        }

    }


    missileExplode(enemy, projectile) {

        this.explosionLarge = new BigExplosion(this, enemy.x, enemy.y);


        this.bigExplosionSound.play();

        this.bossEnemy.health = this.bossEnemy.health - 5;
        this.scoreSettings.point();


        this.enemyHurtSound.play();
        projectile.destroy();
        this.checkifDead(enemy);

    }

    restart() {
        if (this.state == 'stateGameOver' || this.state == 'stateRunning') {
            this.scene.start('newGame');
        }
        if (alienSettings != undefined || alienSettings != null) {
            this.alienSettings.restart(this.level);
        }

    }

    continueGame() {
        if (this.state == 'stateGameWon') {
            this.scene.start('newGame', { scoreSettings: this.scoreSettings, level: this.level, stage: this.stage, missile: this.player.missiles });
        }
        if (alienSettings != undefined || alienSettings != null) {
            this.alienSettings.restart(this.level);
        }
    }

    newGamePlus() {
        this.scoreSettings.setHiScore();
        this.player.play('ship_1_idle');
        this.beginText.setVisible(false);
        this.gameoverText.setVisible(false);
        this.bombs.getChildren().forEach(
            function (bomb) { bomb.destroy(); }
        );
        this.continueGame();
    }


    hitEnemy(enemy, projectile) {
        if (this.state == 'stateRunning' && enemy.active && projectile.active) {

            this.enemyHurtSound.play();
            projectile.destroy();
            this.bossEnemy.health = this.bossEnemy.health - 1;
            this.scoreSettings.point();
            this.checkifDead(enemy);
            
        }
    }

    checkifDead(enemy){
        if (this.bossEnemy.health <= 0) {
            var explosion = new Explosion(this, enemy.x, enemy.y);
            this.enemyDeathSound.play();
            enemy.destroy();
            this.bossMusic.stop()
            this.victorySound.play();
            this.level = this.level - 1;
            this.stage++;
            this.gameWin();
        }else{
            return;
        }

    }




    update() {

        this.playerMovement();

        this.background.tilePositionY -= 0.5;
        
        this.physics.add.collider(this.bossEnemy, this.completeMissile, this.missileExplode, null, this);

        



    }

    playerMovement() {

        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed);
        } else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed);
        } else if (this.cursorKeys.left.isUp || this.cursorKeys.right.isUp) {
            this.player.setVelocityX(0);
        }

    }

    
    createMissile(){
        this.missileObject = this.physics.add.sprite(this.player.x, this.player.y - 28, "missile");
        this.missileObject.play("player_missile");
        this.missileObject.setInteractive();
        this.missileObject.body.onWorldBounds = true;
        return this.missileObject;

    }

    fireMissile(e) {
        

        if (e.code === "ArrowDown" && this.player.missiles > 0) {
            this.player.missiles = this.player.missiles - 1;
            this.completeMissile = this.createMissile();
            this.missileDisplay.missileDeplete();
            
            this.completeMissile.setVelocityY(-400);

            if(this.completeMissile.y < 0)
            {
                this.completeMissile.destroy();
            }

        }

    }

    


    ready() {
        if (this.state == 'stateGameWon'){
            this.beginText.setVisible(true);
            return;
        }
        this.state = 'stateReady'
        this.beginText.setVisible(true);
    }


    gameover() {
        this.state = 'stateGameOver';
        this.touchEnemy();
        this.bossMusic.stop();
        this.time.removeAllEvents();
        this.shots.getChildren().forEach(
            function (shot) { shot.destroy(); }
        );
        this.bombs.setVelocityX(0);
        this.bombs.setVelocityY(0);
        this.gameoverText.setVisible(true);

        this.time.addEvent({
            delay: 3000,
            callback: function () { this.ready(); },
            callbackScope: this
        });
    }

    gameWin() {
        this.state = 'stateGameWon';
        this.time.removeAllEvents();
        this.bossMusic.stop();
        this.shots.getChildren().forEach(
            function (shot) { shot.destroy(); }
        );
        this.bombs.setVelocityX(0);
        this.bombs.setVelocityY(0);
        this.victoryText.setVisible(true);

        this.time.addEvent({
            delay: 3000,
            callback: function () { this.ready(); },
            callbackScope: this
        });
    }







}