
var sprites = [];
var spaceship = null;

//////////////////////
var img_bg;
var img_bdy;
var img_feet;
var img_spaceship;
var img_req;
//----
var imgPkg;
var imgPkgFeet;
var imgPkgSpaceship;
var imgPkgReq;
//----
var sound_bg;
var sound_catch;
//////////////////////

var game_start = false;
var game_maxlevel;
var game_level_score = [];
var game_level_selected;
var game_level_avatar_total;
var game_level_avatar_passed;
var game_score = 0;
var game_random_seed;

var sprites_freq = 200;

var target_question = null;
var usr_name;

///////////////////////////

const STAGE_PRE = 0;
const STAGE_GO = 1;
const STAGE_RUN = 2;
const STAGE_END = 3;
const STAR = '⭐';
var GAME_STAGE;
var TARGET_AVATAR_PAUSE = false;
var pre_ava = 0;

///////////////////////////

const LD_KEY_GAME_NAME = 'catch_alien';

///////////////////////////

var database;

function preload() {
    // sound
    sound_bg = loadSound('Stuff.mp3');
}

function setup() {
    // createCanvas(1300, 800);
    let cnv = createCanvas(1480, 780);
    cnv.parent('game');

    imageMode(CENTER);

    img_bg = loadImage("AlienPlanetBackground.png");
    img_bdy = loadImage("Body.png");
    img_feet = loadImage("JumpingFeet.png");
    img_spaceship = loadImage("Spaceship.png");
    img_req = loadImage("AlienRequirements.png");

    imgPkg = new ImgPackage(img_bdy, 256, 256);
    imgPkgFeet = new ImgPackage(img_feet, 256, 256);
    imgPkgSpaceship = new ImgPackage(img_spaceship, 256, 256);
    imgPkgReq = new ImgPackage(img_req, 256, 256);



    // data
    load_data();




    for (let i = 0; i < 7; i++) {
        sprites.push(new Avatar(100 + 150 * i, 550, imgPkg, imgPkgFeet, genFeatures()));
    }





    sound_catch = new p5.MonoSynth();
    // Start the audio context on a click/touch event
    userStartAudio().then(function () {
        // sound 
        sound_bg.setVolume(0.1);
        sound_bg.stop();
        sound_bg.play();
    });

}

