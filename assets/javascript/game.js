'use strict'

$(document).ready(function(){
    var gameStarted = false;
    var winScreen = $("#winScreen");
    var charSelectScreen = $("#charSelectScreen");
    var gameScreen = $("#gameplayArea");
    var yourCharacter;
    var playerImg = $("#playerImage");
    var deathScreen = $("#deathScreen");
    var enemies = {
        "foot":"Frozen Zombie",
        "boss":"White Walker",
        "king":"King White Walker"
    }
    var waveNumber = 1;
    var chanceKing = 2;
    var chanceWalker = 6;
    var totalEnemies = 0;
    var currentEnemies = [];
    class startingCharacter{
        constructor(name, source){
            this.image = source;
            this.level = 1;
            this.exp = 0;
            this.name = name;
            this.health = 100;
            this.maxHealth = 100;
            this.attack = 20;
            this.strength = 0;
            this.agility = 0;
            if(firstLetter(name)==="j"){
                this.strength = 10;
                this.agility = 2;
            } else{
                this.strength = 6;
                this.agility = 5;
            }
        }
        assault(target){
            var damage = 1+(Math.floor(Math.random()*(this.attack+this.strength))*this.agility);

            target.health-=damage;
            $("").attr("value",target.health);
        }

    }
    class enemy{
        constructor(type){
            this.name = enemies[type];
            this.health = 0;
            this.attack = 0;
            this.givenExp = 0;
            if(type === "foot"){
                this.health = 100;
                this.attack = 20;
                this.givenExp = (Math.floor(Math.random()*(50-20+1)+20));
            }else if(type === "boss"){
                this.health = 300;
                this.attack = 30;
                this.givenExp = (Math.floor(Math.random()*(100-50+1)+20));
            }else{
                this.health = 500;
                this.attack = 40;
                this.givenExp = 0;
                chanceKing = 0;
            }
        }
        slash(target){
            this.target = target;
            this.damage = 1+(Math.floor(Math.random()*this.attack));
            target.health -= this.damage;
            $("#healthBar").attr("value",yourCharacter.health);
            checkIfDead();
        }
    }

    function gainExp(target, yourCharacter){
        yourCharacter.exp += target.givenExp;
        $("#expBar").attr("value", yourCharacter.exp);
        if(yourCharacter.exp > yourCharacter.level*100){
            yourCharacter.strength +=(Math.floor(Math.random()*3)+1);
            yourCharacter.agility += (Math.floor(Math.random()*3)+1);
            yourCharacter.health = 100+(50*yourCharacter.level);
            yourCharacter.maxHealth = 100+(50*yourCharacter.level);
            yourCharacter.exp -= yourCharacter.level*100;
            yourCharacter.level++;
            $("#expBar").attr("value", yourCharacter.exp);
            $("#expBar").attr("max", yourCharacter.level*100);
            $("#healthBar").attr("value", yourCharacter.health);
            $("#healthBar").attr("max", yourCharacter.maxHealth);
        }
        playerInformation();
    }

    function combat(target, yourCharacter, clicked){
        yourCharacter.assault(target);
        $("#progress"+clicked.slice(-1)).attr("value",target.health);
        if(target.health <0){
            if(target.name === "King White Walker"){
                youWin();
            }
            gainExp(target, yourCharacter);
            $("#"+clicked).hide();
            $("#progress"+clicked.slice(-1)).hide();
            totalEnemies--;
            if(totalEnemies === 0){
                populateEnemies();
                waveNumber++;
            }
            return;
        }
        target.slash(yourCharacter);
        checkIfDead();
        playerInformation();
    }

    function checkIfDead(){
        if(yourCharacter.health < 0){
            gameScreen.hide();
            deathScreen.show();
            $("#bannerName").hide();
            $("#hrBar").hide();
            return;
        }
    }

    function potion(input){
        if(yourCharacter.health === yourCharacter.maxHealth){
            return;
        }
        yourCharacter.health+=50;
        if(yourCharacter.health>yourCharacter.maxHealth){
            yourCharacter.health = yourCharacter.maxHealth;
        }
        var working = input.id;
        $("#healthBar").attr("value",yourCharacter.health);
        $("#"+working).css("display", "none");
        playerInformation();
    };

    function startGame(){
        gameStarted = true;
        populateEnemies();
        waveNumber++;
        $("#bannerText").text("Kill the King Walker to claim Victory!");
    }

    function populateEnemies(){
        totalEnemies = 6;
        currentEnemies = [];
        for (var i = 0; i < 6; i++) {
            var selectImage;
            var randy = Math.floor(Math.random()*100);
            var foobar;
            if(randy<chanceKing*waveNumber){
                foobar = "king";
                selectImage = "assets/images/kingWalker.png";
                chanceKing = 0;
            }else if(randy<chanceWalker*waveNumber){
                foobar = "boss";
                selectImage = "assets/images/whiteWalker.jpg";
            }else{
                foobar = "foot";
                if(randy<50){
                    selectImage = "assets/images/zombie1.jpg";
                }else{
                    selectImage = "assets/images/zombie2.jpg";
                }
            }
            $("#enemy"+i).attr("src",selectImage);
            $("#enemy"+i).show();
            currentEnemies.push(createEnemy(foobar));
            $("#progress"+i).attr("max",currentEnemies[i].health);
            $("#progress"+i).attr("value",currentEnemies[i].health);
            $("#progress"+i).show();
        } 
    }

    function createEnemy(number){
        return new enemy(number);
    }

    $(".charSelect").click(function(){
        yourCharacter = new startingCharacter(this.id, this.src);
        charSelectScreen.hide();
        gameScreen.show();
        playerInformation();
        playerImg.attr("src", ""+yourCharacter.image);
        if(!gameStarted){
            startGame();
        }
    })
    
    $(".target").on("click", function(){
        var clicked = this.id;
        var passed = currentEnemies[parseInt(clicked.slice(-1))];
        combat(passed, yourCharacter, clicked);
    })

    $(".healthPotion").on("click", function(){
        var clickedElement = this;
        potion(clickedElement);
    })

    function playerInformation(){
        $("#playerName").text(yourCharacter.name);
        $("#playerHealth").text(yourCharacter.health);
        $("#playerMaxHealth").text(yourCharacter.maxHealth);
        $("#currentExp").text(yourCharacter.exp);
        $("#levelExperience").text(100*yourCharacter.level);
    }

    function firstLetter(wordHere){
        return (wordHere.charAt(0).toLowerCase());
    }

    function youWin(){
        gameScreen.hide();
        winScreen.show();
        $("#bannerName").hide();
        $("#hrBar").hide();
    };

    $(".clickRestart").on("click", function(){
        charSelectScreen.show();
        deathScreen.hide();
        winScreen.hide();
        $("#bannerName").show();
        $("#hrBar").show();
        gameStarted=false;
        $(".healthPotion").show();
        $("#expBar").attr("value",0);
        $("#expBar").attr("max", 100);
        $("#healthBar").attr("value", 100);
        $("#healthBar").attr("max", 100);
        waveNumber = 1;
        chanceKing = 2;
        chanceWalker = 6;
        totalEnemies = 0;
        currentEnemies = [];
    })

})