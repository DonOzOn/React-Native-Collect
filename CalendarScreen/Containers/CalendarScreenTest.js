// import * as PropTypes from 'prop-types';

// import {
//     ActivityIndicator,
//     Animated,
//     Dimensions,
//     InteractionManager,
//     Platform,
//     SafeAreaView,
//     Text,
//     View,
// } from 'react-native';
// import { CalendarChinese, CalendarVietnamese } from 'date-chinese';
// import React, { Component, useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//     calculateChiofDay,
//     hoangdao,
//     hoangdaoEn,
// } from '../Transforms/ConvertToCanchi';
// import { ceremony, ceremonyLunar } from '../Fixtures/ceremony';
// import { injectIntl, intlShape } from 'react-intl';
// import { screenHeight, screenWidth } from 'react-native-calendars/src/expandableCalendar/commons';

// import CalendarList from '../Components/react-native-calendars/src/calendar-list/index'
// import CalendarProvider from '../Components/react-native-calendars/src/expandableCalendar/calendarProvider';
// import { Colors } from '../Themes/index';
// import ConvertModal from '../Components/ConvertModal';
// import DateItem from '../Components/DateItem';
// import DateItemTest from '../Components/DateItemTest'
// import DateItemWeek from '../Components/DateItemWeek';
// import Header from '../Components/Header';
// import {
//     LocaleConfig,
// } from 'react-native-calendars';
// import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
// import TuviScreen from './TuviScreen';
// import WeekCalendar from '../Components/react-native-calendars/src/expandableCalendar/weekCalendar';
// import _ from 'lodash';
// import configuration from '../../../../configuration';
// import message from '../../../../core/msg/calendar';
// import moment from 'moment';
// import styles from './Styles/CalendarScreenStyle';
// import testIDs from '../Components/react-native-calendars/src/testIDs';

// // import { CalendarProvider, WeekCalendar } from 'react-native-calendars';

// LocaleConfig.locales['vn'] = {
//     monthNames: [
//         'Tháng 1 -',
//         'Tháng 2 -',
//         'Tháng 3 -',
//         'Tháng 4 -',
//         'Tháng 5 -',
//         'Tháng 6 -',
//         'Tháng 7 -',
//         'Tháng 8 -',
//         'Tháng 9 -',
//         'Tháng 10 -',
//         'Tháng 11 -',
//         'Tháng 12 -',
//     ],
//     monthNamesShort: [
//         'T.1',
//         'T.2',
//         'T.3',
//         'T.4',
//         'T.5',
//         'T.6',
//         'T.7',
//         'T.8',
//         'T.9',
//         'T.10',
//         'T.11',
//         'T.12',
//     ],
//     dayNames: [' Chủ Nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
//     dayNamesShort: ['C.N', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
//     today: 'Hôm nay',
// };
// const dayNames = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'C.N'];
// const dayNamesEng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// LocaleConfig.defaultLocale = 'vn';
// let cal = new CalendarVietnamese();




// const CalendarScreen = (props) => {
//     const [markedDates, setMarkedDates] = useState({})
//     const [selectedDate, setSelectedDate] = useState({
//         day: moment().date(),
//         month: moment().month() + 1,
//         year: moment().year(),
//         dateString: moment().format('YYYY-MM-DD'),
//     })
//     const [selectedDateWeek, setSelectedDateWeek] = useState({
//         day: moment().date(),
//         month: moment().month() + 1,
//         year: moment().year(),
//         dateString: moment().format('YYYY-MM-DD'),
//     })
//     const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
//     const [listCeremoney, setListCeremoney] = useState([])
//     const [monthSelect, setMonthSelect] = useState(moment().month() + 1,)
//     const [yearSelect, setYearSelect] = useState(moment().year())
//     const [isVisible, setIsVisible] = useState(false)
//     const [pause, setPause] = useState(false)
//     const [key, setKey] = useState('initial')
//     const [currentMonDay, setCurrentMonDay] = useState(null)
//     const [change, setChange] = useState(true)
//     const [showCalendar, setShowCalendar] = useState(false)
//     const [listWeek, setListWeek] = useState([])
//     const [heightValue, setHeightValue] = useState(0)
//     const scrollY = useRef(new Animated.Value(0)).current;
//     const animatedOpacityValue = useRef(new Animated.Value(0)).current;
//     const scrollHeight = useRef(new Animated.Value(0)).current;
//     const opacityCalendar = useRef(new Animated.Value(1)).current;
//     const zIndexAnimate = useRef(new Animated.Value(0)).current;

