import React, {Component} from 'react';
import {View, Button, Text, Dimensions, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('screen');
export default class RemoveItems extends Component {
  sendData = () => {
    this.props.parentCallback(this.props.items); //to call function from parentclass on press
  };
  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.RBSheet.open()}>
          <Icon name="ellipsis-v" type="font-awesome" color="white" />
        </TouchableOpacity>
        <View style={styles._mainView}>
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            closeOnDragDown={false}
            closeOnPressMask={false}
            closeOnPressBack={false}
            height={230}
            duration={250}
            customStyles={{
              container: {
                backgroundColor: '#171817',
              },
            }}>
            <Text style={styles._channelTittle}>{this.props.item}</Text>
            <Text style={styles._questionTittle}>
              Do you want to remove this from favourites ?{' '}
            </Text>
            <View style={styles._buttonOuterView}>
              <View style={styles._removeButtonView}>
                <Button
                  title="Remove"
                  color="white"
                  onPress={() => {
                    this.sendData();
                    this.RBSheet.close();
                  }}
                />
              </View>
              <View style={styles._cancelButtonView}>
                <Button
                  title="cancel"
                  color="white"
                  onPress={() => this.RBSheet.close()}
                />
              </View>
            </View>
          </RBSheet>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  _mainView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  _channelTittle: {
    fontSize: width / 27,
    color: 'blue',
    marginHorizontal: width / 60,
    marginVertical: height / 100,
  },
  _questionTittle: {
    fontSize: width / 23,
    alignSelf: 'center',
    marginVertical: height / 12,
    position: 'absolute',
    color: 'white',
  },
  _buttonOuterView: {
    justifyContent: 'space-between',
    marginHorizontal: width / 2,
    marginVertical: height / 7,
    height: height / 22,
    width: width / 2.2,
    position: 'absolute',
    flexDirection: 'row',
  },
  _removeButtonView: {
    height: height / 22,
    width: width / 5,
    backgroundColor: 'black',
  },
  _cancelButtonView: {
    height: height / 22,
    width: width / 5,
    backgroundColor: 'black',
  },
});
