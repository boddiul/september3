var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;


        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

    },

    preload: function () {


        this.load.atlas("preloader", "assets/lprelouder.png", "assets/lprelouder.json");

    },

    create: function () {

        this.state.start('Preloader');

    }

};
