
class Scene4 extends Phaser.Scene {

    init(data) {
        if (data.scoreSettings != null) {
            this.scoreSettingdata = data.scoreSettings;
        }
        if (data.level != null) {
            this.levelData = data.level;
        }

        if (data.stage != null) {
            this.stageData = data.stage;
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

        this.level = this.levelData;
        this.stage = this.stageData;


        this.createVictoryText();
        this.createDefeatText();

        this.player = null;



        this.background = this.add.tileSprite(0, 0, config.width, config.height, "stageBScreen");

        this.background.setOrigin(0, 0);
        this.shotSound = this.sound.add("lasershot");
        this.playerDeathSound = this.sound.add("playerDeath");
        this.enemyDeathSound = this.sound.add("enemyDeath");
        this.enemyHurtSound = this.sound.add("enemyHurt");
        this.spaceshipSound = this.sound.add("spaceshipAlert");

        this.victorySound = this.sound.add("victory");

        //player spawn
        //this.player = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "player");
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on("keydown", this.handleKey, this);

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
        this.spawnPlayer();


        this.shots = new Shots(this);

        this.bombs = this.physics.add.group({
            maxSize: 20,
            classType: Bomb,
            runChildUpdate: true
        });

        this.physics.add.overlap(this.bossEnemy, this.player, this.gameover, null, this);
        this.physics.add.overlap(this.shots, this.bossEnemy, this.hitEnemy, null, this);

        this.scoreSettings = new ScoreSettings(this);
        if (this.scoreSettings.score != 0) {
            this.scoreSettings = this.scoreSettingdata;
        }
        this.scoreSettings.print();
        this.state = 'stateRunning';


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
            this.scene.start('newGame', { scoreSettings: this.scoreSettings, level: this.level, stage: this.stage });
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
            console.log(this.bossEnemy.health);
            if (this.bossEnemy.health === 0) {
                var explosion = new Explosion(this, enemy.x, enemy.y);
                this.enemyDeathSound.play();
                enemy.destroy();
                this.bossMusic.stop()
                this.victorySound.play();
                this.level = this.level - 1;
                this.stage++;
                this.gameWin();
            }
        }
    }




    update() {

        this.playerMovement();

        this.background.tilePositionY -= 0.5;


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
        } else if (this.cursorKeys.left.isUp || this.cursorKeys.right.isUp) {
            this.player.setVelocityX(0);
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