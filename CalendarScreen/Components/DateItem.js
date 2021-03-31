import { Animated, Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import React, { Component, PureComponent } from 'react';
import { ceremony, ceremonyHightLight, ceremonyLunar, ceremonyLunarHightLight } from '../Fixtures/ceremony';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import colors from '../Themes/Colors';
import memoize from "memoizee";
import moment from 'moment';
import styles from './Styles/DateItemStyle';

// import PropTypes from 'prop-types';

// import {Colors} from 'react-native/Libraries/NewAppScreen'

const DAY_HEIGHT = 35;
const { width, height } = Dimensions.get('window');
export default class DateItem extends Component {

    constructor(props) {
        super(props);
        const now = moment()
            .year(this.props.date.year)
            .month(this.props.date.month - 1)
            .date(this.props.date.day);
        this.isSunday = now.isoWeekday() == 7;
        this.state = {
            checkBg: false,
            opacityBackground: new Animated.Value(0),
            textColor: new Animated.Value(0),
            lunarTextColor: new Animated.Value(0)
        }
    }

    componentDidMount() {
        if (this.props.state == 'selected') {
            this.startAnimation()
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state == 'selected' && (this.props.state == '' || this.props.state == 'today')) {

            setTimeout(this.startAnimation, 0)

        }

        if (nextProps.showZodiacDay !== this.props.showZodiacDay) {
            return true
        }
        if (nextProps.listEventPrivate !== this.props.listEventPrivate) {
            return true
        }
        if (this.props.state !== nextProps.state && (nextProps.state == '' || nextProps.state == 'today')) {
            setTimeout(this.fadeOutAnimation, 0)

        }

        return this.props.state !== nextProps.state

    }

    onCeremoney = (list) => {
        this.props.onCeremoney(list);
    }


    cereDay = (date) => {
        return ceremony.find(element => element.value == date.day + "/" + date.month)
    }

    cereDayLunar = (lunarDay) => {
        return ceremonyLunar.find(element => element.value == lunarDay + "/" + this.props.month)
    }

    cereDayHLLunar = (lunarDay) => {
        return ceremonyLunarHightLight.find(element => element.value == lunarDay + "/" + this.props.month)
    }

    cereDayHLDay = (date) => {
        return ceremonyHightLight.find(element => element.value == date.day + "/" + date.month)
    }

    eventPrivate = (date) => {
        const mapEvent = this.props.listEventPrivate.find(element => moment(element.event_date, 'YYYY-MM-DD').format('DD/MM/YYYY') == moment(date.year + "-" + date.month + "-" + date.day, 'YYYY-MM-DD').format('DD/MM/YYYY'));
        if (mapEvent) {
            let newObj = {
                value: moment(mapEvent.event_date).format('DD/MM/YYYY'),
                label: mapEvent.event_name,
                labelEN: mapEvent.event_name,
                private: true
            }
            if (mapEvent.type_event) {
                newObj['lunar'] = true
            }
            return newObj;
        }

        return null;

    }


    memoCereDay = memoize(this.cereDay)

    memoCereDayLunar = memoize(this.cereDayLunar)

    memoCereHLDay = memoize(this.cereDayHLDay)

    memoCereHLLunar = memoize(this.cereDayHLLunar)
    memoEventPrivate = memoize(this.eventPrivate)



    startAnimation = () => {
        Animated.parallel([
            Animated.timing(this.state.opacityBackground, {
                toValue: 150,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.textColor, {
                toValue: 150,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.lunarTextColor, {
                toValue: 150,
                duration: 500,
                useNativeDriver: false
            })
        ]).start()
    }

    fadeOutAnimation = () => {

        Animated.parallel([
            Animated.timing(this.state.opacityBackground, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.textColor, {
                toValue: this.checkDayTextColorSolar() ? 200 : this.props.state == 'today' ? 100 : 0,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(this.state.lunarTextColor, {
                toValue: this.checkDayTextColorLunar() ? 200 : 0,
                duration: 500,
                useNativeDriver: false
            })
        ]).start()
    }

    checkDayTextColorSolar = () => {
        const cereLunarHLMap = this.memoCereHLLunar(this.props.lunarDay)
        const cereHLMap = this.memoCereHLDay(this.props.date)
        let state = this.props.state
        return this.isSunday &&
            state != 'selected' &&
            state != 'disabled' ||
            cereHLMap && state != 'selected' &&
            state != 'disabled' ||
            cereLunarHLMap && state != 'selected' &&
            state != 'disabled'
    }

    checkDayTextColorLunar = () => {
        const cereLunarHLMap = this.memoCereHLLunar(this.props.lunarDay)
        const cereHLMap = this.memoCereHLDay(this.props.date)
        const state = this.props.state

        return (this.props.lunarDay == 1 || this.props.lunarDay == 15 ||
            (this.isSunday && state != 'selected' && state != 'disabled'))
            || cereHLMap && state != 'selected' &&
            state != 'disabled' ||
            cereLunarHLMap && state != 'selected' &&
            state != 'disabled'
    }

    render() {
        const { date, state, onPress, prevDay, lunarDay, month, showZodiacDay, isHoangdao, isHacdao } = this.props;
        let color = this.state.textColor.interpolate({
            inputRange: [0, 100, 150, 200],
            outputRange: ['rgb(0,0,0)', 'rgb(1, 92, 208)', 'rgb(255,255,255)', 'rgb(236, 55, 59)']
        })
        let dotColor = { backgroundColor: '#fb0e0e' };
        if (isHacdao)
            dotColor = { backgroundColor: '#a2a2a2' };
        if (isHoangdao)
            dotColor = { backgroundColor: '#fb0e0e' };
        switch (state) {
            case 'disabled':
                color = colors.steel;
                break;

        }


        const listCeremon = [];
        const listEvent = [];
        let isLunarDay = false;
        const cereMap = this.memoCereDay(date)
        const cereLunarMap = this.memoCereDayLunar(lunarDay)
        const cereLunarHLMap = this.memoCereHLLunar(lunarDay)
        const cereHLMap = this.memoCereHLDay(date)
        const eventPrivateMap = this.memoEventPrivate(date)

        if (cereLunarMap) {
            listCeremon.push(cereLunarMap);
        }
        if (cereMap) {
            listCeremon.push(cereMap);
        }
        if (eventPrivateMap) {
            listEvent.push(eventPrivateMap);
        }
        if (lunarDay === 1 || lunarDay === 15) {
            isLunarDay = true
        }

        const colorInterpolate = this.state.opacityBackground.interpolate({
            inputRange: [0, 150],
            outputRange: ['rgba(255,255,255,0)', 'rgba(1, 92, 208,1)']
        })

        const colorLunarText = this.state.lunarTextColor.interpolate({
            inputRange: [0, 150, 200],
            outputRange: ['rgb(128, 128, 128)', 'rgb(255,255,255)', 'rgb(236, 55, 59)']
        })

        return (


            <TouchableOpacity
                onPress={() => {

                    onPress(date)
                }}

                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                activeOpacity={1}>
                <Animated.View
                    style={[{
                        backgroundColor: colorInterpolate,
                        borderRadius: 8, width: width / 10,
                        marginTop: Platform.OS === 'android' ? -3 : 0,
                    }, styles.cont]}
                >
                    <View
                        style={[styles.dateItemCont

                        ]}>
                        <OpenSansSemiBoldText
                            style={
                                {
                                    textAlign: 'center',
                                    color:this.checkDayTextColorSolar() ?'#ec373b': color,
                                    fontSize: 17,
                                }
                            }>
                            {date.day}

                        </OpenSansSemiBoldText>
                        <OpenSansText
                            style={
                                {
                                    textAlign: 'center',
                                    color: this.checkDayTextColorLunar() ? '#ec373b' : colorLunarText,
                                    fontWeight: '300',
                                    fontSize: 10,
                                    transform: [{ translateY: -2 }]
                                }

                            }>
                            {lunarDay != 1 ? `${lunarDay}` : `${lunarDay}/${month}`}
                        </OpenSansText>


                    </View>

                    <View style={styles.eventCont}>

                        <View style={{ flex: 1 }}>
                            {showZodiacDay ? isHoangdao ? <View
                                style={[styles.center]}>
                                <View
                                    style={[
                                        styles.isLucky,
                                        dotColor,
                                    ]}
                                />

                            </View> : isHacdao ? <View
                                style={[styles.center]}>
                                <View
                                    style={[
                                        styles.isLucky,
                                        dotColor,
                                    ]}
                                />

                            </View> : null : null}
                            {listCeremon.length > 0 && <View
                                style={[styles.cereStyle]}>
                                <View
                                    style={[
                                        {
                                            width: 4, height: 4, borderRadius: 4, backgroundColor: state === 'selected'
                                                ? '#ffffff' : colors.selectedDate
                                        }]}
                                />

                            </View>}
                            {listEvent.length > 0 && listCeremon.length === 0 && <View
                                style={[styles.cereStyle]}>
                                <View
                                    style={[
                                        {
                                            width: 4, height: 4, borderRadius: 4, backgroundColor: state === 'selected'
                                                ? '#ffffff' : colors.selectedDate
                                        }]}
                                />

                            </View>}
                        </View>

                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    }
}
