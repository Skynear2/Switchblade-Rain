
class Player extends Phaser.Sprite {
    
    constructor(game, x, y, img, tint, bullets, keys) {
        super(game, x, y, img)
        this.scale.setTo(0.2)
        this.speedX = 10
        this.tint = tint
        this.health = config.PLAYER_HEALTH
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        this.body.drag.set(config.PLAYER_DRAG)
        this.body.maxVelocity.set(config.PLAYER_MAX_VELOCITY)
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
    
        this.bullets = bullets
    }        

    // move e rotaciona, como em Asteroids
    moveAndTurn() {
        // define aceleracao pela rotacao (radianos) do sprite
        

        // rotaciona
        if (this.cursors.left.isDown) {
            //this.body.x += -this.speedX
            this.body.velocity.x = -150
        } else
        if (this.cursors.right.isDown) {
            this.body.velocity.x = 150
            //this.body.x += this.speedX
        }
        //console.log(this.body.onWall())
        //&& this.body.onFloor()
        if(this.cursors.up.isDown  && game.time.now > this.jumpTimer){
            this.body.velocity.y = -250;
            this.jumpTimer = game.time.now + 750;
        }
         

        // atravessa bordas da tela (usando phaser built-in)
        //game.world.wrap(this, 0, true)
        this.body.collideWorldBounds = true;
        this.body.bounce.set(0)
    } 
    
     
    
    
    fireBullet() {
        if (!this.alive)
            return;
    
        if (this.cursors.fire.isDown) {
            if (this.game.time.time > this.nextFire) {
                var bullet = this.bullets.getFirstExists(false)
                if (bullet) {
                    bullet.reset(this.x, this.y)
                    bullet.lifespan = config.BULLET_LIFE_SPAN
                    bullet.rotation = this.rotation
                    bullet.body.bounce.setTo(1,1)
                    bullet.body.friction.setTo(0,0)
                    game.physics.arcade.velocityFromRotation(
                        bullet.rotation + game.rnd.realInRange(-config.BULLET_ANGLE_ERROR, config.BULLET_ANGLE_ERROR), 
                        config.BULLET_VELOCITY, bullet.body.velocity
                    )
                    // fire rate
                    this.nextFire = this.game.time.time + config.BULLET_FIRE_RATE
                }
            }
        }    
    } 
    
    update() {
         
        this.moveAndTurn()
        //this.fireBullet()
    }
}