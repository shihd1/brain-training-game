var usr_name;
const LD_KEY_GAME_NAME = 'hit_bad_alien';
var database;

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

var locked = [1,1,1];
var accuracy = [ [0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0] ];

var img_coin;
var img_space_background;
var img_planet_background;
var img_angry_animation;
var img_level_monster
var img_planets;
var imgPkg;
var imgPkg1;
var imgPkg2;

var avatar = [];

var testmx=[];
var testmy=[];

function setup(){
    let cnv = createCanvas(1420,750);
    cnv.parent('game');
    // img_coin = loadImage("Coin.png");
    img_space_background = loadImage("space.jpg");
    img_planet_background = loadImage("PlanetBakground.png");
    img_angry_animation = loadImage("AngryAlien.png");
    img_level_monster = loadImage("ColorAndSizeLevelMonsters.png");
    imgPkg = new ImgPackage(img_angry_animation,256,256);
    img_planets = loadImage("planets.png");
    imgPkg1 = new ImgPackage(img_planets,64,64);
    imgPkg2 = new ImgPackage(img_level_monster,256,256);
    reset();
    userStartAudio().then(function(){
        sound_bg.setVolume(0.1);
        sound_bg.play();
    });
    loadData();
}
function loadData(){
    // load admin-account
    let admin_txt = getCookie('admin');
    if (admin_txt != null && admin_txt.length > 0) {
        database = new DataEngine(admin_txt);
    } else {
        database = new DataEngine();
    }


    // load user info
    while (true) {
        usr_name = '' + prompt('請輸入您的帳號');
        if (usr_name != 'null' && usr_name.length > 0) {
            break;
        }
        alert('帳號不可以空白！！');
    }
    if (database.check_user_is_valid(usr_name, 'NOPWD') == true) {

    } else {
        database.create_user_password(usr_name, 'NOPWD');
    }

    // create game-log , 
    // if the game records has existed , the function won't be overridden 
    database.create_game(usr_name, LD_KEY_GAME_NAME, 15);

    data = database.db[usr_name][LD_KEY_GAME_NAME][database.FN_RECORD];
    var index = 0;
    for(i = 0; i<3; i++){
        for(j = 0; j<5; j++){
            accuracy[i][j] = data[data.length-1][database.FN_SCORE][index]/100.0;
            if(accuracy[i][j] >= 0.6){
                locked[i]++;
            }
            index++;
        }
    }

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
            circle(1130, 200, 200);
            rect(1270,100,50,200);
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
            imgPkg1.showAtCenter(planetJ,planetI,1130,200,3.6);
            strokeWeight(8);
            noFill();
            circle(1130, 200, 200);
            //selected menu: accuracy
            noStroke();
            fill(0, 153, 255);
            rect(1270, 100+200*(1-accuracy[planetI][planetJ]), 50, 200*accuracy[planetI][planetJ]);
            strokeWeight(5);
            stroke(79,232,222);
            noFill();
            rect(1270,100,50,200);
            //selected menu: words
            strokeWeight(2);
            fill(0,0,0);
            textSize(50);
            stroke(79,232,222);
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
        if((score/(numCoins*50)) >= 0.6){
            statusText = "You pass this level!";
        }else{
            statusText = "Sorry, try again!";
        }
        displayStatus = true;
    }
}
function reset(){
    cursor(ARROW);
    score = 0;
    numCoins = 0;
    avatar = [];
    lngth = 1;
    for (let i = 0; i< 23; i++) {
        avatar.push(new Avatar(random(0,width-128),random(250, height-120),imgPkg2,imgPkg));
        if(avatar[i].random != 0){
            numCoins++;
        }
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
        mouseClickedOnMenu();
    }
    if(switchToGame == true){
        mouseClickedOnGame();
    }
    if(displayStatus == true){
        mouseClickedOnGamePanel();
    }
}
    function mouseClickedOnMenu(){
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
                if(planetI == 2){
                    for (let i = 0; i < 23; i++) {
                        avatar[i].speed_y = -7+(planetJ/2)^2;
                        avatar[i].gravity = 0.08+(planetJ*0.02);
                    }
                }
                switchToGame = true;
            }
            
        }
    }
    function mouseClickedOnGame(){
        for (let index = 0; index < lngth; index++) {
            const tempA = avatar[index];
            let dd = dist(mouseX,mouseY,tempA.x+60,tempA.y+60);
            if(dd < 40){
                console.log("hit: "+dd);
                tempA.hit = true;
            }
        }
    }
    function mouseClickedOnGamePanel(){
        
        if(mouseX > 650 && mouseX < 790 && mouseY > 400 && mouseY < 470){
            switchToGame = false;
            if((score/(numCoins*50)) >= 0.6 && planetJ+1 == locked[planetI]){
                locked[planetI]++;
            }
            if((score/(numCoins*50)) > accuracy[planetI][planetJ]){
                accuracy[planetI][planetJ] = score/(numCoins*50);
                database.add_game_record(usr_name,LD_KEY_GAME_NAME,(planetJ)+(planetI*5),Math.floor(score*100/(numCoins*50)));
                database.save_to_localstorage();
            }
            displayStatus = false;
            reset();
        }
    }