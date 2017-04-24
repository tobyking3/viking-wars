class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    get area() {
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }
}

const rect = new Rectangle(800, 600);

var game;

function main() {
    
    console.log(rect.area);
    
    console.log(rect.width);
    
    console.log(rect.height);
    
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { create: create });
}

function create() {
    game.add.text(50, 50, "Phaser is working!", { fontSize: '32px', fill: '#FFF' });
}