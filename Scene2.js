class Scene2 extends Phaser.Scene {
	constructor(){
        super("playGame");
        

    }

    preload(){


        
        var musicConfig ={
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        }


        
        this.titleMusic = this.sound.add('title', musicConfig);
        this.titleMusic.play();


    }

   
    create(){

       
            
        this.background = this.add.tileSprite(0,0, config.width, config.height, "titleScreen");

        this.background.setOrigin(0, 0);

        


        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.attackButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    }

    update(){
        if (this.attackButton.isDown) {
            this.titleMusic.stop();
            this.scene.start('newGame');
        }
        
    }










    
}