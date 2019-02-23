import * as Ask from 'ask-sdk';

const LaunchRequestHandler = {
  canHandle: handlerInput => true,
  handle: handlerInput =>
    handlerInput.responseBuilder.speak('Hello world and stream!').getResponse()
}

export const alexaOld = Ask.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler
  )
  .lambda();
