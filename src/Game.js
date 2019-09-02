BasicGame.Game = function (game) {


};

BasicGame.Game.prototype = {



    preload : function() {



        this.controller = new this.Controller(this);
        this.fire = new this.Fire(this);
        this.calendar = new this.Calendar(this);
        this.score = new this.Score(this);
        this.pulse = new this.Pulse(this);
        this.repButton = new this.RepButton(this);
        this.sndButton = new this.SndButton(this);

        this.mortal = new this.Mortal(this);

    },


    Controller : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.back = game.add.sprite(0, 0, 'back');
            this.back.inputEnabled = true;


            this.soundtrack = game.add.audio('soundtrack', 0.9, true);
            this.boosted = game.add.audio('boosted', 0, true);
            this.global.game.stage.backgroundColor = "#230202";
        }


    },
    controller : null,


    RepButton : class {


        constructor(global) {this.global=global;}

        init()
        {
            this.pressed =function() {


                console.log("You reposted in the wrong neighborhood");

                //send("VKWebAppShowWallPostBox", {"message": "Перевернул 300 листов и не жалею об этом! #Шуфунтач","attachments":"photo-54781675_457239018,https://vk.com/app7119027"});
                send("VKWebAppShowWallPostBox", {"message": "Я календарь перевернул "+this.global.score.n+" раз, и снова #третьесентябряч","attachments":"photo-29534144_457967299,https://vk.com/app7119027_59559418"});

            }

            this.obj = game.add.button(0, 0, 'repButton', this.pressed, this, 2, 1, 0);
        }


    },
    repButton : null,

    SndButton : class {
        constructor(global) {this.global=global;}

        init()
        {
            this.boost = false;
            this.pressed =function() {

                this.boost = !this.boost;

                if (this.boost)
                {
                    this.global.controller.soundtrack.volume=0;
                    this.global.controller.boosted.volume=0.9;
                }
                else
                {
                    this.global.controller.soundtrack.volume=0.9;
                    this.global.controller.boosted.volume=0;
                }

            }

            this.obj = game.add.button(300, 0, 'repButton', this.pressed, this, 2, 1, 0);
        }
    },
    sndButton : null,

    Calendar : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.flip1 = game.add.audio('flip1', 0.9, false);
            this.flip2 = game.add.audio('flip2', 0.9, false);

            this.myback = game.add.sprite(104,592,'calendar');
            this.sept3 = game.add.sprite(0,0,'3sept');
            this.sept3.visible = false;
            this.sept2 = game.add.sprite(0,0,'2sept');

            this.anim1 = game.add.sprite(0,1280-854,'anim1');
            this.anim2 = game.add.sprite(0,1280-854,'anim2');
            this.anim1.width = WIDTH;
            this.anim1.height = 854;
            this.anim2.width = WIDTH;
            this.anim2.height = 854;
            this.anim1.animations.add('flip',[0,1,2,3,4,5,6],20,false);
            this.anim2.animations.add('flip',[0,1,2,3,4,5,6],20,false);


            this.anim1.animations.getAnimation('flip').onComplete.add(
                function(){﻿this.visible=false},this.anim1);
            this.anim2.animations.getAnimation('flip').onComplete.add(
                function(){﻿this.visible=false},this.anim2);


            this.anim1.visible = false;
            this.anim2.visible = false;
            this.cooldown = 0;
            this.play1 = true;


            this.global.controller.back.events.onInputDown.add(this.click, this);
        }

        click()
        {

            if (!this.global.controller.soundtrack.isPlaying)
            {
                this.global.controller.soundtrack.play();

                this.global.controller.boosted.play();
            }


            if (game.input.y>HEIGHT*0.45)
                if (this.cooldown<=1)
                {


                    if (this.global.sndButton.boost)
                        this.global.camera.shake(0.01);
                    if (this.play1)
                    {

                        this.anim1.visible = true;
                        this.anim1.animations.play('flip');
                        this.flip1.play();
                    }
                    else
                    {
                        this.anim2.visible = true;
                        this.anim2.animations.play('flip');
                        this.flip2.play();
                    }


                    this.play1 = !this.play1;
                    this.global.score.inc(this.cooldown>-COOLDOWN);
                    this.cooldown = COOLDOWN;





                }


        }




        update()
        {
            if (this.cooldown === Math.trunc(COOLDOWN*0.3))
            {

                if (this.global.score.n <2)
                {
                    this.sept3.visible = true;
                    this.sept2.visible = false;
                }

                this.sept3.x = -3+Math.floor(Math.random()*6)
                this.sept3.y = -3+Math.floor(Math.random()*6)
            }

            if (this.cooldown>-COOLDOWN*5)
            {
                this.cooldown-=1;

                if (this.global.fire.onFire  && this.cooldown < -COOLDOWN*4)
                {
                    this.global.fire.stop();
                    //this.global.pulse.stop();
                }
            }

        }


    },
    calendar : null,

    Fire : class
    {
        constructor(global) {this.global=global;}

        init()
        {
            this.firestart = game.add.audio('firestart', 1, false);
            this.onfire = game.add.audio('onfire', 0.4, true);

            this.hot=[null,null,null,null];

            this.startF = game.add.sprite(10,0,"fire_start");
            this.startF.animations.add('run',null,23*0.75,false);
            this.startF.animations.getAnimation('run').onComplete.add(
                function(){
                    this.onfire.play();
                    this.startF.visible=false;
                    for (let i = 0;i < 3; i++)
                    {
                        this.hot[i].visible = true;
                        this.hot[i].alpha = 1;
                        //this.hot[i].animations.play('run');

                    }
                },this);
            //this.startF.animations.play('run');
            this.startF.width*=2;
            this.startF.height*=2;
            this.startF.visible = false;



            this.fade = 0;
            this.onFire = false;
            for (let i=0;i<=2;i++)
            {
                this.hot[i] = game.add.sprite(0,0,"fire"+(i+1)+"_hot");
                this.hot[i].animations.add('run',null,23*0.75,true);
                this.hot[i].animations.play('run');
                this.hot[i].visible = false;
                this.hot[i].width*=2;
                this.hot[i].height*=2;
            }

            this.hot[0].x=20;
            this.hot[0].y=420;

            this.hot[1].x=226;
            this.hot[1].y=80;

            this.hot[2].x=570;
            this.hot[2].y=235;


        }

        start()
        {

            this.startF.visible = true;
            this.startF.animations.play('run');
            this.firestart.play();
            this.onFire = true;
            this.global.camera.shake(0.02);
            //this.global.pulse.short();
        }


        extra()
        {
            this.firestart.play();
            this.global.camera.shake(0.02);
           // this.global.pulse.start();
        }

        stop()
        {
            this.onfire.stop();
            this.onFire = false;
            this.fade = 1;
            for (let i = 0;i < 3; i++)
            {
                //this.hot[i].visible = false;
                //this.hot[i].animations.stop('run');
            }

            //this.global.pulse.stop();
        }


        update()
        {
            if (this.onFire==false && this.fade>0)
            {
                this.fade-=1/30;
                for (let i = 0;i < 3; i++)
                {
                    this.hot[i].alpha = this.fade;
                    if (this.fade<2/30)
                        this.hot[i].visible = false;
                }


            }

        }
    },
    fire : null,


    Score : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.n = 0;
            this.spree=0;


            this.label = [null,null,null,null,null,null];

            for (let i = 0;i<6;i++)
            {
                this.label[i] = game.add.bitmapText(561-73*i, 1180, 'myfont', '', 70);
                this.label[i].anchor = new Phaser.Point(1,0);
            }


            this.label[0].text = '0';

            this.label[1].y = 1180+10;
            this.label[2].y = 1180+15;
            this.label[3].y = 1180+15;
            this.label[4].y = 1180+10;
        }

        inc(isFast)
        {
            if (isFast)
                this.spree++;
            else
                this.spree=0;


            if (this.spree==FIRESPREE && !this.global.fire.onFire)
                this.global.fire.start();


            if (this.spree==HOTSPREE)
                this.global.fire.extra();

            this.n++;



            if (this.n % 1000 == 0)
                this.global.mortal.appear();
            this.setText(this.n.toString(10));
        }

        setText(txt) {

            for (let i=0;i<6;i++)
                this.label[i].text = i<txt.length ? txt[txt.length-i-1] : '';

        }


    },
    score : null,

    Pulse : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.obj = game.add.sprite(0,0,'pulse');
            this.obj.alpha = 0;
            this.fade = 0;

            this.step=0;
        }

        update()
        {


            if (!this.global.fire.onFire && this.fade>0)
            {
                this.fade-=1/30;
                this.step = 0;
            }


            if (this.global.fire.onFire && this.global.score.spree>HOTSPREE)
            {
                this.step+=1;
                this.fade = 1-(Math.cos(this.step/30)*0.5+0.5);
            }


            this.obj.alpha = this.fade;
        }


    },
    pulse : null,




    Mortal : class {


        constructor(global) {
            this.global = global;
        }

        init() {


            this.obj = game.add.sprite(-300, 333, 'mortal');

            this.yuppie = game.add.audio('yuppie', 1, false)

        }

        appear()
        {

            let currentTween = game.add.tween(this.obj);
            currentTween.to({ x: 0 },1000,Phaser.Easing.Circular.InOut);
            currentTween.start();

            currentTween.onComplete.add(
                function()
                {
                    this.yuppie.play();
                    let currentTween = game.add.tween(this.obj);
                    currentTween.to({ x: -300 },800,Phaser.Easing.Circular.InOut);
                    currentTween.delay(600);
                    currentTween.start();
                },this);
        }


    },
    mortal:null,

    create: function () {

        this.controller.init();
        this.fire.init();
        this.calendar.init();
        this.score.init();
        this.pulse.init();
        this.mortal.init();
        this.repButton.init();
        this.sndButton.init();

    },

    update: function () {

        this.calendar.update();
        this.fire.update();
        this.pulse.update();

    }



};
