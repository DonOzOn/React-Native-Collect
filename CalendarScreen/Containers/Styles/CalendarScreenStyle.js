import { ApplicationStyles, Metrics } from '../../Themes/';
import { Dimensions, StyleSheet } from 'react-native';

import colors from '../../Themes/Colors';
import metrics from '../../Themes/Metrics';

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    calendar: {
        backgroundColor: '#fff',
        // height: metrics.screenHeight / 2,
        // borderBottomWidth: 7,
        // borderBottomColor: '#eff0ef',
        // marginBottom: 5,
    },
    borderBottom:{
        borderBottomWidth: 7,
        borderBottomColor: '#eff0ef',
        marginBottom: 5,
    },
    headerContainer: {
        maxHeight: 60,
        paddingTop: 0,
        borderBottomWidth: 0,
    },
    textCenterComponent: {
        color: '#fff',
        fontSize: 20,
    },
    imgBg: {
        width: Metrics.screenHeight,
        height: Metrics.screenHeight,
        position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    },
    showDateContainer: {
        backgroundColor: '#0e67b7',
        // marginHorizontal: 10,
        borderRadius: 15,
        alignItems: 'center',
        paddingVertical: 10,
        // marginTop: 15,
    },
    textTitle: {
        color: colors.snow,
        fontSize: 18,
        fontWeight: '700',
        marginVertical: 5,
    },
    textTitleCanchi: {
        color: colors.snow,
        fontSize: 14,
        fontWeight: '400',
        marginVertical: 5,
        paddingHorizontal: 10,
        textAlign: 'center',
    },
    textNavTuvi: {
        color: colors.selectedDate,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
    },
    textNavChuyenDoi: {
        color: colors.selectedDate,
        fontSize: 18,
        fontWeight: '400',
        // marginTop: 5,
        // marginBottom: 20,
        textAlign: 'center',
    },
    textContent: { color: colors.snow, fontSize: 18, fontWeight: '400' },
    weekCalendar: {
        backgroundColor: 'red'
    }
    , dayNameContainer: {
        height: 30, width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: width / 20,
        paddingLeft: width / 21,
        backgroundColor: 'white', paddingTop:6
    },
});
