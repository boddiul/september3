const WIDTH = 720;
const HEIGHT = 1280;
const COOLDOWN = 15;

const FIRESPREE = 5;


let game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('back', 'assets/back.png');
    game.load.image('calendar', 'assets/calendar.png');
    game.load.image('repButton', 'assets/repButton.png');
    game.load.image('3sept','assets/3sept.png')
    game.load.spritesheet('anim1','assets/anim1.png',360,427);
    game.load.spritesheet('anim2','assets/anim2.png',360,427);

    game.load.spritesheet('fire_start','assets/fire_start.png',350,374);
    game.load.spritesheet('fire1_hot','assets/fire1_hot.png',99,166);
    game.load.spritesheet('fire2_hot','assets/fire2_hot.png',67,123);
    game.load.spritesheet('fire3_hot','assets/fire3_hot.png',93,197);
}

let controller;
let repButton;
let calendar;
let fire;
let score;

let overlay;


function Controller()
{
    this.back = game.add.sprite(0, 0, 'back');
    this.back.inputEnabled = true;



}

function RepButton(x,y)
{

    this.pressed =function() {


        console.log("You reposted in the wrong neighborhood");

        //send("VKWebAppShowWallPostBox", {"message": "Перевернул 300 листов и не жалею об этом! #Шуфунтач","attachments":"photo-54781675_457239018,https://vk.com/app7119027"});
        send("VKWebAppShowWallPostBox", {"message": "test! #hashtag","attachments":"photo-102692491_457239019,https://vk.com/app7119527_59559418"});


    }

    let obj = game.add.button(x, y, 'repButton', this.pressed, this, 2, 1, 0);
}

function Fire()
{
    this.hot=[null,null,null,null];

    this.startF = game.add.sprite(10,0,"fire_start");
    this.startF.animations.add('run',null,23*0.75,false);
    this.startF.animations.getAnimation('run').onComplete.add(
        function(){
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
        this.onFire = true;
    }

    this.stop = function ()
    {
        this.onFire = false;
        this.fade = 1;
        for (let i = 0;i < 3; i++)
        {
            //this.hot[i].visible = false;
            //this.hot[i].animations.stop('run');
        }
    }


    this.update = function ()
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
}

function Calendar()
{

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

    this.click =  function()
    {
        if (game.input.y>HEIGHT*0.45)
            if (this.cooldown<=1)
            {

                if (this.play1)
                {
                    this.anim1.visible = true;
                    this.anim1.animations.play('flip');
                }
                else
                {
                    this.anim2.visible = true;
                    this.anim2.animations.play('flip');
                }


                this.play1 = !this.play1;
                score.inc(this.cooldown>-COOLDOWN*0.9);
                this.cooldown = COOLDOWN;


            }


    }

    this.update = function()
    {
        if (this.cooldown === Math.trunc(COOLDOWN*0.3))
        {
            this.sept.x = -3+Math.floor(Math.random()*6)
            this.sept.y = -3+Math.floor(Math.random()*6)
        }

        if (this.cooldown>-COOLDOWN*5)
        {
            this.cooldown-=1;

            if (fire.onFire  && this.cooldown < -COOLDOWN*4)
            {
                fire.stop();
            }
        }

    }

    controller.back.events.onInputDown.add(this.click, this);
}


function  Score() {
    this.n = 0;
    this.spree=0;

    this.inc = function(isFast)
    {
        if (isFast)
            this.spree++;
        else
            this.spree=0;


        if (this.spree==FIRESPREE)
            fire.start();

        this.n++;
    }
}







function create()
{


    controller = new Controller();
    fire = new Fire();
    calendar = new Calendar();
    score = new Score();
    repButton = new RepButton(0,0);
}


function update()
{
    calendar.update();
    fire.update();
}