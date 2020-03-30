import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SessionExistsModal = props => {

  return(
    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
      <Text style={{ margin: 5, fontSize: 24, fontWeight: 'bold', color: 'white', fontWeight: 'bold', marginTop: 20 }}>Monarch Login</Text>
      <Text style={{ margin: 5, fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 30 }}>You are already logged in.</Text>
      <Text style={{ margin: 5, fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 30 }}>Would you like to terminate your other session?</Text>
      <View style={{ flexDirection: 'row', marginTop: 40, marginBottom: 20 }}>
        <TouchableOpacity onPress={ props.onDeny } style={{ backgroundColor: 'white', borderRadius: 5, padding: 8, marginRight: 30 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#135ba2' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={ props.onAccept } style={{ backgroundColor: 'white', borderRadius: 5, padding: 8 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#135ba2' }}>     OK     </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SessionExistsModal;
