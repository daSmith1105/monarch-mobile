import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TableOfContents = (props) => {
  return (
    <View style={{ flex: .8, width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>

      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>What system are you working with?</Text>

      <TouchableOpacity style={{  padding: 10, 
                                  border: '2px solid black', 
                                  borderRadius: 5, 
                                  backgroundColor: 'lightgrey', 
                                  width: '60%', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' }}
                        onPress={ () => props.setActiveView('nvr-main')}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>NVR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{  padding: 10, 
                                  border: '2px solid black', 
                                  borderRadius: 5, 
                                  backgroundColor: 'lightgrey', 
                                  width: '60%', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' }}
                        onPress={ () => props.setActiveView('jobsite-main')}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>JobSite</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{  padding: 10, 
                                  border: '2px solid black', 
                                  borderRadius: 5, 
                                  backgroundColor: 'lightgrey', 
                                  width: '60%', 
                                  alignItems: 'center', 
                                  justifyContent: 'center' }}
                        onPress={ () => props.setActiveView('jetengine-main')}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>JetEngine</Text>
      </TouchableOpacity>

    </View>
  )
};

export default TableOfContents;