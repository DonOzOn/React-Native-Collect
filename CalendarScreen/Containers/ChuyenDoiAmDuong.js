import "moment/min/locales";
import 'moment/locale/vi';

import {
    Dimensions,
    Platform,
    SafeAreaView,
    View,
} from 'react-native';
import {
    INT,
    convertLunar2Solar,
    convertSolar2Lunar,
    getLeapMonthOffset,
    getLunarMonth11,
    getNewMoonDay,
    jdFromDate,
} from '../Transforms/ConvertToCanchi';
import React, { Component } from 'react';

import { CalendarChinese } from 'date-chinese';
import CalendarItem from '../Components/CalendarItem';
import CalendarItemDay from '../Components/CalendarItemDay';
import Carousel from 'react-native-snap-carousel';
import configuration from '../../../../configuration';
import moment from 'moment';
import month from '../Fixtures/month.json';
import styles from './Styles/TuviScreenStyle';

// import AppHeader from '../../AppHeader';
const { width, height } = Dimensions.get('window');

class ChuyenDoiAmDuong extends Component {
    constructor(props) {
        super(props);
        this.cal = new CalendarChinese();
        this.mode = 'duong';
        this.year = [];
        this.day = [];
        this.dayLunar = [];
        this.monthLunar = [];
        this.generateYear(moment().year());

        for (let index = 1; index <= moment().daysInMonth(); index++) {
            this.day.push({
                value: index,
                label: index,
            });
        }

        this.generateLunarDay(moment().month(), moment().year());
        this.generateLunarMonth(moment().year());

        this.state = {
            markedDates: {},
            selectedDate: {
                day: moment(this.props.selectedDate).date(),
                month: moment(this.props.selectedDate).month() + 1,
                year: moment(this.props.selectedDate).year(),
                dateString: moment(this.props.selectedDate).format('YYYY-MM-DD'),
            },
            date: moment(this.props.selectedDate).toDate(),
            solarDayClick: false,
            showHideDropDown: [false, false, false],
            show: false,
            dayIndex: this.day.findIndex(
                item => item.value === moment(this.props.selectedDate).date(),
            ),
            dayLunarIndex: 0,
            lunarMonth: 0,
            lunarYear: 0,
            monthLunar: this.monthLunar,
            monthIndex: month.findIndex(
                item => item.value === moment(this.props.selectedDate).month(),
            ),
            yearIndex: this.year.findIndex(
                item => item.value === moment(this.props.selectedDate).year(),
            ),
            monthLunarIndex: this.monthLunar.findIndex(
                item => item.value === moment(this.props.selectedDate).month(),
            ),
            yearLunarIndex: this.year.findIndex(
                item => item.value === moment(this.props.selectedDate).year(),
            ),
        };
    }

    getNumberOfDayInLunarMonth = (month, year) => {
        const offFromDate = jdFromDate(2, month, year) - 2415021;
        const kfrom = INT(offFromDate / 29.530588853);
        const juliussoc = getNewMoonDay(kfrom, 7);
        const offToDate = jdFromDate(2, month + 1, year) - 2415021;
        const kToDate = INT(offToDate / 29.530588853);
        const juliusNor = getNewMoonDay(kToDate, 7);
        return juliusNor - juliussoc;
    };

    generateYear = () => {
        for (let index = 1900; index < 2100; index++) {
            this.year.push({
                value: index,
                label: index,
            });
        }
    };

    generateLunarMonth = year => {
        for (let index = 1; index < 13; index++) {
            this.monthLunar.push({
                value: index,
                label: 'Tháng ' + index,
                isLeap: false,
            });
        }

        if (this.isNhuanYear(year)) {
            const nhuanMonth = this.getNhuanMonth(year);
            this.monthLunar.splice(nhuanMonth - 1, 0, {
                value: nhuanMonth,
                label: `Tháng ${nhuanMonth - 1} +`,
                isLeap: true,
            });
        }
    };

    generateLunarDay = (month, year) => {
        const dayinMonth = this.getNumberOfDayInLunarMonth(month, year);

        if (dayinMonth > this.dayLunar.length) {
            for (
                let index = this.dayLunar.length + 1;
                index <= dayinMonth;
                index++
            ) {
                this.dayLunar.push({
                    value: index,
                    label: index,
                });
            }
        } else {
            for (
                let index = this.dayLunar.length - 1;
                index >= dayinMonth;
                index--
            ) {
                this.dayLunar.splice(index, 1);
            }
        }
    };