//     const calendarList = useRef(null)

//     useEffect(() => {
//         getCeremoney(moment().year(), moment().month() + 1, moment().date());
//     }, [])

//     useEffect(() => {
//         getCurrentWeek(new Date());
//         InteractionManager.runAfterInteractions(() => {
//             setShowCalendar(true)
//         });
//     }, [showCalendar])

//     const getCeremoney = (year, monthValue, day) => {
//         let listCeremon = [];
//         cal.fromGregorian(year, monthValue, day);
//         let [, , month, , lunarDay] = cal.get();
//         let cereMap = ceremony.find(element => element.value == day + "/" + monthValue)
//         let cereLunarMap = ceremonyLunar.find(element => element.value == lunarDay + "/" + month)
//         if (cereLunarMap) {
//             listCeremon.push(cereLunarMap);
//         }

//         if (cereMap) {
//             listCeremon.push(cereMap);
//         }
//         setListCeremoney(listCeremon)
//     }

//     const getCurrentWeek = (monday) => {
//         let currentWeek = [];
//         currentWeek.push(moment(getMonday(monday)).format('DD-MM-YYYY'));
//         for (let index = 1; index < 7; index++) {
//             currentWeek.push(moment(getMonday(monday)).add(index, 'days').format('DD-MM-YYYY'))
//         }
//         let listWeekNew = [...listWeek];
//         listWeekNew.push(currentWeek)
//         setListWeek(listWeekNew)
//         setCurrentMonDay(getMonday(monday))
//     }

//     const getMonday = (d) => {
//         d = new Date(d);
//         var day = d.getDay(),
//             diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
//         return new Date(d.setDate(diff));
//     }

//     const goBack = () => {
//         props.navigation.goBack();
//     }

//     const renderDate = (data) => {
//         cal.fromGregorian(data.date.year, data.date.month, data.date.day);
//         let [, , month, , lunarDay] = cal.get();
//         let cloneData = { ...data };
//         cloneData.lunarDay = lunarDay;
//         cloneData.month = month;
//         cloneData.isHoangdao = false;
//         if (cloneData.date.dateString === selectedDate.dateString) {
//             cloneData.state = 'selected';
//         }
//         const chiofDayItem = calculateChiofDay(
//             data.date.year,
//             data.date.month,
//             data.date.day,
//         );


//         if (data.date.month == 3 && data.date.day == 31) { }

//         if (datehoangdao.indexOf(chiofDayItem) > -1) {
//             cloneData.isHoangdao = true;
//         }

//         return <DateItemTest lunarDay={lunarDay} month={month} isHoangdao={cloneData.isHoangdao} date={data.date} state={cloneData.state} onPress={data.onPress} />;
//     }

//     const formatDate = (date) => {
//         var d = new Date(date),
//             month = '' + (d.getMonth() + 1),
//             day = '' + d.getDate(),
//             year = d.getFullYear();

//         if (month.length < 2)
//             month = '0' + month;
//         if (day.length < 2)
//             day = '0' + day;

//         return [month, day, year].join('-');
//     }

//     const renderWeek = ({ item }) => {
//         return (
//             <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
//                 {item.map(e =>
//                     <Text>{moment(e, 'DD-MM-YYYY').format('DD')}</Text>
//                 )}
//             </View>
//         )
//     }

//     const marginDayName = (index) => {
//         switch (index) {
//             case 1:
//                 return 4
//             case 2:
//                 return 6
//             case 4:
//                 return -3
//             default:
//                 return 0
//         }
//     }



//     const marginDayNameEN = (index) => {
//         switch (index) {
//             case 1:
//                 return -7
//             case 2:
//                 return 0
//             case 3:
//                 return -4
//             default:
//                 return 0
//         }
//     }
//     /**
//     * random number from 0 -> max
//     * @param {*} max 
//     */
//     const getRandomInt = max => {
//         return Math.floor(Math.random() * Math.floor(max));
//     };





//     const onSelectedDate = useCallback((day) => {
//         if (day.month !== selectedDate.month) {
//             calendarList.current.scrollToDay(moment(day.dateString).format('YYYY-MM-DD'), 0, false)
//         }
//         setSelectedDate(day)
//         setMonthSelect(day.month)
//         setYearSelect(day.year)
//         getCeremoney(day.year, day.month, day.day)

