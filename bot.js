const uuid = require('uuid');

const PROJECT_ID = 'civa-boivdp';

const resourceMap = {
  0: 'Out of stock',
  1: 'Limited',
  2: 'Plenty' 
}

// supermarket data
// 0 - out o
const DATA = [
  {
    name: 'maxvordstadt',
    stores: [
      {
        name: 'Edeka Express',
        address: 'Schellingstraße 52, 80799 München',
        latitude: 48.1511634,
        longitude: 11.5723138,
        tissue: false,
        bread: true,
        pasta: false,
        sanitizer: false,
      },
      {
        name: 'Netto',
        address: 'Schellingstraße 38, 80799 München',
        latitude: 48.1518393,
        longitude: 11.5742421,
        tissue: true,
        bread: false,
        pasta: false,
        sanitizer: true,
      }, 
      {
        name: 'Rewe',
        address: 'Georgenstraße 74-78, 80799 München',
        latitude: 48.1569668,
        longitude: 11.5707424,
        tissue: true,
        bread: false,
        pasta: true,
        sanitizer: false,
      }
    ]
  },
  {
    name: 'schwabing west',
    stores: [
      {
        name: 'Netto City Filiale',
        address: 'Hohenzollernpl. 7, 80796 München',
        latitude: 48.1621182,
        longitude: 11.5676796,
        tissue: true,
        bread: false,
        pasta: true,
        sanitizer: false,
      },
      {
        name: 'EDEKA Schlieker',
        address: 'Hohenzollernpl. 7, 80796 München',
        latitude: 48.1615984,
        longitude: 11.5735646,
        tissue: false,
        bread: true,
        pasta: false,
        sanitizer: true,
      },
    ]
  }
];

const fulfillItemRequest = async (item, location) => {
  try {
    const place = DATA.filter(d => {
      const name = d.name.toLowerCase();
      return name.includes(location);
    });

    if (place.length > 0) {
      const availableStores = [];

      for (const store of place[0].stores) {
        item = item.toLowerCase();
        if (store[item]) {
          availableStores.push(store);
        }
      }

      // build string to return all stores
      let returnString = ' Here are list of stores with available item:\n';
      
      for (const s of availableStores) {
        returnString += `${s.name} - ${s.address}\n`;
      }

      return returnString;
    }
    
    return '';
  } catch(e) {
    return '';
  }

}

const botReply = async (client, query, sessionId) => {
  try {
    if (!sessionId) sessionId = uuid.v4();

    const sessionPath = client.sessionPath(PROJECT_ID, sessionId);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: query,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };

    // Send request and log result
    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult;
    const action = result.action;

    console.log(`Action: ${action}`);
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);

    let finalResponse = result.fulfillmentText;
    
    // handle supermarket stuff here
    if (action === 'civa.BUY_ITEM' && result.allRequiredParamsPresent) {
      const { item, location } = result.parameters.fields
      const additional = await fulfillItemRequest(item.stringValue, location.stringValue);
      finalResponse += additional;
    }

    return {
      response: finalResponse,
      sessionId: sessionId,
    };
  } catch(e) {
    console.log(e);
    return { response: 'ERROR' }
  }
}

module.exports = {
  botReply: botReply
};