    isNhuanYear = year => {
        const remain = year % 19;
        switch (remain) {
            case 0:
                return true;
            case 3:
                return true;
            case 6:
                return true;
            case 9:
                return true;
            case 11:
                return true;
            case 14:
                return true;
            case 17:
                return true;
            default:
                return false;
        }
    };

    getNhuanMonth = year => {
        const monthDongchi = getLunarMonth11(year - 1, 7);
        const nhuanYear = getLeapMonthOffset(monthDongchi, 7);
        return nhuanYear - 1;
    };
    componentWillMount() {
        // this.toLichAm(
        //     this.state.dayIndex,
        //     this.state.monthIndex,
        //     this.state.yearIndex,
        // );
    }
    componentDidMount() {
        this.toLichAm(
            this.state.dayIndex,
            this.state.monthIndex,
            this.state.yearIndex,
        );


    }
    onSolarDay = () => {
        this.setState({ show: true });
    };
    onEnableScroll = value => {
        this.setState({
            enableScrollViewScroll: value,
        });
    };

    notif = (value, index) => {
        const arr = [false, false, false];
        arr[index] = value;
        this.setState({
            showHideDropDown: arr,
        });
    };

    convertDate = fromDate => {
        const date = moment(fromDate);
        const selectedDate = { ...this.state.selectedDate };
        selectedDate.day = date.date();
        selectedDate.month = date.month() + 1;
        selectedDate.year = date.year();
        selectedDate.dateString = date.format('YYYY-MM-DD');
        return selectedDate;
    };

    // onIosSelectedDate = () => {
    //     const selectedDate = this.convertDate(this.state.date);
    //     this.setState({selectedDate, show: false}, () => {
    //         this.toLichAm();
    //     });
    // };

    selectDay = (event, obj) => {
        if (Platform.OS === 'android') {
            const selectedDate = this.convertDate(obj);
            this.setState({ selectedDate, show: false, date: obj }, () => {
                this.toLichAm();
            });
        } else {
            this.setState({ date: obj });
        }
        // if (obj.check == 'day') {
        //     selectedDate.day = obj.value;
        //     this.setState({selectedDate});
        // }
        // if (obj.check == 'month') {
        //     selectedDate.month = obj.value;
        //     const dayinMonth = moment(
        //         `${obj.value}-${selectedDate.year}`,
        //         'MM-YYYY',
        //     ).daysInMonth();
        //     if (selectedDate.day > dayinMonth) {
        //         selectedDate.day = dayinMonth;
        //     }
        //     this.setState({selectedDate});
        // }
        // if (obj.check == 'year') {
        //     selectedDate.year = obj.value;
        //     const dayinMonth = moment(
        //         `${selectedDate.month}-${obj.value}`,
        //         'MM-YYYY',
        //     ).daysInMonth();
        //     if (selectedDate.day > dayinMonth) {
        //         selectedDate.day = dayinMonth;
        //     }
        //     this.setState({selectedDate});
        // }
    };

    toLichAm = (dayIndex, monthIndex, yearIndex, objectState) => {
        const lunar = convertSolar2Lunar(
            this.day[
                dayIndex > this.day.length - 1 ? this.day.length - 1 : dayIndex
            ].value,
            month[monthIndex].value + 1,
            this.year[yearIndex].value,
            7,
        );
        this.afterSelectYearLunarCallback(
            this.year.findIndex(item => item.value === lunar[2]),
        );
        this.afterSelectMonthLunarCallback(
            this.monthLunar.findIndex(item => item.value === lunar[1]),
        );

        this.setState({
            ...objectState,
            dayLunarIndex: this.dayLunar.findIndex(
                item => item.value === lunar[0],
            ),
            monthLunarIndex: this.monthLunar.findIndex(
                item => item.value === lunar[1],
            ),
            yearLunarIndex: this.year.findIndex(
                item => item.value === lunar[2],
            ),
        });
    };

    toLichDuong = (dayIndex, monthIndex, yearIndex, objectState) => {
        const date = convertLunar2Solar(
            this.dayLunar[
                dayIndex > this.day.length - 1 ? this.day.length - 1 : dayIndex
            ].value,
            this.monthLunar[monthIndex].isLeap
                ? this.monthLunar[monthIndex].value - 1
                : this.monthLunar[monthIndex].value,
            this.year[yearIndex].value,
            this.monthLunar[monthIndex].isLeap,
            7,
        );
        this.afterSelectMonthCallback(
            month.findIndex(item => item.value === date[1] - 1),
        );
        this.setState({
            ...objectState,
            dayIndex: this.day.findIndex(item => item.value === date[0]),
            monthIndex: month.findIndex(item => item.value === date[1] - 1),
            yearIndex: this.year.findIndex(item => item.value === date[2]),
        });
    };

