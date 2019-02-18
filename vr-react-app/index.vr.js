import React from 'react';
import {
  AppRegistry,
  View,
} from 'react-vr';
import App from './src/App';

export default class office extends React.Component {
  render() {
    return (
      <View>
        <App />
      </View>
    );
  }
};

AppRegistry.registerComponent('office', () => office);
