class playGame extends Phaser.Scene {
    constructor() {
        super("playGame");
    }
    
    create(){
        //sky + mountains
        bg = this.add.tileSprite(0,0,game.config.width, game.config.height, "bgSky").setDepth(-1);
        bg.setOrigin(0, 0);
        bg.setScrollFactor(0, 0);
        //bg mountain range front
        mtn1 = this.add.tileSprite(0,110,game.config.width, game.config.height,"bgMtn1").setDepth(-1);
        mtn1.setOrigin(0, 0);
        mtn1.setScrollFactor(0, 0);
        //bg mountain range back
        mtn0 = this.add.tileSprite(0,110,game.config.width, game.config.height,"bgMtn0").setDepth(-1);
        mtn0.setOrigin(0, 0);
        mtn0.setScrollFactor(0, 0);

        //Score
        this.score = 0;
        var scoreFormated = this.zeroPad(this.score, 6);
        this.scoreLabel = this.add.bitmapText(20, 20, "pixelFont", "SCORE " + scoreFormated, 32);
        
    //Main Code by Emanuele Feronato

            // group with all active platforms.
        this.platformGroup = this.add.group({

            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });

        // platform pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });

        // group with all active golds.
        this.goldGroup = this.add.group({

            // once a gold is removed, it's added to the pool
            removeCallback: function(gold){
                gold.scene.goldPool.add(gold)
            }
        });

        // gold pool
        this.goldPool = this.add.group({

            // once a gold is removed from the pool, it's added to the active golds group
            removeCallback: function(gold){
                gold.scene.goldGroup.add(gold)
            }
        });

        this.spikeGroup = this.add.group({
            removeCallback: function(spike){
                spike.scene.spikePool.add(spike)
            }
        });

        this.spikePool = this.add.group({
            removeCallback: function(spike){
                spike.scene.spikeGroup.add(spike)
            }
        });

        // keeping track of added platforms
        this.addedPlatforms = 0;

        // number of consecutive jumps made by the player so far
        this.playerJumps = 0;

        // adding a platform to the game, the arguments are platform width, x position and y position
        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height * 0.6, "playerIdle");
        this.player.setGravityY(gameOptions.playerGravity);
        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function(){

            // play "run" animation if the player is on a platform
            if(!this.player.anims.isPlaying){
                this.player.anims.play("playerRun_anim");
            }
        }, null, this);

        // setting collisions between the player and the gold group
        this.physics.add.overlap(this.player, this.goldGroup, function(player, gold){
            this.tweens.add({
                targets: gold,
                y: gold.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function(){
                    this.goldGroup.killAndHide(gold);
                    this.goldGroup.remove(gold);
                }
            });
            this.score++;
            var scoreFormated = this.zeroPad(this.score, 5);
            this.scoreLabel.text = "SCORE " + scoreFormated;
            
            
        }, null, this);

        // setting collisions between the player and the spike group
        this.physics.add.overlap(this.player, this.spikeGroup, function(player, spike){

            this.dying = true;
            this.player.anims.play("playerHit_anim");
            this.player.body.setVelocityY(-200);
            this.physics.world.removeCollider(this.platformCollider);

        }, null, this);

        // checking for input
        this.input.on("pointerdown", this.jump, this);
    }

        // the core of the script: platform are added from the pool or created on the fly
    addPlatform(platformWidth, posX, posY){
        this.addedPlatforms ++;
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            let newRatio =  platformWidth / platform.displayWidth;
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else{
            platform = this.add.tileSprite(posX, posY, platformWidth, 48, "ground");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if(this.addedPlatforms > 1){

            // is there a gold over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.goldPercent){
                if(this.goldPool.getLength()){
                    let gold = this.goldPool.getFirst();
                    gold.x = posX;
                    gold.y = posY - 64;
                    gold.alpha = 1;
                    gold.active = true;
                    gold.visible = true;
                    this.goldPool.remove(gold);
                }
                else{
                    let gold = this.physics.add.sprite(posX, posY - 64, "goldNugget");
                    gold.setImmovable(true);
                    gold.setVelocityX(platform.body.velocity.x);
                    gold.anims.play("goldNugget_anim");
                    gold.setDepth(2);
                    this.goldGroup.add(gold);
                }
            }

            // is there a spike over the platform?
            if(Phaser.Math.Between(1, 100) <= gameOptions.spikePercent){
                if(this.spikePool.getLength()){
                    let spike = this.spikePool.getFirst();
                    spike.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                    spike.y = posY - 64;
                    spike.alpha = 1;
                    spike.active = true;
                    spike.visible = true;
                    this.spikePool.remove(spike);
                }
                else{
                    let spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 64, "spike");
                    spike.setImmovable(true);
                    spike.setVelocityX(platform.body.velocity.x);
                    spike.setSize(8, 2, true)
                    spike.setDepth(2);
                    this.spikeGroup.add(spike);
                }
            }
        }
    }
// Display Score with 6x0s
    zeroPad(number, size){
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)){
          stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
    // and obviously if the player is not dying
    jump(){
        if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
            if(this.player.body.touching.down){
                this.playerJumps = 0;
            }
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            this.playerJumps ++;
            this.player.anims.play("playerJump_anim");
        }
    }

    update(){

        //parallax bg
        mtn1.tilePositionX += 0.3;
        mtn0.tilePositionX += 0.6;

        // game over
        if(this.player.y > game.config.height){
            this.scene.start("gameOver", {score: this.score});
        }

        this.player.x = gameOptions.playerStartPosition;

        // recycling platforms
        let minDistance = game.config.width;
        let rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if(platformDistance < minDistance){
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling golds
        this.goldGroup.getChildren().forEach(function(gold){
            if(gold.x < - gold.displayWidth / 2){
                this.goldGroup.killAndHide(gold);
                this.goldGroup.remove(gold);
            }
        }, this);

        // recycling spike
        this.spikeGroup.getChildren().forEach(function(spike){
            if(spike.x < - spike.displayWidth / 2){
                this.spikeGroup.killAndHide(spike);
                this.spikeGroup.remove(spike);
            }
        }, this);


        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
            let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            let minPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[0];
            let maxPlatformHeight = game.config.height * gameOptions.platformVerticalLimit[1];
            let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }
}