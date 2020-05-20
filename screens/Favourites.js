import React from 'react';
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
const {width, height} = Dimensions.get('screen');
import RemoveItems from '../subcomponents/RemoveItems';
export default class Favourites extends React.Component {
  state = {
    favourites: [],
    hidedata: true,
    id_Arrays: [],
    borderColor: '',
    flatlistitem: '',
  };

  componentDidMount = async () => {
    this.data_refresh();
    await this._retrieveData_favo_data();

    this.props.screenProps.dispatch({
      type: 'keys',
      payload: this.state.favourites,
    });
  };

  data_refresh = () => {
    setTimeout(() => {
      this.setState({hidedata: false}); //invoke when the page starts
    }, 60);
  };
  _retrieveData_favo_data = async () => {
    try {
      const value = await AsyncStorage.getItem('favo_data'); //to save data offline
      if (value !== null)
        this.setState({
          favourites: JSON.parse(value),
        });
    } catch (error) {}
  };
  deleting_from_async = async (item) => {
    this._retrieveData_favo_data();
    let j = this.props.screenProps.storeItem.filter(function (i) {
      // to delete data from favourites
      return i.img !== item.img;
    });
    let lastitem = j[j.length - 1];
    this.setState({
      favourites: j,
    });
    if (this.props.screenProps.store_channels[0] === item.img) {
      if (this.props.screenProps.storeItem.length == 0) {
      } else
        this.props.screenProps.dispatch({
          type: 'reset',
          payload: [lastitem.img],
        });
    }
    await AsyncStorage.setItem('favo_data', JSON.stringify(j));
    this.props.screenProps.dispatch({
      type: 'keys',
      payload: j,
    });
    this._retrieveData_favo_data();
  };
  reducer_data_pass = () => {
    this.props.screenProps.dispatch({
      type: 'reset',
      payload: this.state.id_Arrays,
    });
  };
  playvideos = async (item, index) => {
    //tap to play current video
    this.setState({kk: []});
    this._retrieveData_favo_data();

    var data_array = this.state.favourites.map((i) => i.img);
    for (let indexes = index; indexes < data_array.length; indexes++) {
      const element = data_array[indexes];
      this.state.id_Arrays.push(element);
    }
    for (let indexes = 0; indexes < index; indexes++) {
      const element = data_array[indexes];
      this.state.id_Arrays.push(element);
    }
    this.setState({borderColor: item.img});
    this.props.screenProps.dispatch({
      type: 'reset',
      payload: this.state.id_Arrays,
    });
  };
  callbackfromRemoveitem = (child) => {
    this.deleting_from_async(child);
  };
  render() {
    if (this.state.hidedata)
      return (
        <View style={styles._firstMainView}>
          <ActivityIndicator />
        </View>
      );
    else if (
      this.props.screenProps.storeItem.length == 0 ||
      this.props.screenProps.storeItem == null
    ) {
      return (
        <View style={styles._noFavourites_View}>
          <View style={styles._noFavourites_View}>
            <Image source={require('../Images/favourites.png')} />
            <Text style={styles._noFavourites_Text}>
              You don't have any favourites
            </Text>
          </View>
        </View>
      );
    } else
      return (
        <View style={styles.firstMainView}>
          <FlatList
            contentContainerStyle={styles._flatlstContainer}
            style={styles._flatlstView}
            data={this.props.screenProps.storeItem}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.playvideos(item, index);
                  }}>
                  <View
                    style={[
                      this.props.screenProps.store_channels[0] == item.img
                        ? styles._changedBoarder
                        : styles._defaultColor,
                      styles._flatlistInnerView,
                    ]}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={{
                          uri: `https://i.ytimg.com/vi/${encodeURI(
                            item.img,
                          )}/hqdefault.jpg`,
                        }}
                        style={styles._flatlst_Img}
                      />
                    </View>
                    <View style={styles._flatlst_Text_OuterView}>
                      <Text style={styles._flatlst_Text}>
                        {item.title_favo}
                      </Text>
                    </View>
                    <View style={styles.container_icon}>
                      <RemoveItems
                        item={item.title_favo}
                        items={item}
                        parentCallback={this.callbackfromRemoveitem}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(index) => index}
          />
        </View>
      );
  }
}
const styles = StyleSheet.create({
  _firstMainView: {
    top: height / 16,
    height: '100%',
    backgroundColor: 'black',
  },
  _noFavourites_View: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  _noFavourites_Text: {fontSize: 17, fontStyle: 'italic', color: 'white'},
  _flatlstContainer: {
    backgroundColor: 'black',
    paddingBottom: height / 50,
  },
  _flatlstView: {
    backgroundColor: 'black',
    height: '100%',
    alignSelf: 'center',
  },
  _flatlistInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    width: width / 1.05,
    height: height / 13,
    borderWidth: 1,
    marginVertical: height / 100,
  },
  _defaultColor: {borderColor: 'black'},
  _changedBoarder: {borderColor: 'deeppink'},
  _flatlst_Img: {
    marginHorizontal: width / 35,
    height: height / 16,
    width: height / 16,
  },
  _flatlst_Text_OuterView: {
    height: height / 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: width / 1.55,
  },
  _flatlst_Text: {
    fontSize: width / 27,
    color: 'white',
  },
  container_icon: {
    position: 'absolute',
    right: width / 200,
    top: height * 0.01,
    alignSelf: 'flex-end',
    width: width / 20,
  },
});
