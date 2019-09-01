const WIDTH = 720;
const HEIGHT = 1280;
const COOLDOWN = 15;


let game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, '', { preload: preload, create: create, update: update });


function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('back', 'assets/back.png');
    game.load.image('repButton', 'assets/repButton.png');
    game.load.image('3sept','assets/3sept.png')
    game.load.spritesheet('anim1','assets/anim1.png',360,427);
    game.load.spritesheet('anim2','assets/anim2.png',360,427);

    game.load.spritesheet('fire2_hot','assets/fire2_hot.png',147,318);
    game.load.spritesheet('fire3_hot','assets/fire3_hot.png',261,378);
}

let controller;
let repButton;
let calendar;
let fire;


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
        send("VKWebAppShowWallPostBox", {"message": "test! #hashtag","attachments":"photo-54781675_457239019,https://vk.com/app7119527_59559418"});


    }

    let obj = game.add.button(40, 40, 'repButton', this.pressed, this, 2, 1, 0);
}

function Fire()
{
    this.hot=[null,null,null,null];

    for (let i=1;i<=2;i++)
    {
        this.hot[i] = game.add.sprite(30,30,"fire"+(i+1)+"_hot");
        this.hot[i].animations.add('run',null,10,true);
        this.hot[i].animations.play('run');
    }


    this.hot[1].y=140;
}

function Calendar()
{

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

        if (this.cooldown>0)
        this.cooldown-=1;
    }

    controller.back.events.onInputDown.add(this.click, this);
}









function create()
{


    controller = new Controller();

    calendar = new Calendar();
    fire = new Fire();
    repButton = new RepButton(10,10);
}


function update()
{
    calendar.update();
}