//         // () => {
//         //     this.setState({ selectedDateWeek: day }, () => {
//         //         this.getCeremoney(day.year, day.month, day.day)
//         //     })

//         // }


//     },[]);

//     const onCeremoney = (list) => {
//         setListCeremoney(list)
//     }

//     const onLichAm = () => {
//         const date = new Date();
//         props.navigation.navigate('TuviScreen', {
//             date: {
//                 year: date.getFullYear(),
//                 month: date.getMonth() + 1,
//                 day: date.getDate(),
//             },
//             amlich: '',
//         });
//     };


//     const modalHandle = () => {
//         setIsVisible(false)
//         setPause(true)
//     }

//     const backToWelcome = () => {
//         setIsVisible(false)
//     }

//     const openModel = () => {
//         setIsVisible(true)
//         setPause(true)
//         setChange(false)
//     }


//     const handleScroll = (event) => {
//         const scrollPosition = event.nativeEvent.contentOffset.y;
//         Animated.event(
//             [{
//                 nativeEvent: {
//                     contentOffset: {
//                         y: scrollHeight
//                     }
//                 }
//             },], {
//             useNativeDriver: true,
//             listener: ({ nativeEvent }) =>
//                 scrollHeight.setValue(nativeEvent.contentOffset.y),
//         }).__getHandler()(event);
//         if (scrollPosition > 60) {
//             Animated.parallel(
//                 // change vertical
//                 Animated.timing(scrollY, {
//                     toValue: 1,
//                     useNativeDriver: true,  // <----- this line
//                     duration: 100
//                 }).start(),
//                 // opacity show week  calendar
//                 Animated.timing(animatedOpacityValue, {
//                     toValue: 1,
//                     useNativeDriver: true,
//                     duration: 50
//                 }).start(),
//                 // opacity hide month calendar
//                 Animated.timing(opacityCalendar, {
//                     toValue: 0.2,
//                     useNativeDriver: true,
//                     duration: 100
//                 }).start())

//         }

//         if (scrollPosition < 150) {
//             Animated.parallel(
//                 Animated.timing(scrollY, {
//                     toValue: -1,
//                     useNativeDriver: true,  // <----- this line
//                 }).start(),
//                 // opacity hide week calendar
//                 Animated.timing(animatedOpacityValue, {
//                     toValue: 0,
//                     duration: 50,
//                     useNativeDriver: true
//                 }).start(),
//                 // opacity show week calendar
//                 Animated.timing(opacityCalendar, {
//                     toValue: 1,
//                     useNativeDriver: true,
//                     duration: 100
//                 }).start(),
//                 // opacity show week calendar
//                 Animated.timing(opacityCalendar, {
//                     toValue: 1,
//                     useNativeDriver: true,
//                     duration: 100
//                 }).start())


//         }
//     }

//     const changeDate = (date) => {
//         calendarList.current.scrollToDay(moment(new Date(date)).format('YYYY-MM-DD'), 1, false)

//         setSelectedDateWeek({
//             day: moment(date).date(),
//             month: moment(date).month() + 1,
//             year: moment(date).year(),
//             dateString: moment(new Date(date)).format('YYYY-MM-DD'),
//             change: true
//         })
//         setMonthSelect(moment(date).month() + 1)
//         setYearSelect(moment(date).year())
//         setChange(false)
//         setIsVisible(false)
//         getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
//         setSelectedDate({
//             day: moment(date).date(),
//             month: moment(date).month() + 1,
//             year: moment(date).year(),
//             dateString: moment(new Date(date)).format('YYYY-MM-DD'),
//         })
//     }

//     const onChuyenDoi = () => {
//         const date = new Date();
//         props.navigation.navigate('ChuyenDoiAmDuong', {
//             date: {
//                 year: date.getFullYear(),
//                 month: date.getMonth() + 1,
//                 day: date.getDate(),
//             },
//             amlich: '',
//         });
//     };

//     const getMonth = () => {

//     };

//     const todaySelect = () => {
//         calendarList.current.scrollToDay(moment().format('YYYY-MM-DD'), 1, false)
//         getCeremoney(moment().year(), moment().month() + 1, moment().date());
//         setSelectedDate({
//             day: moment().date(),
//             month: moment().month() + 1,
//             year: moment().year(),
//             dateString: moment().format('YYYY-MM-DD'),
//         })
//         setMonthSelect(moment().month() + 1)
//         setYearSelect(moment().year())
//         setSelectedDateWeek({
//             day: moment().date(),
//             month: moment().month() + 1,
//             year: moment().year(),
//             dateString: moment().format('YYYY-MM-DD'),
//         })
//     }

