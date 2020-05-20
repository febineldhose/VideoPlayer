import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  PixelRatio,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import PlayerControl from '../subcomponents/PlayerControls';
import YouTube from 'react-native-youtube';
import {Slider} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
const {height} = Dimensions.get('window');
export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      isReady: true,
      status: true,
      quality: null,
      error: null,
      isPlaying: true,
      fullScreen: false,
      isLooping: true,
      duration: 0,
      currentTime: 0,
      containerMounted: false,
      containerWidth: null,
      favourites_data_save: null,
      videostate: 0,
      hideInfo: false,
      showinfo: false,
      currentId: '',
      values: [],
      favourates_data: [],
      repeating_fav_data: '',
      isLoading: true,
      set_favou_buttn_colour: false,
      data_length: [],
      changing_counts: '',
      timeduration: '',
      domain: null,
      seekTo: 0,
      isPlaying: true,
      isSeeking: false,
      value: '',
      doubletap: false,
      sec_fade_out: false,
      seek_backward: false,
      seek_forward: false,
      fadeValue: new Animated.Value(0),
      Buffering: true,
    };
  }
  componentDidMount = async () => {
    this.timer2();
    this._retrieveData();
    this.Toggle_favo_Button();
  };
  Animation_start = () => {
    //set Animation for DoubleTap
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 500,
    }).start();
  };
  timer = async () => {
    //Doubletap Tapping functionality
    setTimeout(() => {
      this.setState({
        doubletap: false,
        sec_fade_out: false,
        seek_forward: false,
        seek_backward: false,
      });
    }, 420);
  };
  timer2 = () => {
    setTimeout(() => {
      this.setState({Buffering: false}); //used when buffering is started
    }, 300);
  };
  hideVideoView = async () => {
    await setTimeout(() => {
      this.state.isPlaying && this.setState({hideInfo: false});
    }, 0);
  };
  hideVideoViews = async () => {
    await this.setState({hideInfo: !this.state.hideInfo});
    setTimeout(() => {
      this.state.hideInfo && this.setState({hideInfo: false, doubletap: false});
    }, 5500);
  };
  gettime = async () => {
    //get duration of the video
    this._youTubeRef
      .getDuration()
      .then((duration) => this.setState({duration}));
  };
  current_video_id = async () => {
    //get the currently playing video's ID
    await this._youTubeRef
      .getVideosIndex()
      .then((k) => this.setState({currentId: this.props.vidID[k]}));
  };

  favodata = async () => {
    this.current_video_id();
    this._retrieveData();
    this.fetching_favo_data();
    this.toggling();
  };
  _retrieveData = async () => {
    try {
      await this.current_video_id();
      const value = await AsyncStorage.getItem('favo_data');
      if (value !== null && value.length !== 0) {
        this.setState({favourates_data: JSON.parse(value)});
      }
    } catch (error) {}
  };
  deleting_from_async = async () => {
    await this._retrieveData();
    let k = this.state.currentId;
    let j = this.state.favourates_data.filter(function (i) {
      return i.img !== k;
    });
    await AsyncStorage.setItem('favo_data', JSON.stringify(j));
    this.props.dispatch({
      type: 'keys',
      payload: j,
    });
  };
  fetching_favo_data = async () => {
    //video ID fetching
    await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${this.state.currentId}&key=AIzaSyBJPNTpTwJlvB56f6Xe3BZ5NU29W6Bt-Ng&part=snippet`,
    ).then((data) => {
      data.json().then((jsondata) => {
        if (this.state.favourates_data.length !== 0) {
          var not_repeat = this.state.favourates_data.map((i) => i.img);
          if (
            this.state.currentId.length !== 0 &&
            not_repeat.includes(this.state.currentId) == false
          )
            this.setState(
              {
                favourates_data: [
                  ...this.state.favourates_data,
                  {
                    title_favo: jsondata.items[0].snippet.title,
                    img: this.state.currentId,
                  },
                ],
              },
              () => {
                this.reducer_keys();
                AsyncStorage.setItem(
                  'favo_data',
                  JSON.stringify(this.state.favourates_data),
                );
              },
            );
        } else
          this.setState(
            {
              favourates_data: [
                {
                  title_favo: jsondata.items[0].snippet.title,
                  img: this.state.currentId,
                },
              ],
            },
            () => {
              AsyncStorage.setItem(
                'favo_data',
                JSON.stringify(this.state.favourates_data),
              );
            },
          );
      });
    });
  };
  reducer_keys = () => {
    this.props.dispatch({
      type: 'keys',
      payload: this.state.favourates_data,
    });
  };
  forloopping() {
    for (let index = 0; index < this.state.dataSources.length; index++) {
      const element = this.state.dataSources[index].id;
      u.push({title: element});
    }
  }
  Toggle_favo_Button = async () => {
    await this.current_video_id();
    await this._retrieveData();
    const not_repeat = this.state.favourates_data.map((i) => i.img);
    if (not_repeat.includes(await this.state.currentId) == true) {
      this.setState({
        set_favou_buttn_colour: true,
      });
    } else {
      this.setState({
        set_favou_buttn_colour: false,
      });
    }
  };
  toggling = () => {
    this.setState({set_favou_buttn_colour: !this.state.set_favou_buttn_colour});
    if (!this.state.set_favou_buttn_colour) {
      this.deleting_from_async();
    }
  };

  datapassing_favo_remote = async () => {
    let count = this.props.vidID;
    await this.current_video_id();
    await this._retrieveData();
    if (count.length !== 0)
      this.setState({
        changing_counts: count.length - 1 - count.indexOf(this.state.currentId),
      });
    this.Toggle_favo_Button();
    await this.props.dispatch({
      type: 'pass_channel',
      payload: [this.state.currentId, this.state.changing_counts],
    });
  };
  onseek = async () => {
    await this.setState({isSeeking: true}, () => {
      this._youTubeRef.seekTo(this.state.value);
    });
  };
  onSlideStart = () => {
    this.setState({isSeeking: true, jj: true}, () => {
      this._youTubeRef.pause();
    });
  };

  onChange = (values) => {
    this.setState((prevState) => {
      this.video.current.currentTime = toSeconds(values[0]);
      if (prevState.isPlaying === true) {
        this.video.current.play();
      }
      return {isSeeking: false, values};
    });
  };
  onUpdate = (values) => {
    this.setState({values}, () => {
      this.video.current.currentTime = toSeconds(values[0]);
    });
  };
  playORpause = (playornot) => {
    this.setState({isPlaying: playornot});
  };
  render() {
    return (
      <View
        style={styles._container}
        onLayout={({
          nativeEvent: {
            layout: {width},
          },
        }) => {
          if (!this.state.containerMounted)
            this.setState({containerMounted: true});
          if (this.state.containerWidth !== width)
            this.setState({containerWidth: width});
        }}>
        {(this.props.loader || this.state.status === 'buffering') && (
          <View style={styles._innerContainer}>
            <MaterialIndicator color="lightgreen" size={70} />
          </View>
        )}

        {this.state.containerMounted && (
          <YouTube //youTube player
            ref={(component) => {
              this._youTubeRef = component;
            }}
            apiKey="AIzaSyBJPNTpTwJlvB56f6Xe3BZ5NU29W6Bt-Ng"
            videoIds={this.props.vidID}
            play={this.state.isPlaying}
            loop={this.state.isLooping}
            fullscreen={this.state.fullScreen}
            controls={0}
            style={[
              {
                height: PixelRatio.roundToNearestPixel(
                  this.state.containerWidth / (16 / 9),
                ),
              },
              styles.player,
            ]}
            onError={(e) => this.setState({error: e.error, Errors: false})}
            onReady={(e) =>
              this.setState({isReady: true}, () => {
                this.gettime();
                this.setState({isLoad: true});
              })
            }
            onChangeState={(e) =>
              this.setState(
                {
                  status: e.state,
                  isLoad: false,
                },
                () => {
                  this.gettime();
                  this.datapassing_favo_remote();
                  if (this.state.status == 'playing') {
                    this.setState({isPlaying: true});
                  }
                },
              )
            }
            onChangeQuality={(e) => this.setState({quality: e.quality})}
            onChangeFullscreen={(e) => {
              this.setState({fullscreen: e.fullScreen});
            }}
            onProgress={(e) =>
              this.setState({
                currentTime: e.currentTime,
              })
            }
          />
        )}
        {
          <View style={styles._outerHideView}>
            <TouchableOpacity onPress={async () => await this.hideVideoViews()}>
              <View style={styles._innerHideView}>
                {!this.props.loader &&
                  this.state.status !== 'buffering' &&
                  this.state.hideInfo && (
                    <View style={styles._playerControlsView}>
                      <PlayerControl //playerControls
                        screenProps={{
                          parentCallback: this.favodata,
                          isPlayingOrPaused: this.playORpause,
                          favoColorChange: this.state.set_favou_buttn_colour,
                          youtubeRef: this._youTubeRef,
                          isPlaying: this.state.isPlaying,
                          videoID: this.state.currentId,
                          videoIDs: this.props.vidID[0],
                          currentTime: this.state.currentTime,
                        }}
                      />
                    </View>
                  )}
                <View style={styles._playerSeekBarView}>
                  <Text style={styles._playerSeekBarText}>
                    {Math.trunc(this.state.currentTime / 60)}:
                    {Math.trunc(this.state.currentTime % 60)} /{' '}
                    {Math.trunc(this.state.duration / 60)}:
                    {Math.trunc(this.state.duration % 60)}
                  </Text>
                  <Slider //player slider
                    maximumValue={this.state.duration}
                    minimumValue={0}
                    minimumTrackTintColor="red"
                    maximumTrackTintColor="#e0dfdc"
                    onChange={this.onChange}
                    onUpdate={this.onUpdate}
                    onSlideStart={this.onSlideStart}
                    value={this.state.currentTime}
                    onValueChange={(value) => this.setState({value})}
                    onSlidingComplete={this.onseek}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  _container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  _innerContainer: {
    height: '100%',
    width: '100%',
    top: height / 7,
    marginVertical: height,
  },
  _outerHideView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  _innerHideView: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  _playerControlsView: {
    width: '100%%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    height: '100%',
    alignSelf: 'center',
  },
  _playerSeekBarView: {
    width: '100%',
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  _playerSeekBarText: {
    color: 'white',
    fontSize: 15,
  },
  player: {
    alignSelf: 'stretch',
    height: '100%',
    backgroundColor: 'red',
  },
});
