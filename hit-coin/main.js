var x = 1;
var iFrame = 0;

var currentTime = 0;
var lngth = 1;
var timeInterval = 50;

var planetI = -100;
var planetJ = -100;
var planetText = [
    ["Level 1: color","Level 2: color","Level 3: color","Level 4: color","Level 5: color"],
    ["Level 1: shape","Level 2: shape","Level 3: shape","Level 4: shape","Level 5: shape"],
    ["Level 1: speed","Level 2: speed","Level 3: speed","Level 4: speed","Level 5: speed"]
]

var sound_bg;

var switchToGame;

var locked = [1,2,3];

var img_coin;
var img_space_background;
var img_planet_background;
var img_angry_animation;
var img_planets;
var imgPkg;
var imgPkg1;

var avatar = [];

function setup(){
    let cnv = createCanvas(1420,750);
    cnv.parent('game');
    img_coin = loadImage("Coin.png");
    img_space_background = loadImage("space.jpg");
    img_planet_background = loadImage("PlanetBakground.png");
    img_angry_animation = loadImage("AngryAlien.png");
    imgPkg = new ImgPackage(img_angry_animation,256,256);
    img_planets = loadImage("planets.png");
    imgPkg1 = new ImgPackage(img_planets,64,64);
    for (let i = 0; i< 23; i++) {
        avatar.push(new Avatar(random(0,width-128),random(250, height-120),img_coin,imgPkg));
    }
    userStartAudio().then(function(){
        sound_bg.setVolume(0.1);
        sound_bg.play();
    });
}
function preload(){
    sound_bg = loadSound("Move_Out.mp3");
}
function draw(){
    if(switchToGame == true){
        drawGame();
        playGame();
    }else{
        drawMenu();
    }
}
function drawMenu(){
    drawImmovableBackground();
    drawLevelRestrictions(locked[0],locked[1],locked[2]);
    drawSelectedLevel();
}
    function drawImmovableBackground(){
        image(img_space_background,0,0,1420,750);
        fill(73, 128, 130,150);
        //level selection
        noStroke();
        rect(50,50,900,640,10);
            stroke(79,232,222);

            //draw 3 Rectangles
            strokeWeight(2);
            fill(73, 128, 130,150);
            rect(60,60,880,200,3);
            rect(60,270,880,200,3);
            rect(60,480,880,200,3);

            //draw circles and fill with planets
            strokeWeight(5);
            noFill();
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 5; j++) {
                    imgPkg1.showAtCenter(j,i,150+(170*j),160+(210*i),2.3);
                    circle(150+(170*j),160+(210*i),130);
                }
            }
            fill(73, 128, 130,150);

        //level selected
        noStroke();
        rect(980,50,400,640,10);
            stroke(79,232,222);
            circle(1180, 200, 200);
            rect(1000,330,360,150,20);
            rect(1080,530,200,100,20);
        
    }
    function drawSelectedLevel(){
        if(planetI != -100){
            //selected circle
            fill(255,255,255,100);
            strokeWeight(5);
            circle(150+(170*planetJ),160+(210*planetI),130);
        
            //selected menu: planet
            imgPkg1.showAtCenter(planetJ,planetI,1180,200,3.6);
            strokeWeight(8);
            noFill();
            circle(1180, 200, 200);
            //selected menu: words
            strokeWeight(2);
            fill(0,0,0);
            textSize(50);
            text(planetText[planetI][planetJ],1020,420);
            //selected menu: play
            fill(0,0,0);
            text("Play",1130,600);
        }
        
    }
    function drawLevelRestrictions(color,shape,speed){
        fill(235, 73, 73,150);
        var arraySelection = [color,shape,speed];
        var arrayY = [160,370,580];
        var arrayX = [150,320,490,660,830];
        for (let i = 0; i < 3; i++) {
            for (let j = arraySelection[i]; j < 5; j++) {
                circle(arrayX[j],arrayY[i],130);
            }
        }
    }
function drawGame(){
    image(img_planet_background,0,0,1420,750);
}
function playGame(){
    for (let index = 0; index < lngth; index++) {
        const tempA = avatar[index];
        tempA.draw();
        tempA.jump();
    }
    if(currentTime == timeInterval){
        currentTime = 0;
        if(lngth != 22){
            lngth++;
        }
    }else{
        currentTime++;
    }
}
function keyPressed() {
    if(keyCode == 32){
        if(x == 0){
            console.log("Chop Rabbit");
        }else{
            console.log("Chop Wood");
        }
    }else{
        console.log("Next");
    }
    console.log("-----------------");
    x = floor(random(0,2));
    console.log(x);
}
function mouseClicked(){
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            if(j < locked[i]){
                if(dist(150+(170*j),160+(210*i),mouseX,mouseY)<65){
                    planetI = i;
                    planetJ = j;
                    return;
                }
            }
        }
    }
    if(mouseX > 1080 && mouseX < 1280 && mouseY > 530 && mouseY < 630){
        console.log("play");
        if(planetI != -100){
            console.log("switch to game: "+planetI+", "+planetJ);
            switchToGame = true;
        }
        
    }
    for (let index = 0; index < lngth; index++) {
        const tempA = avatar[index];
        let dd = dist(mouseX,mouseY,tempA.x+60,tempA.y+60);
        if(dd < 40){
            console.log("hit: "+dd);
            tempA.hit = true;
        }
    }
}