//     /**
//      * calculate number week of month
//      * @param {*} month 
//      * @param {*} year 
//      */
//     const week = (month, year) => {
//         var firstOfMonth = new Date(year, month, 1);
//         var lastOfMonth = new Date(year, month + 1, 0);
//         var used = firstOfMonth.getDay() + lastOfMonth.getDate();
//         return Math.ceil(used / 7);
//     }


//     const monthChange = (monthValue) => {
//         let dateString;
//         let dayBefore = parseInt(moment(selectedDate.dateString, 'YYYY-MM-DD').format('DD'), 10);
//         let dayAfter = parseInt(moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD'), 10);
//         //check date select out range of month
//         if (dayBefore <= dayAfter) {
//             // go to date current
//             dateString = monthValue.year + '-'
//                 + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
//                 + moment(selectedDate.dateString, 'YYYY-MM-DD').format('DD');

//         } else {
//             // go to end of month after
//             dateString = monthValue.year + '-'
//                 + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
//                 + moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD');
//         }
//         // // if (moment(monthValue.dateString).month() + 1 !== selectedDate.month) {

//         setMonthSelect(monthValue.month)
//         setYearSelect(monthValue.year)
//         setSelectedDate({
//             day: moment(dateString, 'YYYY-MM-DD').date(),
//             month: moment(monthValue.dateString).month() + 1,
//             year: moment(monthValue.dateString).year(),
//             dateString: moment(dateString).format('YYYY-MM-DD'),

//         });
//         setSelectedDateWeek({
//             day: moment(dateString, 'YYYY-MM-DD').date(),
//             month: moment(monthValue.dateString).month() + 1,
//             year: moment(monthValue.dateString).year(),
//             dateString: moment(dateString).format('YYYY-MM-DD'),

//         })
//         getCeremoney(monthValue.year, monthValue.month, selectedDate.day);
//     }


//     /**
//      * change week on scroll
//      * @param {*} date 
//      */
//     const changeWeek = (date) => {
//         if (moment(date).week() !== moment(selectedDate.dateString).week()) {
//             getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
//             setMonthSelect(moment(date).month() + 1)
//             setYearSelect(moment(date).year())
//             setSelectedDate({
//                 day: moment(date).date(),
//                 month: moment(date).month() + 1,
//                 year: moment(date).year(),
//                 dateString: moment(date).format('YYYY-MM-DD'),
//             });
//             setMarkedDates({ [moment(date).format('YYYY-MM-DD')]: { selected: true } })
//         }

//     }


//     const onVisibleMonthsChange = (monthValue) => {
//         let dateString;
//         if (monthValue) {
//             let dayBefore = parseInt(moment(selectedDate.dateString, 'YYYY-MM-DD').format('DD'), 10);
//             let dayAfter = parseInt(moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD'), 10);
//             //check date select out range of month
//             if (dayBefore <= dayAfter) {
//                 // go to date current
//                 dateString = monthValue.year + '-'
//                     + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
//                     + moment(selectedDate.dateString, 'YYYY-MM-DD').format('DD');

//             } else {
//                 // go to end of month after
//                 dateString = monthValue.year + '-'
//                     + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
//                     + moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD');
//             }
//             // if (moment(monthValue.dateString).month() + 1 !== selectedDate.month) {
//             setMonthSelect(monthValue.month)
//             setYearSelect(monthValue.year)
//             setSelectedDate({
//                 day: moment(dateString, 'YYYY-MM-DD').date(),
//                 month: moment(monthValue.dateString).month() + 1,
//                 year: moment(monthValue.dateString).year(),
//                 dateString: moment(dateString).format('YYYY-MM-DD'),

//             })
//             getCeremoney(monthValue.year, monthValue.month, selectedDate.day);

//         }
//     }

//     const onDateChanged = (date, updateSource) => {
//         if (date) {
//             if (moment(date).week() !== moment(selectedDate.dateString).week()) {
//                 getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
//                 setMonthSelect(moment(date).month() + 1)
//                 setYearSelect(moment(date).year())
//                 setSelectedDate({
//                     day: moment(date).date(),
//                     month: moment(date).month() + 1,
//                     year: moment(date).year(),
//                     dateString: moment(date).format('YYYY-MM-DD'),
//                 })
//                 setSelectedDateWeek({
//                     day: moment(date).date(),
//                     month: moment(date).month() + 1,
//                     year: moment(date).year(),
//                     dateString: moment(date).format('YYYY-MM-DD'),
//                 })
//                 setMarkedDates({ [moment(date).format('YYYY-MM-DD')]: { selected: true } })
//                 if (calendarList) {
//                     calendarList.current.scrollToDay(moment(date).format('YYYY-MM-DD'), 0, false)
//                 }
//             }
//             // fetch and set data for date + week ahead

