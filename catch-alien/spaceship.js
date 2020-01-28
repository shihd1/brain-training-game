class Spaceship {

    constructor(img, reqimg, x, y) {

        this.img = img;
        this.reqimg = reqimg;

        this.x = x;
        this.y = y;
        this.target_x = -1000;
        this.target_y = -1000;
        this.max_speed = 50;
        this.ratio = 1;

        this.open = false;
        this.open_light = 1;
        this.open_light_speed = 10;

        // 
        this.task = new Task(this.reqimg, this);
        this.question = null;
    }

    draw() {

        // open tunnel 
        if (this.open) {
            rectMode(CORNER);
            let w = 66;
            fill(255, 242, 0, 100);
            noStroke();

            this.open_light += this.open_light_speed;
            if (this.open_light > 420) {
                rect(this.x - w / 2, this.y, w, 420);
                if (this.open_light > 600) {
                    this.open_light_speed = -10;
                }
            } else if (this.open_light < 1) {
                this.open = false;
            } else {
                rect(this.x - w / 2, this.y, w, this.open_light);
            }
        }


        // show space ship
        this.img.show(0, 0, this.x, this.y, this.ratio);
        this.task.show(this.question);


        // move
        if (this.open == false) {
            let d = (this.target_x - this.x) * 0.1;
            if (abs(d) > this.max_speed) {
                if (this.target_x < this.x) {
                    d = this.max_speed * -1;
                } else {
                    d = this.max_speed;
                }
            }
            this.x += d;
            if (abs(d) < 0.1) {
                this.x = this.target_x;
            }
        }

    }

    open_tunnel() {
        this.open = true;
        this.open_light = 1;
        this.open_light_speed = 50;
    }



}