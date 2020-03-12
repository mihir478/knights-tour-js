const drawBoard = side => {
  for(let r = 0; r < 8; ++r)
    for (let c = 0; c < 8; ++c) {
      const square = document.createElement('div');
      const even = (r + c) % 2 == 0;
      square.className = `${r}-${c}`;
      square.style.backgroundColor = even ? 'white' : 'black';
      square.style.color = even ? 'black' : 'white'; // text color
      square.style.height = side;
      square.style.left = side * c;
      square.style.position = 'absolute';
      square.style.textAlign = 'center';
      square.style.lineHeight = `${side}px`; // center text vertically
      square.style.top = side * r;
      square.style.width = side;
      square.style.zIndex = 0;
      document.body.appendChild(square);
    }
  
  const dim = 32;
  const knight = document.createElement('img');
  knight.src = 'chess.png';
  knight.style.height = dim;
  knight.style.left = 8;
  knight.style.position = 'absolute';
  knight.style.top = 8;
  knight.style.width = dim;
  knight.style.zIndex = 1;
  document.body.appendChild(knight); // add square to the html body
}

const withinBounds = i => i > -1 && i < 8;

const countOutboundMoves = (board, r, c, moves) => {
  board[r][c] = 0;
  for(let move of moves)
    if(withinBounds(move.r + r) && withinBounds(move.c + c))
      board[r][c] += 1;
}

const initBoardState = moves => {
  
  const board = new Array(8);
  for(let r = 0; r < 8; ++r)
    board[r] = new Array(8);
  
  for(let r = 0; r < 8; ++r)
    for (let c = 0; c < 8; ++c)
      countOutboundMoves(board, r, c, moves);
  
  return board;
}

const tour = (r, c, moves, moveNumber, board, side) => {
  // base case
  if (moveNumber > 64)
    return;
  
  let nextR = 0, nextC = 0, minOutbound = 9;
  // determine next move
  for(let move of moves) {
    const candidateR = move.r + r;
    const candidateC = move.c + c;
    if(withinBounds(candidateR) && withinBounds(candidateC) && board[candidateR][candidateC] < minOutbound) {
      minOutbound = board[candidateR][candidateC];
      nextR = candidateR;
      nextC = candidateC;
    }
  }
  
  // mark square as taken
  board[r][c] = 100;

  // update neighbors outbound
  for(let move of moves) {
    const neighborR = move.r + r;
    const neighborC = move.c + c;
    if(withinBounds(neighborR) && withinBounds(neighborC)) {
      board[neighborR][neighborC]--;
    }
  }

  // update text and move knight
  document.getElementsByClassName(`${r}-${c}`)[0].textContent = moveNumber;
  const knight = document.getElementsByTagName('img')[0];
  knight.style.top = r * side + 8;
  knight.style.left = c * side + 8;

  // recursive case
  setTimeout(() => {
    tour(nextR, nextC, moves, moveNumber + 1, board, side);
  }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
  const moves = [
    {r: -2, c: -1},
    {r: -2, c:  1},
    {r:  2, c: -1},
    {r:  2, c:  1},
    {r: -1, c: -2},
    {r: -1, c:  2},
    {r:  1, c: -2},
    {r:  1, c:  2},
  ];
  const side = 50;

  drawBoard(side);
  const board = initBoardState(moves);
  tour(0, 0, moves, 1, board, side);
});
