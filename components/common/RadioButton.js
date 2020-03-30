import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RadioButton = props => {
  return( 
    <View style={ styles.buttonContainer } >
      <Text style={{ marginRight: 10 }}>{props.text}</Text>
      <TouchableOpacity style={ styles.circle }
                        onPress={ props.onPress } >
        { props.value === true && (<View style={styles.checkedCircle} />) } 
      </TouchableOpacity>
    </View>
  )
};

export default RadioButton;

const styles = {
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  circle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ACACAC',
      alignItems: 'center',
      justifyContent: 'center',
  },
  checkedCircle: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: 'dodgerblue',
  }
};