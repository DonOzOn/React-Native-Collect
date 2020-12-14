/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { Agenda, Calendar, CalendarList, CalendarProvider, WeekCalendar } from 'react-native-calendars';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';

import { Animated } from 'react-native';
import { Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import moment from 'moment';

const { width, height } = Dimensions.get('window');


const App: () => React$Node = () => {

  const [date, setDate] = useState({
    day: moment().date(),
    month: moment().month() + 1,
    year: moment().year(),
    dateString: moment().format('YYYY-MM-DD'),
  })

  const inputWidth = useRef(new Animated.Value(260)).current
  const inputOpacity = useRef(new Animated.Value(1)).current
  const heightMenuBar = useRef(new Animated.Value(100)).current
  const firstItemY = useRef(new Animated.Value(0)).current
  const firstItemX = useRef(new Animated.Value(0)).current
  const secondItemX = useRef(new Animated.Value(0)).current
  const thirdItemX = useRef(new Animated.Value(0)).current
  const fourItemX = useRef(new Animated.Value(0)).current
  const fontSizeItem = useRef(new Animated.Value(14)).current
  const onScroll = (e) => {
    const { x, y } = e.nativeEvent.contentOffset;
    console.log('y', y)
    if (y > 100) {
      Animated.parallel([Animated.timing(firstItemY, {
        toValue: -10,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(secondItemX, {
        toValue: -10,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(thirdItemX, {
        toValue: -60,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(fourItemX, {
        toValue: -110,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(firstItemX, {
        toValue: 40,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fontSizeItem, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }), Animated.spring(inputWidth, {
        toValue: 0,
        friction: 1,
        tension: 1,
        // duration: 100,
        useNativeDriver: false,
        // easing: Easing.linear
      }), Animated.timing(inputOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(heightMenuBar, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.linear
      }),
      ]).start()
    } else {
      Animated.parallel([Animated.timing(inputWidth, {
        toValue: 260,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(heightMenuBar, {
        toValue: 80,
        // friction: 1,
        // tension: 1,
        speed: 9,
        bounciness: 1,
        // duration: 200,
        useNativeDriver: false,
        // easing: Easing.linear
      }),
      Animated.timing(firstItemY, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(secondItemX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(thirdItemX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }), Animated.timing(fourItemX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(fontSizeItem, {
        toValue: 14,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(firstItemX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      ]).start()
    }

  }


  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.body}>
          <View style={styles.header}>
            <Icon
              name='search'
              type='font-awesome'
              size={20}
              color='grey' />
            <View style={{ width: 280, alignItems: 'flex-start', }}>
              <Animated.View style={{ width: inputWidth, flex: 1, opacity: inputOpacity }}>
                <TextInput placeholder={'Nhập vào đây'} style={{ borderWidth: 1, flex: 1 }} />
              </Animated.View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '20%', alignItems: 'center' }}>

              <Icon
                name='bell'
                type='font-awesome'
                size={20}
                color='white' />
              <Icon
                name='power-off'
                type='font-awesome'
                size={22}
                color='white' />
            </View>

          </View>

          <Animated.View style={[styles.menuBar, { height: heightMenuBar }]}>
            <View style={styles.item}>
              <Animated.View style={{ transform: [{ translateY: firstItemY }, { translateX: firstItemX }], position: 'absolute', top: -20 }}>
                <Icon
                  name='star'
                  type='font-awesome'
                  size={22}
                  color='white' />
              </Animated.View>

              <Animated.Text style={{ opacity: inputOpacity, fontSize: fontSizeItem, position: 'absolute' }}>First Item</Animated.Text>
            </View>
            <View style={styles.item}>
              <Animated.View style={{ transform: [{ translateY: firstItemY }, { translateX: secondItemX }], position: 'absolute', top: -20 }}>
                <Icon
                  name='grav'
                  type='font-awesome'
                  size={22}
                  color='white' />
              </Animated.View>
              <Animated.Text style={{ opacity: inputOpacity, fontSize: fontSizeItem, position: 'absolute' }}>Second Item</Animated.Text>
            </View>
            <View style={styles.item}>
              <Animated.View style={{ transform: [{ translateY: firstItemY }, { translateX: thirdItemX }], position: 'absolute', top: -20 }}>
                <Icon
                  name='shower'
                  type='font-awesome'
                  size={22}
                  color='white' />
              </Animated.View>

              <Animated.Text style={{ opacity: inputOpacity, fontSize: fontSizeItem, position: 'absolute' }}>Third Item</Animated.Text>
            </View>
            <View style={styles.item}>
              <Animated.View style={{ transform: [{ translateY: firstItemY }, { translateX: fourItemX }], position: 'absolute', top: -20 }}>
                <Icon
                  name='vcard'
                  type='font-awesome'
                  size={22}
                  color='white' />
              </Animated.View>

              <Animated.Text style={{ opacity: inputOpacity, fontSize: fontSizeItem, position: 'absolute' }}>Fourth Item</Animated.Text>
            </View>
          </Animated.View>
          <View style={styles.numberBar}>
            <Text>Day la example</Text>
          </View>
        </View>
        <ScrollView
          onScroll={onScroll}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45Az7g_ZaHorWn72vna7YopGR8TCEAHHxWg&usqp=CAU' }} style={styles.image} />
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45Az7g_ZaHorWn72vna7YopGR8TCEAHHxWg&usqp=CAU' }} style={styles.image} />
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45Az7g_ZaHorWn72vna7YopGR8TCEAHHxWg&usqp=CAU' }} style={styles.image} />
            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ45Az7g_ZaHorWn72vna7YopGR8TCEAHHxWg&usqp=CAU' }} style={styles.image} />

          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
    width: width
  },
  image: {
    width: 300,
    height: 300
  },
  header: {
    height: 40,
    backgroundColor: 'rgba(0, 128, 128, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    paddingLeft: 15
  },
  numberBar: {
    height: 50,
    backgroundColor: '#ccc'
  },
  menuBar: {

    backgroundColor: '#6495ED',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  item: {
    width: '25%',
    alignItems: 'center'
  }
});

export default App;
