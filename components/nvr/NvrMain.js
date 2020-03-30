import React from 'react'
import { View, Text, Dimensions } from 'react-native';
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
      selectedFromAutoMatch: 0
    };
  }

  componentDidMount = () => {
    this.props.getNvrReferenceList();
  }

  setSearchText = ( text, fromSelect ) => {
    let matches =[];

    if ( !fromSelect ) {
      this.setState({ selectedFromAutoMatch: 0, showAutoMatches: true, searchResults: [] });

      if ( !isNaN(parseInt(text.trim()))) {
        this.props.nvrReferenceList.forEach( n => {
          if( n.bSerial.toString() === text.trim() ) {
            matches.push(n)
          }
        });
      } else {
        this.props.nvrReferenceList.forEach( n => {
          if( n.sName.toLowerCase().indexOf(text.trim().toLowerCase()) >= 0 || n.sCompany.toLowerCase().indexOf(text.trim().toLowerCase()) >= 0 ) {
            if( matches.indexOf(n.bSerial) < 0 ) {
              matches.push(n)
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
      this.setState({ searchResults: response.data.result[0], 
                      searching: false, 
                      selectedFromAutoMatch: 0 })
    })
    .catch( error => {
      console.log(error)
    })
  };

  render() {
    return (
      <View style={{  flex: 1, width: '100%', maxWidth: Dimensions.get('window').width, backgroundColor: 'transparent' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ marginBottom: 5 }}>
            <NvrSearchInput searchText={ this.state.searchText }
                            searching={ this.state.searching }
                            setSearchText={ this.setSearchText }
                            startSearch={ this.startSearch }
                            autoMatches={ this.state.autoMatches }
                            showAutomatches={ this.state.showAutoMatches } />
          </View>
        </View>
        
        { this.state.searchResults.length > 0 ?
          <View style={{ flex: '1fr' , alignItems: 'center', marginTop: -14  }}>
            <Text style={{ marginBottom: 10, fontSize: 22, fontWeight: 'bold', color: 'dodgerblue', textAlign: 'center' }}>{this.state.searchResults.length.toString()} Results Found for "{this.state.previousSearchText}"</Text>
            <NvrSearchResults searchResults={ this.state.searchResults } /> 
          </View>:
          null
        }
      </View>
    )
  }
};

export default NvrMain;