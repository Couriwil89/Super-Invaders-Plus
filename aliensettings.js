



 class AlienSettings{
  deactivateAlien(alien) {
    alien.deactivate();
  }


  constructor(scene, level) {
    this.scene = scene;
    this.newAlien = new Alien(this.scene, level);
    this.maxY = this.scene.game.canvas.height;
    this.aliensStartVelocity = 40;

    this.aliens1 = this.scene.physics.add.group({
      maxSize: 26,
      classType: Alien,
      runChildUpdate: true
    });

    this.aliens2 = this.scene.physics.add.group({
      maxSize: 26,
      classType: Alien,
      runChildUpdate: true
    });
    this.aliens3 = this.scene.physics.add.group({
      maxSize: 13,
      classType: Alien,
      runChildUpdate: true
    });

    this.init(level);
  }

  addColider(other, eventHandler, scene) {
    scene.physics.add.overlap(this.aliens1, other, eventHandler, null, scene);
    scene.physics.add.overlap(this.aliens2, other, eventHandler, null, scene);
    scene.physics.add.overlap(this.aliens3, other, eventHandler, null, scene);
  }

  restart(level) {
    this.level = level;
    this.forAllAliens(this.deactivateAlien);
    this.init(level);
  }

  init(level) {
    this.level = level;
    this.makeAlienRow(0, this.aliens1);
    this.makeAlienRow(1, this.aliens2);
    this.makeAlienRow(2, this.aliens3);

    this.aliensVelocity = this.aliensStartVelocity + (5 * (level - 1));
    this.aliens1.setVelocityX(this.aliensVelocity);
    this.aliens2.setVelocityX(this.aliensVelocity);
    this.aliens3.setVelocityX(this.aliensVelocity);

    this.alienThrowsBombInFuture();
  }

  makeAlienRow(row, aliens) {
    try{
    for (var column = 0; column <= 12; column++) {
      let x = 100 + (column * 54);
      let y = 70 + (row * 50);
      aliens.get().activate(x, y);
    
    }
  }
  catch(err){
    console.log(err);
  }
  }


  countAliensDetailed() {
    const nrOfAliens1 = this.aliens1.countActive();
    const nrOfAliens2 = this.aliens2.countActive();
    const nrOfAliens3 = this.aliens3.countActive();
    const nrOfAliens = nrOfAliens1 + nrOfAliens2 + nrOfAliens3;
    return {
      all: nrOfAliens,
      aliens1: nrOfAliens1,
      aliens2: nrOfAliens2,
      aliens3: nrOfAliens1
    }
  }

  testAllAliensDead() {
    return this.countAliensDetailed().all === 0;
  }

  getRandomAlien() {
    const count = this.countAliensDetailed();
    if (count.all > 0) {
      let alienIndex = Math.floor(Math.random() * count.all);
      let aliens = this.aliens1;
      if (alienIndex >= count.aliens1) {
        aliens = this.aliens2;
        alienIndex -= count.aliens1;
      }
      if (alienIndex >= count.aliens2) {
        aliens = this.aliens3;
        alienIndex -= count.aliens2;
      }
     
      const alien = aliens.getFirstNth(alienIndex, true, false);
      return alien;
    }
  }

  alienThrowsBombInFuture() {
    let delay = 400 + Math.random() * 4000;
    this.scene.time.addEvent({
      delay: delay,
      callback: this.alienThrowsBomb,
      callbackScope: this
    });
  }

  alienThrowsBomb() {
    if (this.scene.state == 'stateRunning') {
      const alien = this.getRandomAlien();
      if (alien !== undefined && alien !== null) {
        this.scene.bombs.get().throw(alien.x, alien.y+10);
      }
    }
    this.alienThrowsBombInFuture();
  }

  onWorldbounds(body) {
    let gameover = false;
    if (body.gameObject.active) {
      const isAlien = this.aliens1.contains(body.gameObject) || this.aliens2.contains(body.gameObject) || this.aliens3.contains(body.gameObject);
      if (isAlien) {
        this.aliensVelocity = -this.aliensVelocity * 1.02;
        this.aliens1.setVelocityX(this.aliensVelocity);
        this.aliens2.setVelocityX(this.aliensVelocity);
        this.aliens3.setVelocityX(this.aliensVelocity);

        const isLanded = (function(alien) {
          return(alien.y+5 > this.maxY);
        }).bind(this);

        function moveAlienDown(alien) {
          alien.y += 5;
        }

        gameover =
          this.aliens1.getChildren().find(isLanded)
          || this.aliens2.getChildren().find(isLanded)
          || this.aliens3.getChildren().find(isLanded);
        if (!gameover) {
          this.forAllAliens(moveAlienDown);
        }
      }
    }
    return gameover;
  }

  forAllAliens(f) {
    this.aliens1.getChildren().forEach(f);
    this.aliens2.getChildren().forEach(f);
    this.aliens3.getChildren().forEach(f);
  }

  gameover() {
    this.aliens1.setVelocityX(0);
    this.aliens1.setVelocityY(0);
    this.aliens2.setVelocityX(0);
    this.aliens2.setVelocityY(0);
    this.aliens3.setVelocityX(0);
    this.aliens3.setVelocityY(0);
  }

}