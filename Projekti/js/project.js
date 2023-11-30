let game;
let score = 0;
let approach = 1100;

// variables for in-game use
const gameOptions = {
    dudeGravity: 900,
    dudeSpeed: 400
}

window.onload = function() {

    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#112211",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                },
                debug: false
            }
        },
        scene: [preScene, mainScene, endScene]
    }

    game = new Phaser.Game(gameConfig)
    window.focus();
}

class mainScene extends Phaser.Scene {

    constructor() {
        super("mainScene")
        this.score = 0;
        this.gameOver = false;
    }

//Preload---------------------------------------------------------------
    preload () {

        score = 0;
        approach = 1100;

        // All audio from https://pixabay.com/sound-effects/search/arcade/?pagi=2
        this.load.audio("boom", "assets/boom.mp3")
        this.load.audio("ding", "assets/ding.mp3")
        this.load.audio("ded", "assets/game-over.mp3")
        this.load.audio("music", "assets/jam.mp3")
        this.load.image("unstable", "assets/ground0.png")
        this.load.image("bg", "assets/forest.jpg") // Taken from https://pxhere.com/en/photo/33640, credit to Nicholas A. Tonelli.
        this.load.image("ladybugL", "assets/ladybug2.png")
        this.load.image("siili", "assets/siili2.png")
        this.load.image("skull", "assets/skull.png")
        this.load.image("ground", "assets/platform.png")
        this.load.image("star", "assets/star.png")
        this.load.image("heart", "assets/heart.png")
        this.load.image("bomba", "assets/bomb.png")
    }

//Create-----------------------------------------------------------------

    create () {
        // Create physics groups
        this.platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true,
        })
        this.unstables = this.physics.add.group({
            allowGravity: false,
            immovable: true
        })
        this.stars = this.physics.add.group({
            key: 'star',
        });
        this.bombs = this.physics.add.group({
            key: 'bomba'
        });
        this.hearts = this.physics.add.group({
            key: 'heart'
        })

        // Set world boundaries to only left, right, and top and add background image
        this.physics.world.setBounds(0, 0, game.config.width, game.config.height, true, true, true, false);
        this.add.image(0, 0, "bg");

        // Create platforms randomly between 0 to height/width of game
        for(let i = 0; i < 20; i++) {
           this.platform = this.platforms.create(Phaser.Math.Between(0, game.config.width), Phaser.Math.Between(0, game.config.height), "ground");
           this.platform.setInteractive();
           this.input.on('gameobjectdown', this.onClicked.bind(this));
        }    

        // Create player character in the middle of the game
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "ladybugL")
        this.player.body.setGravityY(gameOptions.dudeGravity);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // Images on screen
        this.add.image(42, 16, "star");
        this.add.image(16, 16, "heart");
        this.scoreText = this.add.text(58, 3, 'Score: 0', {fontSize: "25px", fill: "#ffffff"});
        this.siili = this.add.sprite(game.config.width / 2, approach, "siili");

        // Sound effects
        this.ding = this.sound.add("ding", {loop: false});
        this.ded = this.sound.add("ded", {loop: false});
        this.jam = this.sound.add("music", {loop: true});
        this.boom = this.sound.add("boom", {loop: false});
        this.jam.play();

        // Create cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        // Colliders
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.unstables, this.platformFall);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.hearts, this.platforms)
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.death, null, this)

        // Overlaps
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);

        // Spawn timer
        this.triggerTimer = this.time.addEvent({
            callback: this.addStuff,
            callbackScope: this,
            delay: 700,
            loop: true
        })    

    }

//Update-----------------------------------------------------------------

    update () {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-gameOptions.dudeSpeed);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(gameOptions.dudeSpeed);
        }
        else {
            this.player.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-gameOptions.dudeGravity / 1.4);
        }

        if (this.player.y > game.config.height || this.player.y <= 0) {
            this.death(this.player, this.bombs);
        }
    }

