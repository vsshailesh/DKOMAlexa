'use strict';

var Alexa = require('alexa-sdk');
var Client = require('node-rest-client').Client;
var http = require('http');
var APP_ID = 'amzn1.ask.skill.9143d8e9-4e5f-4574-bd51-a0d893302502';  // TODO replace with your app ID (OPTIONAL).

var languageStrings = {    
    "en-US": {
        "translation": {
            "SKILL_NAME": "Hana Skill",
            "AMOUNT_IS_PROMPT": "The amount is: ",
            "HELP_MESSAGE": "You can say get revenue of American Airlines, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
    
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('WelcomeFunc');
    },
    'GetSAPHANAIntent': function () {
	   this.emit('GetFact');
    },



    'GetFact': function () {
		  
	//	var options_auth={user:"SYSTEM",password:"password"}
        var client = new Client()
        var Amount;
        var curr;
	var airline = this.event.request.intent.slots.airline.value;
	var th = this;
	var url = 'https://cdhcpwe996cf12.sap.hana.ondemand.com/fitbit/test_alex.xsjs?airline=' + airline;
	client.get(url, function(data, response){

		     Amount = data.amount;
		     curr = data.curr;
		     if(Amount == null)
			{ var speechOutput = 'Sorry, could not find the airline, ' + airline + '. Try again, say, get revenue of, followed by an airline name' ; 
			  th.emit(':ask', speechOutput, speechOutput);

			}
		     else
		       { var speechOutput = th.t("AMOUNT_IS_PROMPT") + curr + ' '+ Amount + ' million';
		         th.emit(':tellWithCard', speechOutput, th.t("SKILL_NAME"), Amount);
		       }
            
           
           })
		

    },

	


    'WelcomeFunc': function () {
        
        var speechOutput = 'Welcome to S A P Hana created by, XXNameXX. Say, get revenue of, followed by an airline name'
        this.emit(':ask', speechOutput, 'Please say an airline name')
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};
