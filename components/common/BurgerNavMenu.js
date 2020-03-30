import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import IconF5 from 'react-native-vector-icons/FontAwesome5';

const BurgerNavMenu = props => {
    return( 
        <View style={{ marginTop: 20 }}>
            <TouchableOpacity onPress={ () => props.toggleSlideMenu() }>
                <IconF5 name='bars' size={30} color={'black'} /> 
            </TouchableOpacity>
        </View>
    )
};

export default BurgerNavMenu;