    _renderItem = ({ item, index }) => {
        return <CalendarItem index={index} {...item} />;
    };
    _renderItemMonth = ({ item, index }) => {
        return <CalendarItem index={index} {...item} month={true} currentIndexMonth={this.state.monthIndex} />;
    };

    _renderItemMonthLunar = ({ item, index }) => {
        return <CalendarItem index={index} {...item} month={true} currentIndexMonth={this.state.monthLunarIndex} />;
    };
    _renderItemYearLunar = ({ item, index }) => {
        return <CalendarItem index={index} {...item} year={true} currentIndexYear={this.state.yearLunarIndex} />;
    };

    _renderItemYear = ({ item, index }) => {
        return <CalendarItem index={index} {...item} year={true} currentIndexYear={this.state.yearIndex} />;
    };
    _renderItemDay = ({ item, index }) => {
        const { Language } = configuration;
        if (Language === 'vi') {
            moment.locale('vi')
        } else {
            moment.locale('en')
        }
        let dayName = this.toUpper(
            moment(
                `${this.year[this.state.yearIndex].value
                }-${month[this.state.monthIndex].value +
                1}-${this.day[index].value}`, 'YYYY-MM-DD'
            ).format('dddd')
        );


        return <CalendarItemDay index={index} {...item} currentDayIndex={this.state.dayIndex} dayname={dayName} />;
    };
    _renderItemDayLunar = ({ item, index }) => {
        const { Language } = configuration;
        if (Language === 'vi') {
            moment.locale('vi')
        } else {
            moment.locale('en')
        }
        let dayName = this.toUpper(
            moment(
                `${this.year[this.state.yearIndex].value
                }-${month[this.state.monthIndex].value +
                1}-${this.day[index > this.day.length - 1 ? this.day.length - 1 : index].value}`, 'YYYY-MM-DD'
            ).format('dddd')
        );
        return <CalendarItemDay index={index} {...item} currentDayIndex={this.state.dayLunarIndex} dayname={dayName} />;
    };

    getItemLayout = (data, index) => ({ length: height / 22.5, offset: height / 22.5 * index, index });

    afterSelectMonthCallback = monthIndex => {
        const dayinMonth = moment(
            `${this.year[this.state.yearIndex].value}-${month[monthIndex]
                .value + 1}`,
            'YYYY-MM',
        ).daysInMonth();

        if (dayinMonth > this.day.length) {
            for (
                let index = this.day.length + 1;
                index <= dayinMonth;
                index++
            ) {
                this.day.push({
                    value: index,
                    label: index,
                });
            }
        } else {
            for (
                let index = this.day.length - 1;
                index >= dayinMonth;
                index--
            ) {
                this.day.splice(index, 1);
            }
        }
    };

    afterSelectMonthLunarCallback = monthIndex => {
        this.generateLunarDay(
            this.monthLunar[monthIndex].value,
            this.year[this.state.yearLunarIndex].value,
        );
    };

    reset = () => {
        const { activeSwitch } = this.props;
        if (activeSwitch === 1) {
            this.carouselYearDuong.snapToItem(this.year.findIndex(
                item => item.value === moment().year(),
            ), true, true)
            this.carouselMonthDuong.snapToItem(month.findIndex(
                item => item.value == moment().month(),
            ), true, true)
            this.carouselDayDuong.snapToItem(this.day.findIndex(
                item => item.value === moment().date(),
            ), true, true)
            this.toLichAm(
                this.state.dayIndex,
                this.state.monthIndex,
                this.state.yearIndex,
            );
        } else {
            const lunar = convertSolar2Lunar(
                this.day[
                    this.day.findIndex(
                        item => item.value === moment().date())
                ].value,
                month[month.findIndex(
                    item => item.value === moment().month()
                )].value + 1,
                this.year[this.year.findIndex(
                    item => item.value === moment().year(),
                )].value,
                7,
            );
            this.carouselYearLunar.snapToItem(this.year.findIndex(
                item => item.value === lunar[2],
            ), true, true)
            this.carouselMonthLunar.snapToItem(this.monthLunar.findIndex(
                item => item.value === lunar[1],
            ), true, true)

            this.carouselDayLunar.snapToItem(this.dayLunar.findIndex(
                item => item.value === lunar[0],
            ), true, true)
        }

    }

