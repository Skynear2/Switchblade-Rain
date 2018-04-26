
class Parede extends Phaser.Sprite {
    constructor(game, x, y, img,) {
        super(game, x, y, img)
        this.scale.setTo(1)
        
        this.anchor.setTo(0.5, 0.5)
        game.physics.arcade.enable(this)
        //this.body.setSize(0, 0, 0,  0)
        
}
}