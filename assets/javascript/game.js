$(document).ready(function(){
    var gameStarted = false;
    var charSelectScreen = $("#charSelectScreen");
    class startingCharacter{
        constructor(name){
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
                    baseStrength = 5;
                }
                return baseStrength;
            })
            this.agility = ((name)=>{
                var baseAgility = 1;
                if(firstLetter(name) ==="j"){
                    baseAgility = 5;
                } else{
                    baseAgility = 10;
                }
                return baseAgility;
            })
        }
        attack(target){
            this.target = target;
            this.damage = 1+(Math.floor(Math.random()*(this.attack+this.strength))*this.agility);
            target.baseHealth-=this.damage;
        }

    }
    $(".charSelect").on("click", function(){
        startingCharacter(this.id);
        charSelectScreen.hide();
        startGame(startingCharacter);
    })
    
    function firstLetter(wordHere){
        return (wordHere.charAt(0).toLowerCase());
    }

})