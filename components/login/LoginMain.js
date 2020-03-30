import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Switch } from 'react-native'; 
import SessionExistsModal from './SessionExistsModal';
import SessionExpiredModal from './SessionExpiredModal';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        username: '',
        password: '',
        autoLogin: false,
        error: false,
        emptyError: false,
        sessionExists: false,
        user: null,
        sessionKey: '',
        token: ''
    };

  };

  componentDidMount = () => {
    this.setState({
      username: '',
      password: '',
      autoLogin: false,
      error: false,
      emptyError: false,
      sessionExists: false,
      user: null,
      sessionKey: '',
      token: ''
    });
  };
  componentWillUnmount = () => {
    this.setState({
      username: '',
      password: '',
      autoLogin: false,
      error: false,
      emptyError: false,
      sessionExists: false,
      user: null,
      sessionKey: '',
      token: ''
    });
  };

  handleSubmit = async(e) => {
    e.preventDefault();
    if (this.state.username.trim() === '' || this.state.password.toString() === '') {
        this.setState({ emptyError: true })
    } else {
        await fetch( this.props.apiUrl + 'login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username.trim(),
                password: this.state.password.trim()
            })
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('bad response')
            };
            return response;
        })
        .then(response => response.json())
        .then( data => {
          if (data.sessionExists) {
            // show session exists modal and let user decide if they want to void their previous session
            this.setState({ sessionExists: true, user: data.user, token: data.token, sessionKey: data.sessionKey });
          } else {
            // if autologin is true set the user to local storage so they don't have to log in repeatedly
            this.state.autoLogin && this.props.setUserToLocalStorage( data.user, data.token, data.sessionKey );
            this.props.setUserToState( data.user, data.token, data.sessionKey );
          }
        })
        .catch(error => {
          console.log(error)
            this.setState({
              error: true,
              emptyError: false,
              username: '',
              password: '',
              autoLogin: false,
              sessionExists: false,
              user: {},
              sessionKey: '',
              token: ''
            });
        }); 
    };
  };

  cancelCurrentSession = () => {
    this.setState({
      username: '',
      password: '',
      autoLogin: false,
      error: false,
      emptyError: false,
      sessionExists: false,
      user: {},
      sessionKey: '',
      token: ''
    });
  };

  forceLogin = () => {
    fetch( this.props.apiUrl + 'forcelogin/' + this.state.user.bID + '/' + this.state.user.sName + '/' + this.state.sessionKey )
    .catch( error => console.log(error))
    // if autologin is true set the user to local storage so they don't have to log in
    this.state.autoLogin && this.props.setUserToLocalStorage( this.state.user, this.state.token, this.state.sessionKey );
    // set the user, token, and session key in our global state
    this.props.setUserToState( this.state.user, this.state.token, this.state.sessionKey );
  };
    
  render() {

    const { 
      loginContainerStyle, 
      innerContainerStyle,
      headingStyle,
      formStyle,
      userBlockStyle,
      passwordBlockStyle, 
      autoLoginContainer,
      loginButtonStyle,
      footerStyle,
      modalContainerStyle,
      expiredModalContainerStyle } = styles;

    const date = new Date();
    const currentYear = date.getFullYear();

    return (
      <View style={ loginContainerStyle }>

        <View style={ innerContainerStyle }>
          <View style={{ flexDirection: 'row' }}>
          <Image  source={ require('../../assets/dividia_logo.jpg') } 
                  style={{ transform: [{ scaleX: .9 }, { scaleY: .9 }] }} />
          </View>

          { this.props.sessionExpired ? 
            <View style={ expiredModalContainerStyle }>
              <SessionExpiredModal 
                                  onAccept={ this.props.clearExpiredSessionModal } />
            </View> :
            null  
          }

          { this.state.sessionExists ?
            <View style={ modalContainerStyle }>
              <SessionExistsModal 
                                  onDeny={ this.cancelCurrentSession }
                                  onAccept={ this.forceLogin } />
            </View> :
            null  
          }

          { !this.state.sessionExists && !this.props.sessionExpired ? 
            <View style={ formStyle }>
              <Text style={ headingStyle }>Monarch Login</Text>
              <View style={ userBlockStyle }>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Username:</Text>
                <TextInput 
                    style={{ width: '60%', borderRadius: 5, padding: 5, paddingLeft: 10, marginLeft: 10, fontSize: 18, backgroundColor: 'white'  }}
                    autoCapitalize="none"
                    autoFocus={true}
                    autoCorrect={false}
                    textContentType="username"
                    onFocus={ () => this.setState({ emptyError: false }) }
                    value={ this.state.username } 
                    onChangeText={ text => this.setState({ username: text })  }
                    autoFocus={true} />
              </View>
              <View style={ passwordBlockStyle }>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Password:</Text>
                <TextInput 
                    style={{ width: '60%', borderRadius: 5, padding: 5, paddingLeft: 10, marginLeft: 14, fontSize: 18, backgroundColor: 'white' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onFocus={ () => this.setState({ emptyError: false }) }
                    value={ this.state.password } 
                    onChangeText={ text => this.setState({ password: text })  } />
              </View>

              <View style={ autoLoginContainer }>
                <Text style={{ marginLeft: 200, marginRight: 8, color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  Auto-Login
                </Text>
                <Switch
                  style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                  value={ this.state.autoLogin } 
                  onChange={ () => this.setState({ autoLogin: !this.state.autoLogin }) } />
              </View>

              {/* Error Block */}
                { !this.state.emptyError && !this.state.error && !this.state.loginCancelled ?
                  <Text style={{ height: 18, fontSize: 18, fontWeight: 'bold', marginTop: 10 }}></Text> :
                  null
                }

                { this.state.emptyError ? 
                    <Text style={{ height: 18, fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 10 }}>Must Provide Username AND Password</Text> :
                    null 
                }

                { this.state.error ? 
                    <Text style={{ height: 18, fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 10 }}>Access Denied</Text> :
                    null
                }

                { this.state.loginCancelled ? 
                    <Text style={{ height: 18, fontSize: 18, fontWeight: 'bold', color: 'red', marginTop: 10 }}>Login Cancelled</Text> :
                    null
                }

                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={ loginButtonStyle } onPress={ this.handleSubmit }>
                    <Text style={{ color: '#135ba2', fontSize: 22, fontWeight: 'bold' }}>Login</Text>
                  </TouchableOpacity>
                </View>
              
              </View> :
             null 
            }

            <Text style={ footerStyle }>&copy; { currentYear } Dividia Technologies, LLC</Text>

          </View> 

      </View>
    );
  };
};

export default Login;

const styles = {
  loginContainerStyle: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    position: 'relative',
  },
  innerContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formStyle: {
    alignItems: 'center',
    padding: 8,
    paddingBottom: 15,
    backgroundColor: '#135ba2',
    borderRadius: 5,
    marginTop: 20,
    maxWidth: 600
  },
  headingStyle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },
  userBlockStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  passwordBlockStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  autoLoginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    textAlign: 'right',
    marginRight: 8,
    fontSize: 16
  },
  loginButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: .6,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 20
  },
  footerStyle: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8
  },
  modalContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    width: '100%',
    paddingBottom: 15,
    backgroundColor: '#135ba2',
    borderRadius: 5,
    marginTop: 20,
  },
  expiredModalContainerStyle: {
    alignItems: 'center',
    padding: 12,
    paddingBottom: 15,
    width: 470,
    backgroundColor: '#135ba2',
    borderRadius: 5,
    marginTop: 20,
    maxWidth: '90%'
  }
};

        
