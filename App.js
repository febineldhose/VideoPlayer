import React, {useReducer, Component} from 'react';
import {SafeAreaView, View, Dimensions, Text, StyleSheet} from 'react-native';
import {MainNavigation} from './screens/MainNavigation';
import VideoPlayer from './Vedioplayer/VideoPlayer';
import {reducer, init} from './reducer/comReducer';
const {width, height} = Dimensions.get('screen');
import NetInfo from '@react-native-community/netinfo';
const Reducerfn = (props) => {
  const [state, dispatch] = useReducer(reducer, init);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: 'black', flex: 28}}>
        <View style={{flex: 11}}>
          <VideoPlayer
            vidID={state.vidID}
            dispatch={dispatch}
            storeItem={state.storeItem}
            store_channels={state.store_channels}
            loader={state.loader}
          />
        </View>
        <View
          style={{
            flex: 21,
            position: props.k == 'landscape' ? 'absolute' : 'relative',
          }}>
          <Appcontainer
            screenProps={{
              dispatch: dispatch,
              vidID: state.vidID,
              storeItem: state.storeItem,
              store_channels: state.store_channels,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SplashscreenLoader: true,
      connection_Status: '',
      isportrait: width < height,
    };
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    this.state = {
      orientation: isPortrait() ? 'portrait' : 'landscape',
    };
    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape', //to Change the orientation
      });
    });
  }
  unsubscribe = () => {
    NetInfo.addEventListener((state) => {
      this.setState({connection_Status: state.isConnected}); //check network is connected or not
    });
  };
  componentDidMount = () => {
    this.timer();
    this.unsubscribe();
  };
  timer = () => {
    setTimeout(() => {
      this.setState({SplashscreenLoader: true}); //splashScreen Time Out
    }, 4000);
  };
  render() {
    return (
      <View style={{height: '100%'}}>
        <View style={{flex: 1}}>
          {this.state.SplashscreenLoader && (
            <Reducerfn k={this.state.orientation} />
          )}
        </View>
        {!this.state.SplashscreenLoader && (
          <View style={styles._splashScreen}>
            <Text style={styles._splashScreenText}>Neverthink</Text>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  _splashScreen: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  _splashScreenText: {color: 'lightgreen', fontSize: 36},
});
