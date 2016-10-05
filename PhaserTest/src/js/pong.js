var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('space', 'assets/pong/starfield.jpg');
    game.load.image('fire1', 'assets/pong/fire1.png');
    game.load.image('fire2', 'assets/pong/fire2.png');
    game.load.image('fire3', 'assets/pong/fire3.png');
    game.load.image('smoke', 'assets/pong/smoke-puff.png');

    game.load.spritesheet('ball', 'assets/pong/plasmaball.png', 128, 128);
    game.load.image("paddle", "assets/pong/paddle.png");
}

var ball;
var emitter;
var path;
var index;
var score = 0;
var scoreText;

var paddle;

var cursors;

var entity;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);

    emitter.makeParticles( [ 'fire1', 'fire2', 'fire3', 'smoke' ] );

    emitter.gravity = 200;
    emitter.setAlpha(1, 0, 3000);
    emitter.setScale(0.8, 0, 0.8, 0, 3000);

    emitter.start(false, 3000, 5);

    ball = game.add.sprite(0, 300, 'ball', 0);

    game.physics.arcade.enable(ball);

    ball.body.setSize(80, 80, 0, 0);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.body.velocity.set(300, 200);

    ball.inputEnabled = true;

    ball.input.enableDrag();
    ball.events.onDragStart.add(onDragStart, this);
    ball.events.onDragStop.add(onDragStop, this);

    ball.animations.add('pulse');
    ball.play('pulse', 30, true);

    ball.anchor.set(0.5);

    scoreText = createText(16, 16, 'Test');

    paddle = game.add.sprite(400, 400, "paddle");
    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();

    entity = new Entity(999);
}

function update() {

    var px = ball.body.velocity.x;
    var py = ball.body.velocity.y;

    px *= -1;
    py *= -1;

    emitter.minParticleSpeed.set(px, py);
    emitter.maxParticleSpeed.set(px, py);

    emitter.emitX = ball.x;
    emitter.emitY = ball.y;

    // emitter.forEachExists(game.world.wrap, game.world);
    game.world.wrap(ball, 64);

    if (cursors.left.isDown) {
        paddle.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
        paddle.body.velocity.x = 250;
    }

    game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);

    scoreText.text = "Score: " + score + entity;
}

function onDragStart() {
    ball.body.moves = false;
}

function onDragStop() {
    ball.body.moves = true;
}

function createText(x, y, string) {

    var text = game.add.text(x, y, string);
    // text.anchor.set(0.5);
    // text.align = 'center';

    //  Font style
    text.font = 'Arial Black';
    text.fontSize = 20;
    // text.fontWeight = 'bold';
    text.fill = '#ffffff';
    text.setShadow(2, 2, 'rgba(0, 0, 0, 0.7)', 2);

    return text;
}


function render() {

    // game.debug.bodyInfo(sprite, 32, 32);
}

function ballHitPaddle(_ball, _paddle) {

    score++;

    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}

function Entity(id) {
    this.id = id;
}

Entity.prototype = {
    constructor: Entity,

    addComponent: function(component) {
        //println("added component " + component);
    },

    addControl: function(control) {
        //println("added control " + control);
    },

    toString: function() {
        return "Entity@" + this.id;
    }
};