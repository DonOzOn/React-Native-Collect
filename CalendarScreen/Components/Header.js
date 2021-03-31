import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Images } from '../Themes';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import _ from 'lodash';
import configuration from '../../../../configuration';
import message from '../../../../core/msg/calendar';
import moment from 'moment';
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

    eventHandle = () => {
        this.props.goToEvent()
    }

    setting = () => {
        this.props.goToSettingScreen();
    }


    render() {
        const { Language } = configuration;
        const { dateString, monthSelect, yearSelect, formatMessage } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.left}>
                    <TouchableOpacity onPress={this.goBack} hitSlop={{ top: 50, bottom: 50, left: 10, right: 10 }}
                        style={{ width: 30, height: 50, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 2 }}>
                        <Image source={require('../Themes/icon/Path-170703x.png')} style={styles.backIcon} resizeMode='contain' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.center} onPress={this.selectDate} hitSlop={{ top: 20, bottom: 20, left: 0, right: 5 }}>
                        {Language === 'vi' ?
                            <OpenSansSemiBoldText style={styles.textCenter}> Tháng {monthSelect && monthSelect < 10 ? `0${monthSelect}` : `${monthSelect}`}, {yearSelect} </OpenSansSemiBoldText>
                            : <OpenSansSemiBoldText style={styles.textCenter}>{moment(dateString).locale('en').format("MMM DD")}, {moment(dateString).format("YYYY")} </OpenSansSemiBoldText>
                        }
                        <Icon name="menu-down" style={{ marginLeft: -8 }} size={25} color="black" />
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.center}>


                </View> */}
                <View style={styles.right}>
                    <TouchableOpacity onPress={this.selectToday} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                        {/* <OpenSansText style={styles.textRight}>{formatMessage(message.today)}</OpenSansText> */}
                        <Image source={Images.todayIcon} style={styles.todayIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.eventHandle} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                        <Image source={Images.eventIcon} style={styles.eventIcon} />

                        {/* <OpenSansText style={styles.eventText}>Sự kiện</OpenSansText> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.setting} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                        <Image source={Images.settingIcon} style={styles.settingIcon} />
                        {/* <OpenSansText>Cài đặt</OpenSansText> */}
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

