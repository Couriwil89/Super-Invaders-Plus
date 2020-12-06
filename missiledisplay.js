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


      scene.add.text(700, 550, 'Bombs x ', missileConfig);
      this.bombLabel = scene.add.text(700, 545, '');
      this.bombNumText = scene.add.text(775, 540, '', missileNumConfig);   
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