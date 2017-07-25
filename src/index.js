'use strict';
var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = 'amzn1.ask.skill.fa9070f2-bc03-4778-9d5d-deb9543c773b';
  alexa.dynamoDBTableName = 'DaysLeft';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

var speechOutput;
var welcomeOutput = "Hello, welcome to your very own death calculator!" +
" Would you like to know when you will die?";
var reprompt = "Say yes to continue or no to stop.";
var DaysLeftIntro = [
  "Cool. ",
  "Great. ",
  "Nice. ",
  "That's nice. ",
  "Excellent. ",
  "Thank you!. ",
  "Splendid! ",
  "Wow...Really? Well, okay then. "
];

// var states = {
//     GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
//     STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
// };

// var newSessionHandlers = {
//     'NewSession': function() {
//         if(Object.keys(this.attributes).length === 0) {
//             this.attributes['endedSessionCount'] = 0;
//             this.attributes['gamesPlayed'] = 0;
//         }
//       }
// };
var handlers = {
  'LaunchRequest': function() {
    if(Object.keys(this.attributes).length === 0) {
      this.attributes['endedSessionCount'] = 0;
      this.attributes['gamesPlayed'] = 0;
    }
    this.emit(':ask', welcomeOutput, reprompt);
  },
  'DaysLeftIntent': function() {
    var filledSlots = delegateSlotCollection.call(this);
    console.log(JSON.stringify(filledSlots));
    var speechOutput = randomPhrase(DaysLeftIntro);

      var dateOfBirth=filledSlots.slots.dateOfBirth.value;
      this.attributes['dateOfBirth'] = dateOfBirth;
      var weight=filledSlots.slots.weight.value;
      this.attributes['weight'] = weight;
      var exercise=filledSlots.slots.exercise.value;
      this.attributes['exercise'] = exercise;
      var smoke=filledSlots.slots.smoke.value;
      this.attributes['smoke'] = smoke;
      var drivingAccident=filledSlots.slots.drivingAccident.value;
      this.attributes['drivingAccident'] = drivingAccident;
      var drivingDUI=filledSlots.slots.drivingDUI.value;
      this.attributes['drivingDUI'] = drivingDUI;
      var alcohol=filledSlots.slots.alcohol.value;
      this.attributes['alcohol'] = alcohol;
      var stress=filledSlots.slots.stress.value;
      this.attributes['stress'] = stress;
      var height=filledSlots.slots.height.value;
      this.attributes['height'] = height;

      var yearsLeft = averageYearsLeft;
      var today = new Date();
      var currentDate = today.getFullYear() + '-'
      + (today.getMonth()+1) + '-' + today.getDate();
      var age = parseInt(currentDate) - parseInt(dateOfBirth);
      var averageYearsLeft = Math.round((79 - age)/365);
      var daysLeft = (averageYearsLeft*365);

      var bodyMassIndex = (parseInt(weight)*703)/(parseInt(height)*parseInt(height));
      console.log("BMI = " + bodyMassIndex);
      console.log("AVERAGE YEARS LEFT: " + averageYearsLeft);
      console.log("APPROXIMATE DAYS LEFT: " + daysLeft);
      speechOutput += "You have " + averageYearsLeft + "years left to live. And "
      speechOutput += "Well, you aren't going to like this. But you have " + daysLeft + " days left to live."

      // averageYearsLeft =(79-((C16-B3)/365))
      // EXERCISE =IF((B8="A"), 1.5, IF(B8="B",3.5,IF(B8="C",4.5, IF(B8="D","-3"))))
      /* if(parseInt(exercise) >= 2 && parseInt(exercise) <= 6) {
            yearsLeft += 3;
          } else if (parseInt(exercise) >= 7) {
            yearsLeft += 5;
          } else if (parseInt(exercise) == 1){
            yearsLeft += 1;
          } else {
            yearsLeft += 0;
          }
      */

      // STRESS =IF(B9="A","1",IF(B9="B","0",IF(B9="C","-1")))
      /* if(parseInt(stress) <= 4) {
            yearsLeft += 1;
          } else if (parseInt(stress) >= 6 && parseInt(stress) <= 10) {
            yearsLeft -= 1;
          } else if (parseInt(stress) == 5) {
            yearsLeft += 0;
          }
      */
      // ALCOHOL =IF(B10="A","1",IF(B10="B","0",IF(B10="C","-3",IF(B10="D","-4"))))
      /*
      */
      // SMOKING =IF(B11="A","2",IF(B11="B","1",IF(B11="C","-1",IF(B11="D","-4",IF(B11="E","-8")))))
      // DRIVEACCI =IF(B12="A","1",IF(B12="B","0",IF(B12="C","-4",IF(B12="D","-6",IF(B12="E","-12")))))
      // DUI
      // BMI =IF(C14<12,"-15",IF(C14<=24,"0",IF(C14<39,"-3",IF(C14<=42,"-10",IF(C14>42,"-30")))))
      // TOTALYEARSLEFT =(C13+C12+C11+C10+C8+C9+C7+C3)
      // DAYSLEFT =(C20*365)



                          // exercise condition

      if(parseInt(exercise) >= 2 && parseInt(exercise) <= 6) {
        yearsLeft += 3;
      } else if (parseInt(exercise) >= 7) {
        yearsLeft += 5;
      } else if (parseInt(exercise) == 1){
        yearsLeft += 1;
      } else {
        yearsLeft += 0;
      };
                          // stress condition
      if(parseInt(stress) <= 4) {
        yearsLeft += 1;
      } else if (parseInt(stress) >= 6 && parseInt(stress) <= 10) {
        yearsLeft -= 1;
      } else if (parseInt(stress) == 5) {
        yearsLeft += 0;
      };
      // if (stress == '3' || '2' || '1') {
      //   speechOutput += ', you deal with stress pretty well';
      // } else if (stress == '6' || '7' || '8' || '9' || '10') {
      //   speechOutput += ", you don't do that well with stress";
      // } else {
      //   speechOutput += ", you handle stress very well";
      // };
                        // car accident condition
      // if (drivingAccident == "none" || "I've never been in an accident" || "I've never been in a car accidnt" || 0) {
      //   speechOutput += ", you haven't been in any car accidents in the past three years";
      // } else {
      //   speechOutput += ", you've been in " + drivingAccident + " car accidents in the past three years";
      // };
                        // DUI condition
      // if (drivingDUI == "none" || "I never drive under the influence" || 0) {
      //   speechOutput += ", you haven't had any DUI's";
      // } else {
      //   speechOutput += ", you've had " + drivingDUI + " DUI's";
      // };
                        //smoking condition
      // if (smoke == 'none' || "I don't smoke" || 0) {
      //   speechOutput += ", and you don't smoke";
      // } else {
      //   speechOutput += ", and you smoke " + smoke + " packs a day";
      // };
      // speechOutput += ". You're still a loser though. And judging by your voice you sound like you don't have any friends at all."
      this.emit(":tell", speechOutput);
    },
    "AMAZON.HelpIntent": function() {
      this.emit(':tell', reprompt);
    },
    "AMAZON.StopIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
    "AMAZON.CancelIntent": function() {
      this.emit(':tell', "Goodbye!");
    },
    'Unhandled': function () {
      console.log("UNHANDLED");
    },
    'SessionEndedRequest': function() {
      console.log('session ended!');
      this.emit(":tell", "Goodbye");
    }
};
  function delegateSlotCollection(){
    console.log("in delegateSlotCollection");
    console.log("current dialogState: "+this.event.request.dialogState);
      if (this.event.request.dialogState === "STARTED") {
        console.log("in Beginning");
        var updatedIntent=this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
      } else if (this.event.request.dialogState !== "COMPLETED") {
        console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
      } else {
        console.log("in completed");
        console.log("returning: "+ JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
      }
}

function randomPhrase(array) {
  var i = 0;
  i = Math.floor(Math.random() * array.length);
  return(array[i]);
}

function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}
