import React from 'react';
import { StyleSheet, View, StatusBar, Dimensions, AsyncStorage } from 'react-native';
import Login from './components/login/LoginMain';
import Header from './components/common/Header';
import config from './backend.json';
import NvrMain from './components/nvr/NvrMain';
import JobsiteMain from './components/jobsite/JobsiteMain';
import JetEngineMain from './components/jetengine/JetEngineMain';
import SlideMenu from './components/nav/SlideMenu';

const API_URL = config.backend
let sessionCheckTimeout;


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiUrl: 'http://192.168.1.69:8081/', //API_URL,
      isLoggedIn: false,
      user: {},
      token: '',
      sessionKey: '',
      autoLogin: false,
      activeView: 'login',
      nvrReferenceList: [],
      loading: true,
      sessionExpired: false,
      sessionCheckRunning: false,
      showMenu: false
    };

  }

  componentDidMount = () => {
    this.setState({ loading: true });
    this.checkAutoLogin();
  };

  componentWillUnmount = () => {
    this.setState({ sessionCheckRunning: false });
  };

  verifySession = async( id, session ) => {
    let userId = this.state.user.bID;
    let sessionKey = this.state.sessionKey;
    if(id) { userId = id };
    if(session) { sessionKey = session };

    await fetch( this.state.apiUrl + 'api/checksession/' + userId + '/' + sessionKey  )
    .then( res => {
      console.log(res.status)
      if( ( res.status === 404 || res.status === 203 || res.status === 400) && this.state.isLoggedIn ) {
        throw new Error()
      };
      console.log('session is valid');
      this.sessionCheckTimeout = setTimeout( function() {
        this.verifySession()
      }.bind(this), 10000);
    })
    .catch( (error) => {
      console.log('error while verifying session ' , error)
      clearTimeout(this.sessionCheckTimeout);
      this.clearLocalUserData('expired');
    });
  };

  clearLocalUserData = async( expired ) => {
    clearTimeout(sessionCheckTimeout);
    await AsyncStorage.removeItem('autoLogin');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('sessionKey');
    this.setState({
      isLoggedIn: false,
      user: {},
      token: '',
      sessionKey: '',
      autoLogin: false,
      activeView: 'login',
      nvrReferenceList: [],
      sessionExpired: expired ? true : false,
      sessionCheckRunning: false,
      loading: false,
      showMenu: false
    });
  }

  clearExpiredSessionModal = () => {
    this.setState({ sessionExpired: false, sessionKey: '' });
    clearTimeout(this.sessionCheckTimeout);
  };

  checkAutoLogin = async () => {
    // see if user was using auto login
    try {
      const autoLogin = await AsyncStorage.getItem('autoLogin');
      const user = await AsyncStorage.getItem('user');
      const sessionKey = await AsyncStorage.getItem('sessionKey');
      const token = await AsyncStorage.getItem('token');
      if (autoLogin !== null) {
        this.setState({ 
          autoLogin: true,
          user: JSON.parse(user),
          sessionKey,
          token ,
          activeView: 'nvr-main',
          isLoggedIn: true,
          loading: false,
          sessionCheckRunning: true,
        }, () => {
          this.getNvrReferenceList();
          setTimeout( function() { this.verifySession( JSON.parse(user).bID, sessionKey )}.bind(this), 1000 );
        });
      } else {
        this.clearLocalUserData();
        clearTimeout(this.sessionCheckTimeout);
      }
    } catch (error) {
      console.log('could not load data from local storage. ', error);
      this.clearLocalUserData();
      clearTimeout(this.sessionCheckTimeout);
    }
  };

  setUserToLocalStorage = async( user, token, sessionKey ) => {
    console.log(user, token, sessionKey);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('sessionKey', sessionKey);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('autoLogin', 'true');
    } 
    catch (error) {
      console.log('could not save data to local storge')
    }
    this.setState({ autoLogin: true });
  };

  setUserToState = ( user, token, sessionKey ) => {
    this.setState({
      isLoggedIn: true,
      user,
      token,
      sessionKey,
      activeView: 'nvr-main',
      sessionCheckRunning: true,
      loading: false
    }, () => {
      this.getNvrReferenceList();
      setTimeout( function() { this.verifySession()}.bind(this), 1000 );
    });
  };

  setActiveView = (view) => {
    this.setState({ activeView: view });
  };

  getNvrReferenceList = async() => {
    fetch( this.state.apiUrl + 'api/nvrreflist' )
    .then( res => {
      if(!res.ok){
        throw new Error('response bad');
      }
      return res.json()
    })
    .then( data => {
      this.setState({ nvrReferenceList: data.result })
    })
    .catch( error => {
      console.log(error)
    })
  };

  toggleSlideMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  logoutUser = () => {
    clearTimeout(sessionCheckTimeout);
    fetch( this.state.apiUrl + 'logout/' + this.state.user.bID + '/' + this.state.user.sName )
    .then ( () => {
      this.clearLocalUserData();
    })
    .catch( error => {
      console.log('logout user failed. ', error)
      this.clearLocalUserData();
    });
  };

  render() {

    return (
        <View style={styles.container}>
          <StatusBar hidden={true} />

              <View style={{ width: '100%', display: this.state.showMenu ? 'visible': 'none' }}>
                <SlideMenu  toggleSlideMenu={ this.toggleSlideMenu }
                            logoutUser={ this.logoutUser } />
              </View> 

            <View style={{  width: '100%', display: !this.state.showMenu ? 'visible': 'none' }}>
          
            { (!this.state.isLoggedIn || this.state.activeView === 'login') && !this.state.loading ?
                <Login  apiUrl={ this.state.apiUrl }
                        isLoggedIn={ this.state.isLoggedIn }
                        setUserToState={ this.setUserToState }
                        setUserToLocalStorage={ this.setUserToLocalStorage }
                        sessionExpired={ this.state.sessionExpired }
                        clearExpiredSessionModal={ this.clearExpiredSessionModal } /> :
                null 
            }

            { this.state.isLoggedIn ?
                <Header setActiveView={ this.setActiveView }
                        toggleSlideMenu={ this.toggleSlideMenu } /> :
              null
            }

            { this.state.activeView === 'nvr-main' ?
                <NvrMain  setActiveView={ this.setActiveView }
                          apiUrl={ this.state.apiUrl }
                          nvrReferenceList={ this.state.nvrReferenceList }
                          getNvrReferenceList={ this.getNvrReferenceList } /> :
                null   
            }

            { this.state.activeView === 'jobsite-main' ?
                <JobsiteMain setActiveView={ this.setActiveView } /> :
                null   
            }

            { this.state.activeView === 'jetengine-main' ?
                <JetEngineMain setActiveView={ this.setActiveView } /> :
                null   
            }

          </View>

        </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    maxWidth: Dimensions.get('window').width,
    width: '100%'
  }
});
