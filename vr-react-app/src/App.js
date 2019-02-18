import React from 'react';
import { asset, Pano, Text, View, Image, AmbientLight } from 'react-vr';
//import Primitives from './Primitives';
import Penholder from './Penholder';

export default class App extends React.Component {
  render() {
    return (
      <View>
        <AmbientLight intensity={ 2.5 } />
        <Pano source={asset('background.jpeg')} />

        <Image 
        crossOrigin="anonymous"
        source={{uri: 'http://dexon.pieapple.com:8765/images/index.jpg'}} 
        />        


        <Text
         style={{
           backgroundColor: '#777879',
           fontSize: 0.8,
           fontWeight: '400',
           paddingLeft: 0.2,
           paddingRight: 0.2,
           textAlign: 'center',
           textAlignVertical: 'center',
           transform: [{translate: [-6, 2, -6]}],
         }}>
         VR Beauty
       </Text>

    
    


        <Penholder />
      </View>
    );
  }
};
