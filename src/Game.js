BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {



    preload : function() {



        this.controller = new this.Controller(this);
        this.fire = new this.Fire(this);
        this.calendar = new this.Calendar(this);
        this.score = new this.Score(this);
        this.pulse = new this.Pulse(this);
        this.repButton = new this.RepButton(this);

    },


    Controller : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.back = game.add.sprite(0, 0, 'back');
            this.back.inputEnabled = true;


            this.soundtrack = game.add.audio('soundtrack', 0.9, true);
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
                send("VKWebAppShowWallPostBox", {"message": "test! #hashtag","attachments":"photo-102692491_457239019,https://vk.com/app7119527_59559418"});


            }

            this.obj = game.add.button(0, 0, 'repButton', this.pressed, this, 2, 1, 0);
        }


    },
    repButton : null,


    Calendar : class {


        constructor(global) {this.global=global;}

        init()
        {


            this.flip1 = game.add.audio('flip1', 0.9, false);
            this.flip2 = game.add.audio('flip2', 0.9, false);

            this.myback = game.add.sprite(104,592,'calendar');
            this.sept = game.add.sprite(0,0,'3sept');
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
                this.global.controller.soundtrack.play();

            if (game.input.y>HEIGHT*0.45)
                if (this.cooldown<=1)
                {

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
                    this.global.score.inc(this.cooldown>-COOLDOWN*0.9);
                    this.cooldown = COOLDOWN;


                }


        }




        update()
        {
            if (this.cooldown === Math.trunc(COOLDOWN*0.3))
            {
                this.sept.x = -3+Math.floor(Math.random()*6)
                this.sept.y = -3+Math.floor(Math.random()*6)
            }

            if (this.cooldown>-COOLDOWN*5)
            {
                this.cooldown-=1;

                if (this.global.fire.onFire  && this.cooldown < -COOLDOWN*4)
                {
                    this.global.fire.stop();
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
            this.onfire = game.add.audio('onfire', 0.3, true);

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

            this.start = function () {
                this.startF.visible = true;
                this.startF.animations.play('run');
                this.firestart.play();
                this.onFire = true;
            }
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


            if (this.spree==FIRESPREE)
                this.global.fire.start();

            this.n++;

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


            if (this.global.fire.onFire)
            {
                this.step+=1;
                this.fade = 1-(Math.cos(this.step/30)*0.5+0.5);
            }


            this.obj.alpha = this.fade;
        }


    },
    pulse : null,


    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.controller.init();
        this.fire.init();
        this.calendar.init();
        this.score.init();
        this.pulse.init();
        this.repButton.init();

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.calendar.update();
        this.fire.update();
        this.pulse.update();
    }



};