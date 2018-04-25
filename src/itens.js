
class Bonus extends Phaser.Sprite {
    constructor(game, x, y, img, random, speed, tint) {
        super(game, x, y, img)
        this.scale.setTo(0.25, 0.25)
        this.anchor.setTo(0.2, 0.3)
        game.physics.arcade.enable(this)
        this.tint = tint
        this.body.setSize(150, 260, 20, 1)
        this.body.isCircle = false
        var left = 0
        var right= game.width
        var up   = y
        var down = game.height + 300
        var hDelay = game.width/(200/1000)
        var vDelay = game.height/(200/1000)
        
        
       
        
            game.add.tween(this)
                    .to( { x: random, y: down }, speed, Phaser.Easing.Exponential.Out, true )
                    .loop(-1)
                    .start()
            
              
            
        /*if (type == 'R') {// vai para direita
            game.add.tween(this)
                .to( { x: right, y: up }, hDelay/2 )
                .to( { x: right, y: down }, vDelay )
                .to( { x: left, y: down }, hDelay )
                .to( { x: left, y: up }, vDelay )
                .to( { x: this.x, y: this.y }, hDelay/2 )
                .loop(-1)
                .start()
        } else
        if (type == 'L') {// vai para esquerda
            game.add.tween(this)
                .to( { x: left, y: down }, hDelay/2 )
                .to( { x: left, y: up }, vDelay )
                .to( { x: right, y: up }, hDelay )
                .to( { x: right, y: down }, vDelay )
                .to( { x: this.x, y: this.y }, hDelay/2 )
                .loop(-1)
                .start()
        } else
        if (type == 'V') {// vai e vem
            game.add.tween(this)
                .to( { x: this.x+500, y: this.y }, 2000 )
                .to( { x: this.x    , y: this.y }, 2000 )
                .loop(-1)
                .start()
        }*/

        /*game.add.tween(this) //roda a serra
            .to( { angle: -359 }, 2000 )
            .loop(-1)
            .start()
           */
    } 
    

}