function draw() {

    imageMode(CORNER);
    image(img_bg, 0, 0, 2080, 780);
    imageMode(CENTER);

    // start UI
    if (game_start == false) {
        start_UI();
        return;
    }

    // Panel UI
    fill(100);
    textSize(30);
    text("LV ", 100, 50);
    text("SCORE ", 30, 90);
    fill(200, 200, 0);
    text(game_level_selected, 150, 50);
    text(game_score, 150, 90);


    //////////////////////////////////////////////
    /////////////////// ----- target question & task & reset level
    //////////////////////////////////////////////

    if (GAME_STAGE == STAGE_PRE) {
        target_question = genFeatureAtLevel(game_level_selected);
        game_random_seed = get_level_random_duration(game_level_selected);
        TARGET_AVATAR_PAUSE = false;
        game_level_avatar_passed = 0;
        GAME_STAGE++;
    }
    if (GAME_STAGE == STAGE_RUN) {
        target_question = null;
        if (sprites.length == 0) { // all avatars leave       
            if (game_level_avatar_total < 9) {
                GAME_STAGE = STAGE_PRE;
            } else {
                GAME_STAGE = STAGE_END;
            }
        }
    }
    if (GAME_STAGE == STAGE_END) {

        save_level_status();

        target_question = null;
        game_start = false;
        game_maxlevel = game_level_selected;
        replay_sound();
    }



    ///////////////////////////////////////
    /////////////////// ----- avatars
    ///////////////////////////////////////

    // create avatars
    if (GAME_STAGE == STAGE_GO && frameCount % sprites_freq == 0) {

        if (game_random_seed <= 0 && TARGET_AVATAR_PAUSE == false) {
            let rfea = genFeatureLike(target_question);
            let ava = new Avatar(-100, 550, imgPkg, imgPkgFeet, rfea);
            ava.isAnswer = true;
            sprites.push(ava);
            game_level_avatar_total++;

            game_random_seed = get_level_random_duration(game_level_selected);
        } else {
            let rfea = genFeatureUnlike(target_question);
            let ava = new Avatar(-100, 550, imgPkg, imgPkgFeet, rfea);

            sprites.push(ava);
        }
        game_random_seed--;
        if (game_level_avatar_total - pre_ava >= 3) {
            TARGET_AVATAR_PAUSE = true;
            pre_ava = game_level_avatar_total;
        }
        //console.log(fff) ;
    }
    //console.log("[total] "+game_level_avatar_total+" [passed] "+game_level_avatar_passed+"  "+TARGET_AVATAR_PAUSE);


    for (const avatar of sprites) {
        avatar.draw();
        if (GAME_STAGE == STAGE_RUN) {
            avatar.runaway();
        }
        if (GAME_STAGE == STAGE_GO) {
            avatar.move();
        }
        if (random(0, 1) < 0.05) {
            avatar.jjump();
        }

        // debug - feature : answer
        // if( avatar.x > width/2 && avatar.x<(width/2+50) ){
        //     if( avatar.isAnswer ){
        //         console.log(" ==>  O ");
        //     }else{
        //         console.log(" ==> X");
        //     }
        // }


    }

    // remove sprites out of window
    if (sprites.length > 0) {
        if (sprites[0].dead || sprites[0].x > width) {
            if (sprites[0].isAnswer) {
                game_level_avatar_passed++;
                if (game_level_avatar_passed >= 3) {
                    GAME_STAGE = STAGE_RUN;
                }
            }
            sprites.splice(0, 1);
        }
    }




    //////////////////////////////////////////////
    ///////////////////// -------- space ship
    //////////////////////////////////////////////

    if (spaceship == null) {
        spaceship = new Spaceship(imgPkgSpaceship, imgPkgReq, -1500, 200);
        spaceship.target_x = width / 2;
    } else {
        spaceship.draw();
        spaceship.target_x = mouseX;
        spaceship.question = target_question;
        //console.log(spaceship);
    }


}

function start_UI() {

    if (frameCount % sprites_freq == 0) {
        sprites.push(new Avatar(-100, 550, imgPkg, imgPkgFeet, genFeatures()));
    }
    for (const avatar of sprites) {
        avatar.draw();
        avatar.move();
        if (random(0, 1) < 0.05) {
            avatar.jjump();
        }
    }

    fill(250, 250, 0);
    showTextAlignCenter(usr_name, height*2/9, 100);

    // rect
    rectMode(CENTER);
    textFont('微軟正黑體');
    textStyle(BOLD);
    let yy = height * 2 / 5 + 30;
    for (let lv = 1; lv <= 4; lv++) {

        noStroke();
        let xx = width * lv / 5;
        let available_level = false;
        if (lv <= game_maxlevel ||
            (lv == game_maxlevel + 1) && (game_level_score[game_maxlevel - 1] >= 55)
        ) {
            available_level = true;
        }

        // rectangle
        if (available_level) {
            fill(10, 10, 10, 200);

            if (game_level_selected == lv) {
                stroke(200, 200, 0);
                strokeWeight(10);
            }
            if (mouseX > xx - 90 && mouseX < xx + 90) {
                game_level_selected = lv;
            }
        } else {
            fill(100, 100, 100, 200);
        }
        rect(xx, yy, 180, 220);

        // text
        textSize(60);
        if (available_level) {
            fill(217, 85, 168);
        } else {
            fill(150, 150, 150, 200);
        }
        text("LV " + lv, xx - 58, yy - 10);

        // score
        noStroke();
        textSize(20);
        fill(225);        
        
        if (game_level_score[lv - 1] != -1) {
            let star_n = Math.floor( game_level_score[lv - 1]/10 ) ;
            let star ='';
            for (let i = 0; i < star_n; i++) {
                star +=STAR ;
                if( i==4 ){
                    star+='\n' ;
                }
            }        
            text(star, xx - 68, yy + 50) ;
        }
    }



    noStroke();
    fill(255);
    showTextAlignCenter("按下［S］開始遊戲", height * 8.9 / 10, 60);
    showTextAlignCenter("達到 250 分，可以前進下一關", height * 9.6 / 10, 22);
}

