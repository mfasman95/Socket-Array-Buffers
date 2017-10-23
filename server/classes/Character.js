class Character {
  constructor(hash) {
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = 1;
    this.y = 2;
    this.prevX = 3;
    this.prevY = 4;
    this.destX = 5;
    this.destY = 6;
    this.height = 100;
    this.width = 100;
    this.frame = 0;
    this.frameCount = 0;
    this.alpha = 0;
    this.direction = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.moveUp = false;
  }
  
  static writeIntToBuffer(buffer, integerValue, offset) {

  }
  
  //serialize
  static toCharacterMessage(charObj) {
    let totalLength = 0; //length to allocate for final message
    

  }
}

module.exports = Character;
