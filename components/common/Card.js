import React from 'react';
import { View, Text, TouchableOpacity, Linking, Clipboard, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconF5 from 'react-native-vector-icons/FontAwesome5';
import checkIsAlive from '../helper/checkIsAlive';
import moment from 'moment';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      viewTags: false,
      viewFeatures: false,
      viewPosTypes: false,
      viewNote: false,
      noteEditable: false,
      modifiedNote: ''
    }
  }

  componentDidMount = () => {
    this.setState({ expanded: false, viewTags: false })
    if(this.props.autoExpanded) {
      this.setState({ expanded: true })
    };
  };

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded }, 
      () => { if(!this.state.expanded){ this.setState({ viewTags: false,  viewFeatures: false, viewPosTypes: false, viewNote: false})}})
  };

  editNote = () => {
    this.setState({ noteEditable: true, modifiedNote: this.props.item.sNote })
  };

  editNvr = () => {
    alert('we are going to edit the nvr settings')
  };

  saveNoteEdit = () => {
    this.setState({ viewNote: false})
  }

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
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Serial: {item.bSerial}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Company: {item.sCompany}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', margin: 3 }} >Name: {item.sName}</Text>
          </View>

          <View style={{ width: '40%', alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={ () => Linking.openURL( "http://" + item.sIP + ":" + item.bPort) } 
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
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>  { moment.utc(item.dTimestamp).format('MM-DD-YYYY') }</Text>
                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 12 }}>  { moment.utc(item.dTimestamp).format('hh:mm:ss a') }</Text>
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
                { this.state.noteEditable ?
                  <TextInput  defaultValue={ item.sNote } 
                              value={ this.state.modifiedNote } 
                              multiline={true}
                              textAlignVertical={true}
                              autoFocus={true}
                              onChangeText={ text => this.setState({ modifiedNote: text }) }
                              style={{ color: 'grey', fontWeight: 'bold', fontSize: 15, marginTop: 10, marginLeft: '5%', width: '90%'}} />
                   :
                  <Text style={{ color: 'grey', fontWeight: 'bold', fontSize: 15, marginTop: 10, marginLeft: '5%', width: '90%' }}>
                  {item.sNote}
                  </Text>
                }
              </View>
            </View>
          :
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '60%', padding: 10 }}>
                { item.bController !== 0 ?
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Controller: {item.bController}</Text> :
                  null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >DVS Key:    <IconF5 name='clipboard' size={20} color={'grey'} onPress={ () => { Clipboard.setString(item.sKey); alert(`"${item.sKey}" copied to clipboard` ) } } /></Text> 
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{item.sKey}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Version: {item.sVersion}   |   {item.sVersionInstalled}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Distro: {item.sOS}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Numcam:: {item.bNumcam}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>POS Lock: {item.bPos}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>LPR Lock: {item.bLpr}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Seed: {item.sSeed}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>Features:   <IconF5 name={this.state.viewFeatures ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewFeatures: !this.state.viewFeatures }) } />
                </Text>
                { this.state.viewFeatures ? 
                    item.sFeatures.split(',').map( f => { return <Text key={ f } style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >{f}</Text> }) :
                    null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>POS Types:  <IconF5 name={this.state.viewPosTypes ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewPosTypes: !this.state.viewPosTypes }) } />
                </Text>
                { this.state.viewPosTypes ? 
                  item.sPosTypes.split(',').map( t => { return <Text key={ t } style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >{t}</Text> }) :
                  null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >MaintenancePlan: {item.sMaintenance.slice(0,4).toUpperCase()} {item.sMaintenance.length > 4 ? item.sMaintenance.slice(item.sMaintenance.length - 1) : ''}</Text>

              </View> 

              <View style={{ width: '40%', padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >IPv6: {!item.sIPv6 || item.sIPv6.length < 1 ? '::1' : null }</Text>
                { item.sIPv6 && item.sIPv6.length > 0 ?
                  <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >{item.sIPv6}</Text> :
                  null
                }
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >
                  Public IP:  <IconF5 name='clipboard' 
                                      size={20} 
                                      color={'grey'} 
                                      onPress={ () => { Clipboard.setString(`http://${item.sIP}:${item.bPort}`); alert(`"http://${item.sIP}:${item.bPort}" copied to clipboard` ) } } /> 
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{item.sIP}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Remote IP: </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{item.sRemoteIP}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >
                  Local IP:  <IconF5 name='clipboard' 
                                     size={20} 
                                     color={'grey'} 
                                     onPress={ () => { Clipboard.setString(`http://${item.sLocalIP}`); alert(`"http://${item.sLocalIP}" copied to clipboard` ) } } /> 
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }}>{item.sLocalIP} </Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Public Port: {item.bPort}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >SSH Port: {item.bSshPort}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'grey', margin: 3 }} >Tags: <IconF5 name={this.state.viewTags ? 'eye-slash' : 'eye' } 
                                                                                                            size={20} 
                                                                                                            color={'grey'} 
                                                                                                            onPress={ () => this.setState({ viewTags: !this.state.viewTags }) } />
                </Text>
                { this.state.viewTags ? 
                    item.sCategories.split(',').map( i => { return <Text key={ i } style={{ fontSize: 14, fontWeight: 'bold', color: 'grey', margin: 3, marginLeft: 12 }} >{i}</Text> }) :
                    null
                }
              </View>
            </View>
            }

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

              { !this.state.noteEditable ? 
              <TouchableOpacity onPress={ () => { this.state.viewNote ? this.editNote() : this.editNvr() } } style={{ alignItems: 'center'}}>
                  <IconF5 name='edit' size={26} color={'white'} /> 
                  <Text style={{ color: 'white' }}>{ this.state.viewNote ? 'edit note' : 'edit' }</Text>
              </TouchableOpacity> :
              <TouchableOpacity onPress={ () => this.saveNoteEdit() } style={{ alignItems: 'center'}}>
                  <IconF5 name='save' size={26} color={'white'} /> 
                  <Text style={{ color: 'white' }}>save note</Text>
              </TouchableOpacity>
              }

              <TouchableOpacity onPress={ () => { item.sNote.length > 0 ? this.setState({ viewNote: !this.state.viewNote }) : alert('There are currently no notes for this system.') }} 
                                style={{ alignItems: 'center'}}>
                  <IconF5 name='sticky-note' size={26} color={ item.sNote ? 'rgba(204,204,0,1)' : 'white' } /> 
                  <Text style={{ color: 'white' }}>{ this.state.viewNote ? 'close notes' : 'notes' }</Text>
              </TouchableOpacity>
              { !this.state.viewNote ?
              <TouchableOpacity onPress={ this.toggleExpanded } style={{ alignItems: 'center'}}>
                  <IconF5 name='redo' size={26} color={'white'} /> 
                  <Text style={{ color: 'white' }}>refresh</Text>
              </TouchableOpacity> :
              <TouchableOpacity onPress={ () => console.log(`you can't see me!`) } style={{ alignItems: 'center'}}>
                <IconF5 name='redo' size={26} color={'transparent'} /> 
                <Text style={{ color: 'transparent' }}>refresh</Text>
              </TouchableOpacity>
              }

              <TouchableOpacity onPress={ this.toggleExpanded } style={{ alignItems: 'center'}}>
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

              <TouchableOpacity onPress={ this.toggleExpanded } style={{ alignItems: 'center', marginTop: -4 }}>
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