import React from 'react';
import { TextInput, View, Text, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NvrSearchInput = props => {
    const { searchText, searching, setSearchText, startSearch } = props;

    sortByCompany = (arr) => arr.sort(function(a, b) {
        var textA = a.sCompany.toUpperCase();
        var textB = b.sCompany.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return (
        <View >
            <View style={{ width: '98%', alignItems: 'center' }}>
                <Text style={{ marginBottom: 5, marginLeft: -272 }}>NVR Search</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }} >
                    <TextInput  value={ searchText } 
                                onChangeText={ text => setSearchText(text) }
                                autoFocus={true}
                                autoCapitalize={'none'}
                                style={{ marginLeft: -2, fontSize: 20, height: 40, width: 310,  borderColor: 'grey', borderWidth: 2, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, padding: 5 }} />
                    <TouchableOpacity onPress={ startSearch } 
                                    style={{  borderColor: 'grey', borderWidth: 2, borderLeftWidth: 0, borderTopRightRadius: 5, borderBottomRightRadius: 5, padding: 5, backgroundColor: 'grey' }}>
                        { searching ? 
                        <Icon name='spinner' size={26} color={'white'} /> :
                        <Icon name='search' size={26} color={'white'} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                { props.showAutomatches && props.autoMatches.length > 0 && props.searchText.length > ( isNaN(parseInt(props.searchText)) ? 2 : 0 )  ?
                    <FlatList
                        contentContainerStyle={{ width: 600, maxWidth: Dimensions.get('window').width - 20, marginRight: 'auto', marginLeft: 'auto', overflow: 'visible', marginTop: 10, borderRadius: 5, paddingBottom: 160}}
                        data={ sortByCompany(props.autoMatches) }
                        renderItem={ ({ item }) => <ScrollView  horizontal={true} 
                                                                showHorizontal showsHorizontalScrollIndicator={false}
                                                                style={{ maxWidth: Dimensions.get('window').width, height: 40, width: '100%', padding: 5, borderColor: 'grey', borderWidth: 2 }} >
                                                        <Text   style={{ fontSize: 16, paddingRight: 20 }}
                                                                onPress={ () => setSearchText( `${item.sCompany} - ${item.sName}`, item.bSerial )} >
                                                            {item.sCompany} - {item.sName}
                                                        </Text>
                                                    </ScrollView> }
                        keyExtractor={ item => item.bSerial.toString() }
                    /> :
                    null
                }
            </View>
        </View>
    )
};

export default NvrSearchInput;