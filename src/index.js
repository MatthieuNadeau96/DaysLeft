'use strict';
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');
var ua = require('universal-analytics');
var googleUA = 'UA-104151044-2'; //tracking ID

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = 'amzn1.ask.skill.fa9070f2-bc03-4778-9d5d-deb9543c773b';
  alexa.dynamoDBTableName = 'DaysLeft';
  alexa.registerHandlers(handlers);
  alexa.execute();
};
                        // query dynamodb table tips

// function readDynamoItem(params, callback) {
//
// var AWS = require('aws-sdk');
// var docClient = new AWS.DynamoDb.DocumentClient({region: 'us-east-1'});
//
// console.log('reading item from DynamoDB table');
//
// docClient.get(params, (err, data) => {
//  if(err) {
//    console.error("Unable to read item. Error JSON:", JSON.stringify(err,null,2));
//  } else {
//    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//
//    callback(data.Item.message);
//
//  }
// });
//}
AWS.config.update({
  region: "us-east-1"
  // endpoint: "http://localhost:8000"
  // accessKeyId: "",
  //secretAccessKey: ""
});

var docClient = new AWS.DynamoDB.DocumentClient();

function readItem(obj, callback) {
  var table = "Tips";
  var id = "1";
  var params = {
    TableName: table,
    Key:{
      "Id": id
    }
    // console.log("PARAMS: " + params);
  };
  docClient.get(params, function(err, data) {
    if(err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      callback(obj, data['Item']['tip']);
      // callback(data.Item.tip);  // this particular row has an attribute called message
    }
  });
  // console.log("IDK: " + docClient.get(params, function(err, data)));
}

// var params = {
//   TableName: 'Tips',
//   Key:{ "Id": 1 }
// };

var speechOutput;
var welcomeOutput = "Hello, I am going to begin by asking you a few questions about yourself to calculate how many days you have left to live. "
+ "Tell me to begin when you are ready. ";
var reprompt = "Just tell me when you're ready to begin. ";
var DaysLeftIntro = [
  "Okay. ",
  "Great. ",
  "Nice. ",
  "Alright. ",
  "Excellent. ",
  "Thank you! ",
  "Splendid! "
];

// var tip = [
//   "Walking thirty minutes a day will add about two point two years to your life. That's an extra nine hundred and three more days! ",
//   "Getting a full one hundred minutes of movement a day will give you about five point six more years on earth. That's another two thousand days! ",
//   "If you just go to bed 15 minutes earlier than you normally do, you'll add an extra three years to your life. That's about one thousand and ninety five days! ",
//   "If you eat a more healthy diet you can add up to fourteen years onto your life! That's five thousand one hundred and ten more days on planet earth. ",
//   "Smoking is extremely bad for you. I'm sure you already know that. If you quit smoking you can add from anywhere between six to twelve years to your life. That's somewhere between two thousand and four thousand days! ",
//   "Frequent sex will add about three more years to your life. That's another one thousand and ninety five days. ",
//   "Don't use too much sugar. A high sugar diet boosts blood sugar, which is bad for your heart by increasing levels of LDL cholesterol and tripling your risk for fatal cardiovascular disease. ",
//   "You should consider extra vitamin D. Vitamin D is a byproduct of sunlight and has many healthy benefits. Though, too much is just as bad as too little. You should ask your doctor if you would benefit from extra D in pill form. ",
//   "If you've been looking to kick your coffee habit, green tea is a great solution. Green tea contains powerful antioxidants known as catechins. In a large study of more than forty thousand men and woman, drinking five or more cups of green tea a day was associated with a twelve percent decrease in mortality among men and a twenty three degrease among woman. ",
//   "Eating three or more servings of whole grains each day can cut your overall death rate by about twenty percent. ",
//   "Drink more water! Staying adequately hydrated can prolong a healthy life by reducing the risk of bladder and colon cancer and keeping your kidneys in great shape. It might also be helpful in eating less and losing weight. ",
//   "People who drink three to five cups of coffee per day had a fifteen percent lower risk of mortality compared to people who didn't drink coffee. Coffee reduces your risk of stroke, diabetes and some cancers. "
// // ];

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

    // Make sure this is a locally-scoped var within each intent function.
    var intentTrackingID = ua(googleUA, {https: true});

    // report a success
    intentTrackingID.pageview("/").send()

    if(this.attributes['daysLeft'] !== undefined) {
    readItem(this, function(obj, data) {
      console.log(data);

      obj.emit(":tell", "Welcome back, you have " + obj.attributes['daysLeft'] + " days left to live." +
        " Here is a tip to help you live a longer and healthier life. " + data);
    });
    } else if (this.attributes['daysLeft'] == undefined){
      this.emit(':ask', welcomeOutput, reprompt);
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
      speechOutput += "you have " + daysLeft + " days left to live. "
      speechOutput += "Now I will tell you a tip on how to increase your life expectancy. "
      readItem(this, function(obj, data) {
        console.log(data);

        obj.emit(":tell", speechOutput += data);
      });
      //speechOutput += readItem();
      //console.log("ADITEM: " + readItem());

      // readDynamoItem(params, tip=>{
      //   var say = '';
      //
      //   say = tip;
      //
      //   say = ' Your tip is, ' + tip + ". ";
      //
      //   this.emit(':tell', say);
      //
      // });
      // speechOutput += randomPhrase(tip);



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
      //this.emit(":tell", speechOutput);
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
