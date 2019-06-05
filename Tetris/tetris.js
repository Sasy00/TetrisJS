//Version 1.0

/*
	TODO:
		punti
*/

//punti = 40 * (n + 1)	100 * (n + 1)	300 * (n + 1)	1200 * (n + 1)

var cvs;
var ctx;

var next_cvs;
var next_ctx;

var playerSpan;

const ROWS = 20;
const COLS = 10;
const DIM = 4;
const RECT_SIZE = 32;

var board=
{
    w:0,
    h:0,
    x:0,
    y:0
}

var L = //array of array of L pieces. each array is a rotation
[
    [
        0,0,0,0,
        0,1,0,0,
        0,1,0,0,
        0,1,1,0
    ],
    [
        0,0,0,0,
        1,1,1,0,
        1,0,0,0,
        0,0,0,0
    ],
    [
        0,1,1,0,
        0,0,1,0,
        0,0,1,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,0,0,1,
        0,1,1,1,
        0,0,0,0
    ]
];
var J = 
[
    [
        0,0,0,0,
        0,0,2,0,
        0,0,2,0,
        0,2,2,0
    ],
    [
        0,0,0,0,
        2,0,0,0,
        2,2,2,0,
        0,0,0,0
    ],
    [
        0,2,2,0,
        0,2,0,0,
        0,2,0,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,2,2,2,
        0,0,0,2,
        0,0,0,0
    ]
];
var S = //array of array of L pieces. each array is a rotation
[
    [
        0,0,0,0,
        0,3,0,0,
        0,3,3,0,
        0,0,3,0
    ],
    [
        0,0,0,0,
        0,3,3,0,
        3,3,0,0,
        0,0,0,0
    ],
    [
        0,3,0,0,
        0,3,3,0,
        0,0,3,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,0,3,3,
        0,3,3,0,
        0,0,0,0
    ]
];
var Z = //array of array of L pieces. each array is a rotation
[
    [
        0,0,0,0,
        0,0,4,0,
        0,4,4,0,
        0,4,0,0
    ],
    [
        0,0,0,0,
        4,4,0,0,
        0,4,4,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,0,4,0,
        0,4,4,0,
        0,4,0,0
    ],
    [
        0,0,0,0,
        4,4,0,0,
        0,4,4,0,
        0,0,0,0
    ],
];
var T = //array of array of L pieces. each array is a rotation
[
    [
        0,0,0,0,
        0,0,0,0,
        0,5,0,0,
        5,5,5,0
    ],
    [
        0,0,0,0,
        5,0,0,0,
        5,5,0,0,
        5,0,0,0
    ],
    [
        0,0,0,0,
        5,5,5,0,
        0,5,0,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,0,5,0,
        0,5,5,0,
        0,0,5,0
    ]
];

var I = //array of array of L pieces. each array is a rotation
[
    [
        0,0,0,0,
        6,6,6,6,
        0,0,0,0,
        0,0,0,0
    ],
    [
        0,6,0,0,
        0,6,0,0,
        0,6,0,0,
        0,6,0,0
    ],
    [
        0,0,0,0,
        6,6,6,6,
        0,0,0,0,
        0,0,0,0
    ],
    [
        0,6,0,0,
        0,6,0,0,
        0,6,0,0,
        0,6,0,0
    ]
]
var O =
[
    [
        0,0,0,0,
        0,7,7,0,
        0,7,7,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,7,7,0,
        0,7,7,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,7,7,0,
        0,7,7,0,
        0,0,0,0
    ],
    [
        0,0,0,0,
        0,7,7,0,
        0,7,7,0,
        0,0,0,0
    ],
]

function mioRandom()
{
	var rand = Math.floor(Math.random() * 7);
	if(rand == 7)
		rand--;
	return rand;
}

var grid = new Array();

var pos = {x:COLS/2 - 2, y:0};
var rot = 0;

var pieces = [L,J,S,Z,T,I,O];
var curr = pieces[mioRandom()];
var next = pieces[mioRandom()];

const REALDT = 500;
var deltaTime = REALDT;
var divider = 1;
var date = new Date();
var prevTime = date.getTime();
var currTime;

const DELTALEV = 10; //RIGHE PER LIVELLO
var clearedRows = 0;
var currLevel;
var playerPoints = 0;

window.onload = function()
{
    cvs = document.getElementById("gameCanvas");
    ctx = cvs.getContext("2d");
	
	next_cvs = document.getElementById("nextCanvas");
	next_ctx = next_cvs.getContext("2d");
    
	playerSpan = document.getElementById("playerPointsSpan");
	
    board.w = COLS * 32;    //32 is the pixel size
    board.h = ROWS * 32;    //of the squares
    board.x = cvs.width / 2 - board.w / 2;
    board.y = cvs.height / 2 - board.h / 2;

    const FPS = 144;
    reset();
    var gameLoop = setInterval(function()
    {
        update();
        draw();
        if(checkIfLost())
        {
            alert("hai perso");
            clearInterval(gameLoop);
        }
    }, FPS/1000);
	
}

