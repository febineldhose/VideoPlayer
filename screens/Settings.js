import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import Share from 'react-native-share';
const {width, height} = Dimensions.get('screen');
export default class Settings extends Component {
  // sharing code
  _onshare = async () => {
    // to share the application
    const shareOptions = {
      title: 'Share file',
      url:
        'https://play.google.com/store/apps/details?id=com.rstream.crafts&hl=en_IN',
      failOnCancel: false,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      setResult('error: '.concat(getErrorString(error)));
    }
  };
  render() {
    return (
      <View>
        <ScrollView style={styles._scrollStyle}>
          <View style={styles._mainView}>
            <TouchableOpacity>
              <View style={styles._container}>
                <Image
                  source={require('../Images/page.png')}
                  style={styles._imagestyle}
                />
                <Text style={styles._textstyle}>About us</Text>
                <View style={styles._iconview}>
                  <Icon name="chevron-right" type="Entypo" color="#333534" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles._container}>
                <Image
                  source={require('../Images/Hand.png')}
                  style={styles._imagestyle}
                />
                <Text style={styles._textstyle}>Write Review</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles._container}>
                <Image
                  source={require('../Images/Antenna.png')}
                  style={styles._imagestyle}
                />
                <Text style={styles._textstyle}>Notifications</Text>
                <View style={styles._iconview}>
                  <Icon name="chevron-right" type="Entypo" color="#333534" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._onshare()}>
              <View style={styles._container}>
                <Image
                  source={require('../Images/kiss.png')}
                  style={styles._imagestyle}
                />
                <Text style={styles._textstyle}>Invite a friend</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  _scrollStyle: {height: '100%', width: '100%', backgroundColor: 'black'},
  _mainView: {height: '100%', width: '100%', padding: width / 30},
  _container: {
    height: height / 20,
    width: '100%',
    backgroundColor: '#171817',
    marginVertical: height / 180,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  _textstyle: {
    color: 'white',
    marginHorizontal: width / 65,
    alignSelf: 'center',
    fontSize: width / 27,
  },
  _imagestyle: {
    height: width / 18,
    width: width / 18,
    alignSelf: 'center',
    marginHorizontal: width / 40,
  },
  _iconview: {
    position: 'absolute',
    right: width / 30,
    alignSelf: 'center',
  },
});