function showTextAlignCenter(text_content, ty, tsize) {
    textSize(tsize);
    textFont('微軟正黑體');
    textStyle(BOLD);
    let sx = (width - textWidth(text_content)) / 2;
    text(text_content, sx, ty);
}

function keyPressed() {
    if (game_start == false && keyCode == 83) { // press ［S］
        game_start = true;

        game_level_avatar_total = 0;
        game_level_avatar_passed = 0;
        GAME_STAGE = STAGE_PRE;

        game_score = 0;
        target_question = genFeatureAtLevel(game_level_selected);
        sprites = [];

        replay_sound();
    }
}

function replay_sound() {
    sound_bg.stop();
    sound_bg.play();
}

function load_data() {

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
    database.create_game(usr_name, LD_KEY_GAME_NAME, 4);

    let p_count = database.db[usr_name][LD_KEY_GAME_NAME][database.FN_P_COUNT];
    let p_record = database.db[usr_name][LD_KEY_GAME_NAME][database.FN_RECORD];
    let p_record_score = p_record[p_record.length - 1][database.FN_SCORE];

    game_maxlevel = 1;
    for (let i = 0; i < p_count.length; i++) {
        if (p_count[i] == 0) {
            game_level_score.push(-1);
        } else {
            game_level_score.push(p_record_score[i]);
            game_maxlevel = i + 1;
        }
    }
    game_level_selected = game_maxlevel + 1;
    
}

function save_level_status() {

    game_score = Math.floor( game_score*100 / 450 ) ;

    if (game_score > game_level_score[game_level_selected - 1]) {
        game_level_score[game_level_selected - 1] = game_score;
        database.add_game_record(usr_name, LD_KEY_GAME_NAME, game_level_selected - 1, game_score);
        database.save_to_localstorage();
    }
 
}


function mouseClicked() {

    if (spaceship == null) {
        return null;
    }

    if (spaceship.open == true) {
        return null;
    }
    if (mouseY < 480 || mouseY > 620) {
        return null;
    }

    if (abs(spaceship.x - mouseX) > 30) {
        return null;
    }

    for (const a of sprites) {
        if (a.dead == true) {
            continue;
        }
        if (abs(a.x - mouseX) < 50) {
            sound_catch.play('A6');
            spaceship.open_tunnel();
            a.ship = spaceship;
            if (a.isAnswer) {
                game_score += 50;
            } else {
                game_score -= 50;
            }
            break;
        }
    }


    return null;

}

function get_level_random_duration(level) {

    switch (level) {
        case 1:
            return floor(random(1, 4));
        case 2:
            return floor(random(1, 4));
        case 3:
            return floor(random(1, 4));
        case 4:
            return floor(random(1, 4));

    }
}

function test_data_game( ){
    for( var i=0 ; i<4 ; i++ ){
        database.add_game_record(usr_name, LD_KEY_GAME_NAME , i , Math.floor( random(50,100)) ) ;
        database.save_to_localstorage() ;
    }
    
    for( var i=0 ; i<15 ; i++ ){
        database.add_game_record(usr_name, 'hit_bad_alien' , i , Math.floor( random(50,100)) ) ;
        database.save_to_localstorage() ;
    }
   
}


