'use strict';

import React from 'react';
import {Linking} from 'react-native'
import {AppRegistry, asset, Pano, Text, Image, View, Sound} from 'react-vr';
const VrButton = require('VrButton');

import CylindricalPanel from 'CylindricalPanel';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }
  render() {
    return (
      <VrButton
        onClick={() => {
          this.setState({open: !this.state.open});
	  let url = 'http://ubuntu1804.twdapp.org:8081/vr/';
	  Linking.openURL(url, "_blank");
	  //window.open(url, "_blank");
        }}
      >
        <Image
          style={{
            borderRadius: 20,
            height: this.state.open ? 120 : 60,
            margin: 10,
            width: this.state.open ? 200 : 100}}
          source={{
            uri: './images/index.jpg',
          }}
        />
      </VrButton>
    );
  }
}

class CylindricalPanelDemo extends React.Component {
  render() {
    return (
      <View>
        <Pano source={asset('chess-world.jpg')} />
	<Sound source={asset('yese.mp3')} loop={true} volume={1}
	/>
    
        <CylindricalPanel layer={{width: 2000, height: 720}} style={{position: 'absolute'}}>
          <View
            style={{
              opacity: 1,
              width: 2000,
              height: 720,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                margin: 10,
                fontSize: 70,
                fontWeight: '300',
                borderRadius: 20,
                backgroundColor: 'grey',
              }}
            >
              VR Beauty 
            </Text>

            <Image
              style={{
                borderRadius: 2,
                backgroundColor: 'red',
                borderWidth: 2,
                width: 600,
                height: 315,
              }}
              source={{
			      
            	uri: './images/index.jpg',
              }}
            />
            <Button />
          </View>
        </CylindricalPanel>
      </View>
    );
  }
}

AppRegistry.registerComponent('CylindricalPanelDemo', () => CylindricalPanelDemo);
