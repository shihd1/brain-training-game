var x = 1;
var iFrame = 0;

var currentTime = 0;
var lngth = 1;
var timeInterval = 50;

var img_coin;
var img_background;
var img_angry_animation;
var imgPkg

var avatar = [];

function setup(){
    createCanvas(1420,750);
    img_coin = loadImage("Coin.png");
    img_background = loadImage("planetBakground.png");
    img_angry_animation = loadImage("AngryAlien.png");
    imgPkg = new ImgPackage(img_angry_animation,256,256);
    for (let i = 0; i< 23; i++) {
        avatar.push(new Avatar(random(0,width-128),random(250, height-120),img_coin,imgPkg));
    }
}
function draw(){
    image(img_background,0,0,1420,750);
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
function mouseClicked(){
    for (let index = 0; index < lngth; index++) {
        const tempA = avatar[index];
        let dd = dist(mouseX,mouseY,tempA.x+60,tempA.y+60);
        if(dd < 40){
            console.log("hit: "+dd);
            tempA.hit = true;
        }
    }
}