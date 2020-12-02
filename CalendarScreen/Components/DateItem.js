import { Dimensions, Platform, Text, View } from 'react-native';
import React, { Component, PureComponent } from 'react';
import { ceremony, ceremonyHightLight, ceremonyLunar, ceremonyLunarHightLight } from '../Fixtures/ceremony';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../Themes/Colors';
import moment from 'moment';
import styles from './Styles/DateItemStyle';

// import PropTypes from 'prop-types';

// import {Colors} from 'react-native/Libraries/NewAppScreen'

const DAY_HEIGHT = 35;
const { width, height } = Dimensions.get('window');
export default class DateItem extends Component {

    componentWillMount() {
        const { year, month, day } = this.props;
        const now = moment()
            .year(this.props.date.year)
            .month(this.props.date.month - 1)
            .date(this.props.date.day);
        this.isSunday = now.isoWeekday() == 7;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.state !== nextProps.state;
    }

    onCeremoney = (list) => {
        this.props.onCeremoney(list);
    }

    render() {
        const { date, state, onPress, lunarDay, month, isHoangdao } = this.props;
        let color = colors.black;
        let dotColor  = { backgroundColor: '#fb0e0e' };
        if (!isHoangdao)
            dotColor = { backgroundColor: '#a2a2a2' };


        switch (state) {
            case 'disabled':
                color = colors.steel;
                break;
            case 'today':
                color = colors.selectedDate;
                break;
            case 'selected':
                color = colors.snow;
                break;
            default:
                color = colors.black;
                break;
        }
        let listCeremon = [];
        let cereMap = ceremony.find(element => element.value == date.day + "/" + date.month)
        let cereLunarMap = ceremonyLunar.find(element => element.value == lunarDay + "/" + month)
        let cereLunarHLMap = ceremonyLunarHightLight.find(element => element.value == lunarDay + "/" + month)
        let cereHLMap = ceremonyHightLight.find(element => element.value == date.day + "/" + date.month)
        if (cereLunarMap) {
            listCeremon.push(cereLunarMap);
        }

        if (cereMap) {
            listCeremon.push(cereMap);
        }

        return (
            <TouchableOpacity
                onPress={() => {
                    onPress(date);
                    this.onCeremoney(listCeremon);
                }}
                style={{
                    height: width / 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor:
                        state === 'selected'
                            ? colors.selectedDate
                            : colors.transparent, borderRadius: 8, width: width / 10,
                    marginTop: Platform.OS === 'android' ? -3 : 0
                }}
                activeOpacity={1}>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                    <OpenSansSemiBoldText
                        style={[
                            {
                                textAlign: 'center',
                                color: color,
                                fontSize: 17,
                            },
                            this.isSunday &&
                            state != 'selected' &&
                            state != 'disabled' && { color: '#ec373b' }

                            , cereHLMap && state != 'selected' &&
                            state != 'disabled' && { color: '#ec373b' },
                            cereLunarHLMap && state != 'selected' &&
                            state != 'disabled' && { color: '#ec373b' }
                        ]}>
                        {date.day}

                    </OpenSansSemiBoldText>
                    <OpenSansText
                        style={[
                            {
                                textAlign: 'center',
                                color: state === 'selected'
                                    ? '#ffffff'
                                    : '#808080',
                                fontWeight: '300',
                                fontSize: 10,
                                transform: [{ translateY: -2 }]
                            },
                            (lunarDay == 1 ||
                                (this.isSunday && state != 'disabled')) && {
                                color: '#ec373b',
                            }, cereHLMap && state != 'selected' &&
                            state != 'disabled' && { color: '#ec373b' },
                            cereLunarHLMap && state != 'selected' &&
                            state != 'disabled' && { color: '#ec373b' }
                        ]}>
                        {lunarDay != 1 ? `${lunarDay}` : `${lunarDay}/${month}`}
                    </OpenSansText>


                </View>

                <View style={{
                    flexDirection: "row", alignItems: 'center', justifyContent: 'center'
                    , alignSelf: 'flex-end', position: 'absolute', bottom: 5, right: 3
                }}>

                    <View style={{ flex: 1 }}>
                        {isHoangdao ? <View
                            style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                            <View
                                style={[
                                    { width: 4, height: 4, borderRadius: 4, transform: [{ translateY: -2 }] },
                                    dotColor,
                                ]}
                            />

                        </View> : <View
                            style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                <View
                                    style={[
                                        { width: 4, height: 4, borderRadius: 4, transform: [{ translateY: -2 }] },
                                        dotColor,
                                    ]}
                                />

                            </View>}
                        {listCeremon.length > 0 && <View
                            style={[{ justifyContent: 'center', alignItems: 'center', marginTop: 2 }]}>
                            <View
                                style={[
                                    {
                                        width: 4, height: 4, borderRadius: 4, backgroundColor: state === 'selected'
                                            ? '#ffffff' : '#004cff'
                                    }]}
                            />

                        </View>}

                    </View>

                </View>

            </TouchableOpacity>
        );
    }
}
