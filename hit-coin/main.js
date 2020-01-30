var x = 1;
var iFrame = 0;

var currentTime = 0;
var lngth = 1;
var numCoins = 0;
var score;
var statusText = "You got a 100% accuracy \n You pass this level!";
var timeInterval = 50;

var planetI = -100;
var planetJ = -100;
var planetText = [
    ["Level 1: color","Level 2: color","Level 3: color","Level 4: color","Level 5: color"],
    ["Level 1: shape","Level 2: shape","Level 3: shape","Level 4: shape","Level 5: shape"],
    ["Level 1: speed","Level 2: speed","Level 3: speed","Level 4: speed","Level 5: speed"]
]

var sound_bg;

var displayStatus = false;
var switchToGame = false;

var locked = [1,2,3];

var img_coin;
var img_space_background;
var img_planet_background;
var img_angry_animation;
var img_planets;
var imgPkg;
var imgPkg1;

var avatar = [];

var testmx=[];
var testmy=[];

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
        if(avatar[i].random != 0){
            numCoins++;
        }
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
        if(mouseIsPressed){
            cursor('hammer2.png');
        }else{
            cursor('hammer.png');
        }
        drawGame();
        playGame();

        // test
        // for (let index = 0; index < testmx.length; index++) {
        //     circle( testmx[index],testmy[index],130);
        // }
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
    strokeWeight(5);
    text(planetText[planetI][planetJ], 1000,50);
    score = 0;
    for (let index = 0; index < lngth; index++) {
        const tempA = avatar[index];
        if(tempA.hit == true){
            if(tempA.random == 0){
                score-=50;
            }else{
                score+=50;
            }
        }
    }
    text("Score: "+score+"/"+(numCoins*50),1000,100);
    if(displayStatus == true){
        rect(400,200,650,300);
        text(statusText,450,300);
        rect(650,400,140,70);
        text("OK",680,450);
    }
}
function playGame(){
    for (let index = 0; index < lngth; index++) {
        const tempA = avatar[index];
        tempA.draw();
        tempA.jump();
    }
    if(currentTime == timeInterval){
        currentTime = 0;
        if(lngth < avatar.length){
            lngth++;
        }
    }else{
        currentTime++;
    }
    if(avatar[avatar.length-1].death){
        if(score==numCoins*50){
            statusText = "You got a 100% accuracy \n You pass this level!";
        }else{
            statusText = "Sorry, try again!";
        }
        displayStatus = true;
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
    if(switchToGame == false){
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                if(j < locked[i]){
                    if(dist(150+(170*j),160+(210*i),mouseX+32,mouseY+32)<65){
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
    }
    if(switchToGame == true){
        for (let index = 0; index < lngth; index++) {
            const tempA = avatar[index];
            let dd = dist(mouseX,mouseY,tempA.x+60,tempA.y+60);
            if(dd < 40){
                console.log("hit: "+dd);
                tempA.hit = true;
            }
        }
    }
    if(displayStatus == true){
        if(mouseX > 650 && mouseX < 790 && mouseY > 400 && mouseY < 470){
            switchToGame = false;
            if(score==numCoins*50){
                locked[planetI]++;
            }
            cursor(ARROW);
            displayStatus = false;
            score = 0;
            numCoins = 0;
            avatar = [];
            for (let i = 0; i< 23; i++) {
                avatar.push(new Avatar(random(0,width-128),random(250, height-120),img_coin,imgPkg));
                if(avatar[i].random != 0){
                    numCoins++;
                }
            }
        }
    }

    // test
    testmx.push(mouseX+32) ;
    testmy.push(mouseY+32) ;
}