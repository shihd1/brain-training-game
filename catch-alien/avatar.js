class Avatar {
    constructor(x, y, img, img_foot_anim, feature) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.img_foot_animator = img_foot_anim;

        if (feature == null) {
            this.shape = floor(random(0, 3));
            this.color = floor(random(0, 3));
            this.eye = floor(random(0, 3));
            this.hair = floor(random(0, 3));
        } else {
            this.shape = feature[0];
            this.color = feature[1];
            this.eye = feature[2];
            this.hair = feature[3];
        }

        this.jump = false;
        this.jump_feet_idx = 0;
        this.ratio = 0.5;
        this.speed = 1;

        this.ship = null;
        this.ship_count = 0;
        this.dead = false;

        this.isAnswer = false ;

    }

    check_same_feature(other_feature){
        if( other_feature[0]!=undefined && other_feature[0]!=null){
            if( this.shape!=other_feature[0]){
                return false ;
            }
        }
        if( other_feature[1]!=undefined && other_feature[1]!=null){
            if( this.color!=other_feature[1]){
                return false ;
            }
        }
        if( other_feature[2]!=undefined && other_feature[2]!=null){
            if( this.eye!=other_feature[2]){
                return false ;
            }
        }
        if( other_feature[3]!=undefined && other_feature[3]!=null){
            if( this.hair!=other_feature[3]){
                return false ;
            }
        }
        return true ;
    }

    draw() {
        if (this.dead) {
            return;
        }

        // feet
        let shift_y = this.y;
        let jump_idx = 0;
        if (this.jump) {
            jump_idx = this.jump_feet_idx;
            this.jump_feet_idx++;

            if (this.jump_feet_idx < 5) {
                shift_y -= this.jump_feet_idx;
            } else {
                shift_y += (-10 + this.jump_feet_idx);
            }

            if (this.jump_feet_idx > 10) {
                this.jump_feet_idx = 0;
                this.jump = false;
            }
        }

        this.img_foot_animator.show(jump_idx, this.color, this.x, this.y, this.ratio);
        this.img.show(this.color, this.shape, this.x, shift_y, this.ratio);

        // hair
        this.img.show(this.hair, 3, this.x, shift_y, this.ratio);
        // eye
        this.img.show(this.eye, 4, this.x, shift_y, this.ratio);

        // fly to ship
        if (this.ship != null) {
            this.ship_count++;
            if (this.ship_count > 20) {
                this.flyToSpaceShip(this.ship);
            }

        }

    }

    move() {
        this.x += this.speed;
    }

    runaway(){
        this.x += this.speed*5;
    }




    jjump() {
        this.jump = true;
    }

    addToTounchMatrix(matrix) {
        let dW = this.x + this.img.gWidth * this.ratio;
        let dH = this.y + this.img.gHeight * this.ratio;
        for (let i = this.x; i < dW; i++) {
            for (let j = this.y; j < dH; j++) {
                if (matrix[i] == null) {
                    matrix[i] = [];
                }
                matrix[i][j] = this;
            }
        }
    }

    flyToSpaceShip(ship) {
        //let halfWidth = ( this.img.gWidth * this.ratio)/2 ;

        let dx = ship.x - this.x;
        this.x = this.move_diff(dx, ship.x, this.x);
        this.y = this.move_diff(ship.y - this.y, ship.y, this.y);
        if (abs(this.y - ship.y) < 50) {
            this.dead = true;
        }
    }

    move_diff(d, targetx, nowx) {
        let max_speed = 20;
        d = d * 0.1;
        if (abs(d) > max_speed) {
            if (targetx < nowx) {
                d = max_speed * -1;
            } else {
                d = max_speed;
            }
        }

        let result = nowx + d;

        if (abs(d) < 0.1) {
            result = targetx;
        }
        return result;
    }


   
}


