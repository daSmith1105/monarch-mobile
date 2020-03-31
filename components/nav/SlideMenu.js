import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconF5 from 'react-native-vector-icons/FontAwesome5';

const SlideMenu = props => {
  return( 
    <View style={{ backgroundColor: 'rgba(46, 49, 49, 1)', height: '100%', justifyContent: 'center', flexDirection: 'row' }}>
  
      <View style={{ width: '80%', flexDirection: 'column', paddingTop: 80, alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>Dividia Control Center</Text>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>Menu</Text>
      <TouchableOpacity onPress={ () => props.logoutUser() } 
                        style={{  justifyContent: 'center', 
                                  alignItems: 'center', 
                                  width: '80%', 
                                  height: 60, 
                                  margin: 20, 
                                  backgroundColor: 'white', 
                                  borderRadius: 5,
                                  shadowColor: 'white',
                                  shadowOffset: { width: 1, height: 2 },
                                  shadowOpacity: 0.8,
                                  shadowRadius: 3,  
                                  elevation: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
      </View>
      <View style={{  width: '20%', 
                      height: '100%', 
                      backgroundColor: 'rgba(103, 128, 159, 1)',
                      alignItems: 'center',
                      borderLeftColor: 'lightgrey',
                      borderLeftWidth: 2,
                      shadowColor: '#000',
                      shadowOffset: { width: 1, height: 2 },
                      shadowOpacity: 0.8,
                      shadowRadius: 8,  
                      elevation: 10 }}>
        <TouchableOpacity onPress={ props.toggleSlideMenu } 
                          style={{ justifyContent: 'center', 
                                   alignItems: 'center', 
                                   width: '80%', 
                                   height: 60, 
                                   marginTop: 30,
                                   backgroundColor: 'white', 
                                   borderRadius: 5,
                                   shadowColor: '#000',
                                   shadowOffset: { width: 1, height: 2 },
                                   shadowOpacity: 0.8,
                                   shadowRadius: 2,  
                                   elevation: 5  }}>
        <IconF5 name='chevron-left' size={30} color={'black'} /> 
        <Text>close</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
};

export default SlideMenu;