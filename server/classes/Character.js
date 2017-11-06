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
    const intValue = (integerValue < 0) ? 0 : integerValue;
    
    const byteCount = Math.floor(intValue / 256);
    const remainder = Math.floor(intValue % 256);
    
    
    
    buffer.writeUInt8(byteCount, offset);
    buffer.writeUInt8(remainder, offset+1);
    
    return buffer;
  }
  
  //serialize
  static toCharacterMessage(charObj) {
    let totalLength = 0; //length to allocate for final message
    
    const hashBuffer = Buffer.from(charObj.hash, 'utf-8');
    const hashLength = hashBuffer.byteLength;
    totalLength += hashLength;

    const dateBuffer = Buffer.alloc(8); //8 bytes in a double
    //write double, read on the client as getFloat64 from dataview
    dateBuffer.writeDoubleBE(charObj.lastUpdate);
    const dateLength = dateBuffer.byteLength;
    totalLength += dateLength;

    //each numeric value, we will send 2 bytes for
    /**
      One byte will be for how multiples of 256 this value is
      One byte will be for the remainder
      the value 300 is 256 + 44
      The first byte (how many 256s there are) will be 1
      The second byte will be 44
      Thus when it's reassembled it will be (256 * 1) + 44
      
      The number 513 would be 2 256s and a remainder of 1
      The first byte would be 2
      The second byte will be 1
      When it's reassembled it will be (256 * 2) + 1 
    **/
    totalLength += 2; //bytes for x value
    totalLength += 2; //bytes for y value
    totalLength += 2; //bytes for prevX
    totalLength += 2; //bytes for prevY
    totalLength += 2; //bytes for destX
    totalLength += 2; //bytes for destY
    totalLength += 2; //bytes for height
    totalLength += 2; //bytes for width
    totalLength += 2; //bytes for frame
    totalLength += 2; //bytes for frameCounter
    
    totalLength += 4; //bytes for alpha (FLOAT)
    
    totalLength += 1; //byte for direction (can only be 0-9 in this app)
    
    totalLength += 1; //byte for moveLeft (boolean can only be 0 or 1)
    totalLength += 1; //byte for moveRight (boolean can only be 0 or 1)
    totalLength += 1; //byte for moveDown (boolean can only be 0 or 1)
    totalLength += 1; //byte for moveUp (boolean can only be 0 or 1)
    
    let offset = 0;
    //allocate as much memory needed + a byte for each varying length variable
    //2 varying length variables were sending - hash + date. 
    //We will send special bytes saying the number of bytes being recieved
    //for varying length variables (like hash and date)
    //Otherwise the client will not know how to parse the data from them
    let message = Buffer.alloc(totalLength + 2);
    
    message.writeInt8(hashLength);
    offset += 1;
    
    hashBuffer.copy(message, offset);
    offset += hashLength;
    
    message.writeInt8(dateLength, offset);
    offset += 1;
    
    dateBuffer.copy(message, offset);
    offset += dateLength;
    
    message = Character.writeIntToBuffer(message, charObj.x, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.y, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.prevX, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.prevY, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.destX, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.destY, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.height, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.width, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.frame, offset);
    offset += 2;
    
    message = Character.writeIntToBuffer(message, charObj.frameCount, offset);
    offset += 2;

    message.writeFloatBE(charObj.alpha, offset);
    offset += 4;
    
    message.writeInt8(charObj.direction, offset);
    offset += 1;
    
    message.writeInt8(charObj.moveLeft, offset);
    offset += 1;
    
    message.writeInt8(charObj.moveRight, offset);
    offset += 1;
    
    message.writeInt8(charObj.moveDown, offset);
    offset += 1;
    
    message.writeInt8(charObj.moveUp, offset);
    offset += 1;

    return message;
  }
}

module.exports = Character;
