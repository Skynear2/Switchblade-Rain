
class Player extends Phaser.Sprite {
    
    constructor(game, x, y, img, flagp1,keys, flagbegin) {
        super(game, x, y, img)
        this.scale.setTo(0.2)
        this.player1 = flagp1
        this.speedX = 10
        this.flag = flagp1
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)                
        this.body.setSize(435, 600, 70,50) //1°: comprimento direta esquerda    2° cumprimento cima baixo  3°:   4°:
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.maxVelocity.set(850)
        this.body.isCircle = false
        this.body.mass = 1
        this.body.friction.setTo(0,0)
        this.body.bounce.setTo(0.1,0.1)
        this.flagright = false
        this.isright = flagbegin
        this.flagleft = false
        //this.nextFire = 0
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
            if(this.flagleft){
                if(this.isright){
                this.scale.x *= -1}
                this.isright = false
            }
            this.body.velocity.x = -450
        } else
        if (this.cursors.right.isDown) {
            if(this.flagright){
                if(!this.isright){
                this.scale.x *= -1}
                this.isright = true
            }
            this.body.velocity.x = 450
            //this.body.x += this.speedX
        }
        //console.log(this.body.onWall())
        //&& this.body.onFloor()
        if(this.cursors.up.isDown  && game.time.now > this.jumpTimer){
            this.body.velocity.y = -2000000;
            this.jumpTimer = game.time.now + 1300;
        }

        if(!this.cursors.right.isdown){
            this.flagright = true
        }
        if(!this.cursors.left.isdown){
            this.flagleft = true
        }
         

        // atravessa bordas da tela (usando phaser built-in)
        //game.world.wrap(this, 0, true)
        this.body.collideWorldBounds = true;
        //this.body.bounce.set(0)
    } 
    
     

       
    update() {
     
        this.moveAndTurn()
        //this.fireBullet()
    }
}