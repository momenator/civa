import React from 'react'
import { ChatFeed, Message } from 'react-chat-ui'

const axios = require('axios');
const uuid = require('uuid');
const BOT_ID = 1;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      messages: [
        new Message({
          id: BOT_ID,
          message: "Hey how can I help?",
        }),
      ],
      sessionId: uuid.v4(),
    }
  }

  sendQuery = (query) => {
    axios.post(`/query?sessionId=${this.state.sessionId}`, {
      query,
    }).then((response) => {
      console.log(response);
      const reply = response.data.response;
      this.setState((state) => ({
        messages: [ 
          ...state.messages,
          new Message({
            id: BOT_ID,
            message: reply,
          }),
        ]
      }))
    });
  } 

  render() {
    return <div style={{
      height: '100%',
      width: '100%'
    }}>
      <div style={{
        bottom: 0,
        width: '50%',
        display: 'block',
        margin: '0 auto'
      }}>
      <ChatFeed
        messages={this.state.messages} // Boolean: list of message objects
        isTyping={false} // Boolean: is the recipient typing
        hasInputField={false} // Boolean: use our input, or use your own
        showSenderName // show the name of the user who sent the message
        bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        // JSON: Custom bubble styles
        bubbleStyles={
          {
            text: {
              fontSize: 20
            },
            chatbubble: {
              borderRadius: 20,
              padding: 15
            }
          }
        }
      />
      <input 
        style={{
          width: '96%',
          fontSize: 20,
          padding: 10,
          display: 'flex',
          flex: '1'
        }} 
        type="text"
        onKeyDown={(ele) => {
          if(ele.keyCode === 13) {
            const query = ele.target.value;
            this.setState((state) => ({
              messages: [
                ...state.messages,
                new Message({
                  id: 0,
                  message: query,
                }),
              ]
            }));
            this.sendQuery(query);
          }
        }}/>
      </div>
    </div>;
  }
}