    select = () => {
        let date = moment(
            `${this.year[this.state.yearIndex].value
            }-${month[this.state.monthIndex].value +
            1}-${this.day[this.state.dayIndex].value
            }`, 'YYYY-MM-DD'
        ).format('YYYY-MM-DD');
        this.toLichAm(
            this.state.dayIndex,
            this.state.monthIndex,
            this.state.yearIndex,
        );
        this.props.selectDate(date);
    }

    afterSelectYearCallback = yearIndex => {
        const dayinMonth = moment(
            `${this.year[yearIndex].value}-${month[this.state.monthIndex]
                .value + 1}`,
            'YYYY-MM',
        ).daysInMonth();

        if (dayinMonth > this.day.length) {
            for (
                let index = this.day.length + 1;
                index <= dayinMonth;
                index++
            ) {
                this.day.push({
                    value: index,
                    label: index,
                });
            }
        } else {
            for (
                let index = this.day.length - 1;
                index >= dayinMonth;
                index--
            ) {
                this.day.splice(index, 1);
            }
        }
    };

    afterSelectYearLunarCallback = yearIndex => {
        this.monthLunar = [];
        this.generateLunarMonth(this.year[yearIndex].value);
    };
    toUpper = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => {
                return word[0].toUpperCase() + word.substr(1);
            })
            .join(' ');
    }
    onScrollEnd = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
    }
    render() {
        const { activeSwitch } = this.props;
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    width: '100%',

                }}>

                {activeSwitch === 1 ? <View style={styles.calendarCont}>
                    <View
                        style={{
                            // borderTopWidth: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',


                        }}>
                        <View style={styles.hoverTop} />
                        <Carousel
                            activeSlideOffset={2}
                            inactiveSlideShift={2}
                            swipeThreshold={400}
                            layout="default"
                            sliderWidth={width / 3}
                            ref={ref => (this.carouselDayDuong = ref)}
                            data={this.day}
                            sliderHeight={(height / 22.5) * 5}
                            // itemWidth={20}
                            itemHeight={height / 22.5}
                            vertical
                            enableMomentum={true}
                            bounces={true}
                            firstItem={this.state.dayIndex}
                            shouldOptimizeUpdates
                            nestedScrollEnabled={true}
                            inactiveSlideOpacity={0.5}
                            initialNumToRender={5}
                            slideStyle={{
                                alignItems: 'center'
                                , justifyContent: 'center',
                                marginLeft: -12

                            }}
                            getItemLayout={this.getItemLayout}
                            maxToRenderPerBatch={5}
                            renderItem={this._renderItemDay}
                            updateCellsBatchingPeriod={0}
                            onBeforeSnapToItem={index => {
                                this.toLichAm(
                                    index,
                                    this.state.monthIndex,
                                    this.state.yearIndex,
                                    { dayIndex: index },
                                );
                            }}

                        />
                        <View style={styles.hoverCenter} />

                        <Carousel
                            layout="default"
                            ref={ref => (this.carouselMonthDuong = ref)}
                            data={month}
                            sliderHeight={(height / 22.5) * 5}
                            itemHeight={height / 22.5}
                            vertical
                            onEndReachedThreshold={0.5}
                            inactiveSlideOpacity={0.5}
                            firstItem={this.state.monthIndex}
                            shouldOptimizeUpdates
                            updateCellsBatchingPeriod={0}
                            getItemLayout={this.getItemLayout}
                            nestedScrollEnabled={true}
                            initialNumToRender={5}
                            slideStyle={{ alignItems: 'center', justifyContent: 'center', paddingRight: width / 17 }}
                            maxToRenderPerBatch={5}
                            activeSlideOffset={2}
                            enableMomentum={true}
                            bounces={true}
                            enableSnap={true}
                            renderItem={this._renderItemMonth}
                            onBeforeSnapToItem={index => {
                                this.afterSelectMonthCallback(index);
                                this.toLichAm(
                                    this.state.dayIndex,
                                    index,
                                    this.state.yearIndex,
                                    { monthIndex: index },
                                );
                            }}
                        />
                        <Carousel
                            layout="default"
                            ref={ref => (this.carouselYearDuong = ref)}
                            data={this.year}
                            sliderHeight={height / 22.5 * 5}
                            swipeThreshold={400}
                            itemHeight={height / 22.5}
                            shouldOptimizeUpdates
                            getItemLayout={this.getItemLayout}
                            vertical
                            activeSlideOffset={2}
                            inactiveSlideOpacity={0.5}
                            enableMomentum={true}
                            initialNumToRender={5}
                            nestedScrollEnabled={true}
                            updateCellsBatchingPeriod={0}
                            maxToRenderPerBatch={5}
                            firstItem={this.state.yearIndex}
                            slideStyle={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: width / 20 }}
                            renderItem={this._renderItemYear}
                            onBeforeSnapToItem={index => {
                                this.afterSelectYearCallback(index);
                                this.toLichAm(
                                    this.state.dayIndex,
                                    this.state.monthIndex,
                                    index,
                                    { yearIndex: index },
                                );
                            }}
                        />
                        <View style={styles.hoverBottom} />

                        <View style={styles.centerView} />
                    </View>
                </View> : <View style={styles.calendarCont}>
                        <View
                            style={{
                                flexDirection: 'row',
                                // padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                            <View style={styles.hoverTop} />
                            <Carousel
                                layout="default"
                                ref={ref => (this.carouselDayLunar = ref)}
                                data={this.dayLunar}
                                sliderHeight={(height / 22.5) * 5}
                                // itemWidth={20}
                                itemHeight={height / 22.5}
                                swipeThreshold={400}
                                vertical
                                activeSlideOffset={2}
                                updateCellsBatchingPeriod={0}
                                nestedScrollEnabled={true}
                                initialNumToRender={5}
                                slideStyle={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: -13
                                }}
                                getItemLayout={this.getItemLayout}
                                enableMomentum={true}
                                inactiveSlideOpacity={0.5}
                                maxToRenderPerBatch={5}
                                firstItem={this.state.dayLunarIndex}
                                shouldOptimizeUpdates
                                renderItem={this._renderItemDayLunar}
                                onBeforeSnapToItem={index =>
                                    this.toLichDuong(
                                        index,
                                        this.state.monthLunarIndex,
                                        this.state.yearLunarIndex,
                                        { dayLunarIndex: index },
                                    )
                                }
                            />
                            <View style={styles.hoverCenter} />

                            <Carousel
                                layout="default"
                                ref={ref => (this.carouselMonthLunar = ref)}
                                data={this.monthLunar}
                                sliderHeight={(height / 22.5) * 5}
                                swipeThreshold={400}
                                itemHeight={height / 22.5}
                                vertical
                                activeSlideOffset={2}
                                getItemLayout={this.getItemLayout}
                                enableMomentum={true}
                                inactiveSlideOpacity={0.5}
                                updateCellsBatchingPeriod={0}
                                firstItem={this.state.monthLunarIndex}
                                shouldOptimizeUpdates
                                nestedScrollEnabled={true}
                                initialNumToRender={5}
                                maxToRenderPerBatch={5}
                                slideStyle={{
                                    alignItems: 'center', justifyContent: 'center'
                                    , paddingRight: width / 17
                                }}
                                renderItem={this._renderItemMonthLunar}
                                onBeforeSnapToItem={index => {
                                    this.afterSelectMonthLunarCallback(index);
                                    this.toLichDuong(
                                        this.state.dayLunarIndex,
                                        index,
                                        this.state.yearLunarIndex,
                                        { monthLunarIndex: index },
                                    );
                                }}
                            />
                            <Carousel
                                layout="default"
                                activeSlideOffset={2}
                                ref={ref => (this.carouselYearLunar = ref)}
                                data={this.year}
                                nestedScrollEnabled={true}
                                sliderHeight={(height / 22.5) * 5}
                                swipeThreshold={400}
                                itemHeight={height / 22.5}
                                inactiveSlideOpacity={0.5}
                                getItemLayout={this.getItemLayout}
                                vertical
                                enableMomentum={true}
                                firstItem={this.state.yearLunarIndex}
                                updateCellsBatchingPeriod={0}
                                shouldOptimizeUpdates
                                renderItem={this._renderItemYearLunar}
                                initialNumToRender={5}
                                maxToRenderPerBatch={5}
                                slideStyle={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: width / 20 }}
                                onBeforeSnapToItem={index => {
                                    this.afterSelectYearLunarCallback(index);
                                    this.toLichDuong(
                                        this.state.dayLunarIndex,
                                        this.state.monthLunarIndex,
                                        index,
                                        { yearLunarIndex: index },
                                    );
                                }}
                            />
                            <View style={styles.hoverBottom} />

                            <View style={styles.centerView} />
                        </View>
                    </View>}

            </SafeAreaView>
        );
    }
}

export default ChuyenDoiAmDuong;
