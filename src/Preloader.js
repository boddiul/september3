BasicGame.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function () {

        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.game.stage.backgroundColor = 15198183;
        this._logoContainer = this.make.sprite(this.world.centerX, this.world.centerY);
        this.add.existing(this._logoContainer);
        this._logo = this.make.image(0, -80, "preloader", "logo1");
        this._logo.anchor.set(.5);
        this._logo2 = this.make.image(this._logo.x, this._logo.y + 80, "preloader", "logo2");
        this._logo2.anchor.set(.5);
        this._footer = this.make.image(this._logo.x, this._logo.y + 85 + 80, "preloader", "bg0000");
        this._footer.anchor.set(.5);
        this._loading = this.make.image(this._logo.x, this._logo.y + 85 + 80, "preloader", "fg0000");
        this._loading.anchor.set(.5);
        this._logoContainer.addChild(this._logo);
        this._logoContainer.addChild(this._logo2);
        this._logoContainer.addChild(this._footer);
        this._logoContainer.addChild(this._loading);
        var arrowBoxWidth = this._loading.width + 4;
        var cpuHeight = this._loading.height + 2;
        this._loadingMask = this.make.graphics(.5 * -arrowBoxWidth, 0);
        this._loadingMask.beginFill(16711680, .5);
        this._loadingMask.drawRect(0, .5 * -cpuHeight, arrowBoxWidth, cpuHeight);
        this._loadingMask.endFill();
        this._loading.addChild(this._loadingMask);
        this._loading.mask = this._loadingMask;
        this._loadingMask.scale.x = 0;


        //	Here we load the rest of the assets our game needs.
        //	As this is just a Project Template I've not provided these assets, swap them for your own.
        this.load.audio('soundtrack', "assets/soundtrack.mp3");
        this.load.audio('boosted', "assets/boosted.mp3");
        this.load.audio('flip1', "assets/flip1.mp3");
        this.load.audio('flip2', "assets/flip2.mp3");
        this.load.audio('firestart', "assets/fire_start.mp3");
        this.load.audio('onfire', "assets/onfire.mp3");
        this.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');

        this.load.image('back', 'assets/back.png');
        this.load.image('calendar', 'assets/calendar.png');
        this.load.image('repButton', 'assets/repButton.png');

        this.load.image('sndOnButton', 'assets/sndON.png');
        this.load.image('sndOffButton', 'assets/sndOFF.png');

        this.load.image('3sept','assets/3sept.png');
        this.load.image('2sept','assets/2sept.png');
        this.load.spritesheet('anim1','assets/anim1.png',360,427);
        this.load.spritesheet('anim2','assets/anim2.png',360,427);

        this.load.image('mortal','assets/mortal.png')
        this.load.audio('yuppie','assets/yuppie.mp3')

        this.load.image('pulse','assets/pulse.png');

        this.load.spritesheet('fire_start','assets/fire_start.png',350,374);
        this.load.spritesheet('fire1_hot','assets/fire1_hot.png',99,166);
        this.load.spritesheet('fire2_hot','assets/fire2_hot.png',67,123);
        this.load.spritesheet('fire3_hot','assets/fire3_hot.png',93,197);
        //	+ lots of other required assets here

    },

    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {

        this._loadingMask.scale.x = progress / 100;
        if (progress >= 100) {
            this.game.load.onFileComplete.removeAll();

        }
    },

    create: function () {


    },

    update: function () {



        if (this.cache.isSoundDecoded('soundtrack')  && this.cache.isSoundDecoded('boosted') && this.ready === false)
        {
            this.ready = true;


            var self = this;
            this.add.tween(this._logoContainer).to({
                alpha : 0
            }, 450, null, true, 300).onComplete.addOnce(function() {
                self.state.start('Game');
            })
            //this.
        }

    }

};
