function padding(s) {
  return s.toLocaleString('en',
    {minimumIntegerDigits:4,minimumFractionDigits:0,useGrouping:false});
}
  class MissileDisplay {
  
    constructor(scene) {
      
      const missileNumConfig =
      { fontSize: '32px',  fontFamily: 'Pixel', fill: "#ffffff" };
      const missileConfig =
        { fontSize: '20px',  fontFamily: 'Pixel', fill: "#ffffff" };


      scene.add.text(650, 550, 'Bombs x ', missileConfig);
      this.bombLabel = scene.add.text(675, 545, '');
      this.bombNumText = scene.add.text(750, 540, '', missileNumConfig);   
      this.missileNumber = 0;


    }

    
    missileExpand() {
      this.missileNumber = this.missileNumber + 3;
      this.print();
    }

    
    missileDeplete() {
      this.missileNumber = this.missileNumber - 1;
      this.print();
    }
  
  
    
    print() {
      return this.bombNumText.setText(
        (this.missileNumber));
    }
  
  }

  class MissileDisplayCarryOver extends MissileDisplay {

  
      constructor(scene, missileNum) {
        super(scene, missileNum);
        
        const missileNumConfig =
        { fontSize: '32px',  fontFamily: 'Pixel', fill: "#ffffff" };
        const missileConfig =
          { fontSize: '20px',  fontFamily: 'Pixel', fill: "#ffffff" };
  
  
        scene.add.text(650, 550, 'Bombs x ', missileConfig);
        this.bombLabel = scene.add.text(675, 545, '');
        this.bombNumText = scene.add.text(750, 540, '', missileNumConfig);   
        this.missileNumber = missileNum;

        
  
  
      }

      print() {
        return this.bombNumText.setText(
          (this.missileNumber));
      }


  }