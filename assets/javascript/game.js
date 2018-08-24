$(document).ready(function(){
    var gameStarted = false;
    var charSelectScreen = $("#charSelectScreen");
    var gameScreen = $("#gameplayArea");
    var yourCharacter;
    var enemies = {
        "foot":"Frozen Zombie",
        "boss":"White Walker",
        "king":"King White Walker"
    }
    var waveNumber = 1;
    class startingCharacter{
        constructor(name, source){
            this.image = source;
            this.level = 1;
            this.exp = 0;
            this.name = name;
            this.health = 100;
            this.attack = 20;
            this.strength =((name)=>{
                var baseStrength = 1;
                if(firstLetter(name)==="j"){
                    baseStrength = 10;
                } else{
                    baseStrength = 2;
                }
                return baseStrength;
            })
            this.agility = ((name)=>{
                var baseAgility = 1;
                if(firstLetter(name) ==="j"){
                    baseAgility = 2;
                } else{
                    baseAgility = 10;
                }
                return baseAgility;
            })
        }
        attack(target){
            this.target = target;
            this.damage = 1+(Math.floor(Math.random()*(this.attack+this.strength))*this.agility);
            target.health-=this.damage;
        }

    }
    class enemies{
        constructor(type){
            this.name = enemies.type;
            this.health = ((type)=>{
                if(type === "foot"){
                    return 100;
                }else if(type === "boss"){
                    return 300;
                }else{
                    return 500;
                }
            })
            this.attack = ((type)=>{
                if(type === "foot"){
                    return 20;
                }else if(type === "boss"){
                    return 30;
                }else{
                    return 40;
                }
            })
            this.givenExp = ((type)=>{
                if(type === "foot"){
                    return (Math.floor(Math.random()*(50-20+1)+20));
                }else if(type === "boss"){
                    return (Math.floor(Math.random()*(100-50+1)+20));;
                }else{
                    return 500;
                }
            })
        }
        slash(target){
            this.target = target;
            this.damage = 1+(Math.floor(Math.random()*this.attack));
            target.health -= this.damage
        }
    }

    function gainExp(target, yourCharacter){
        yourCharacter.exp += target.givenExp;
        if(yourCharacter.exp > yourCharacter.level*100){
            yourCharacter.strength +=(Math.floor(rand.random()*3)+1);
            yourCharacter.agility += (Math.floor(rand.random()*3)+1);
            yourCharacter.health = 100+(50*yourCharacter.level);
            yourCharacter.level++;
            yourCharacter.exp -= yourCharacter.level*100;
        }
    }

    function combat(target, yourCharacter){
        yourCharacter.attack(target);
        target.slash(yourCharacter);
        if(yourCharacter.health < 0){
            gameScreen.hide();
            deathScreen.show();
            return;
        }
        if(target.health <0){
            gainExp(target, yourCharacter);
            target.hide();
        }
    }

    function potion(){
        yourCharacter.health+=50;
    };

    function startGame(){
        $()
        for (var i = 0; i < waveNumber; i++) {
           createWave(i);
           waveNumber++;
        }

    }

    function createWave(iteration){
        if(i>3){};
    }

    $(".charSelect").on("click", function(){
        yourCharacter = new startingCharacter(this.id, this.src);
        console.log(yourCharacter);
        charSelectScreen.hide();
        gameScreen.show();
        startGame();
    })
    
    $(".target").on("click",function(){
        combat(this.id, yourCharacter);
    })

    $("#potion").on("click", function(){
        potion(this.id);
        this.hide();
    })

    function firstLetter(wordHere){
        return (wordHere.charAt(0).toLowerCase());
    }

})