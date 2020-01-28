class Task {



    constructor(img, ship) {
        this.img = img;
        this.ship = ship;
        this.ratio = this.ship.ratio;
    }

    show(feature) {

        if (feature == null) {
            return;
        }



        // border
        this.img.show(0, 4, this.ship.x + 270, this.ship.y - 100, this.ratio);
        for (let i = 0; i < Avatar_Features.length; i++) {
            if( feature[i]==undefined || feature[i]<0 || feature[i]>3){
                continue ;
            }
            this.img.show( feature[i],i, this.ship.x + 270, this.ship.y - 100, this.ratio);           
        }

        // for( let k in Avatar_Shape){
        //     if( Avatar_Shape[k]==feature[0]){
        //         console.log(k);
        //     }        
        // }
        // for( let k in Avatar_Color){
        //     if( Avatar_Color[k]==feature[1]){
        //         console.log(k);
        //     }        
        // }
        // for( let k in Avatar_Eye){
        //     if( Avatar_Eye[k]==feature[2]){
        //         console.log(k);
        //     }        
        // }
        // for( let k in Avatar_Hair){
        //     if( Avatar_Hair[k]==feature[3]){
        //         console.log(k);
        //     }        
        // }
    }





}