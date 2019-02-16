import * as Ask from 'ask-sdk';
// const https = require('https');
import axios from "axios";

import { audioData } from './AudioAssets';
import { audio } from './AudioController';
import { Text } from 'aws-sdk/clients/lexruntime';


// import * as db from "./database";

let lastPlayedURL = '';

// function play(url: string, offset: number) {
//   /*
//        *  Using the function to begin playing audio when:
//        *      Play Audio intent invoked.
//        *      Resuming audio when stopped/paused.
//        *      Next/Previous commands issued.
//        */

//   /*
//      https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#play
//      REPLACE_ALL: Immediately begin playback of the specified stream, and replace current and enqueued streams.             
//   */
//   const result = ResponseFactory.init();

//   // we are using url as token as they are all unique
//   result
//       .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, offset)
//       .withShouldEndSession(true);

//   // add support for radio meta data.  
//   // this is not supported by the SDK yet, so it should be handled manually
//   const response = this.addScreenBackground(cardData, result.getResponse());
//   return response;
// }

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle: handlerInput => 
    handlerInput.responseBuilder
      .speak(`Welcome to Family Radio, you can say, 
              "Play Through The Bible in a Year for Today",
              or, "Play Family Radio Stream",
              or, "Read Genesis 1"`)
      .getResponse()
}

const LaunchRequestHandlerAlternative = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LaunchRequestHandler';
  },
  handle: handlerInput => {
    console.log("This is a test log");
    return handlerInput.responseBuilder.speak('Welcome to testing serverless').getResponse();
  }
}

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .reprompt("test reprompt")
      .getResponse();
  }
};

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'Repeat';
  },
  handle(handlerInput) {
    const speechText = "Repeat Number";

    console.log("Repeat Variable:  ", handlerInput.requestEnvelope.request.intent);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Repeat', speechText)
      .reprompt("test reprompt")
      .getResponse();
  }
};

const RepeatNameIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RepeatNameIntent';
  },
  handle(handlerInput) {
    const speechText = handlerInput.requestEnvelope.request.intent.slots.repeatName.value ? handlerInput.requestEnvelope.request.intent.slots.repeatName.value : "RepeatNameIntent";

    console.log("Repeat Variable:  ", handlerInput.requestEnvelope.request.intent.slots.repeatName.value);
    console.log("Repeat Variable:  ", handlerInput.requestEnvelope.context);
    // console.log("Repeat Variable:  ", handlerInput);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Repeat', speechText)
      .reprompt("test reprompt")
      .getResponse();
  }
};

const GetLocationIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetLocationIntent';
  },
  async handle(handlerInput) {
    const speechText = handlerInput.requestEnvelope.request.intent.name ? handlerInput.requestEnvelope.request.intent.name : "GetLocationIntent";
    // const speechText = "GetLocationIntent";

    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;

    // https://api.amazonalexa.com/v1/devices/{deviceId}/settings/address/countryAndPostalCode
    // path: '/v2/accounts/~current/settings/Profile.email', // System.timeZone
    const options = {        
      hostname: 'api.amazonalexa.com',
      port: 443,
      path: `/v2/devices/${deviceId}/settings/System.timeZone`, // System.timeZone
      method: 'GET',
      headers:{
        Authorization: `Bearer ${accessToken}`
      }
    };

    // console.log(`Bearer ${accessToken}`);

    // const options = {        
    //   hostname: 'api.halfwaymeet.tk',
    //   port: 443,
    //   path: '/',
    //   method: 'GET',
    // };

    // EXAMPLE
    // const options = {
    //   hostname: 'api.amazonalexa.com',
    //   port: 443,
    //   path: '/v2/accounts/~current/settings/Profile.email',
    //   method: 'GET'
    // }
    let response = 'default response';

    const req = await https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on('data', (d) => {
        response = d;
        console.log(d, '\n');
        process.stdout.write(d);
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.end();


    // // EXAMPLE
    // const options = {
    //   hostname: 'flaviocopes.com',
    //   port: 443,
    //   path: '/todos',
    //   method: 'GET'
    // }

    // const req = https.request(options, (res) => {
    //   console.log(`statusCode: ${res.statusCode}`)

    //   res.on('data', (d) => {
    //     process.stdout.write(d)
    //   })
    // })

    // req.on('error', (error) => {
    //   console.error(error)
    // })

    // req.end()

    
    // const data = https.get('https://api.amazonalexa.com/v2/accounts/~current/settings/Profile.email', );
    // const data = https.get(options);
    // const data = https.get('https://api.halfwaymeet.tk/');
    // console.log('data:  ', data);

    // console.log("Repeat Variable:  ", handlerInput.requestEnvelope.request.intent.slots.repeatName.value);
    // console.log("Repeat Variable:  ", handlerInput.requestEnvelope.context);
    // console.log("Repeat Variable:  ", handlerInput);

    // From example on alexa api
    // const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;
    // const { deviceId } = requestEnvelope.context.System.device;
    // const deviceAddressServiceClient = serviceClientFactory.getDeviceAddressServiceClient();
    // const address = deviceAddressServiceClient.getFullAddress(deviceId);
    // console.log(address);

    const messages = {
      WELCOME: 'Welcome to the Sample Device Address API Skill!  You can ask for the device address by saying what is my address.  What do you want to ask?',
      WHAT_DO_YOU_WANT: 'What do you want to ask?',
      NOTIFY_MISSING_PERMISSIONS: 'Please enable Location permissions in the Amazon Alexa app.',
      NO_ADDRESS: 'It looks like you don\'t have an address set. You can set your address from the companion app.',
      ADDRESS_AVAILABLE: 'Here is your full address: ',
      ERROR: 'Uh Oh. Looks like something went wrong.',
      LOCATION_FAILURE: 'There was an error with the Device Address API. Please try again.',
      GOODBYE: 'Bye! Thanks for using the Sample Device Address API Skill!',
      UNHANDLED: 'This skill doesn\'t support that. Please ask something else.',
      HELP: 'You can use this skill by asking something like: whats my address?',
      STOP: 'Bye! Thanks for using the Sample Device Address API Skill!',
    };

    const PERMISSIONS = ['read::alexa:device:all:address'];

    const { requestEnvelope, serviceClientFactory, responseBuilder } = handlerInput;

    const consentToken = requestEnvelope.context.System.user.permissions
      && requestEnvelope.context.System.user.permissions.consentToken;
    if (!consentToken) {
      return responseBuilder
        .speak(messages.NOTIFY_MISSING_PERMISSIONS)
        .withAskForPermissionsConsentCard(PERMISSIONS)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(response)
      // .withAskForPermissionsConsentCard(PERMISSIONS)
      // .withSimpleCard()
      // .withSimpleCard('Get Location', speechText)
      // .reprompt("test reprompt")
      .getResponse();
  }
};

const StreamIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StreamIntent';
  },
  async handle(handlerInput) {
    const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId;
    const accessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    let timeZone: string;  // 'America/Los_Angeles';
    let url: string = 'https://18153.live.streamtheworld.com/FAMILYRADIO_EASTAAC.aac';
    // let url: string = 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac';
    lastPlayedURL = url;
    let speechText: string = 'Playing East Stream';
    let data;

    const options = {
      method: 'get',
      url: `https://api.amazonalexa.com/v2/devices/${deviceId}/settings/System.timeZone`, // System.timeZone
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };


    try {
      data = await axios(options);
      // console.log('big response', data);
      console.log('Time Zone: ', data.data);
      timeZone = data.data;
    } catch (error) {
      console.error(error);
    }

    const zones = [
      'America/Adak',
      'America/Anchorage',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat',
      'America/Los_Angeles',
      'Canada/Saskatchewan',
      'America/Belize',
      'America/Regina',
      'America/Swift_Current',
      'America/Costa_Rica',
      'Pacific/Galapagos',
      'America/Guatemala',
      'America/Tegucigalpa',
      'America/Managua',
      'America/El_Salvador',
      'America/Shiprock',
      'Canada/Mountain',
      'Mexico/BajaSur',
      'US/Mountain',
      'America/Cambridge_Bay',
      'America/Edmonton',
      'America/Inuvik',
      'America/Yellowknife',
      'America/Chihuahua',
      'America/Mazatlan',
      'America/Ojinaga',
      'America/Boise',
      'America/Denver',
      'US/Arizona',
      'America/Creston',
      'America/Dawson_Creek',
      'America/Fort_Nelson',
      'America/Hermosillo',
      'America/Phoenix',
      'America/Ensenada',
      'America/Santa_Isabel',
      'Canada/Pacific',
      'Canada/Yukon',
      'Mexico/BajaNorte',
      'US/Pacific',
      'US/Pacific-New',
      'America/Dawson',
      'America/Vancouver',
      'America/Whitehorse',
      'America/Tijuana',
      'America/Los_Angeles',
      'Pacific/Pitcairn',
      'US/Alaska',
      'America/Anchorage',
      'America/Juneau',
      'America/Metlakatla',
      'America/Nome',
      'America/Sitka',
      'America/Yakutat',
      'Pacific/Gambier',
      'America/Atka',
      'US/Aleutian',
      'America/Adak',
      'Pacific/Marquesas',
      'Pacific/Johnston',
      'US/Hawaii',
      'Pacific/Rarotonga',
      'Pacific/Tahiti',
      'Pacific/Honolulu',
      'Pacific/Samoa',
      'US/Samoa',
      'Pacific/Pago_Pago',
      'Pacific/Niue',
      'Pacific/Midway'
    ]

    try {
      for (let z in zones) {
        if (timeZone ===  z) {
          url = 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac';
          speechText = 'Playing West Stream';
        }
        console.log(speechText);
      }
    } catch (error) {
      console.error(error);
    }


    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Time Zone', timeZone, )
      .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, 0)
      .getResponse();
  }
};

const PlaySongIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlaySongIntent';
  },
  handle(handlerInput) {
    const offset = 20 * 1000;
    const speechText = 'Stream';
    const url = 'https://feeds.soundcloud.com/stream/309340878-user-652822799-episode-010-building-an-alexa-skill-with-flask-ask-with-john-wheeler.mp3';
    lastPlayedURL = url;

    return handlerInput.responseBuilder
      // .speak(speechText)
      .addAudioPlayerPlayDirective('REPLACE_ALL',url, url, offset)
      .getResponse();
  }
};

const StopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    // return handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    const speechText = 'Stop';

    return handlerInput.responseBuilder
      // .speak(speechText)
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

const PauseIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
    // return handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
  },
  handle(handlerInput) {
    const speechText = 'Pause';

    return handlerInput.responseBuilder
      // .speak(speechText)
      .addAudioPlayerStopDirective()
      .getResponse();
  }
};

const ResumeIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent';
  },
  handle(handlerInput) {
    const speechText = 'Resume';
    // const userId = handlerInput.requestEnvelope.context ? handlerInput.requestEnvelope.context.System.user.userId : handlerInput.requestEnvelope.session.user.userId;  // use this?
    // const userId =  handlerInput.requestEnvelope.session.user.userId;
    const url = lastPlayedURL !== '' ? lastPlayedURL : 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac';

    // console.log('handlerInput', handlerInput);
    // console.log('userId', userId);

    return handlerInput.responseBuilder
      // .speak(speechText)
      .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, 20000)
      .getResponse();
  }
};

const GetUserIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetUserIntent';
  },
  handle(handlerInput) {
    const speechText = 'Get user';
    // const userId = handlerInput.context ? handlerInput.context.System.user.userId : handlerInput.session.user.userId;  // use this?
    // const userId =  handlerInput.session.user.userId;
    const userId =  handlerInput.requestEnvelope.session.user.userId;
    
    // console.log('handlerInput', handlerInput);
    console.log('userId', userId);
    console.log('userSession', handlerInput.requestEnvelope.session);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('User Id', `${speechText}  >   ${userId}`)
      .getResponse();
  }
};

const PineAppleIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PineAppleIntent';
  },
  handle(handlerInput) {
    const speechText = 'The pineapple';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('The pineapple', speechText)
      .reprompt("more pineapples?")
      .getResponse();
  }
};

const PlayStreamIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlayStreamIntent';
  },
  handle(handlerInput) {
    const speechText = 'Playing Stream';
    // const request = handlerInput.requestEnvelope.request;
    // const url = 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac';

    // play the radio directly
    // return Promise.resolve(audio.play(audioData(request).url, 0, i18n.S(request, 'WELCOME_MSG', audioData(request).card.title), audioData(request).card));
    // return audio.play('https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac', 0);
            

    // return handlerInput.responseBuilder
    //   .withSimpleCard('Commands: hello, play stream', speechText)
    //   // .addAudioPlayerPlayDirective('REPLACE_ALL','https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac', 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac', 0)
    //   .speak(speechText);
    //   // .withShouldEndSession(true);

    return handlerInput.responseBuilder
      .speak(speechText)
      .addAudioPlayerPlayDirective('REPLACE_ALL','https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac', 'https://13983.live.streamtheworld.com/FAMILYRADIO_WESTAAC.aac', 0)
      .withSimpleCard('Stream', speechText)
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello, stream, play stream, or play song';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Help', speechText)
      .getResponse();
  }
};

const myErrorHandler = {
  canHandle(handlerInput, error) {
    return error.name.startsWith('AskSdk');
  },
  handle(handlerInput, error) {
    return handlerInput.responseBuilder
      .speak('An error was encountered while handling your request. Try again later')
      .getResponse();
  }
}

// const DefaultHandler = {
//   canHandle: handlerInput => true,
//   handle: handlerInput =>
//     handlerInput.responseBuilder.speak('Default Response').getResponse()
// }

export const alexa = Ask.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    RepeatHandler,
    RepeatNameIntentHandler,
    GetLocationIntentHandler,
    StreamIntentHandler,
    PlayStreamIntentHandler,
    PlaySongIntentHandler,
    StopIntentHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    PineAppleIntentHandler,
    GetUserIntentHandler,
    HelpIntentHandler
  )
  .addErrorHandlers(myErrorHandler)
  .lambda();
