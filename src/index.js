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
//             // this.attributes['endedSessionCount'] = 0;
//             // this.attributes['gamesPlayed'] = 0;
//         }
//         this.handler.state = states.STARTMODE;
//         this.emit(':ask', welcomeOutput + ' Do you want to calculate your date?',
//             'Say yes to start the game or no to quit.');
//           }
// };
var handlers = {
  'LaunchRequest': function() {
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


      speechOutput += "You were born on " + dateOfBirth;
      speechOutput +=", you weigh " + weight + " pounds";
      speechOutput +=", you are about " + height + " inches tall";
      speechOutput +=", you exercise for about " + exercise + " hours per week";
      speechOutput +=", on average you drink about " + alcohol + "alcoholic beverages a week";

                        // stress condition
      if (stress == '3' || '2' || '1') {
        speechOutput += ', you deal with stress pretty well';
      } else if (stress == '6' || '7' || '8' || '9' || '10') {
        speechOutput += ", you don't do that well with stress";
      } else {
        speechOutput += ", you handle stress very well";
      };
                        // car accident condition
      if (drivingAccident == "none" || "I've never been in an accident" || "I've never been in a car accidnt" || 0) {
        speechOutput += ", you haven't been in any car accidents in the past three years";
      } else {
        speechOutput += ", you've been in " + drivingAccident + " car accidents in the past three years";
      };
                        // DUI condition
      if (drivingDUI == "none" || "I never drive under the influence" || 0) {
        speechOutput += ", you haven't had any DUI's";
      } else {
        speechOutput += ", you've had " + drivingDUI + " DUI's";
      };
                        //smoking condition
      if (smoke == 'none' || "I don't smoke" || 0) {
        speechOutput += ", and you don't smoke";
      } else {
        speechOutput += ", and you smoke " + smoke + " packs a day";
      };
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
