import React, {Component} from 'react';
import {
  View,
  Button,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
const {width, height} = Dimensions.get('screen');
export default class AddMoreChannels extends Component {
  sendData = (item) => {
    this.props.parentCallback(item); //to call function from parentclass on press
  };
  render() {
    return (
      <View style={styles._mainView}>
        <Button
          color="white"
          title="Addmore"
          onPress={() => {
            this.RBSheet.open();
          }}
        />
        <View style={{height: '100%'}}>
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            closeOnDragDown={false}
            closeOnPressMask={false}
            closeOnPressBack={false}
            height={height}
            duration={300}
            customStyles={{
              container: {
                backgroundColor: 'black',
                justifyContent: 'center',
                paddingTop: 50,
              },
            }}>
            <View style={styles._addMoreTextView}>
              <Text style={styles._addMoreText}>Addmore</Text>
              <TouchableOpacity
                onPress={() => {
                  this.RBSheet.close();
                }}>
                <View style={styles._iconView}>
                  <Icon name="clear" color="white" size={width / 14} />
                </View>
              </TouchableOpacity>
            </View>
            <FlatList
              style={styles._flatListView}
              contentContainerStyle={styles._flatListContainer}
              data={this.props.data}
              renderItem={({item, index}) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.RBSheet.close();
                        this.sendData(item);
                      }}>
                      <View key={index} style={styles._flatListInnerView}>
                        <Image
                          source={{uri: item.imgurl}}
                          style={styles._flatListImage}
                        />

                        <View style={styles._flatListTextView}>
                          <Text style={styles._flatListText}>
                            {item.category}
                          </Text>
                        </View>
                        <Icon name="add" type="materials" color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(index) => index}
            />
          </RBSheet>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  _mainView: {height: height / 2},
  _addMoreTextView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  _addMoreText: {
    color: 'white',
    fontSize: width / 18,
  },
  _iconView: {
    position: 'absolute',
    top: -height / 75,
    marginHorizontal: width / 3.7,
  },
  _flatListView: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  _flatListContainer: {paddingBottom: height / 24},
  _flatListInnerView: {
    width: '90%',
    height: height / 20,
    backgroundColor: 'black',
    flexDirection: 'row',
    marginVertical: height / 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  _flatListImage: {
    height: width / 12,
    width: width / 12,
    alignSelf: 'center',
    borderRadius: 40,
  },
  _flatListTextView: {
    width: '75%',
    backgroundColor: 'black',
  },
  _flatListText: {color: 'white', fontSize: width / 25},
});
