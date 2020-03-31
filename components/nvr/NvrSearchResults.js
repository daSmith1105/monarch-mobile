import React from 'react';
import { View, FlatList } from 'react-native';
import Card from '../common/Card';

const NvrSearchResults = props => {
    const { searchResults, apiUrl } = props;

    sortByCompany = (arr) => arr.sort(function(a, b) {
        var textA = a.sCompany.toUpperCase();
        var textB = b.sCompany.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    
    return (
        <View style={{ minWidth: '100%', paddingBottom: 40 }}>
            <FlatList
                contentContainerStyle={{ width: '100%', marginLeft: '3%' }}
                data={ this.sortByCompany(searchResults) }
                renderItem={ ({ item }) => <Card    item={ item } 
                                                    autoExpanded={ searchResults.length === 1 ? true : false }
                                                    apiUrl={ apiUrl }
                                                    setExpandedCardId={ props.setExpandedCardId }
                                                    expandedCardId={ props.expandedCardId } /> }
                keyExtractor={ item => item.bSerial.toString() } />
        </View>
    )
};

export default NvrSearchResults;