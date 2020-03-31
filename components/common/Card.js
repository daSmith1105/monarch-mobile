import React from 'react';
import { View, Text, TouchableOpacity, Linking, Clipboard, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import checkIsAlive from '../helper/checkIsAlive';
import moment from 'moment';

// TODO: Need to allow only one card to be expanded at any given time

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentServer: {},
      expanded: false,
      viewTags: false,
      viewFeatures: false,
      viewPosTypes: false,
      viewNote: false,
      noteEditable: false,
      modifiedNote: '',
      headerData: {
        sCompany: '',
        sName: '',
        sIP: '',
        bPort: null,
        dTimestamp: ''
      }
    }

    this.updateNvrDataHandler;
    this.updateHeaderDataHandler;
    this.verifyExpandedHandler;

  }

  componentDidMount = () => {
    this.setHeaderData();
    this.setState({ 
      expanded: false, 
      viewTags: false, 
      viewFeatures: false, 
      viewPosTypes: false, 
      viewNote: false,
      currentServer: this.props.item },
    () => {
      if(this.props.autoExpanded) {
        this.props.setExpandedCardId( this.props.item.bSerial );
        this.setState({ expanded: true });
        setTimeout( this.getUpdatedNvrData, 1000);
        setTimeout( this.verifyExpanded, 1000);
      } else {
        setTimeout( this.getUpdatedHeaderData, 1000);
      };
    });
  };

  setHeaderData = (company,name,ip,port,timestamp) => {
    let hData = { ...this.state.headerData };
    hData.sCompany = company ? company : this.props.item.sCompany;
    hData.sName = name ? name : this.props.item.sName;
    hData.sIP = ip ? ip : this.props.item.sIP;
    hData.bPort = port ? port : this.props.item.bPort;
    hData.dTimestamp = timestamp ? timestamp : this.props.item.dTimestamp;

    this.setState({ headerData: hData });
  };
  
  componentWillUnmount = () => {     
   clearTimeout(this.updateNvrDataHandler);   
   clearTimeout(this.updateHeaderDataHandler);                                   
   clearTimeout(this.verifyExpandedHandler);                                                                             
  }; 

  compareObj = ( newObj, oldObj ) => {
    // compare each value to determine of the objects are equal
    const aProps = Object.getOwnPropertyNames(newObj);
    const bProps = Object.getOwnPropertyNames(oldObj);

    if( aProps.length !== bProps.length) {
      return false;
    };

    for (var i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      // If values of same property are not equal, objects are not equivalent
      if (newObj[propName] !== oldObj[propName]) {
          return false;
      };
    };
    // If we made it this far, objects are considered equivalent
    return true;
  };

  getUpdatedHeaderData = async () => {
    // only get what we need for our headers if we have a list of servers that are collapsed
    if( !this.state.expanded ) {
      await fetch( this.props.apiUrl + 'api/getnvrheaderdatabyserial/' + this.props.item.bSerial.toString() )
      .then( res => res.json() )
      .then( data => {
        if ( data && data.server && data.server[0]) {
          // console.log(`is the header data the same? - ${this.props.item.bSerial.toString()}`, this.compareObj( this.state.headerData, data.server[0] ))
          if ( this.compareObj( this.state.headerData, data.server[0] )) {
            // if the new and old objects are the same, set a new timer
            this.updateHeaderDataHandler = setTimeout( () => { this.getUpdatedHeaderData(); this.updateHeaderDataHandler = 0 }, 60000 );
          } else {
            // if they are not the same, update the currentServer in state and set a new timer
            this.setState({ currentServer:  { ...this.state.currentServer,                   // shallow copy of currentServer state
                                              sCompany: data.server[0].sCompany,
                                              sName: data.server[0].sName,
                                              sIP: data.server[0].sIP,
                                              bPort: data.server[0].bPort,
                                              dTimestamp: data.server[0].dTimestamp
                                            }
                          },
                          () => {
                            this.setHeaderData(data.server[0].sCompany,data.server[0].sName,data.server[0].sIP,data.server[0].bPort,data.server[0].dTimestamp), // company,name,ip,port,timestamp
                            this.updateHeaderDataHandler = setTimeout( () => { this.getUpdatedHeaderData(); this.updateHeaderDataHandler = 0 }, 60000 );
                          });
          };
        } else {
          clearTimeout(this.updateHeaderDataHandler); 
        };
      })
      .catch( error => {
        console.log(error); 
        clearTimeout(this.updateHeaderDataHandler); 
      }) 
    } else {
      // we are expanded, we will be running this.getUpdatedNvrData()
      clearTimeout(this.updateHeaderDataHandler); 
    }
  };

  getUpdatedNvrData = async () => {
    if( this.state.expanded ) {
      await fetch( this.props.apiUrl + 'api/getnvrbyserial/' + this.props.item.bSerial.toString() )
      .then( res => res.json() )
      .then( data => {
        if ( data && data.server && data.server[0]) {
          // console.log('are they the same? ', this.compareObj( this.state.currentServer, data.server[0] ))      
          if ( this.compareObj( this.state.currentServer, data.server[0] )) {
            // if the new and old objects are the same, set a new timer
            this.updateNvrDataHandler = setTimeout( () => { this.getUpdatedNvrData(); this.updateNvrDataHandler = 0 }, 10000 );
          } else {
            // if they are not the same, update the currentServer in state and set a new timer
            this.setState({ currentServer: data.server[0] },
              () => { this.setHeaderData(data.server[0].sCompany,data.server[0].sName,data.server[0].sIP,data.server[0].bPort,data.server[0].dTimestamp), // company,name,ip,port,timestamp); 
                      this.updateNvrDataHandler = setTimeout( () => { this.getUpdatedNvrData(); this.updateNvrDataHandler = 0 }, 10000 );
                    })
          };
        } else {
          clearTimeout(this.updateNvrDataHandler); 
        }
      })
      .catch( error => {
        console.log(error); 
        clearTimeout(this.updateNvrDataHandler); 
      }) 
    } else {
      // we are not expanded, just get header data: sCompany,sName,sIP,bPort, dTimestamp
      clearTimeout(this.updateNvrDataHandler); 
    }
  };

  expand = () => {
    this.props.setExpandedCardId(this.props.item.bSerial); 
    this.setState({ expanded: true },
      () => {
        setTimeout( this.getUpdatedNvrData, 1000 );
        setTimeout( this.verifyExpanded, 1000 );
      });
  };

  minimize = () => {
    this.setState({ expanded: false, viewTags: false,  viewFeatures: false, viewPosTypes: false, viewNote: false },
      () => {
        clearTimeout(this.updateNvrDataHandler);                                         
        clearTimeout(this.verifyExpandedHandler); 
        setTimeout( this.getUpdatedHeaderData, 1000 );  
      });                    
  };

  editNote = () => {
    this.setState({ noteEditable: true, modifiedNote: this.props.item.sNote })
  };

  editNvr = () => {
    alert('we are going to edit the nvr settings')
  };

  saveNoteEdit = () => {
    this.setState({ viewNote: false });
  };

  // should we be expanded?
  verifyExpanded = () => {
    if( this.state.expanded  ) {
      // console.log(`from ${this.props.item.bSerial} - currently expanded: `, this.props.expandedCardId);
      // check to make sure no other cards are expanded, if they are close this card and stop checking for updated data
      if( this.props.expandedCardId !== this.props.item.bSerial ) {
        this.setState({ expanded: false}, () => {
          clearTimeout(this.verifyExpandedHandler); 
          clearTimeout(this.updateNvrDataHandler); 
        });                                                                                      
      } else {
        this.verifyExpandedHandler = setTimeout( () => { this.verifyExpanded(); this.verifyExpandedHandler = 0 }, 1000 );
      };
    } else {
      clearTimeout(this.verifyExpandedHandler); 
      clearTimeout(this.updateNvrDataHandler); 
    };
  };

  render() {
    const item = this.props.item;
    
    return (
      <View style={{  width: '90%', 
                      margin: 10,
                      borderRadius: 5,
                      backgroundColor:  'lightgrey',
                      borderWidth: 2,
                      borderColor: 'grey',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,  
                      elevation: 5 }}>
{/* Card Header */}
        <View style={{ width: '100%', 
        flexDirection: 'row',
                       borderTopRightRadius: 5, 
                       borderTopLeftRadius: 5, 
                       padding: 5,
                       backgroundColor: checkIsAlive( item.dTimestamp ) && item.fSick ? 'rgba(204,204,0,1)' : 
                       checkIsAlive( item.dTimestamp) ? 'rgba(76,153,0,1)' : 'rgba(255,51,51,1)',
                       shadowColor: '#000',
                       shadowOffset: { width: 0, height: 1 },
                       shadowOpacity: 0.8,
                       shadowRadius: 2,  
                       elevation: 5 }}>
          <View style={{ width: '60%'}}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Serial: { item.bSerial }</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Company: { this.state.currentServer.sCompany }</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Name: { this.state.currentServer.sName }</Text>
          </View>

          <View style={{ width: '40%', alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={ () => Linking.openURL( "http://" + this.state.currentServer.sIP + ":" + this.state.currentServer.bPort) } 
                              style={{  padding: 10, 
                                        backgroundColor: 'grey', 
                                        borderRadius: 5,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 2,  
                                        elevation: 5 }}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Jump System</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 10, marginRight: 10 }}>
              <Icon name='heart' size={16} color={'white'} /> 
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>  { moment.utc(this.state.currentServer.dTimestamp).format('MM-DD-YYYY') }</Text>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>  { moment.utc(this.state.currentServer.dTimestamp).format('hh:mm:ss a') }</Text>
              </View>

            </View>
          </View>

        </View>
        
{/* Card Details */}
        { this.state.expanded ? 
          <View style={{ width: '100%' }}>


          { this.state.viewNote ? 
            <View style={{ width: '100%', minHeight: 300, backgroundColor: 'lightgrey', padding: 10, alignItems: 'center'}}>
              <View style={{ marginTop: 20, width: '95%', minHeight: 260, padding: 10, borderColor: 'grey', borderWidth: 2, borderRadius: 5, backgroundColor: 'white', alignItems: 'flex-start' }}>
                <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 18 }}>NOTE:</Text>
                  <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 15, marginTop: 10, marginLeft: '5%', width: '90%' }}>
                    {this.state.currentServer.sNote}
                  </Text>
              </View>
            </View>
          :
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '60%', padding: 10 }}>
                { this.state.currentServer.bController !== 0 ?
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Controller: {this.state.currentServer.bController}</Text> :
                  null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >DVS Key:    <IconF5 name='clipboard' size={20} color={'grey'} onPress={ () => { Clipboard.setString(this.state.currentServer.sKey); 
                                                                                                                                                                              alert(`"${this.state.currentServer.sKey}" copied to clipboard`)}} /></Text> 
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{this.state.currentServer.sKey}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Version: {this.state.currentServer.sVersion}   |   {this.state.currentServer.sVersionInstalled}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Distro: {this.state.currentServer.sOS}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Numcam:: {this.state.currentServer.bNumcam}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>POS Lock: {this.state.currentServer.bPos}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>LPR Lock: {this.state.currentServer.bLpr}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Seed: {this.state.currentServer.sSeed}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Features:   <IconF5 name={this.state.viewFeatures ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewFeatures: !this.state.viewFeatures }) } />
                </Text>
                
                { this.state.viewFeatures ?
                    this.state.currentServer.sFeatures.split(',').map( f => { return  <Text key={ f } 
                                                                        style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >
                                                                    {f}
                                                                  </Text> 
                                                        }) :
                    null
                }

                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>POS Types:  <IconF5 name={this.state.viewPosTypes ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewPosTypes: !this.state.viewPosTypes }) } />
                </Text>

                { this.state.viewPosTypes ? 
                    this.state.currentServer.sPosTypes.split(',').map( t => { return  <Text key={ t } 
                                                                                            style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >
                                                                                        {t}
                                                                                      </Text> 
                                                                            }) :
                    null                                                       
                }

                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >
                  MaintenancePlan: { this.state.currentServer.sMaintenance.slice(0,4).toUpperCase()} {  this.state.currentServer.sMaintenance.length > 4 ? this.state.currentServer.sMaintenance.slice(this.state.currentServer.sMaintenance.length - 1) : ''}
                </Text>

              </View> 

              <View style={{ width: '40%', padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >IPv6: {!this.state.currentServer.sIPv6 || this.state.currentServer.sIPv6.length < 1 ? '::1' : null }</Text>
                { this.state.currentServer.sIPv6 && this.state.currentServer.sIPv6.length > 0 ?
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >{item.sIPv6}</Text> :
                  null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >
                  Public IP:  <IconF5 name='clipboard' 
                                      size={20} 
                                      color={'grey'} 
                                      onPress={ () => { Clipboard.setString(`http://${this.state.currentServer.sIP}:${this.state.currentServer.bPort}`);
                                                        alert(`"http://${this.state.currentServer.sIP}:${this.state.currentServer.bPort}" copied to clipboard` )} } /> 
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{this.state.currentServer.sIP}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Remote IP: </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{this.state.currentServer.sRemoteIP}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >
                  Local IP:  <IconF5 name='clipboard' 
                                     size={20} 
                                     color={'grey'} 
                                     onPress={ () => {  Clipboard.setString(`http://${this.state.currentServer.sLocalIP}`);
                                                        alert(`"http://${this.state.currentServer.sLocalIP}" copied to clipboard` )}} /> 
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{this.state.currentServer.sLocalIP} </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Public Port: {this.state.currentServer.bPort}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >SSH Port: {this.state.currentServer.bSshPort}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Tags: <IconF5 name={this.state.viewTags ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewTags: !this.state.viewTags }) } />
                </Text>
                { this.state.viewTags ? 
                    this.state.currentServer.sCategories.split(',').map( i => { return  <Text key={ i } 
                                                                          style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >
                                                                      {i}
                                                                    </Text> 
                                                          }) :
                    null                                      
                }
              </View>
            </View>
            }

