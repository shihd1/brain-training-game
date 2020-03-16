var img_space_background;
var img_planets;
var imgPkgPlanets;
function setup(){
    let cnv = createCanvas(1420,750);
    img_space_background = loadImage("space.jpg");
    img_planets = loadImage("planets.png");
    imgPkgPlanets = new ImgPackage(img_planets,64,64);
}
function draw(){
    image(img_space_background,0,0,1420,750);
    imgPkgPlanets.showAtCenter(0,0,150,160,2.3)
}