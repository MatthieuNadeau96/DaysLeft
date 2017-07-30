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
var welcomeOutput = "Hello, I am going to begin by asking you a few questions about yourself to calculate how many days you have left to live. "
+ "Tell me to begin when you are ready. ";
var reprompt;
var DaysLeftIntro = [
  "Okay. ",
  "Great. ",
  "Nice. ",
  "Alright. ",
  "Excellent. ",
  "Thank you! ",
  "Splendid! "
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
    if(this.attributes['daysLeft'] != undefined) {
      this.emit(":tell", "Welcome back, you have " + this.attributes['daysLeft'] + " days left to live on planet earth.");
    } else {
      this.emit(':ask', welcomeOutput);
    };
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
      var sleep=filledSlots.slots.sleep.value;
      this.attributes['sleep'] = sleep;
      var fastfood=filledSlots.slots.fastfood.value;
      this.attributes['fastfood'] = fastfood;
      var doctorvisits=filledSlots.slots.doctorvisits.value;
      this.attributes['doctorvisits'] = doctorvisits;

      var yearsLeft = 0;
      var today = new Date();
      var currentDate = today.getFullYear() + '-'
      + (today.getMonth()+1) + '-' + today.getDate();
      var age = parseInt(currentDate) - parseInt(dateOfBirth);
      var bodyMassIndex = (parseInt(weight)*703)/(parseInt(height)*parseInt(height));

      // averageYearsLeft =(79-((C16-B3)/365))
      // TOTALYEARSLEFT =(C13+C12+C11+C10+C8+C9+C7+C3)
      // DAYSLEFT =(C20*365)

///////////////////////////////////////////////////////
      //
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

      // ALCOHOL =IF(B10="A","1",IF(B10="B","0",IF(B10="C","-3",IF(B10="D","-4"))))
      // I think I need to rethink the question for alcohol intake

                          //smoking condition
      if(parseInt(smoke) == 0 || smoke == "none" || smoke == "i don't smoke") {
        yearsLeft += 2;
      } else if(parseInt(smoke) >= 2) {
        yearsLeft -= 8;
      } else {
        yearsLeft -= 4;
      };

                          //accident condition
      if(parseInt(drivingAccident) >= 4) {
        yearsLeft -= 4;
      } else if(parseInt(drivingAccident) >= 1) {
        yearsLeft += 0;
      } else {
        yearsLeft += 1;
      };
                          // DUI condition
      if(parseInt(drivingDUI) == 1) {
        yearsLeft -= 6;
      } else if (parseInt(drivingDUI) > 1) {
        yearsLeft -= 12;
      } else {
        yearsLeft += 1;
      };

                          // BMI condition
      if(bodyMassIndex <= 18.5) {
        yearsLeft -=1;
      } else if(bodyMassIndex <= 29) {
        yearsLeft += 0;
      } else if(bodyMassIndex <= 39) {
        yearsLeft -= 3;
      } else {
        yearsLeft -= 10;
      };


      if(parseInt(sleep) == 7) {
        yearsLeft += 1;
      } else if(parseInt(sleep) >= 8) {
        yearsLeft += 2;
      } else if (parseInt(sleep) >= 5){
        yearsLeft -= 1;
      } else {
        yearsLeft -= 1;
        speechOutput += " you should really get some more sleep. ";
      };

      if(parseInt(fastfood) > 3) {
        yearsLeft -= 2;
      } else if (parseInt(fastfood) <= 3 && parseInt(fastfood) > 0) {
        yearsLeft -= 1;
      } else {
        yearsLeft += 1;
      };

      if(parseInt(doctorvisits) == 1 || doctorvisits == "only when i need to") {
        yearsLeft += 1;
      } else if (parseInt(doctorvisits) >= 2) {
        yearsLeft += 2;
      } else {
        yearsLeft -= 1;
      };

      //////////////////////////////////////////////////////////
      var averageYearsLeft = (yearsLeft) + (Math.round((79 - age)));
      var daysLeft = (averageYearsLeft*365);
      this.attributes["daysLeft"] = daysLeft.toString();
      this.attributes["averageYearsLeft"] = averageYearsLeft.toString();
      console.log("BMI = " + bodyMassIndex);
      console.log("AVERAGE YEARS LEFT: " + averageYearsLeft);
      console.log("APPROXIMATE DAYS LEFT: " + daysLeft);
      speechOutput += "You have " + averageYearsLeft + "years left to live. And "
      speechOutput += "you have " + daysLeft + " days left to live."
      speechOutput += " Come back again tomorrow if you'd like to hear a tip on how you can increase your days left on earth. "



      // if (stress == '3' || '2' || '1') {
      //   speechOutput += ', you deal with stress pretty well';
      // } else if (stress == '6' || '7' || '8' || '9' || '10') {
      //   speechOutput += ", you don't do that well with stress";
      // } else {
      //   speechOutput += ", you handle stress very well";
      // };
      //                   car accident condition
      // if (drivingAccident == "none" || "I've never been in an accident" || "I've never been in a car accidnt" || 0) {
      //   speechOutput += ", you haven't been in any car accidents in the past three years";
      // } else {
      //   speechOutput += ", you've been in " + drivingAccident + " car accidents in the past three years";
      // };
      //                   DUI condition
      // if (drivingDUI == "none" || "I never drive under the influence" || 0) {
      //   speechOutput += ", you haven't had any DUI's";
      // } else {
      //   speechOutput += ", you've had " + drivingDUI + " DUI's";
      // };
      //                   smoking condition
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
