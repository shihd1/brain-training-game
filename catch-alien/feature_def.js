var Avatar_Shape = {
    rect: 0,
    triangle: 1,
    circle: 2
}
var Avatar_Color = {
    purple: 0,
    orange: 1,
    green: 2
}
var Avatar_Eye = {
    one: 0,
    two: 1,
    three: 2
}
var Avatar_Hair = {
    shirt: 0,
    long: 1,
    curved: 2
}

var Avatar_Features = [];
Avatar_Features.push(Avatar_Shape);
Avatar_Features.push(Avatar_Color);
Avatar_Features.push(Avatar_Eye);
Avatar_Features.push(Avatar_Hair);



function genFeatureLike( feature ){
    let fea = [] ;
    for (let i = 0; i < 4; i++) {
        if( feature[i]==null){
            fea[i]=floor(random(0, 3));
        }else{
            fea[i] = feature[i] ;
        }
    }
    return fea ;
}

function genFeatureUnlike( feature ){

    let fea = [] ;
    let r = floor(random(0, 4));
    for (let i = 0;;) {
        if( feature[i]!=null){
            if( r==0 ){
                fea[i] = feature[i]+floor(random(1, 3)) ;
                fea[i]%=3 ;
                break ;
            }
            r-- ;
        }
        i++ ;
        i%=4 ;
    }

    for (let i = 0; i < 4; i++) {
        if( fea[i]==null){
            if( feature[i]!=null){
                fea[i] = feature[i];
            }else{
                fea[i]=floor(random(0, 3));
            }            
        }
    }

    return fea ;

}

function genFeatureAtLevel( level ){
    
    if( level==0){
        return []; 
    }
    if( level==4){
        return genFeatures() ;
    }

    let fea = [] ;
    let count = 0 ;
    while( count<level){
        let target = floor(random(0, 4));
        if( fea[target]==null){
            fea[target]=floor(random(0, 3));
            count++ ;
        }
    }
    return fea ;
}


function genFeatures() {
    var f = [];
    for (let index = 0; index < 4; index++) {
        f[index] = floor(random(0, 3));
    }
    return f;
}
function genFeaturesBySeed(seed) {

    var fea = [];

    // 0 <= seed <=80
    let u = 27;
    while (u >= 1) {
        let s1 = floor(seed / u);
        seed -= s1 * u;
        //console.log(u +":"+s1 ) ;
        fea.push(s1)
        u /= 3;
    }

    return fea;
}
function showFeatureInfo(info) {

    // this.shape = feature[0];
    // this.color = feature[1];
    // this.eye = feature[2];
    // this.hair = feature[3];
    console.log('=========================');
    for (let k in Avatar_Shape) {
        if (Avatar_Shape[k] == info[0]) {
            console.log(k);
        }
    }
    for (let k in Avatar_Color) {
        if (Avatar_Color[k] == info[1]) {
            console.log(k);
        }
    }
    for (let k in Avatar_Eye) {
        if (Avatar_Eye[k] == info[2]) {
            console.log(k);
        }
    }
    for (let k in Avatar_Hair) {
        if (Avatar_Hair[k] == info[3]) {
            console.log(k);
        }
    }
    console.log('=========================');
}