function newDivider()
{
	var ciao = currLevel;
	return (ciao / (19/2));
}

function reset()
{
    for(i = 0; i < COLS*ROWS; ++i)
    {
        grid[i] = 0;
    }
}

function update()
{
	playerSpan.innerHTML = "<h2>" + playerPoints + "<br> Livello: "+ currLevel + "<br>";
    currLevel = Math.floor(clearedRows / DELTALEV) + 1;
	
    var date = new Date();
    currTime = date.getTime();
    if(currTime - prevTime >= deltaTime)
    {
        moveDown();
        prevTime = currTime;
    }
    deltaTime = REALDT / currLevel
	console.log(currLevel);
    
	window.onkeydown = function(e)
	{
		if(e.keyCode == '37' && !collisionLeft())
			pos.x--;
		if(e.keyCode == '39' && !collisionRight())
			pos.x++;
        if(e.keyCode == '90')
        {
            var tempRot = (rot + 1) % 4;
            if(!collisionRotation(tempRot))
                rot = tempRot;
        }
		if(e.keyCode == '88' || e.keyCode == '38')
		{
			var tempRot = (rot - 1)
			if(tempRot < 0)
			{
				tempRot = 3;
            }
            if(!collisionRotation(tempRot))
                rot = tempRot;   
        }
		if(e.keyCode == '40')
        {
            deltaTime = REALDT/10; 
        }		
    }
    window.onkeypress = function(e)
    {
		if(e.keyCode == '32')
		{
			fall();
		}
    }
    cancellaRighe();
}

function fall()
{
	while(!collision())
		moveDown();
}

function moveDown()
{
    if(collision())
    {
        for(i = 0; i < DIM; ++i)
        {
            for(j = 0; j < DIM; ++j)
            {
                var questo = curr[rot][indexof(i,j,DIM)] 
                if(questo != 0)
                {
                    grid[indexof(pos.y + i, pos.x + j, COLS)] = questo;
                }
            }
        }
        curr = next;
		next = pieces[mioRandom()];
        //curr = pieces[4];
        pos.x = COLS/2 - 2
        pos.y = 0;
        rot = 0;
        deltaTime = REALDT;
    }
    else
    {
        pos.y++;
    }
}

function draw()
{
	var color;
    fRect(0,0,cvs.width,cvs.height,"DarkSlateGray");
	
    for(i = 0; i < DIM; ++i)
    {
        for (j = 0; j < DIM; ++j)
        {
            if( curr[rot][indexof(i,j,DIM)] != 0 )
            {
				switch(curr[rot][indexof(i,j,DIM)])
				{
					case 1:color = "orange";
						break;
					case 2:color = "blue";
						break;
					case 3:color = "green";
						break;
					case 4:color = "red";
						break;
					case 5:color = "purple";
						break;
					case 6:color = "cyan";
						break;
					case 7:color = "yellow";
						break;
				}
                fRect((pos.x + j)*32, ((pos.y + i)*RECT_SIZE),RECT_SIZE,RECT_SIZE,color);
            }
        }
    }
	
    for(i = 0; i < ROWS; ++i)
    {
        for(j = 0; j < COLS; ++j)
        {
            if(grid[indexof(i,j,COLS)] != 0)
            {
				switch(grid[indexof(i,j,COLS)])
				{
					case 1:color = "orange";
						break;
					case 2:color = "blue";
						break;
					case 3:color = "green";
						break;
					case 4:color = "red";
						break;
					case 5:color = "purple";
						break;
					case 6:color = "cyan";
						break;
					case 7:color = "yellow";
						break;
				}
                fRect((j * RECT_SIZE),(i * RECT_SIZE), RECT_SIZE, RECT_SIZE, color);
            }
        }
    }
	next_ctx.fillStyle = "DarkSlateGray";
	next_ctx.fillRect(0,0,next_cvs.width,next_cvs.height);
	for(var i = 0; i < DIM; ++i)
	{
		for(var j = 0; j < DIM; ++j)
		{
			if(next[0][indexof(i, j, DIM)] != 0)
			{
				switch(next[0][indexof(i,j,DIM)])
				{
					case 1:color = "orange";
						break;
					case 2:color = "blue";
						break;
					case 3:color = "green";
						break;
					case 4:color = "red";
						break;
					case 5:color = "purple";
						break;
					case 6:color = "cyan";
						break;
					case 7:color = "yellow";
						break;
				}
				next_ctx.fillStyle = color;
				next_ctx.fillRect(RECT_SIZE+(j * RECT_SIZE), RECT_SIZE+(i * RECT_SIZE), RECT_SIZE, RECT_SIZE);
			}
		}
	}
	ctx.fillStyle = "black";
	for(var i = 0; i < cvs.width; i += RECT_SIZE)
	{
		for(var j = 0; j < cvs.height; j += RECT_SIZE)
		{
			ctx.fillRect(0, j, cvs.width, 2);
		}
		ctx.fillRect(i, 0, 2, cvs.height);
	}
	next_ctx.fillStyle = "black";
	for(var i = 0; i < next_cvs.width; i += RECT_SIZE)
	{
		for(var j = 0; j < next_cvs.height; j += RECT_SIZE)
		{
			next_ctx.fillRect(0, j, next_cvs.width, 2);
		}
		next_ctx.fillRect(i, 0, 2, next_cvs.height);
	}
}

