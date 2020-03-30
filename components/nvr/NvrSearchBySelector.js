import React from 'react';
import { View, Text } from 'react-native';
import RadioButton from '../common/RadioButton';

const NvrSearchBySelector = props => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
      <Text style={{ marginBottom: 10 }}>Search By</Text>
      <View style={{ width: '100%' }}>
        <RadioButton
          text="Name"
          value={ props.searchBy === 'name' ? true : false }
          onPress={ () => props.setSearchBy('name') }
        />
        <RadioButton
          text="Company"
          value={ props.searchBy === 'company' ? true : false }
          onPress={() => props.setSearchBy('company') }
        />
        <RadioButton
          text="Serial"
          value={ props.searchBy === 'serial' ? true : false }
          onPress={() => props.setSearchBy('serial')}
        />
      </View>
    </View>
  )
};

export default NvrSearchBySelector;