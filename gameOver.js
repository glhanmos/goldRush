class gameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    init(data){
        console.log('init', data);
        this.finalScore = data.score;
    }
    create(){
        //background color
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#49537E");
        //text
        let text = this.add.bitmapText(475, 550, "pixelFont", "GAME OVER ", 50);

        //final score
        let finalScore = this.add.bitmapText(375, 500, "pixelFont", "You collected " + this.finalScore + " g. of gold", 30);
        text.setOrigin(0,5);
        //restart Game
        this.input.once('pointerup', function (event) {

            this.scene.start('playGame');

        }, this);

    }
    
    
}