function indexof(row,col,maxCol)
{
    return row * maxCol + col;
}

function fRect(x,y,w,h,color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function collision()
{
    var collider = new Array();
    var isCollidable = false;   //indica se in questa colonna ci sono pezzi
    var atleast1 = false;
    for(j = 0; j < DIM; ++j)
    {
        atleast1 = false; 
        isCollidable = false;
        var lastCollider;
        for(i = 0; i < DIM; ++i)
        {
            isCollidable = (curr[rot][indexof(i,j,DIM)] != 0);
            if(isCollidable)
            {
                if(!atleast1)
                    atleast1 = true;
                lastCollider = i + 1;
            }
        }
        if(atleast1)
            collider.push({i:lastCollider, j:j});
    }
    var detect = false;
    for(i = 0; i < collider.length && !detect; ++i) 
    {
        element = collider[i];
        detect = pos.y + element.i > ROWS - 1 || grid[indexof(pos.y+element.i,pos.x+element.j,COLS)] != 0;    
    }
    return detect;
}

function collisionLeft()
{
    var collider = new Array();
    var isCollidable = false;   //indica se in questa colonna ci sono pezzi
    var atleast1 = false;
    for(i = 0; i < DIM; ++i)
    {
        atleast1 = false; 
        isCollidable = false;
        var lastCollider;
        for(j = 3; j >= 0; --j)
        {
            isCollidable = (curr[rot][indexof(i,j,DIM)] != 0);
            if(isCollidable)
            {
                if(!atleast1)
                    atleast1 = true;
                lastCollider = j - 1;
            }
        }
        if(atleast1)
            collider.push({i:i, j:lastCollider});
    }
    var detect = false;
    for(i = 0; i < collider.length && !detect; ++i) 
    {
        var element = collider[i];
        detect = grid[indexof(pos.y+element.i,pos.x+element.j,COLS)] != 0 || pos.x + element.j < 0;    
    }
    return detect;
}

function collisionRight()
{
    var collider = new Array();
    var isCollidable = false;   //indica se in questa colonna ci sono pezzi
    var atleast1 = false;
    for(i = 0; i < DIM; ++i)
    {
        atleast1 = false; 
        isCollidable = false;
        var lastCollider;
        for(j = 0; j < DIM; ++j)
        {
            isCollidable = (curr[rot][indexof(i,j,DIM)] != 0);
            if(isCollidable)
            {
                if(!atleast1)
                    atleast1 = true;
                lastCollider = j + 1;
            }
        }
        if(atleast1)
            collider.push({i:i, j:lastCollider});
    }
    var detect = false;
    for(i = 0; i < collider.length && !detect; ++i) 
    {
        let element = collider[i];
        detect = grid[indexof(pos.y+element.i,pos.x+element.j,COLS)] != 0 || pos.x + element.j >= COLS;    
    }
    return detect;
}

function collisionRotation(rotation)
{
    var detect = false;
    var dentro = true;
    for(i = 0; i < DIM && !detect; ++i)
    {
        for(j = 0; j < DIM && !detect; ++j)
        {
            if(curr[rotation][indexof(i,j,DIM)] != 0)
            {
                dentro = pos.x + j < COLS && pos.x + j >= 0
                detect = grid[indexof(pos.y + i, pos.x + j, COLS)] != 0 || !dentro;
            }
        }
    }
    return detect;
}

function cancellaRighe()//500 superate YAY ^_^
{
	var temp = 0;
    for(i = 0; i < ROWS; ++i)
    {
        rigaPiena = true;
        for(j = 0; j < COLS && rigaPiena; ++j)
        {
            rigaPiena = grid[indexof(i,j,COLS)] != 0;
        }
        if(rigaPiena)
        {
			++clearedRows;
			++temp;
            for(j = 0; j < COLS; ++j)
            {
                grid[indexof(i,j,COLS)] = 0;
            }
            for(x = i - 1; x >= 0; --x)
            {
                for(y = 0; y < COLS; ++y)
                {
                    grid[indexof(x + 1, y,COLS)] = grid[indexof(x,y,COLS)];
                }
            }
        }
    }
	switch(temp)
	{
		case 1: playerPoints += 40;
			break;
		case 2: playerPoints += 100;
			break;
		case 3: playerPoints += 300;
			break;
		case 4: playerPoints += 1200;
			break;
	}
}


function checkIfLost()
{
    var lost = false;
    for(var i = 0; i < COLS && !lost; ++i)
    {
        lost = grid[i+COLS] != 0;
    }
    return lost;
}