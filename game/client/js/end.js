let End = {};

End.init = function() {
    game.stage.disableVisibilityChange = true;
};

End.preload = function() {

};

End.create = function() {
    powerText = game.add.text(400, 200, 'GAME OVER', {font: "40px Arial", fill: "#ffffff"});
    powerText.setShadow(1, 1, 'rgba(0, 0, 0, 0.8)', 1);
    powerText.fixedToCamera = true;
};