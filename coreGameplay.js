
class Title extends Phaser.Scene{
    constructor(){
        super('title');
    }
    create(){
        this.cameras.main.setBackgroundColor('#f97bde');
        this.add.text(500, 300, 'Roly Poly: To the End', {
            fontSize: '72px',
            fill: '#ffffff'
        });
        this.clickText =this.add.text(650, 600, 'Click to Start', {
            fontSize: '64px',
            fill: '#ffffff'
        })

        this.input.on('pointerdown', () => {
            this.scene.start('gameplay')
        });

        this.tweens.add({
            targets: this.clickText,
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }
}
class Gameplay extends Phaser.Scene{
    constructor(){
        super('gameplay');
    }
    preload(){
        this.load.image('rolly', 'assets/rollypoly.png');
        this.load.image('snail', 'assets/snail.png')
    }

    create(){
        this.cameras.main.setBackgroundColor('#f97bde')
        
        //player
        //setCollideWorldBounds stops it flying off the edge of the canvas
        //creates an invisible wall on all 4 edges of the canvas top bottom left right
        this.rollyPoly = this.physics.add.sprite(0, 1080, 'rolly')
            .setScale(0.3)
            .setBodySize(540, 367)
            .setFlipX(true)
            .setCollideWorldBounds(true);

        //jump input
        //pointerdown fires for both mouse clicks and finger taps
        this.input.on('pointerdown', () => {
            if(this.rollyPoly.body.blocked.down){
                this.rollyPoly.setVelocityY(-500);
            }
        })
        this.isAlive = true;

        this.snail1 = this.physics.add.sprite(900, 1080, 'snail')
            .setScale(0.2)
            .setBodySize(1500, 1000)
            .setCollideWorldBounds(true);

        this.snail2 = this.physics.add.sprite(920, 1080, 'snail')
            .setScale(0.2)
            .setBodySize(1500, 1000)
            .setCollideWorldBounds(true);

        this.tweens.add({
            targets: this.snail1,
            x: 10,
            duration: 3000, 
            yoyo: true,
            repeat: -1,
            ease: 'Linear',
            onYoyo: () => {
                this.snail1.setFlipX(true);
            },
            onRepeat: () => {
                this.snail1.setFlipX(false);
            }
        })
        

        this.tweens.add({
            targets: this.snail2,
            x: 1920,
            duration: 3000, 
            yoyo: true,
            repeat: -1,
            ease: 'Linear',
            onStart: () => {
                this.snail2.setFlipX(true);
            },
            onYoyo: () => {
                this.snail2.setFlipX(false);
            },
            onRepeat: () => {
                this.snail2.setFlipX(true);
            }
        })


        this.physics.add.overlap(this.rollyPoly, this.snail1, () => {
            if(this.rollyPoly.body.blocked.down){
                this.hitSnail();
            }
        })
         this.physics.add.overlap(this.rollyPoly, this.snail2, () => {
            if(this.rollyPoly.body.blocked.down){
                this.hitSnail();
            }
        })

        //spacebar/up arrow as desktop fallback
        this.cursor = this.input.keyboard.createCursorKeys();
        
        
        }

        hitSnail(){
            this.isAlive = false;

            this.tweens.add({
                targets: this.rollyPoly,
                alpha: 0,
                duration: 1000,
            });

            this.rollyPoly.setVelocityX(0);
            this.rollyPoly.setVelocityY(0);
            const messageCard = this.add.rectangle(950, 500, 700, 700, 0x7CD4F7);
            this.add.text(690, 500, 'Watch out for snails!', {
                fontSize: '42px',
                fillStyle: '#ecf0ef'
            });
            this.time.delayedCall(3000, () => {
                this.scene.start('title');
            });
        }

    update(){
        //Auto run
        if(this.isAlive){
        this.rollyPoly.setVelocityX(290);
    
        //keyboard Jump
        if(Phaser.Input.Keyboard.JustDown(this.cursor.up) ||
            Phaser.Input.Keyboard.JustDown(this.cursor.space)
        ) {
            if(this.rollyPoly.body.blocked.down){
                this.rollyPoly.setVelocityY(-450);
            };
        };

        //win condition
        if(this.rollyPoly.x >= 1800){
            const messageCard2 = this.add.rectangle(950, 500, 700, 700, 0x7CD4F7);
            this.add.text(730, 500, "That's good work!", {
                fontSize: '42px',
                fillStyle: '#ecf0ef'
            });
            this.time.delayedCall(1500, () => {
                this.scene.start('title');
            });
        }
    }
        

    }
}

const config = {
    width: 1920,
    height: 1080,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, 
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false,
        },
    },
    scene: [Title, Gameplay]
}
const game = new Phaser.Game(config);