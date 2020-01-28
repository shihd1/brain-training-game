class ImgPackage {

    constructor(source, grid_width, grid_height) {
        this.img = source;
        this.gWidth = grid_width;
        this.gHeight = grid_height;
    }

    show(i, j, tx, ty ,scale_ratio ) {
        image(this.img, tx, ty
            , this.gWidth*scale_ratio, this.gHeight*scale_ratio
            , i * this.gWidth, j * this.gHeight,
            this.gWidth, this.gHeight);
    }

}