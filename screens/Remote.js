import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import AddMoreChannels from '../subcomponents/AddMoreChannels';
const {width, height} = Dimensions.get('screen');
import styles from '../Constants/styles';
import RemoveItems from '../subcomponents/RemoveItems';
export default class Remotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSources: [],
      data2: [],
      dataSource: [],
      first_default_video: [],
      data_id: [],
      boarder_set: '',
      first_boarder_select: false,
      current_category_playing: '',
      horrizontal_boarder_color: false,
      shuffle_vid_ids: false,
      timeout: false,
    };
  }
  static tabBarOptions = ({navigation}) => {
    return {
      activeTintColor: {
        activeTintColor: navigation.getParam('BackgroundColor', '#ED2525'),
        //Background color of ActionBar
      },
    };
  };
  componentDidMount = async () => {
    this.componentDidMount_call();
  };
  componentDidMount_call = async () => {
    await this.stores_channel_list();
    await this._fetchingdata();
    let item = this.state.data2[0];
    if (this.state.data2.length !== 0) {
      this.setState(
        {
          boarder_set: item.category,
          current_category_playing: item.category,
          shuffle_vid_ids: true,
        },
        async () => {
          this._callData();
        },
      );
    } else {
      this.setState(
        {
          current_category_playing: this.state.dataSource[0].category,
          horrizontal_boarder_color: this.state.dataSource[0].category,
          shuffle_vid_ids: true,
        },
        () => {
          this._callData();
        },
      );
    }
  };
  // code for fetching the  id,channel name,etc
  _callData = async () => {
    this._loadingTimer();
    await fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSources: responseJson,
        });
      })
      .catch((error) => {});
    this.setState({
      data_id: this.state.dataSources.map((i) => {
        return i.id;
      }),
    });
    if (this.state.shuffle_vid_ids == true) {
      let filterd_component = this.state.data_id;
      this.shuffle(filterd_component);
      await this.props.screenProps.dispatch({
        type: 'reset',
        payload: filterd_component,
      });
      this.setState({shuffle_vid_ids: false});
    }
    await this.props.screenProps.dispatch({
      type: 'reset',
      payload: this.state.data_id,
    });
  };
  stores_channel_list = async () => {
    let values = await AsyncStorage.getItem('stores').catch((e) => {});
    if (values !== null) {
      this.setState({data2: JSON.parse(values)});
    }
  };
  stores_current_Addmorelist = async () => {
    const values1 = await AsyncStorage.getItem(
      'store_addmore',
    ).catch((e) => {});
    if (values1 !== null)
      this.setState({retriving_addmore_current_data: JSON.parse(values1)});
  };
  channel_boarder_selector = (item) => {
    this.setState({
      boarder_set: item.category,
      horrizontal_boarder_color: false,
    });
  };
  deleting_from_async = () => {
    var toRemove = this.state.items;
    let deleteddatafrom = this.state.data2.filter(
      (j) => j.category !== toRemove,
    );
    if (this.state.boarder_set == toRemove && deleteddatafrom.length !== 0) {
      let lastitem = deleteddatafrom[deleteddatafrom.length - 1];
      this.setState(
        {
          current_category_playing: lastitem.category,
          boarder_set: lastitem.category,
        },
        () => this._callData(),
      );
    }
    this.setState({data2_category: deleteddatafrom, data2: deleteddatafrom});
    this._storeData_after_delete(deleteddatafrom);
    if (deleteddatafrom.length == 0) {
      this.setState(
        {
          current_category_playing: this.state.dataSource[0].category,
          horrizontal_boarder_color: this.state.dataSource[0].category,
        },
        () => this._callData(),
      );
    }
  };
  //storing data after removing channels from my channel
  _storeData_after_delete = async (deletedfrom) => {
    try {
      await AsyncStorage.setItem('stores', JSON.stringify(deletedfrom));
      let values = await AsyncStorage.getItem('stores');
      if (JSON.parse(values) == null) this.setState({n: null});
    } catch (error) {}
  };
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  callbackFunction = (items) => {
    this.stores_channel_list();
    this.setState(
      {
        data2: [...this.state.data2, items],
        boarder_set: items.category,
        current_category_playing: items.category,
      },
      () => {
        this._callData(items);
        AsyncStorage.setItem('stores', JSON.stringify(this.state.data2));
        this._fetchingdata();
      },
    );
  };
  shuffle = (filterd_component) => {
    var length_array = filterd_component.length,
      temp,
      index;
    while (length_array > 0) {
      index = Math.floor(Math.random() * length_array);
      length_array--;
      temp = filterd_component[length_array];
      filterd_component[length_array] = filterd_component[index];
      filterd_component[index] = temp;
    }
    return filterd_component;
  };
  _fetchingdata = async () => {
    await this.stores_channel_list();
    await fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((responseJson) => {
        if (this.state.data2 !== null) {
          let history_array_name = this.state.data2.map((i) => {
            return i.category;
          });
          var filterd_component = responseJson.filter((i) => {
            return history_array_name.indexOf(i.category) == -1;
          });
          this.shuffle(filterd_component);
          this.setState({dataSource: filterd_component});
        }
      })
      .catch(() => {
        this.dataPassOnRequestFailed();
      });
  };
  _setTimeout = () => {
    this.setState({timeout: false});
    setTimeout(() => {
      this.setState({timeout: true});
    }, 1000);
  };
  _loadingTimer = () => {
    this.props.screenProps.dispatch({
      type: 'loading',
      payload: true,
    });
    setTimeout(() => {
      this.props.screenProps.dispatch({
        type: 'loading',
        payload: false,
      });
    }, 4000);
  };
  callbackfromRemoveitem = () => {
    this.deleting_from_async();
  };
  _onClick_Horizontal_flatlist = (item) => {
    this.setState(
      {
        current_category_playing: item.category,
        horrizontal_boarder_color: item.category,
        boarder_set: false,
      },
      () => {
        this._callData(), this._setTimeout();
      },
    );
  };
  _onClick_Vertical_flatlist = (item) => {
    this.setState({current_category_playing: item.category}, async () => {
      this._callData(), this.channel_boarder_selector(item);
    });
  };
  dataPassOnRequestFailed = () => {
    this.props.parentCallback('sherya');
  };
  render() {
    return (
      <View style={styles.whole_container}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.goback({
              BackgroundColor: 'red',
            })
          }>
          <Text style={styles.Specials}> Specials</Text>
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{paddingBottom: 25}}
          style={styles.ScrollView}>
          <FlatList
            style={styles.fltst_height}
            horizontal
            data={this.state.dataSource}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this._onClick_Horizontal_flatlist(item);
                  }}>
                  <Card
                    containerStyle={[
                      styles.horizontal_flatLst,
                      this.state.horrizontal_boarder_color == item.category
                        ? styles.changed_bordr_color
                        : styles.deflt_bordr_colr,
                    ]}>
                    <Image
                      source={{uri: item.imgurl}}
                      style={styles.hori_flatlst_Image}
                    />
                    {this.state.horrizontal_boarder_color == item.category && (
                      <View style={styles.deflt_large_circle}>
                        {!this.state.timeout && (
                          <View>
                            <ActivityIndicator />
                          </View>
                        )}
                        {this.state.timeout && (
                          <Text style={{color: '#FFFFFF'}}>
                            {this.props.screenProps.store_channels[1]}
                          </Text>
                        )}
                      </View>
                    )}
                    {this.state.horrizontal_boarder_color !== item.category && (
                      <View style={styles.deflt_small_circle} />
                    )}
                  </Card>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item, index) => index}
          />
          <View style={styles.lf_rt_padding}>
            <View style={styles.underline} />
            <Text style={styles.channel_Text}> My channel</Text>
            <View style={styles.addmore_Text}>
              <AddMoreChannels
                parentCallback={this.callbackFunction}
                data={this.state.dataSource}
              />
            </View>
            <View style={styles.outer_view_container}>
              {this.state.data2.length !== 0 &&
                this.state.data2.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      this._onClick_Vertical_flatlist(item);
                    }}>
                    <View
                      style={[
                        styles.inner_view_container,
                        item.category == this.state.boarder_set
                          ? styles.changed_bordr_color
                          : styles.deflt_bordr_colr,
                      ]}>
                      <Image
                        source={{uri: item.imgurl}}
                        style={styles.container_image}
                      />
                      <View style={styles.container_icon}>
                        <TouchableOpacity
                          onPress={() => this.setState({items: item.category})}>
                          <RemoveItems
                            item={item.category}
                            parentCallback={this.callbackfromRemoveitem}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.container_text}>{item.category}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
