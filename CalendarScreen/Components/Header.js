import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import _ from 'lodash';
import configuration from '../../../../configuration';
import message from '../../../../core/msg/calendar';
import moment from 'moment';
import style from './react-native-calendars/src/calendar/header/style';
import styles from './Styles/HeaderStyle';

const { width, height } = Dimensions.get('window');
export default class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
        this.day = String(new Date().getDate()).padStart(2, '0');
        this.month = String(new Date().getMonth() + 1).padStart(2, '0');
        this.year = new Date().getFullYear();
        this.back = _.debounce(this.back, 300);
    }

    selectDate = () => {
        this.props.modalHandle();
    }

    selectToday = () => {
        this.props.todaySelect();
    }

    back = (params) => {

    }


    goBack = () => {
        this.props.goBack();
    }

    render() {
        const { Language } = configuration;
        const { dateString, monthSelect, yearSelect, formatMessage } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <TouchableOpacity onPress={this.goBack} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                        style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 2 }}>
                        <Image source={require('../Themes/icon/Path-170703x.png')} style={styles.backIcon} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    <TouchableOpacity style={styles.center} onPress={this.selectDate} hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}>
                        {Language === 'vi' ?
                            <OpenSansSemiBoldText style={styles.textCenter}> {dateString ? moment(dateString).format("DD") : this.day} tháng {monthSelect && monthSelect < 10 ? `0${monthSelect}` : `${monthSelect}`}, {yearSelect} </OpenSansSemiBoldText>
                            : <OpenSansSemiBoldText style={styles.textCenter}>{moment(dateString).locale('en').format("MMM DD")}, {moment(dateString).format("YYYY")} </OpenSansSemiBoldText>
                        }
                        <Icon name="menu-down" style={{ marginLeft: -8 }} size={25} color="black" />
                    </TouchableOpacity>

                </View>
                <View style={styles.right}>
                    <TouchableOpacity onPress={this.selectToday} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                        <OpenSansText style={styles.textRight}>{formatMessage(message.today)}</OpenSansText>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

