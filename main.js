const PLAYER_HEIGHT = 9;
const PLAYER_WIDTH = 8;
const FONT = "10px sans-serif";
const FONT_COLOR = "#ffffff";
const HEIGHT = 120;
const WIDTH = 128;
const FRAME_INTERVALS = 33;
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const SCREEN_HEIGHT = 8;
const SCREEN_WIDTH = 8;
const SCROLL_SPEED = 2;
const SMOOTHNESS = 0;
const START_X = 15;
const START_Y = 17;
const TILECOLUMN = 4;
const TILEROW = 4;
const TILESIZE = 8;
const WINDOW_COLOR = "rgba(0, 0, 0, 0.75)";

const	gKey = new Uint8Array( 0x100 );	

let gAngle = 0;
let gFrame = 0;
let gHeight; 
let gWidth;
let gMoveX = 0;
let gMoveY = 0
let gMessage1 = null;
let gMessage2 = null;
let theMap;
let thePlayer;
let gPlayerX = START_X * TILESIZE + TILESIZE/2;
let gPlayerY = START_Y * TILESIZE + TILESIZE/2;
let gScreen;

const gFileMap = "img/map.png";
const gFilePlayer = "img/player.png";

function DrawMain(){

    const g = gScreen.getContext("2d");

    let mx = Math.floor(gPlayerX/TILESIZE);
    let my = Math.floor(gPlayerY/TILESIZE);

    for(let dy = -SCREEN_HEIGHT; dy <= SCREEN_HEIGHT; dy++ ){
        let ty = my + dy;
        let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;
        for(let dx = -SCREEN_WIDTH; dx <= SCREEN_WIDTH; dx++){
            let tx = mx + dx;
            let px = (tx + MAP_WIDTH) % MAP_WIDTH;
            DrawTile(g, 
                    // (tx - mx +8) * TILESIZE,
                    // = (tx - {gPlayerX/TILESIZE} + 8) * TILESIZE 
                    // tx * TILESIZE + 8 * TILESIZE - gPlayerX,
                    tx * TILESIZE + WIDTH/2 -gPlayerX,
                    // (ty - my +7) * TILESIZE, 
                    // = (ty - {gPlayerY/TILESIZE} + 8) * TILESIZE
                    // ty * TILESIZE + 8 * TILESIZE - gPlayerY
                    ty * TILESIZE + HEIGHT/2 -gPlayerY,
                    gMap[py * MAP_WIDTH + px]);
        }
    };

    ///(the object, [ , , , ] <-- trimming out which part, x, y, width, height)

    DrawMessage(g);

    g.drawImage(thePlayer, 
                (gFrame >> 4 & 1) * PLAYER_WIDTH, gAngle * PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT, 
                WIDTH/2 - PLAYER_WIDTH/2, HEIGHT/2 - PLAYER_HEIGHT + TILESIZE/2, PLAYER_WIDTH, PLAYER_HEIGHT); 

    g.fillStyle = WINDOW_COLOR;
    g.fillRect(20, 2, 105, 15);
    g.font = FONT;
    g.fillStyle = FONT_COLOR;
    g.fillText("x=" + gPlayerX + "   y= " + gPlayerY + " m= " + gMap[my * MAP_WIDTH + mx] ,25, 12);
}

function DrawMessage(g){
    
    if(!gMessage1){
        return;
    }

    g.fillStyle = WINDOW_COLOR
    g.fillRect(4, 84, 120, 30);
        
    g.font = FONT;
    g.fillStyle = FONT_COLOR;
    g.fillText(gMessage1, 9, 96);
    if (gMessage2){
        g.fillText(gMessage2, 6, 110);
    }
}

function DrawTile(g, x, y, INDEX){

    const xINDEX = (INDEX % TILECOLUMN) * TILESIZE;
    const yINDEX = Math.floor(INDEX / TILECOLUMN) * TILESIZE;
    g.drawImage(theMap, xINDEX,  yINDEX, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);

}

function loadImage(){
    theMap = new Image(); theMap.src = gFileMap;
    thePlayer = new Image(); thePlayer.src = gFilePlayer;
};

