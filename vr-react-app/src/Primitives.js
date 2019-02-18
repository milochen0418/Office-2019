import React from 'react';
import { View, Box, Cylinder, Sphere, StyleSheet } from 'react-vr';

export default class App extends React.Component {
  render() {
    return (
      <View>
      <Cylinder
        radiusTop={0.5}
        radiusBottom={0.5}
        dimHeight={2}
        segments={12}
        style={{
          transform: [{translate: [-0.5, 2, -5]}]
        }}
      />
      </View>
    );
  }
};
