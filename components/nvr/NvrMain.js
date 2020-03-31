import React from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import NvrSearchInput from './NvrSearchInput';
import NvrSearchResults from './NvrSearchResults';
import axios from 'axios';

class NvrMain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      searching: false,
      searchResults: [],
      previousSearchText: '',
      noResults: false,
      searchBy: 'name',
      autoMatches: [],
      showAutoMatches: false,
      selectedFromAutoMatch: 0,
      expandedCardId: 0,
      clearingResults: false
    };
  }

  componentWillUnMount = () => {
    this.state = {
      searchText: '',
      searching: false,
      searchResults: [],
      previousSearchText: '',
      noResults: false,
      searchBy: 'name',
      autoMatches: [],
      showAutoMatches: false,
      selectedFromAutoMatch: 0,
      expandedCardId: 0,
      clearingResults: false
    };
  }

  setExpandedCardId = (id) => {
    this.setState({ expandedCardId: id });
  };

  setSearchText = ( text, fromSelect ) => {
    let matches =[];
    this.setState({ noResults: false, expandedCardId: 0 },
      () => {
        if ( !fromSelect ) {
          this.setState({ selectedFromAutoMatch: 0, showAutoMatches: true });

          if ( !isNaN(parseInt(text.trim()))) {
            this.props.nvrReferenceList.forEach( n => {
              if( n.bSerial.toString() === text.trim() ) {
                matches.push(n)
              }
            });
          } else {
            this.props.nvrReferenceList.forEach( n => {
              if( n.sName.replace(/\W/g, '').toLowerCase().indexOf(text.replace(/\W/g, '').trim().toLowerCase()) >= 0 || n.sCompany.replace(/\W/g, '').toLowerCase().indexOf(text.replace(/\W/g, '').trim().toLowerCase()) >= 0 ) {
                if( matches.indexOf(n.bSerial) < 0 ) {
                  matches.push(n);
                };
              };
            });
          }

          this.setState({ searchText: text, autoMatches: matches, showAutoMatches: true })

        } else {
          this.setState({ searchText: text, autoMatches: [], showAutoMatches: false, selectedFromAutoMatch: fromSelect }, 
            () => {
              this.startSearch();
            })
        };
      });
  };

  setSearchBy = value => {
    this.setState({ searchBy: value });
  };

  startSearch = async() => {
    let query = this.state.searchText.trim();
    this.setState({ searching: true, 
                    searchResults: [],
                    previousSearchText: this.state.searchText, 
                    searchText: '', 
                    autoMatches: [], 
                    showAutoMatches: false })

    if(this.state.selectedFromAutoMatch != 0 ) {
      query = this.state.selectedFromAutoMatch;
    }
    // run search function using this.state.searchText
    await axios({
      method: 'get',
      url: this.props.apiUrl + 'api/mobilesearch/' + query,
    })
    .then( response => {
      if(response.data.result[0] && response.data.result[0].length > 0 ) {
        this.setState({ searchResults: response.data.result[0], 
          searching: false, 
          selectedFromAutoMatch: 0 })
      } else {
        this.setState({ noResults: true, searching: false });
      };
    })
    .catch( error => {
      console.log(error)
    })
  };

  rollbackNoResults = () => {
    this.setState({ noResults: false })
  };

  clearResults = () => {
    this.setState({ expandedCardId: 0, clearingResults: true },
      () => {
        setTimeout( () => this.setState({ searchResults: [], clearingResults: false }), 1100)
      });
  }

  render() {
    return (
      <View style={{  flex: 1, width: '100%', maxWidth: Dimensions.get('window').width, backgroundColor: 'transparent' }}>
          { this.state.searchResults.length > 0 ?
              <View style={{ width: '100%', alignItems: 'flex-end', marginTop: -20, marginLeft: -20 }} >
                <TouchableOpacity   onPress={ this.state.clearingResults ? console.log('') : this.clearResults }
                                    style={{ width: 120, marginLeft: 20, height: 36, alignItems: 'center', justifyContent: 'center', padding: 5, borderWidth: 2, borderColor: 'grey', backgroundColor: 'transparent', borderRadius: 5 }}>
                  { this.state.clearingResults ? 
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'grey' }}>processing...</Text> :
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'grey' }}>clear results</Text>
                  }
                </TouchableOpacity>
              </View> :
              <View style={{ width: '100%', alignItems: 'flex-end', marginTop: -20, marginLeft: -20 }} >
                <TouchableOpacity   
                                    style={{ width: 120, marginLeft: 20, height: 36, alignItems: 'center', justifyContent: 'center', padding: 5, borderWidth: 2, borderColor: 'transparent', backgroundColor: 'transparent', borderRadius: 5 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'transparent' }}>clear results</Text>
                </TouchableOpacity>
              </View>
            }
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ marginBottom: 5 }}>
            <NvrSearchInput searchText={ this.state.searchText }
                            searching={ this.state.searching }
                            setSearchText={ this.setSearchText }
                            startSearch={ this.startSearch }
                            autoMatches={ this.state.autoMatches }
                            showAutomatches={ this.state.showAutoMatches }
                            rollbackNoResults={ this.rollbackNoResults }
                            searchResults={ this.state.searchResults } />
          </View>
        </View>
        
          <View style={{ flex: '1fr' , alignItems: 'center', marginTop: -14  }}>
            {this.state.searchResults.length > 0 ?
              <Text style={{ marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: 'dodgerblue', textAlign: 'center' }}>{this.state.searchResults.length.toString()} Results Found for "{this.state.previousSearchText}"</Text> :
              null
            }

            {this.state.noResults ?
              <Text style={{ marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: 'dodgerblue', textAlign: 'center' }}>No Results Found for "{this.state.previousSearchText}"</Text> :
              null
            }

            <NvrSearchResults searchResults={ this.state.searchResults }
                              apiUrl={ this.props.apiUrl }
                              setExpandedCardId={ this.setExpandedCardId }
                              expandedCardId={ this.state.expandedCardId }
                              noResults={ this.state.noResults } /> 
          </View>
      </View>
    )
  }
};

export default NvrMain;