import * as PropTypes from 'prop-types';

import {
    Animated,
    Dimensions,
    InteractionManager,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import React, { Component } from 'react';
import {
    calculateChiofDay,
    hoangdao,
    hoangdaoEn,
} from '../Transforms/ConvertToCanchi';
import { ceremony, ceremonyLunar } from '../Fixtures/ceremony';
import { injectIntl, intlShape } from 'react-intl';

import { CalendarChinese } from 'date-chinese';
import CalendarList from '../Components/react-native-calendars/src/calendar-list/index'
import CalendarProvider from '../Components/react-native-calendars/src/expandableCalendar/calendarProvider';
import ConvertModal from '../Components/ConvertModal';
import DateItem from '../Components/DateItem';
import DateItemWeek from '../Components/DateItemWeek';
import Header from '../Components/Header';
import {
    LocaleConfig,
} from 'react-native-calendars';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import TuviScreen from './TuviScreen';
import WeekCalendar from '../Components/react-native-calendars/src/expandableCalendar/weekCalendar';
import _ from 'lodash';
import configuration from '../../../../configuration';
import message from '../../../../core/msg/calendar';
import moment from 'moment';
import { screenWidth } from 'react-native-calendars/src/expandableCalendar/commons';
import styles from './Styles/CalendarScreenStyle';
import testIDs from '../Components/react-native-calendars/src/testIDs';

// import { CalendarProvider, WeekCalendar } from 'react-native-calendars';

LocaleConfig.locales['vn'] = {
    monthNames: [
        'Tháng 1 -',
        'Tháng 2 -',
        'Tháng 3 -',
        'Tháng 4 -',
        'Tháng 5 -',
        'Tháng 6 -',
        'Tháng 7 -',
        'Tháng 8 -',
        'Tháng 9 -',
        'Tháng 10 -',
        'Tháng 11 -',
        'Tháng 12 -',
    ],
    monthNamesShort: [
        'T.1',
        'T.2',
        'T.3',
        'T.4',
        'T.5',
        'T.6',
        'T.7',
        'T.8',
        'T.9',
        'T.10',
        'T.11',
        'T.12',
    ],
    dayNames: [' Chủ Nhật', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    dayNamesShort: ['C.N', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
    today: 'Hôm nay',
};
const dayNames = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'C.N'];
const dayNamesEng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
LocaleConfig.defaultLocale = 'vn';
class CalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.cal = new CalendarChinese();
        this.state = {
            markedDates: {},
            selectedDate: {
                day: moment().date(),
                month: moment().month() + 1,
                year: moment().year(),
                dateString: moment().format('YYYY-MM-DD'),
            },
            markedDatesWeek: {},
            selectedDateWeek: {
                day: moment().date(),
                month: moment().month() + 1,
                year: moment().year(),
                dateString: moment().format('YYYY-MM-DD'),
            },
            date: moment().format('YYYY-MM-DD'),
            listCeremoney: null,
            monthSelect: moment().month() + 1,
            yearSelect: moment().year(),
            isVisible: false,
            pause: false,
            key: 'initial',
            scrollY: new Animated.Value(0),
            scrollHeight: new Animated.Value(0),
            animatedOpacityValue: new Animated.Value(0),
            currentPosition: 0,
            listWeek: [],
            currentMonDay: null,
            change: true,
            showCalendar: false,
            heightValue: 0,
            opacityCalendar: new Animated.Value(1),
            zIndexAnimate: new Animated.Value(0),

        };

    }
    UNSAFE_componentWillMount() {
        this.getCeremoney(moment().year(), moment().month() + 1, moment().date());
    }

    componentDidMount() {
        this.getCurrentWeek(new Date());
        InteractionManager.runAfterInteractions(() => {
            this.setState({ showCalendar: true })
        });
    }

    componentDidUpdate() {
        const { animatedOpacityValue, scrollY, opacityCalendar } = this.state;
        // reset animate


        Animated.timing(opacityCalendar, {
            toValue: 1,
            useNativeDriver: true,
            duration: 100
        }).start()
    }

    /**
     * random number from 0 -> max
     * @param {*} max 
     */
    getRandomInt = max => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    getCeremoney = (year, monthValue, day) => {
        let listCeremon = [];
        this.cal.fromGregorian(year, monthValue, day);
        let [, , month, , lunarDay] = this.cal.get();
        let cereMap = ceremony.find(element => element.value == day + "/" + monthValue)
        let cereLunarMap = ceremonyLunar.find(element => element.value == lunarDay + "/" + month)
        if (cereLunarMap) {
            listCeremon.push(cereLunarMap);
        }

        if (cereMap) {
            listCeremon.push(cereMap);
        }
        this.setState({ listCeremoney: listCeremon })
    }


    getCurrentWeek = (monday) => {
        let currentWeek = [];
        currentWeek.push(moment(this.getMonday(monday)).format('DD-MM-YYYY'));
        for (let index = 1; index < 7; index++) {
            currentWeek.push(moment(this.getMonday(monday)).add(index, 'days').format('DD-MM-YYYY'))
        }
        let listWeek = [...this.state.listWeek];
        listWeek.push(currentWeek)
        this.setState({ listWeek: listWeek, currentMonDay: this.getMonday(monday) })
    }

    renderDate = data => {
        const { Language } = configuration
        this.cal.fromGregorian(data.date.year, data.date.month, data.date.day);
        let [, , month, , lunarDay] = this.cal.get();
        let cloneData = { ...data };
        cloneData.lunarDay = lunarDay;
        cloneData.month = month;
        cloneData.isHoangdao = false;
        if (cloneData.date.dateString === this.state.selectedDate.dateString) {
            cloneData.state = 'selected';
        }

        const chiofDay = calculateChiofDay(
            data.date.year,
            data.date.month,
            data.date.day,
        );
        const datehoangdao = Language === 'vi' ? hoangdao[month] : hoangdaoEn[month];
        if (data.date.month == 3 && data.date.day == 31) {
            // console.log(month);
            // console.log(chiofDay);
            // console.log(datehoangdao);
        }
        if (datehoangdao.indexOf(chiofDay) > -1) {
            cloneData.isHoangdao = true;
        }
        return <DateItem {...cloneData} onCeremoney={this.onCeremoney} />;
    };
    renderDateWeek = data => {
        const { Language } = configuration
        this.cal.fromGregorian(data.date.year, data.date.month, data.date.day);
        let [, , month, , lunarDay] = this.cal.get();
        let cloneData = { ...data };
        cloneData.lunarDay = lunarDay;
        cloneData.month = month;
        cloneData.isHoangdao = false;
        if (cloneData.date.dateString === this.state.selectedDate.dateString) {
            cloneData.state = 'selected';
        }

        const chiofDay = calculateChiofDay(
            data.date.year,
            data.date.month,
            data.date.day,
        );
        const datehoangdao = Language === 'vi' ? hoangdao[month] : hoangdaoEn[month];
        if (datehoangdao.indexOf(chiofDay) > -1) {
            cloneData.isHoangdao = true;
        }
        return <DateItemWeek {...cloneData} onCeremoney={this.onCeremoney} />;
    };

    onSelectedDate = (day) => {
        this.setState({
            selectedDate: day,
            markedDates: { [day.dateString]: { selected: true } },
            monthSelect: day.month,
            yearSelect: day.year,
        }, () => {
            this.setState({ selectedDateWeek: day, markedDatesWeek: { [day.dateString]: { selected: true } }, })
        });
    };
    onCeremoney = (list) => {
        this.setState({ listCeremoney: list })

    }

    onLichAm = () => {
        const date = new Date();
        this.props.navigation.navigate('TuviScreen', {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            },
            amlich: '',
        });
    };

    modalHandle = () => {
        this.setState({ isVisible: false, pause: true })
    }
    backToWelcome = () => {
        this.setState({ isVisible: false })
        // this.props.navigation.goBack();
    }


    openModel = () => {
        this.setState({ isVisible: true, pause: true, change: false })
    }


    handleScroll = (event) => {
        const { animatedOpacityValue, scrollY, opacityCalendar } = this.state;
        const scrollPosition = event.nativeEvent.contentOffset.y;
        Animated.event(
            [{
                nativeEvent: {
                    contentOffset: {
                        y: this.state.scrollHeight
                    }
                }
            },], {
            useNativeDriver: true,
            listener: ({ nativeEvent }) =>
                this.state.scrollHeight.setValue(nativeEvent.contentOffset.y),
        }).__getHandler()(event);
        if (scrollPosition > 60) {
            Animated.parallel(
                // change vertical
                Animated.timing(scrollY, {
                    toValue: 1,
                    useNativeDriver: true,  // <----- this line
                    duration: 100
                }).start(),
                // opacity show week  calendar
                Animated.timing(animatedOpacityValue, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 50
                }).start(),
                // opacity hide month calendar
                Animated.timing(opacityCalendar, {
                    toValue: 0.2,
                    useNativeDriver: true,
                    duration: 100
                }).start())

        }

        if (scrollPosition < 150) {
            Animated.parallel(
                Animated.timing(scrollY, {
                    toValue: -1,
                    useNativeDriver: true,  // <----- this line
                }).start(),
                // opacity hide week calendar
                Animated.timing(animatedOpacityValue, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true
                }).start(),
                // opacity show week calendar
                Animated.timing(opacityCalendar, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 100
                }).start(),
                // opacity show week calendar
                Animated.timing(opacityCalendar, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 100
                }).start())


        }
    }

    changeDate = (date) => {
        console.log('date', date)
        this.setState({
            selectedDateWeek: {
                day: moment(date).date(),
                month: moment(date).month() + 1,
                year: moment(date).year(),
                dateString: moment(new Date(date)).format('YYYY-MM-DD'),
                change: true
            },
            monthSelect: moment(date).month() + 1,
            yearSelect: moment(date).year(),
            change: false

        }, () => {
            this.getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
            this.setState({
                selectedDate: {
                    day: moment(date).date(),
                    month: moment(date).month() + 1,
                    year: moment(date).year(),
                    dateString: moment(new Date(date)).format('YYYY-MM-DD'),
                }
            })
        })
    }

    onChuyenDoi = () => {
        const date = new Date();
        this.props.navigation.navigate('ChuyenDoiAmDuong', {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            },
            amlich: '',
        });
    };
    getMonth = () => {
        // this.monthSelect = months[0].month;
        // let month = months[0].month;
        // let year = months[0].year;
        // let day = months[0].date;
        // const startDay = moment()
        //     .year(year)
        //     .month(month - 1)
        //     .date(day);

        // moment(startDay)
        //     .startOf('month')
        //     .week();
    };

    todaySelect = () => {
        this.getCeremoney(moment().year(), moment().month() + 1, moment().date());
        this.setState({
            selectedDate: {
                day: moment().date(),
                month: moment().month() + 1,
                year: moment().year(),
                dateString: moment().format('YYYY-MM-DD'),
            },
            monthSelect: moment().month() + 1,
            yearSelect: moment().year(),
        }, () => {
            this.setState({
                selectedDateWeek: {
                    day: moment().date(),
                    month: moment().month() + 1,
                    year: moment().year(),
                    dateString: moment().format('YYYY-MM-DD'),
                }
            })
        })
    }
    _onMomentumScrollEnd = ({ nativeEvent }) => {
        this.setState({ currentPosition: nativeEvent.contentOffset.y })
    };
    getMonday = (d) => {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, day, year].join('-');
    }


    renderWeek = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {item.map(e =>
                    <Text>{moment(e, 'DD-MM-YYYY').format('DD')}</Text>
                )}
            </View>
        )
    }

    marginDayName = (index) => {
        switch (index) {
            case 1:
                return 4
            case 2:
                return 6
            case 4:
                return -3
            default:
                return 0
        }
    }

    marginDayNameEN = (index) => {
        switch (index) {
            case 1:
                return -7
            case 2:
                return 0
            case 3:
                return -4
            default:
                return 0
        }
    }

    /**
     * calculate number week of month
     * @param {*} month 
     * @param {*} year 
     */
    week = (month, year) => {
        var firstOfMonth = new Date(year, month, 1);
        var lastOfMonth = new Date(year, month + 1, 0);
        var used = firstOfMonth.getDay() + lastOfMonth.getDate();
        return Math.ceil(used / 7);
    }

    monthChange = (monthValue) => {
        // let dateString;
        // let dayBefore = parseInt(moment(this.state.selectedDate.dateString, 'YYYY-MM-DD').format('DD'), 10);
        // let dayAfter = parseInt(moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD'), 10);
        // //check date select out range of month
        // if (dayBefore <= dayAfter) {
        //     // go to date current
        //     dateString = monthValue.year + '-'
        //         + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
        //         + moment(this.state.selectedDate.dateString, 'YYYY-MM-DD').format('DD');

        // } else {
        //     // go to end of month after
        //     dateString = monthValue.year + '-'
        //         + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
        //         + moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD');
        // }
        // // if (moment(monthValue.dateString).month() + 1 !== this.state.selectedDate.month) {
        // this.setState({
        //     monthSelect: monthValue.month, yearSelect: monthValue.year,
        //     selectedDate: {
        //         day: moment(dateString, 'YYYY-MM-DD').date(),
        //         month: moment(monthValue.dateString).month() + 1,
        //         year: moment(monthValue.dateString).year(),
        //         dateString: moment(dateString).format('YYYY-MM-DD'),

        //     },
        // }, () => {
        //     // get ceremoney of curr date
        //     this.getCeremoney(monthValue.year, monthValue.month, this.state.selectedDate.day);
        //     this.setState({
        //         selectedDateWeek: {
        //             day: moment(dateString, 'YYYY-MM-DD').date(),
        //             month: moment(monthValue.dateString).month() + 1,
        //             year: moment(monthValue.dateString).year(),
        //             dateString: moment(dateString).format('YYYY-MM-DD'),

        //         }
        //     })
        // })
        // }

    }

    /**
     * change week on scroll
     * @param {*} date 
     */
    changeWeek = (date) => {
        if (moment(date).week() !== moment(this.state.selectedDate.dateString).week()) {
            this.getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
            this.setState({
                monthSelect: moment(date).month() + 1, yearSelect: moment(date).year(),
                selectedDate: {
                    day: moment(date).date(),
                    month: moment(date).month() + 1,
                    year: moment(date).year(),
                    dateString: moment(date).format('YYYY-MM-DD'),
                },
                markedDates: { [moment(date).format('YYYY-MM-DD')]: { selected: true } },
            })
        }

    }

    onVisibleMonthsChange = (monthValue) => {
        let dateString;
        if (monthValue) {
            let dayBefore = parseInt(moment(this.state.selectedDate.dateString, 'YYYY-MM-DD').format('DD'), 10);
            let dayAfter = parseInt(moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD'), 10);
            //check date select out range of month
            if (dayBefore <= dayAfter) {
                // go to date current
                dateString = monthValue.year + '-'
                    + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
                    + moment(this.state.selectedDate.dateString, 'YYYY-MM-DD').format('DD');

            } else {
                // go to end of month after
                dateString = monthValue.year + '-'
                    + moment(monthValue.dateString, 'YYYY-MM-DD').format('MM') + '-'
                    + moment(monthValue.dateString, 'YYYY-MM-DD').endOf('month').format('DD');
            }
            // if (moment(monthValue.dateString).month() + 1 !== this.state.selectedDate.month) {
            this.setState({
                monthSelect: monthValue.month, yearSelect: monthValue.year,
                selectedDate: {
                    day: moment(dateString, 'YYYY-MM-DD').date(),
                    month: moment(monthValue.dateString).month() + 1,
                    year: moment(monthValue.dateString).year(),
                    dateString: moment(dateString).format('YYYY-MM-DD'),

                },
            }, () => {
                // get ceremoney of curr date
                this.getCeremoney(monthValue.year, monthValue.month, this.state.selectedDate.day);
                this.setState({
                    selectedDateWeek: {
                        day: moment(dateString, 'YYYY-MM-DD').date(),
                        month: moment(monthValue.dateString).month() + 1,
                        year: moment(monthValue.dateString).year(),
                        dateString: moment(dateString).format('YYYY-MM-DD'),

                    }
                })
            })
        }

        // }

    }
    onMonthChange = (month, updateSource) => {
        console.log('ExpandableCalendarScreen onMonthChange: ', month, updateSource);
    };

    onDateChanged = (date, updateSource) => {
        if (moment(date).week() !== moment(this.state.selectedDate.dateString).week()) {
            this.getCeremoney(moment(date).year(), moment(date).month() + 1, moment(date).date());
            this.setState({
                monthSelect: moment(date).month() + 1, yearSelect: moment(date).year(),
                selectedDate: {
                    day: moment(date).date(),
                    month: moment(date).month() + 1,
                    year: moment(date).year(),
                    dateString: moment(date).format('YYYY-MM-DD'),
                },
                markedDates: { [moment(date).format('YYYY-MM-DD')]: { selected: true } },
            })
        }
        // fetch and set data for date + week ahead
    };

    render() {
        const { intl } = this.props;
        const { formatMessage } = intl;
        const { Language } = configuration
        this.cal.fromGregorian(
            this.state.selectedDate.year,
            this.state.selectedDate.month,
            this.state.selectedDate.day,
        );
        let [, , month,] = this.cal.get();
        if (this.state.selectedDate.month - 1 === 0) {
        }
        const datehoangdao = Language === 'vi' ? hoangdao[month] : hoangdaoEn[month];
        const chiofDay = calculateChiofDay(
            this.state.selectedDate.year,
            this.state.selectedDate.month,
            this.state.selectedDate.day,
        );
        let isHoangdao = false;

        if (datehoangdao.indexOf(chiofDay) > -1) {
            isHoangdao = true;
        }
        const headerHeight = this.state.scrollHeight.interpolate({
            inputRange: [0, 0],
            outputRange: [0, 65],
            extrapolate: 'clamp',

        })


        return (
            <View style={styles.container}>
                <SafeAreaView style={{ flex: 1 }}>

                    <Header
                        formatMessage={formatMessage}
                        goBack={this.goBack}
                        modalHandle={this.openModel}
                        dateString={this.state.selectedDate.dateString}
                        todaySelect={this.todaySelect}
                        monthSelect={this.state.monthSelect ? this.state.monthSelect : new Date().getMonth()}
                        yearSelect={this.state.yearSelect ? this.state.yearSelect : new Date().getFullYear()}
                    />
                    <View style={styles.dayNameContainer}>
                        {Language === 'vi' ? dayNames.map((e, index) =>
                            <OpenSansSemiBoldText
                                style={[{
                                    marginLeft: this.marginDayName(index),
                                    fontSize: 10, color: (index === dayNames.length - 1 ? '#ec373b' : 'black'),
                                    transform: [{ translateY: -2 }]
                                }]}>
                                {e.toUpperCase()}
                            </OpenSansSemiBoldText>
                        ) : dayNamesEng.map((e, index) =>
                            <OpenSansSemiBoldText
                                style={[{
                                    marginLeft: this.marginDayNameEN(index),
                                    fontSize: 10, color: (index === dayNames.length - 1 ? '#ec373b' : 'black'),
                                    transform: [{ translateY: -2 }, { translateX: index === 5 ? 3 : 0 }]
                                }]}>
                                {e.toUpperCase()}
                            </OpenSansSemiBoldText>
                        )}
                    </View>

                    <Animated.View style={{
                        backgroundColor: 'transparent', position: 'absolute', justifyContent: 'center',
                        top: 65, zIndex: 1000,
                        paddingTop: 12,
                        height: headerHeight,
                    }}>
                        <Animated.View style={{
                            opacity: this.state.animatedOpacityValue,
                            borderBottomColor: '#f0f0f0f0',
                            borderBottomWidth: 1,
                            paddingTop: 1,
                            translateY: this.state.scrollY,
                            flex: 1
                        }}>
                            {/* {this.state.showCalendar && */}
                            <CalendarProvider
                                date={this.state.selectedDateWeek.dateString}
                                onDateChanged={this.onDateChanged}
                                onMonthChange={this.onMonthChange}

                            >
                                <WeekCalendar
                                    testID={testIDs.weekCalendar.CONTAINER}
                                    hideDayNames={true}
                                    firstDay={1}
                                    dayComponent={this.renderDateWeek}
                                    theme={calendarThemes}
                                    calendarWidth={screenWidth}
                                    allowShadow={false}
                                    markedDates={{
                                        ...this.state.markedDatesWeek,
                                        [this.state.selectedDateWeek.dateString]: {
                                            selected: true,
                                        },
                                    }}
                                    pastScrollRange={(new Date().getFullYear() - 1900) * 12}
                                    futureScrollRange={(2099 - new Date().getFullYear()) * 12}
                                    style={[styles.calendar, { paddingBottom: 20, paddingLeft: 0, paddingRight: 0 }]}
                                    // current={this.state.selectedDateWeek.dateString}
                                    onDayPress={(date) => this.changeDate(date.dateString)}
                                    changeWeek={this.changeWeek}
                                />

                            </CalendarProvider>

                            {/* } */}


                        </Animated.View>

                    </Animated.View >

                    <Animated.ScrollView
                        ref={ref => this.scrollViewAnimate = ref}
                        contentInsetAdjustmentBehavior="automatic"
                        onScroll={this.handleScroll}
                        style={{ flex: 1, backgroundColor: '#ffffff' }}
                        scrollEventThrottle={1}
                        bounces={true}
                        bouncesZoom={true}
                        alwaysBounceVertical={true}
                        showsVerticalScrollIndicator={false}>
                        <Animated.View style={{ opacity: this.state.opacityCalendar }}>
                            <CalendarList
                                renderHeader={() => {
                                    return (null)
                                }}
                                onVisibleMonthsChange={months => {
                                    this.getMonth(months);
                                }}
                                key={this.state.key}
                                onLayout={() => {
                                    this.setState({ key: 'ready' });
                                }}
                                calendarWidth={screenWidth}
                                hideDayNames={true}
                                style={[styles.calendar, { padding: 0, flex: 1 }]}
                                hideExtraDays={false}
                                hideArrows={true}
                                horizontal={true}
                                firstDay={1}
                                renderArrow={direction => (
                                    <Arrow direction={direction} />
                                )}
                                onVisibleMonthsChange={this.onVisibleMonthsChange}
                                calendarHeight={'auto'}
                                pastScrollRange={(new Date().getFullYear() - 1900) * 12}
                                futureScrollRange={(2099 - new Date().getFullYear()) * 12}
                                current={this.state.selectedDate.dateString}
                                dayComponent={this.renderDate}
                                pagingEnabled={true}
                                theme={calendarThemes}
                                monthChange={this.monthChange}
                                onDayPress={this.onSelectedDate}
                                markingType={'custom'}
                                markedDates={{
                                    ...this.state.markedDates,
                                    [this.state.selectedDate.dateString]: {
                                        selected: true,
                                    },
                                }}
                            />
                        </Animated.View>
                        <View style={styles.borderBottom} />
                        <TuviScreen formatMessage={formatMessage} date={this.state.selectedDate} isHoangdao={isHoangdao} ceremoney={this.state.listCeremoney} />
                        <ConvertModal
                            backToWelcome={this.backToWelcome}
                            isVisible={this.state.isVisible}
                            modalHandle={this.modalHandle}
                            changeDate={this.changeDate}
                            selectedDate={this.state.selectedDate.dateString}
                            formatMessage={formatMessage}
                        />
                    </Animated.ScrollView>
                </SafeAreaView>
            </View >
        );
    }
}
CalendarScreen.propTypes = {
    intl: intlShape.isRequired,
};

CalendarScreen.contextTypes = {
    language: PropTypes.string,
};
export default injectIntl(CalendarScreen);
const calendarThemes = {
    'stylesheet.day.basic': {
        'base': {
            width: 100,
            height: 100
        }
    },
    backgroundColor: 'transparent',
    calendarBackground: 'white',
    textSectionTitleColor: '#000',
    selectedDayBackgroundColor: 'yellow',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: '#0e67b7',
    indicatorColor: 'blue',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '400',
    textDayFontSize: 16,
    textMonthFontSize: 20,
    textDayHeaderFontSize: 13,
};
