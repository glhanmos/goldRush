class preload extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }
    preload(){
        this.load.spritesheet("playerIdle", "assets/spritesheets/protagIdle.png", {
            frameWidth: 60,
            frameHeight: 112,
            startFrame: 0,
            endFrame: 3,
        });

        this.load.spritesheet("playerRun", "assets/spritesheets/protagRun.png", {
            frameWidth: 76,
            frameHeight: 112
        });
        
        this.load.spritesheet("playerJump", "assets/spritesheets/protagJump.png", {
            frameWidth: 80,
            frameHeight: 112,
            startFrame: 0,
            endFrame: 4,
        });
        this.load.spritesheet("playerHit", "assets/spritesheets/protagHit.png",{
            frameWidth: 98,
            frameHeight: 112,
        })
        //unused spritesheet
        this.load.spritesheet("playerFall", "assets/spritesheets/protagJump.png", {
            frameWidth: 80,
            frameHeight: 112,
            startFrame: 5,
            endFrame: 6,
        });

        //objects =============================

        this.load.spritesheet("spike", "assets/spritesheets/objects/spike.png", {
            frameWidth: 96,
            frameHeight: 96,
            startFrame: 0,
            endFrame: 2
        });

        this.load.spritesheet("goldNugget", "assets/spritesheets/objects/goldNugget.png", {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 4,
        });

        //ground ==============================
        this.load.image("ground", "assets/background/thinGround.png");
        //background
        this.load.image("bgSky", "assets/background/bgSky.png");
        this.load.image("bgMtn0", "assets/background/bgMtn0.png");
        this.load.image("bgMtn1", "assets/background/bgMtn1.png");

        // font ========================
        this.load.bitmapFont("pixelFont","assets/font/font.png", "assets/font/font.xml");

    }

    create() {
        this.scene.start("playGame");
        //Player Animations =======================
        this.anims.create({
            key: "playerIdle_anim",
            frames: this.anims.generateFrameNumbers("playerIdle"),
            frameRate: 3,
            repeat: 0,
        })

        this.anims.create({
            key: "playerRun_anim",
            frames: this.anims.generateFrameNumbers("playerRun"),
            frameRate: 12,
            repeat: 0,
        })

        this.anims.create({
            key: "playerJump_anim",
            frames: this.anims.generateFrameNumbers("playerJump"),
            frameRate: 10,
            repeat: 0,
        })

        this.anims.create({
            key: "playerFall_anim",
            frames: this.anims.generateFrameNumbers("playerFall"),
            frameRate: 12,
            repeat: 0,
        })

        this.anims.create({
            key: "playerHit_anim",
            frames: this.anims.generateFrameNumbers("playerHit"),
            frameRate: 12,
            repeat: 0,
        })
        //Object animations ==================

        this.anims.create({
            key: "goldNugget_anim",
            frames: this.anims.generateFrameNumbers("goldNugget"),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: "spikeHit_anim",
            frames: this.anims.generateFrameNumbers("spike"),
            frameRate: 4,
            repeat: 0,
        })
    }
}