//         }

//     };
//     const { intl } = props;
//     const { formatMessage } = intl;
//     const { Language } = configuration
//     cal.fromGregorian(
//         selectedDate.year,
//         selectedDate.month,
//         selectedDate.day,
//     );
//     let [, , month,] = cal.get();
//     if (selectedDate.month - 1 === 0) {
//     }
//     const datehoangdao = Language === 'vi' ? hoangdao[month] : hoangdaoEn[month];
//     const chiofDay = calculateChiofDay(
//         selectedDate.year,
//         selectedDate.month,
//         selectedDate.day,
//     );
//     let isHoangdao = false;

//     if (datehoangdao.indexOf(chiofDay) > -1) {
//         isHoangdao = true;
//     }
//     const headerHeight = scrollHeight.interpolate({
//         inputRange: [0, 0],
//         outputRange: [0, 65],
//         extrapolate: 'clamp',

//     })
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={{ flex: 1, position: 'relative' }}>
//                 <Header
//                     formatMessage={formatMessage}
//                     goBack={goBack}
//                     modalHandle={openModel}
//                     dateString={selectedDate.dateString}
//                     todaySelect={todaySelect}
//                     monthSelect={monthSelect ? monthSelect : new Date().getMonth()}
//                     yearSelect={yearSelect ? yearSelect : new Date().getFullYear()}
//                 />
//                 <View style={styles.dayNameContainer}>
//                     {Language === 'vi' ? dayNames.map((e, index) =>
//                         <OpenSansSemiBoldText
//                             style={[{
//                                 marginLeft: marginDayName(index),
//                                 fontSize: 10, color: (index === dayNames.length - 1 ? '#ec373b' : 'black'),
//                                 transform: [{ translateY: -2 }],
//                                 fontWeight: 'bold'
//                             }]}>
//                             {e.toUpperCase()}
//                         </OpenSansSemiBoldText>
//                     ) : dayNamesEng.map((e, index) =>
//                         <OpenSansSemiBoldText
//                             style={[{
//                                 marginLeft: marginDayNameEN(index),
//                                 fontSize: 10, color: (index === dayNames.length - 1 ? '#ec373b' : 'black'),
//                                 transform: [{ translateY: -2 }, { translateX: index === 5 ? 3 : 0 }],
//                                 fontWeight: 'bold'
//                             }]}>
//                             {e.toUpperCase()}
//                         </OpenSansSemiBoldText>
//                     )}
//                 </View>

//                 <Animated.View style={{
//                     backgroundColor: 'transparent', position: 'absolute', justifyContent: 'center',
//                     top: 65, zIndex: 1000,
//                     paddingTop: 12,
//                     height: headerHeight,
//                 }}>
//                     <Animated.View style={{
//                         opacity: animatedOpacityValue,
//                         borderBottomColor: '#f0f0f0f0',
//                         borderBottomWidth: 1,
//                         paddingTop: 1,
//                         translateY: scrollY,
//                         flex: 1
//                     }}>
//                         {/* {showCalendar &&
//                             <CalendarProvider
//                                 date={selectedDate.dateString}
//                                 onDateChanged={onDateChanged}

//                                 markedDates={{
//                                     ...markedDates,
//                                     [selectedDate.dateString]: {
//                                         selected: true,
//                                     },
//                                 }}
//                             >
//                                 <WeekCalendar
//                                     testID={testIDs.weekCalendar.CONTAINER}
//                                     hideDayNames={true}
//                                     firstDay={1}
//                                     dayComponent={renderDateWeek}
//                                     theme={calendarThemes}
//                                     calendarWidth={screenWidth}
//                                     allowShadow={false}
//                                     markedDates={{
//                                         ...markedDates,
//                                         [selectedDate.dateString]: {
//                                             selected: true,
//                                         },
//                                     }}
//                                     pastScrollRange={(new Date().getFullYear() - 1900) * 12}
//                                     futureScrollRange={(2099 - new Date().getFullYear()) * 12}
//                                     style={[styles.calendar, { paddingBottom: 20, paddingLeft: 0, paddingRight: 0 }]}
//                                     // current={selectedDateWeek.dateString}
//                                     onDayPress={(date) => changeDate(date.dateString)}
//                                 // changeWeek={changeWeek}
//                                 />

