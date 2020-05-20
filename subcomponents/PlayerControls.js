import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Button,
} from 'react-native';
import {Icon} from 'react-native-elements';
const {width, height} = Dimensions.get('window');
export default class PlayerControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: this.props.screenProps.isPlaying,
      doubletap: false,
      sec_fade_out: false,
      seek_backward: false,
      seek_forward: false,
      fadeValue: new Animated.Value(0),
    };
  }
  sendData = () => {
    this.props.screenProps.parentCallback(); //function call from videoPlayer page
  };
  pauseORplay = () => {
    this.props.screenProps.isPlayingOrPaused(this.state.isPlaying); // function call when video is play or paused
  };
  timer = async () => {
    setTimeout(() => {
      this.setState({
        doubletap: false,
        sec_fade_out: false,
        seek_forward: false,
        seek_backward: false,
      });
    }, 420);
  };
  Animation_start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 500,
    }).start();
  };
  secBackward = () => {
    this.setState({sec_fade_out: true, seek_backward: true}, async () => {
      await this.props.screenProps.youtubeRef.seekTo(
        this.props.screenProps.currentTime - 30,
      );
      this.timer();
      this.Animation_start();
    });
  };
  secForward = () => {
    this.setState({sec_fade_out: true, seek_backward: true}, async () => {
      await this.props.screenProps.youtubeRef.seekTo(
        this.props.screenProps.currentTime + 30,
      );
      this.timer();
      this.Animation_start();
    });
  };
  render() {
    return (
      <View style={styles._mainView}>
        <View style={styles._favoView}>
          <Button onPress={() => this.kk()} title="press" />
          <TouchableOpacity onPress={() => this.sendData()}>
            <Icon
              name="favorite"
              color={
                this.props.screenProps.favoColorChange ? 'lightgreen' : 'white'
              }
              size={35}
            />
          </TouchableOpacity>
        </View>
        <View style={styles._controlOuterView}>
          <View style={styles._dobleTapOuterView}>
            <TouchableOpacity
              onPress={async () => {
                await this.setState({doubletap: true});
                this.timer();
              }}>
              <View style={styles._doubleTapView}>
                {this.state.doubletap && (
                  <TouchableOpacity
                    onPress={async () => {
                      this.secBackward();
                    }}>
                    <View style={styles._doubleTapInnerView}>
                      {this.state.sec_fade_out && this.state.seek_backward && (
                        <Animated.Text
                          style={{
                            opacity: this.state.fadeValue,
                            fontSize: 30,
                            color: 'white',
                          }}>
                          ◀◀◀
                        </Animated.Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.props.screenProps.youtubeRef;
              this.setState({isPlaying: true});
              this.props.screenProps.youtubeRef.previousVideo();
            }}>
            {this.props.screenProps.videoIDs ==
              this.props.screenProps.videoID && (
              <Icon name="skip-previous" color="#7f7f85" size={42} />
            )}
            {this.props.screenProps.videoIDs !==
              this.props.screenProps.videoID && (
              <Icon name="skip-previous" color="white" size={43} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  isPlaying: !this.state.isPlaying,
                },
                () => this.pauseORplay(),
              );
            }}>
            <Icon
              name={this.state.isPlaying ? 'pause' : 'play-arrow'}
              color="white"
              size={60}
              type="material"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.screenProps.youtubeRef.nextVideo();
              this.setState({isPlaying: true});
            }}>
            <Icon name="skip-next" color="white" size={42} />
          </TouchableOpacity>
          <View style={styles._dobleTapOuterView}>
            <TouchableOpacity
              onPress={async () => {
                await this.setState({doubletap: true});
                this.timer();
              }}>
              <View style={styles._doubleTapView}>
                {this.state.doubletap && (
                  <TouchableOpacity
                    onPress={async () => {
                      this.secForward();
                    }}>
                    <View style={styles._doubleTapInnerView}>
                      {this.state.sec_fade_out && this.state.seek_backward && (
                        <Animated.Text
                          style={{
                            opacity: this.state.fadeValue,
                            fontSize: 30,
                            color: 'white',
                          }}>
                          ◀◀◀
                        </Animated.Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  _mainView: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  _favoView: {
    top: 0,
    height: Math.floor((width * height) / 7300),
    width: Math.floor((width * height) / 7300),
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  _controlOuterView: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: '30%',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'space-between',
  },
  _dobleTapOuterView: {
    height: '100%',
    width: '15%',
  },
  _doubleTapView: {
    height: '100%',
    width: '100%',
  },
  _doubleTapInnerView: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
