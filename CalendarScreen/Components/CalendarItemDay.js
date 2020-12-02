import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import styles from './Styles/Date'

export default class CalendarItemDay extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { dayname, currentDayIndex, index, lunar, currentDayLunarIndex } = this.props;
        return (<View>
            {lunar ? 
            <OpenSansSemiBoldText
                key={index}
                style={[styles.calendarText, { color: currentDayLunarIndex === index ? '#015cd0' : 'black'}]}>
                {dayname}, {this.props.label}
            </OpenSansSemiBoldText> : <OpenSansSemiBoldText
                key={index}
                style={[styles.calendarText, { color: currentDayIndex === index ? '#015cd0' : 'black' }]}>
                    {dayname}, {this.props.label}
                </OpenSansSemiBoldText>}
        </View>

        );
    }
}
