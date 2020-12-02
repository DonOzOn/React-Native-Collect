import {Colors, Fonts, Metrics} from '../../Themes/';

import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: Metrics.section,
    },
    contentContainer: {
        alignSelf: 'center',
        alignItems: 'center',
    },
    message: {
        marginTop: Metrics.baseMargin,
        marginHorizontal: Metrics.baseMargin,
        textAlign: 'center',
        fontFamily: Fonts.type.base,
        fontSize: Fonts.size.regular,
        fontWeight: 'bold',
        color: Colors.steel,
    },
    icon: {
        color: Colors.steel,
    },
    calendarText: {
        fontSize: 14,
        textAlign: 'center',
        // fontWeight: 'bold',
    },
});