{/* bottom button bar */}
            <View style={{  width: '100%', 
                            marginTop: 30, 
                            flexDirection: 'row', 
                            justifyContent: 'space-around',
                            backgroundColor: 'grey',
                            borderBottomRightRadius: 3,
                            borderBottomLeftRadius: 3,
                            padding: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,  
                            elevation: 5 }}>

              { this.state.currentServer.sNote.length > 0 ? 
                <TouchableOpacity onPress={ () => { this.setState({ viewNote: !this.state.viewNote }) }} 
                                  style={{ alignItems: 'center' }}>
                    <IconF5 name='sticky-note' size={26} color={ 'rgba(204,204,0,1)' } /> 
                    <Text style={{ color: 'white' }}>{ this.state.viewNote ? 'close notes' : 'notes' }</Text>
                </TouchableOpacity> :
                // this is a placeholder for when there are no notes for this server, item is transparent, but keeps spacing
                <TouchableOpacity style={{ alignItems: 'center' }}>
                  <IconF5 name='sticky-note' size={26} color={ 'transparent' } /> 
                  <Text style={{ color: 'transparent' }}>notes</Text>
                </TouchableOpacity>
              }

              {/* currently just a spacer, refresh button is not shown */}
              <TouchableOpacity style={{ alignItems: 'center'}}>
                  <IconF5 name='redo' size={26} color={'transparent'} /> 
                  <Text style={{ color: 'transparent' }}>refresh</Text>
              </TouchableOpacity> 

              <TouchableOpacity onPress={ this.minimize } style={{ alignItems: 'center'}}>
                  <IconF5 name='chevron-up' size={26} color={'white'} /> 
                  <Text style={{ color: 'white' }}>less</Text>
              </TouchableOpacity>
            </View>  
          </View>
        :

          <View style={{ padding: 10 }}>

            <View style={{ width: '100%', height: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
            {/* these 3 elements are pretty much spacers */}
              <TouchableOpacity>
                  <Icon name='rocket' size={26} color={'transparent'} /> 
              </TouchableOpacity>
              <TouchableOpacity>
                  <Icon name='rocket' size={26} color={'transparent'} /> 
              </TouchableOpacity>
              <TouchableOpacity>
                  <Icon name='rocket' size={26} color={'transparent'} /> 
              </TouchableOpacity>

              <TouchableOpacity onPress={ this.expand } style={{ alignItems: 'center', marginTop: -4 }}>
                  <IconF5 name='chevron-down' size={26} color={'grey'} /> 
                  <Text style={{ color: 'grey', marginTop: -5 }}>more</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }
};

export default Card;