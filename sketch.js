//refer to https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_depth-first_search for more information.

var cW = 600; //Change this to change canvas width
var cH = 600; //Change this to change canvas height
var size = 5; //Change this to change cell size

var cols, rows;
var grid = [];
var currIndex = 0;
var stack = [];
var NeighbourIndex;


//p5js setup (runs once on startup)
function setup() {
  createCanvas(cW, cH);
  cols = floor(width/size);
  rows = floor(height/size);
  
  //frameRate(5); //Uncomment this line to see your maze generate slowly
  

  //Creates a grid
  for(i = 0; i < rows; i++){
    for(j = 0;j < cols; j++){
      grid.push(new cell(j, i))
    }
  }

  //Pushes the Initial position to a stack
  stack.push(currIndex);
}

//p5js draw function (runs once every frame)
function draw() {
  background(220);
  
  //Draws the grid every frame
  for(i = 0; i < grid.length; i++){
    var x = grid[i].i * size;
    var y = grid[i].j * size;
    
    //top wall
    if(grid[i].walls[0]){
      line(x,y,x,y+size);
    }

    //right wall
    if(grid[i].walls[1]){
      line(x,y+size,x+size,y+size);
    }

    //bottom wall
    if(grid[i].walls[2]){
      line(x+size,y+size,x+size, y);
    }

    //left wall
    if(grid[i].walls[3]){
      line(x+size,y,x,y);
    }
  }
  
  //marks the current cell as visited
  grid[currIndex].visited = true;
  
  //displays the current cell
  if(grid[currIndex].visited){
    fill('red');
    rect(grid[currIndex].i*size, grid[currIndex].j*size, size, size);
  }
  
  //Recursive Backtracking algorithm
  if(stack.length > 0){
    currIndex = stack.pop();
    NeighbourIndex = getRandomUnvisitedNeighbour(grid, currIndex);
    if(NeighbourIndex > 0){
      stack.push(currIndex);
      removeWalls(grid, currIndex, NeighbourIndex);
      stack.push(NeighbourIndex);
    }
  }
}


//returns the index of any one unvisited neighbour
function getRandomUnvisitedNeighbour(grid, i){
  var neighbours = [];
  
  var gridI = grid[i].i;
  var gridJ = grid[i].j;

  //top neighbour
  if(gridI > 0){
    if(!grid[getIndex(gridI-1,gridJ)].visited){
      neighbours.push(grid[getIndex(gridI-1,gridJ)]);
    }
  }

  //left neighbour
  if(gridJ > 0){
    if(!grid[getIndex(gridI,gridJ-1)].visited){
      neighbours.push(grid[getIndex(gridI,gridJ-1)]);
    }
  }

  //right neighbour
  if(gridJ < cols - 1){
    if(!grid[getIndex(gridI,gridJ+1)].visited){
      neighbours.push(grid[getIndex(gridI,gridJ+1)]);
    }
  }

  //bottom neighbour
  if(gridI < rows - 1){
    if(!grid[getIndex(gridI+1,gridJ)].visited){
      neighbours.push(grid[getIndex(gridI+1,gridJ)]);
    }
  }

  //randomly returns the index of a neighbour form a list of neighbours
  if(neighbours.length > 0){
    var randomNeighbour = neighbours[floor(random(0, neighbours.length))];
    return getIndex(randomNeighbour.i, randomNeighbour.j);
  }

  //else returns -1
  else{
    return -1;
  }
}


//converts 2d array position to 1d array position
function getIndex(i, j){
  var index = i + cols * j;
  return Math.floor(index);
}


//removes the wall between two cells
function removeWalls(grid, i, nI){
  var dX = grid[i].i - grid[nI].i;
  var dY = grid[i].j - grid[nI].j;
  
  //removes top wall
  if(dX == 1){
    grid[i].walls[0] = false;
    grid[nI].walls[2] = false;
  }

  //removes bottom wall
  if(dX == -1){
    grid[i].walls[2] = false;
    grid[nI].walls[0] = false;
  }

  //removes left wall
  if(dY == 1){
    grid[i].walls[3] = false;
    grid[nI].walls[1] = false;
  }

  //removes right wall
  if(dY == -1){
    grid[i].walls[1] = false;
    grid[nI].walls[3] = false;
  }
}


//cell definition
function cell(i, j){
  this.j = j;
  this.i = i;
  
  this.visited = false;
  this.walls = [true, true, true, true];
}