function TickField(){
    
    if( gMoveX != 0 || gMoveY != 0 ){}				
	else if( gKey[ 37 ] ){ gAngle = 1,	gMoveX = -TILESIZE}	
	else if( gKey[ 38 ] ){ gAngle = 3,	gMoveY = -TILESIZE}	
	else if( gKey[ 39 ] ){ gAngle = 2,	gMoveX =  TILESIZE}	
	else if( gKey[ 40 ] ){ gAngle = 0,	gMoveY =  TILESIZE};	

    let mx = Math.floor ((gPlayerX + gMoveX) / TILESIZE);
    let my = Math.floor ((gPlayerY + gMoveY) / TILESIZE);
    
    mx += MAP_WIDTH;
    mx %= MAP_WIDTH;
    my += MAP_HEIGHT;
    my %= MAP_HEIGHT;

    let m = gMap[my * MAP_WIDTH + mx];

    if(m == 0 || m == 1 || m == 2){
        gMoveX = 0;
        gMoveY = 0;
    }

    if(Math.abs(gMoveX) + Math.abs(gMoveY) == SCROLL_SPEED){
        if(m == 8 || m == 9){

            SetMessage("why uh u runnin?", null);
        
        }
    
        if(m == 11 || m == 10){
    
            SetMessage("why uh u gae?", "u uh gae");
    
        }
    
        if(m == 12){
    
            SetMessage("I Identify myself as", " an apache helicopter");
    
        }
    
        if(m == 13){
    
            gPlayerY -= TILESIZE;
            SetMessage("Banana", null);
            // SetMessage("every 60 sec in Africa", " a minute passes");
    
        }
    
        if(m == 14){
    
            SetMessage("everybody in Uganda", " knows kung-fu");
    
        }
    
        if(m == 15){
    
            SetMessage("CONFUSION OF DA", " HIGHEST ORDAAAA!");
    
        }
    }

    

	gPlayerX += Sign( gMoveX ) * SCROLL_SPEED;					
	gPlayerY += Sign( gMoveY ) * SCROLL_SPEED;					
	gMoveX -= Sign( gMoveX ) * SCROLL_SPEED;			
	gMoveY -= Sign( gMoveY ) * SCROLL_SPEED;		

	gPlayerX += ( MAP_WIDTH  * TILESIZE );
	gPlayerX %= ( MAP_WIDTH  * TILESIZE );
	gPlayerY += ( MAP_HEIGHT * TILESIZE );
	gPlayerY %= ( MAP_HEIGHT * TILESIZE );
};

function SetMessage(v1, v2){
    gMessage1 = v1;
    gMessage2 = v2;
}

function Sign(val){

    if(val == 0){
        return(0);
    }
    if(val < 0){
        return(-1)
    }
    return(1);
}

function WmPaint(){

    DrawMain();

    const ca = document.getElementById("main");
    const g = ca.getContext("2d");
    g.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight);
   
};

function WmSize(){

    const ca = document.getElementById("main");
    ca.height = window.innerHeight;
    ca.width = window.innerWidth;
    gWidth = ca.width;
    gHeight = ca.height;

    const g = ca.getContext("2d");
    g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTHNESS;


    if(gWidth / WIDTH < gHeight / HEIGHT){
        gHeight = gWidth * HEIGHT/WIDTH
    }else{
        gWidth = gHeight * WIDTH/HEIGHT
    }

}

function WmTimer(){

    gFrame++;
    WmPaint();
    TickField();

};

window.onkeydown = function(ev){
    let c = ev.keyCode;
    gKey[ c ] = 1;

    gMessage1 = null;
}

window.onkeyup = function(ev){
    gKey[ ev.keyCode ] = 0;
}

window.onload = function(){

    loadImage();

    gScreen = document.createElement("canvas");
    gScreen.width = WIDTH;
    gScreen.height = HEIGHT; ///virtual screen

    WmSize(); ///have screen information
    window.addEventListener("resize", function(){WmSize()}); ///resize relative to the window size
    setInterval(function(){WmTimer()}, FRAME_INTERVALS); ///update screen at every 33msec
};

const	gMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
    0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
    0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
    7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
   ];