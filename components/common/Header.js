import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import BurgerNavMenu from './BurgerNavMenu';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Header = (props) => {

  return (
    <View style={{ height: 180, width: '100%', backgroundColor: 'transparent' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 60, paddingLeft: 36 }}>
        <BurgerNavMenu toggleSlideMenu={ props.toggleSlideMenu } />
        <Image source={ require('../../assets/dividia_logo.jpg')} style={{ marginTop: 20, transform: [{ scaleX: deviceWidth > 500 ? .9 : .65 }, { scaleY: deviceWidth > 500 ? .9 : .65 }] }} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>Dividia Control Center</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Monarch</Text>
          {/* this needs to actually be the correct size - transforming the inage only makes it appear smaller, footprint is the same as original image */}
          {/* <Image source={ require('../../assets/monarch.png') } style={{ backgroundColor: 'green', transform: [{ scaleX: .13 }, { scaleY: .13 }] }} /> */}
        </View>
      </View>
    </View>
  )
};

export default Header;