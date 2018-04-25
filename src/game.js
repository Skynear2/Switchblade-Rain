    'use strict'

/**
 * Exemplo de jogo com miscelanea de elementos:
 * - control de personagem por rotacionar e mover usando arcade physics
 * - dois players PVP
 * - pool e tiros
 * - colisao de tiros e players
 * - taxa de tiros e variancia de angulo
 * - HUD simples
 * - mapa em TXT
 */

const config = {}
config.RES_X = 1280 // resolucao HD
config.RES_Y = 720


config.PLAYER_ACCELERATION  = 600
config.PLAYER_TURN_VELOCITY = 350
config.PLAYER_MAX_VELOCITY  = 300
config.PLAYER_HEALTH        = 30
config.PLAYER_DRAG          = 300


config.BULLET_FIRE_RATE     = 20
config.BULLET_ANGLE_ERROR   = 0.1
config.BULLET_LIFE_SPAN     = 750
config.BULLET_VELOCITY      = 500

var sky
var fog
var player1
var player2
var hud
var map
var obstacles
var serras
var timer1
var timer2
var scorep1 = 0
var scorep2 = 0
var enemyspeed1 = 10000
var enemyspeed2 = 10000
var enemySpawnDelay1 = 3000
var enemySpawnDelay2 = 3000
var gameOver
var itens

var timeritem


var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })
    
function preload() {
    game.load.image('itens', 'assets/Barrel (2).png')
    game.load.image('saw', 'assets/saw.png')
    game.load.image('sky', 'assets/sky.png')
    game.load.image('plane1', 'assets/Idle (1).png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('wall', 'assets/wall.png')
    game.load.image('fog', 'assets/fog.png')
    game.load.text('map1', 'assets/map1.txt');  // arquivo txt do mapa
}

function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(10, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)
    spawn()
    spawnItens()
    //game.physics.arcade.gravity.y = 300;
    var skyWidth = game.cache.getImage('sky').width
    var skyHeight = game.cache.getImage('sky').height
    sky = game.add.tileSprite(
        0, 0, skyWidth, skyHeight, 'sky')
    sky.scale.x = game.width/sky.width
    sky.scale.y = game.height/sky.height

    

    fog = game.add.tileSprite(
        0, 0, game.width, game.height, 'fog')
    fog.tileScale.setTo(7,7)
    fog.alpha = 0.4
    
    obstacles = game.add.group()
    serras = game.add.group()
    itens = game.add.group()
    createMap()

    player1 = new Player(game, game.width*2/9, game.height-85, 
                        'plane1', 0xff0000, createBullets(), {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })
    player2 = new Player(game, game.width*7/9, game.height-85, 
                        'plane1', 0x00ff00, createBullets(), {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.G
        })
        game.physics.enable(player1, Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 250
        player1.body.gravity.y = 250;
        player2.body.gravity.y = 250;
        game.add.existing(player1)
    game.add.existing(player2)
    player2.scale.x *= -1;

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: '),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: '),
        fps: createHealthText(game.width*6/9, 50, 'FPS'),
        text3: createHealthText((game.width/2 - 450), (game.height/2), 'Score Final: '),
        text4: createHealthText((game.width - 285), (game.height/2), 'Score Final: '),
        text5: createEndText(game.width/2, game.height/2-40, 'GAME OVER!!', ),
        text6: createWinnerText(game.width/2, (game.height/2 + 60), 'PLAYER 1 WIN!!!'),
        text7: createWinnerText(game.width/2, (game.height/2 + 60), 'PLAYER 2 WIN!!!'),
        
       
        }
        hud.text3.visible = false
        hud.text4.visible = false
    //createText()
    updateHud()

    var fps = new FramesPerSecond(game, game.width*3/9, 50)
    game.add.existing(fps)

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)

    game.time.advancedTiming = true;
}

function spawnItens(){
    timeritem = game.time.create(true)
    timeritem.loop(10000, spawnIten1, this)
    timeritem.start()
}

function spawn (){

    timer1 = game.time.create(true);
    timer1.loop(enemySpawnDelay1, fireSaw1, this);
    timer1.start()
    timer2 = game.time.create(true);
    timer2.loop(enemySpawnDelay2, fireSaw2, this);
    timer2.start()

}


/*//function createText(){
        var centroX1 = game.width/2 - 450
        var centroY1 = game.height/2
        var centroX2 = game.width - 450
        var centroY2 = game.height/2
        console.log("centro:"+centroX2 )
        scoreFinal1 = game.add.text(centroX1 , centroY1, 'Score final:', { font: '24px Arial', fill: '#fff' })
        scoreFinal2 = game.add.text(centroX2 , centroY2, 'Score final2:', { font: '24px Arial', fill: '#fff' })
        gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', { font: '84px Arial', fill: '#fff' })
        gameOver.anchor.setTo(0.5, 0.5)
        gameOver.visible = false
        scoreFinal1.anchor.setTo(0.5, 0.5)
        scoreFinal1.visible = true
        scoreFinal1.stroke = '#000000';
        scoreFinal1.strokeThickness = 2;
        scoreFinal2.stroke = '#000000';
        scoreFinal2.strokeThickness = 2;
        
//}*/

function loadFile() {
    var text = game.cache.getText('map1');
    return text.split('\n');
}

