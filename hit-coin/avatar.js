class Avatar {
    constructor(x, y, img_Coin, img_Alien) {
        this.x = x;
        this.y = y;
        this.img_Coin = img_Coin;
        this.img_Alien = img_Alien;
        this.ratio = 0.5;
        this.random = floor(random(0, 2));
        this.hit = false;
        this.iFrame = 0;
        this.speed_y = -8;
        this.gravity = 0.1;
        this.death = false;
    }
    draw() {
        if(this.death == true){
            return;
        }
        if (this.random == 0) {
            this.img_Alien.show(this.iFrame, 0, this.x, this.y, this.ratio);
            if (this.hit == true) {
                if (frameCount % 3 == 0) {
                    this.iFrame++;
                    if (this.iFrame == 23) {
                        this.iFrame = 0;
                    }
                }
            }
        } else {
            image(this.img_Coin, this.x, this.y, 256 * this.ratio, 256 * this.ratio);
        }

    }
    jump() {
        if(this.iFrame < 1){
            this.speed_y += this.gravity;
            this.y += this.speed_y;
        }
        
        if(this.speed_y > 10 || this.iFrame == 22){
            this.death = true;
        }
    }
}