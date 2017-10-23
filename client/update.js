const getIntFromBuffer = (buffer, offset) => {
  let val = 0;

  val += buffer.getUint8(offset) * 256;
  val += buffer.getUint8(offset+1);
    
  return val;
};

const parseCharacter = (data) => {
  let totalOffset = 0;

  
  const character = {
    hash: hash,
    lastUpdate: lastUpdate,
    x: x,
    y: y,
    prevX: prevX,
    prevY: prevY,
    destX: destX,
    destY: destY,
    height: height,
    width: width,
    frame: frame,
    frameCount: frameCount,
    alpha: alpha,
    direction: direction,
    moveLeft: moveLeft,
    moveRight: moveRight,
    moveDown: moveDown,
    moveUp: moveUp,
  };
  
  return character;
};

const update = (dataObj) => {
  
  const data = parseCharacter(dataObj);
  
  if(!squares[data.hash]) {
    squares[data.hash] = data;
    return;
  }

  if(data.hash === hash) {
    return;
  }

  if(squares[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  const square = squares[data.hash];
  square.prevX = data.prevX;
  square.prevY = data.prevY;
  square.destX = data.destX;
  square.destY = data.destY;
  square.direction = data.direction;
  square.moveLeft = data.moveLeft;
  square.moveRight = data.moveRight;
  square.moveDown = data.moveDown;
  square.moveUp = data.moveUp;
  square.alpha = 0.05;
};

const removeUser = (dataObj) => {
  const data = parseCharacter(dataObj);
  
  if(squares[data.hash]) {
    delete squares[data.hash];
  }
};

const setUser = (dataObj) => {
  const data = parseCharacter(dataObj);
  
  hash = data.hash;
  squares[hash] = data;
  requestAnimationFrame(redraw);
};

const updatePosition = () => {
  const square = squares[hash];

  square.prevX = square.x;
  square.prevY = square.y;

  if(square.moveUp && square.destY > 0) {
    square.destY -= 2;
  }
  if(square.moveDown && square.destY < 400) {
    square.destY += 2;
  }
  if(square.moveLeft && square.destX > 0) {
    square.destX -= 2;
  }
  if(square.moveRight && square.destX < 400) {
    square.destX += 2;
  }

  if(square.moveUp && square.moveLeft) square.direction = directions.UPLEFT;

  if(square.moveUp && square.moveRight) square.direction = directions.UPRIGHT;

  if(square.moveDown && square.moveLeft) square.direction = directions.DOWNLEFT;

  if(square.moveDown && square.moveRight) square.direction = directions.DOWNRIGHT;

  if(square.moveDown && !(square.moveRight || square.moveLeft)) square.direction = directions.DOWN;

  if(square.moveUp && !(square.moveRight || square.moveLeft)) square.direction = directions.UP;

  if(square.moveLeft && !(square.moveUp || square.moveDown)) square.direction = directions.LEFT;

  if(square.moveRight && !(square.moveUp || square.moveDown)) square.direction = directions.RIGHT;

  square.alpha = 0.05;

  socket.emit('movementUpdate', square);
};