function createMap() {
    // carrega mapa de arquivo texto
    var mapData = loadFile()

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col]
            var param = ''
            if (col+1 < mapData[row].length) {
                param = mapData[row][col+1]
            }
            if (tipo == 'X') {
                var wall = map.create(col*32, row*32, 'wall')
                wall.scale.setTo(0.5, 0.5)
                game.physics.arcade.enable(wall)
                wall.body.allowGravity = false
                wall.body.immovable = true
                wall.tag = 'wall'
            } 
        }
    }
    
}

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function createWinnerText(x, y, text) {
    var style = {font: 'bold 64px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    text.visible = false
    return text
}

function createEndText(x, y, text) {
    var style = {font: 'bold 84px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    text.visible = false
    return text
}



function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    //text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.anchor.setTo(0.5, 0.5)
    return text
}

function updateBullets(bullets) {
    bullets.forEach(function(bullet) {
        game.world.wrap(bullet, 0, true)
    })
}

function spawnIten1(){
    var aux = Math.floor((Math.random() * 639) + 1);
    //console.log(player1.alive)    
    if( (aux >= 0)&& (aux < 640) && (player1.alive) ){            
                var item = new Bonus(game, aux, -30, 'itens', aux, enemyspeed1) 
                game.add.existing(item)
                itens.add(item)}
      
}

function fireSaw1(){
    var aux = Math.floor((Math.random() * 639) + 1);
    //console.log(player1.alive)    
    if( (aux >= 0)&& (aux < 640) && (player1.alive) ){            
                var saw = new Saw(game, aux, -30, 'saw', aux, enemyspeed1) 
                game.add.existing(saw)
                obstacles.add(saw)}
      
}

function fireSaw2(){
    var auxSpawn2 = 640 
    //console.log("antes de somar:"+auxSpawn2)
    auxSpawn2 += Math.floor((Math.random() * 640) + 1);    
    //console.log("dps de somar:"+auxSpawn2)
    if( (auxSpawn2 >= 641)&& (auxSpawn2 < 1280) && (player2.alive) ){            
                var saw = new Saw(game, auxSpawn2, -30, 'saw', auxSpawn2, enemyspeed2) 
                game.add.existing(saw)
                obstacles.add(saw)}
      
}
    

function update() {
    
   /* console.log(aux3)
    var aux2 = Math.floor((Math.random() * 1280) + 1);
    if(aux2 < 10){ 
    fireSaw()
    }*/
    
    
    hud.fps.text = `FPS ${game.time.fps}`

    sky.tilePosition.x += 0.5
    fog.tilePosition.x += 0.3
 
    //moveAndStop(player1)
    //updateBullets(player1.bullets)
    //updateBullets(player2.bullets)

    game.physics.arcade.collide(player1, player2)
    game.physics.arcade.collide(player1, obstacles, hitPlayer)
    game.physics.arcade.collide(player2, obstacles, hitPlayer)
    game.physics.arcade.collide(player1, itens, greenBarrel)
    game.physics.arcade.collide(player2, itens, greenBarrel)

    game.physics.arcade.collide(player1, map)
    game.physics.arcade.collide(player2, map)
    
    game.physics.arcade.collide(player1, obstacles)
    game.physics.arcade.collide(player2, obstacles)
    game.physics.arcade.collide(obstacles, map, killBullet)
    game.physics.arcade.collide(itens, map, killBarrel)
    
}

function killBarrel(saw, wall) {
    //wall.kill()
    saw.kill()
}

function killBullet(saw, wall) {
    //wall.kill()
    saw.kill()
    if(saw.body.x < 639){
        scorep1 += 5
    }
    else if (saw.body.x > 641){
        scorep2 += 5
    }
    //console.log("X:"+saw.body.x)
    //saw.kill()
    updateHud()
}

function hitPlayer(player, bullet) {
    if (player.alive) {
        player.damage(15)
        bullet.kill()
        updateHud()
    }
}

function greenBarrel(player, item) {
    if (player.alive) {
        player.health+= 10
        item.kill()
        updateHud()
    }
}


function winner(){
    
    if(!(player1.alive) && !(player2.alive) && (scorep1 > scorep2)){
        hud.text3.visible = true
        hud.text4.visible = true
        hud.text5.visible = true
        hud.text6.visible = true
        hut       
        var fadeInGameOver = game.add.tween(hud.text5);
        fadeInGameOver.to({ alpha: 1 }, 5000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.start();
        var fadeInWinner = game.add.tween(hud.text6);
        fadeInWinner.to({ alpha: 0.5 }, 1000, Phaser.Easing.Quintic.Out);
        fadeInWinner.start();
    }else 
    if(!(player1.alive) && !(player2.alive) && (scorep1 < scorep2)){
        hud.text3.visible = true
        hud.text4.visible = true
        hud.text5.visible = true
        hud.text7.visible = true       
        var fadeInGameOver = game.add.tween(hud.text5);
        fadeInGameOver.to({ alpha: 1 }, 5000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.start();
        var fadeInWinner = game.add.tween(hud.text7);
        fadeInWinner.to({ alpha: 1 }, 1000, Phaser.Easing.Quintic.Out);
        fadeInWinner.start();
    }

}

function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health} SCORE: ${scorep1}`
    hud.text2.text = `PLAYER 1: ${player2.health} SCORE: ${scorep2}`
    hud.text3.text = `Score Final: ${scorep1}`
    hud.text4.text = `Score Final: ${scorep2}`
    winner()
    //hud.text2.text = 'PLAYER 2: ' + player2.health + 'SCORE:' +scorep2
}

function render() {
    obstacles.forEach( function(obj) {game.debug.body(obj)})
    itens.forEach( function(obj) {game.debug.body(obj)})
    game.debug.body(player1)
    game.debug.body(player2)
}