//Other functions-----------------------------------------------

    addStuff () {

        // Add regular platforms
        this.platform = this.platforms.create(Phaser.Math.Between(0, game.config.width), 0, "ground");
        this.platforms.setVelocityY(gameOptions.dudeSpeed / 6);
        this.platform.setInteractive();
        this.input.on('gameobjectdown', this.onClicked.bind(this));

        // Sometimes add unstable platforms
        if(Phaser.Math.Between(0, 1)) {        
            this.wonkyPlatform = this.unstables.create(Phaser.Math.Between  (0, game.config.width), 0, "unstable");
            this.wonkyPlatform.setVelocityY(gameOptions.dudeSpeed / 6);
            this.wonkyPlatform.displayWidth = 100;
            this.wonkyPlatform.setInteractive();
            this.input.on('gameobjectdown', this.onClicked.bind(this));
        }

        if(Phaser.Math.Between(0, 1)) { // Add stars
            this.stars.create(Phaser.Math.Between(0, game.config.width), 0, "star")
            this.stars.setVelocityY(gameOptions.dudeSpeed)

            if(Phaser.Math.Between(0, 1)) { // Hearts are rarer
                this.hearts.create(Phaser.Math.Between(0, game.config.width), 0, "heart")
                this.hearts.setVelocityY(gameOptions.dudeSpeed)
            }
        }

        this.siili.setPosition(game.config.width / 2, approach)
        if (approach != 840) { // Siili lähestyy!
            approach -= 5;
        }

        // create game-over text so that its on top of platforms
        this.gameOverText = this.add.text(game.config.width / 2, game.config.height / 2, "Game Over", {fontSize: "50px", fill: "#ffffff"});
        this.gameOverText2 = this.add.text(game.config.width / 2, game.config.height / 2 + 100, "Click anywhere", {fontSize: "20px", fill: "#ffffff"});
        this.gameOverText.setOrigin(0.5)
        this.gameOverText.visible = false;
        this.gameOverText2.setOrigin(0.5)
        this.gameOverText2.visible = false;
        
    }

    // Platforms fall. 
    // Source: https://digitherium.com/blog/phaser-platformer-series-20-collapsing-platforms/
    platformFall (player, platform) {
        if (player.body.blocked.down) {
            platform.setVelocityY(gameOptions.dudeGravity / 3)
        }
    }

    collectStar (player, star) {

        this.ding.play();
        star.disableBody(true, true);
        score += 1;
        this.scoreText.setText('Score: ' + score);
        // create bombs when collected
        this.createBomb();

    }

    collectHeart (player, heart) {

        this.ding.play();
        heart.disableBody(true, true); 
        score += 10;
        this.scoreText.setText('Score: ' + score);
        this.createBomb();
    }

    createBomb () {

        this.bomb = this.bombs.create(Phaser.Math.Between(0, game.config.width), -game.config.height, 'bomba')
        this.bomb.setBounce(1);
        this.bomb.setCollideWorldBounds(true);
        this.bomb.setVelocity(Phaser.Math.Between(-gameOptions.dudeSpeed / 3, gameOptions.dudeSpeed / 3), gameOptions.dudeSpeed); 

        // Destroy the bomb.
        // Source: https://phasergames.com/how-do-i-remove-object-on-click/
        this.bomb.setInteractive();
        this.input.on('gameobjectdown', this.onClicked.bind(this));
    }

    onClicked (pointer, objectClicked) {

        objectClicked.destroy();
        this.boom.play();
    }

    death (player, bomb) {

        this.physics.pause();
        this.player.setTint(0xff0000);
        this.ded.play();
        this.gameOver = true;
        this.gameOverText.visible = true;
        this.gameOverText2.visible = true;
        this.jam.stop();

        this.input.on("pointerdown", () => this.scene.start("endScene"));

    }

}

//OTHER SCENES--------------------------------------------------

class endScene extends Phaser.Scene {

    constructor () {
        super("endScene");
    }

    preload () {
        this.load.image("skull", "assets/skull.png")
    }

    create() {
        this.add.text(75, 100, "The hedgehog ate you...", {fontSize: "40px", fill: "#ffffff", fontStyle: "bold"});
        this.add.text(75, 200, "(He was probably also the one throwing bombs)", {fontSize: "18px", fill: "#ffffff"});
        this.add.text(75, 300, "Thank you for playing my game!", {fontSize: "18px", fill: "#ffffff"});
        this.add.text(75, 400, "Your score was: " + score + "!", {fontSize: "20px", fill: "#ffffff"});
        this.add.text(75, 500, "Click the screen to start again", {fontSize: "30px", fill: "#ffffff", fontStyle: "bold"});
        this.add.image(670, 120, "skull")
        // click mouse
        this.input.on("pointerdown", () => this.scene.start("preScene"))
    }

}

class preScene extends Phaser.Scene {

    constructor() {
        super("preScene");
    }

    preload () {
        this.load.image("heart", "assets/heart.png")
    }

    create() {
        this.add.text(100, 100, "Welcome to the game!", {fontSize: "40px", fill: "#ffffff", fontStyle: "bold"});
        this.add.text(55,200, "You are the national insect of Finland, a ladybug.", {fontSize: "18px", fill: "#ffffff"});
        this.add.text(55, 300, "Your goal is to get away from the hedgehog trying to eat you.", {fontSize: "20px", fill: "#ffffff"});
        this.add.text(55, 400, "Use the power of stars (1 point) and hearts (10 points)", {fontSize: "20px", fill: "#ffffff"});
        this.add.text(55, 450, "to defeat him!", {fontSize: "18px", fill: "#ffffff"});
        this.add.text(55, 600, "Click on bombs or platforms to destroy them", {fontSize: "20px", fill: "#ffffff"});
        this.add.text(55, 530, "Move your character with arrow keys", {fontSize: "20px", fill: "#ffffff"});
        this.add.text(70, 700, "CLICK THE SCREEN TO START...",{fontSize: "40px", fill: "#ffffff", fontStyle: "bold"});
        this.add.image(620, 120, "heart")
        // click mouse
        this.input.on("pointerdown", () => this.scene.start("mainScene"))
    }

}