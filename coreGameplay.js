
class Title extends Phaser.Scene{
    constructor(){
        super('title');
    }
    create(){
        this.cameras.main.setBackgroundColor('#1fb2f1');
        this.add.text(150, 100, 'Roly Poly: To the End', {
            fontSize: '40px',
            fill: '#ffffff'
        });
        this.clickText =this.add.text(240, 300, 'Click to Start', {
            fontSize: '36px',
            fill: '#ffffff'
        })
        .setInteractive()
        .on('pointerdown', () => {
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
        this.cameras.main.setBackgroundColor('#0a9cd5')
        this.matter.world.setBounds(1, 1, 799, 599);
        this.rollyPloy = this.matter.add.circle(400, 300, 20, 
            {restitution: 0.9}
        );
        this.rollyPloyVisual = this.add.image(this.rollyPloy.position.x, this.rollyPloy.position.y, 'rolly')
        .setScale(0.1);

        this.snail1 = this.matter.add.image(750, 550, 'snail', null, 
            {isStatic: true, isSensor: true}
        )
        .setScale(0.05);
        this.snail1.body.label = 'snail1';
         this.snail2 = this.matter.add.image(50, 550, 'snail', null, 
            {isStatic: true, isSensor: true}
        )
        .setScale(0.05);
        this.snail2.body.label = 'snail2';
        

        this.tweens.add({
            targets: this.snail1,
            x: 50,
            duration: 8000, 
            yoyo: true,
            repeat: -1,
            ease: 'linear'
        });
        this.tweens.add({
            targets: this.snail2,
            x: 750,
            duration: 8000, 
            yoyo: true,
            repeat: -1,
            ease: 'linear'
        });

        this.matter.world.on('collisionstart', (event, body1, body2) => {
            if(body1.label ==='snail1' && body2 === this.rollyPloy ||
                body2.label === 'snail1'&& body1 === this.rollyPloy){
                    this.scene.start('title');
                }
        });
        this.matter.world.on('collisionstart', (event, body1, body2) => {
            if(body1.label ==='snail2' && body2 === this.rollyPloy ||
                body2.label === 'snail2'&& body1 === this.rollyPloy){
                    this.scene.start('title');
                }
        });

        
        
        this.cursor = this.input.keyboard.createCursorKeys();
        }

    update(){
        if(this.cursor.left.isDown){
            this.matter.body.setVelocity(this.rollyPloy, {x: -5, y: this.rollyPloy.velocity.y});
        }
        if(this.cursor.right.isDown){
            this.matter.body.setVelocity(this.rollyPloy, {x: 5, y:this.rollyPloy.velocity.y});
        }

        if(this.cursor.up.isDown){
            this.matter.body.setVelocity(this.rollyPloy, {x: this.rollyPloy.velocity.x, y: -11});
        }

        this.rollyPloyVisual.x = this.rollyPloy.position.x;
        this.rollyPloyVisual.y = this.rollyPloy.position.y;
        this.rollyPloyVisual.rotation = this.rollyPloy.angle;


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
        default: 'matter',
        matter: {
            gravity: {y: 1},
            debug: true,
        },
    },
    scene: [Title, Gameplay]
}
const game = new Phaser.Game(config);