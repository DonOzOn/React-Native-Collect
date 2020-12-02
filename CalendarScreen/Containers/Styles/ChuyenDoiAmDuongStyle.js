import {StyleSheet} from 'react-native';
import {ApplicationStyles} from '../../Themes';
import metrics from '../../Themes/Metrics';
import colors from '../../Themes/Colors';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
const DropDownWidth = 90;
const DropDownHeight = 36;
const DropPadding = 10;
const YEAR_BOX_WIDTH = ((DropDownWidth - DropPadding * 2) * 3) / 4 - 10;
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    screenContainer: {height: height - 50, width, alignItems: 'center'},
    textTitleCanchi: {
        color: colors.black,
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 2,
        textAlign: 'left',
        marginTop: 370,
        zIndex: 0,
    },
    chuyenDoiContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    headerStyle: {backgroundColor: '#0f67b8'},
    contentText: {
        fontSize: 21.7,
        fontWeight: 'bold',
        marginTop: 63.7,
        color: '#0f67b8',
    },
    lunalCal: {position: 'absolute', alignItems: 'center', top: 337},
    solarCal: {position: 'absolute', top: 144, alignItems: 'center'},
    calText: {fontSize: 22.7, color: '#0f67b8'},
    dropDownRow: {flexDirection: 'row', marginTop: 20},
    centerView : {
        position: 'absolute',
        top: 82,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 32,
        left: 0,
        right: 0,
    }
});
