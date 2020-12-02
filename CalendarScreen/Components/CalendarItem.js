import "moment/min/locales";
import 'moment/locale/vi';

import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import configuration from '../../../../configuration';
import moment from 'moment';
import styles from './Styles/Date'

export default class CalendarItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { Language } = configuration;
        const { index, label, month, currentIndexMonth, year, currentIndexYear } = this.props;
        return (
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {month && <OpenSansSemiBoldText
                    key={index}
                    style={[styles.calendarText, { color: currentIndexMonth === index ? '#015cd0' : 'black', textTransform: 'capitalize' }]} >
                    {moment(label, 'MM').locale(Language === 'vi' ? 'vi' : 'en').format('MMMM')}
                </OpenSansSemiBoldText>}
                {year && <OpenSansSemiBoldText
                    key={index}
                    style={[styles.calendarText, { color: currentIndexYear === index ? '#015cd0' : 'black' }]} >
                    {label}
                </OpenSansSemiBoldText>}

            </View>

        );
    }
}
