
class Player extends Phaser.Sprite {
    
    constructor(game, x, y, img, tint, flagp1,keys) {
        super(game, x, y, img)
        this.scale.setTo(0.2)
        this.player1 = flagp1
        this.speedX = 10
        this.tint = tint
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        //this.body.drag.set(config.PLAYER_DRAG)
        //this.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
        this.body.isCircle = false
        //this.body.mass = 1
        this.body.friction.setTo(0,0)
        this.body.bounce.setTo(1,1)
        this.nextFire = 0
        this.jumpTimer = 0

        this.cursors = {
            left: game.input.keyboard.addKey(keys.left),
            right: game.input.keyboard.addKey(keys.right),
            up: game.input.keyboard.addKey(keys.up),
            down: game.input.keyboard.addKey(keys.down),        
            
        }
    
        
    }        

    // move e rotaciona, como em Asteroids
    moveAndTurn() {
        // define aceleracao pela rotacao (radianos) do sprite
        

        // rotaciona
        if (this.cursors.left.isDown) {
            //this.body.x += -this.speedX
            this.body.velocity.x = -250
        } else
        if (this.cursors.right.isDown) {
            this.body.velocity.x = 250
            //this.body.x += this.speedX
        }
        //console.log(this.body.onWall())
        //&& this.body.onFloor()
        if(this.cursors.up.isDown  && game.time.now > this.jumpTimer){
            this.body.velocity.y = -2000000;
            this.jumpTimer = game.time.now + 1750;
        }
         

        // atravessa bordas da tela (usando phaser built-in)
        //game.world.wrap(this, 0, true)
        this.body.collideWorldBounds = true;
        this.body.bounce.set(0)
    } 
    
     
    
    
       
    update() {
         
        this.moveAndTurn()
        //this.fireBullet()
    }
}