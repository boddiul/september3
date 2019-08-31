var game = new Phaser.Game(720, 1280, Phaser.AUTO, '', { preload: preload, create: create, update: update });



function preload() {
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertically = true;
    game.load.image('back', 'assets/back.png');

}



function create() {

    game.add.sprite(0, 0, 'back');
}


function update() {

}