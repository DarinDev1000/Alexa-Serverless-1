const Alexa = require('ask-sdk');

const NewSessionHandler = {
  canHandle (handlerInput) {
    return handlerInput.requestEnvelope.session.new
  },
  handle (handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({
      someData: 'everything looks great'
    })

    // say something but don't end the session
    return handlerInput.responseBuilder
      .speak('Something')
      .withShouldEndSession(false)
      .getResponse()
  }
}

const ExistingSessionHandler = {
  canHandle (handlerInput) {
    return !handlerInput.requestEnvelope.session.new;
  },
  handle (handlerInput) {
    const { someData } = handlerInput.attributesManager.getSessionAttributes()
    
    // someData is there :D yay
    console.log(someData)
  }
}

exports.alexa = Alexa.SkillBuilders.custom()
  .addRequestHandlers(ExistingSessionHandler, NewSessionHandler)
  .lambda();