//                             </CalendarProvider>

//                         } */}


//                     </Animated.View>

//                 </Animated.View >

//                 <Animated.ScrollView
//                     contentInsetAdjustmentBehavior="automatic"
//                     onScroll={handleScroll}
//                     style={{ flex: 1, backgroundColor: '#ffffff' }}
//                     scrollEventThrottle={1}
//                     bounces={true}
//                     bouncesZoom={true}
//                     alwaysBounceVertical={true}
//                     showsVerticalScrollIndicator={false}>
//                     <Animated.View style={{ opacity: opacityCalendar }}>
//                         <CalendarList
//                             ref={calendarList}
//                             renderHeader={() => {
//                                 return (null)
//                             }}
//                             onVisibleMonthsChange={months => {
//                                 getMonth(months);
//                             }}
//                             // key={key}
//                             // onLayout={() => {
//                             //     this.setState({ key: 'ready' });
//                             // }}
//                             dynamicHeight={true}
//                             showSixWeeks={true}
//                             calendarWidth={screenWidth}
//                             hideDayNames={true}
//                             style={[styles.calendar, { padding: 0, flex: 1 }]}
//                             hideExtraDays={false}
//                             hideArrows={true}
//                             horizontal={true}
//                             firstDay={1}
//                             renderArrow={direction => (
//                                 <Arrow direction={direction} />
//                             )}
//                             // onVisibleMonthsChange={this.onVisibleMonthsChange}
//                             calendarHeight={screenHeight / 2.5}
//                             pastScrollRange={(new Date().getFullYear() - 1900) * 12}
//                             futureScrollRange={(2099 - new Date().getFullYear()) * 12}
//                             currentDate={selectedDate.dateString}
//                             dayComponent={renderDate}
//                             pagingEnabled={true}
//                             theme={calendarThemes}
//                             monthChange={monthChange}
//                             onDayPress={onSelectedDate}
//                             markingType={'custom'}
//                             removeClippedSubviews={false}
//                             // markedDates={{
//                             //     ...markedDates,
//                             //     [selectedDate.dateString]: {
//                             //         selected: true,
//                             //     },
//                             // }}
//                         />
//                     </Animated.View>
//                     <View style={styles.borderBottom} />
//                     {/* {showCalendar ? */}
//                     <TuviScreen
//                         formatMessage={formatMessage}
//                         date={selectedDateWeek}
//                         isHoangdao={isHoangdao}
//                         ceremoney={listCeremoney} />
//                     {/* // : <ActivityIndicator color={Colors.drawer}/>} */}
//                     <ConvertModal
//                         backToWelcome={backToWelcome}
//                         isVisible={isVisible}
//                         modalHandle={modalHandle}
//                         changeDate={changeDate}
//                         selectedDate={selectedDate.dateString}
//                         formatMessage={formatMessage}
//                     />
//                 </Animated.ScrollView>
//             </View>
//         </SafeAreaView>
//     )
// }

// CalendarScreen.propTypes = {
//     intl: intlShape.isRequired,
// };

// CalendarScreen.contextTypes = {
//     language: PropTypes.string,
// };
// export default injectIntl(CalendarScreen);
// const calendarThemes = {
//     'stylesheet.day.basic': {
//         'base': {
//             width: 100,
//             height: 100
//         }
//     },
//     backgroundColor: 'transparent',
//     calendarBackground: 'white',
//     textSectionTitleColor: '#000',
//     selectedDayBackgroundColor: 'yellow',
//     selectedDayTextColor: '#ffffff',
//     todayTextColor: '#00adf5',
//     dayTextColor: '#2d4150',
//     textDisabledColor: '#d9e1e8',
//     dotColor: '#00adf5',
//     selectedDotColor: '#ffffff',
//     arrowColor: 'orange',
//     disabledArrowColor: '#d9e1e8',
//     monthTextColor: '#0e67b7',
//     indicatorColor: 'blue',
//     textDayFontWeight: '300',
//     textMonthFontWeight: 'bold',
//     textDayHeaderFontWeight: '400',
//     textDayFontSize: 16,
//     textMonthFontSize: 20,
//     textDayHeaderFontSize: 13,
// };
