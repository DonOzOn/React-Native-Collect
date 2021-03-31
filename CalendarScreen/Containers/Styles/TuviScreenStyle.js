import { Dimensions, StyleSheet } from 'react-native';

import { ApplicationStyles } from '../../Themes/';
import colors from '../../Themes/Colors';
import { hoangdao } from '../../../WelcomeScreen/utils/ConvertToCanchi';
import metrics from '../../Themes/Metrics';

const DropDownWidth = 90;
const DropDownHeight = 36;
const DropPadding = 10;
const YEAR_BOX_WIDTH = (DropDownWidth - DropPadding * 2) * 3 / 4 - 10;
const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    ...ApplicationStyles.screen,
    hoangDaoContainer: { paddingRight: 14, paddingTop: 15.5, paddingBottom: 0 },
    calendar: {
        height: metrics.screenHeight / 2,
    },
    inforContainer: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 23,
        borderBottomWidth: 7,
        borderBottomColor: '#eff0ef',
        position: 'relative',
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
        width: metrics.screenHeight,
        height: metrics.screenHeight,
        position: 'absolute',
    },
    centerView: {
        position: 'absolute',
        top: 76,
        // borderTopWidth: 1,
        // borderBottomWidth: 1,
        height: 42,
        left: 0,
        right: 0,
    },
    calendarCont: {
        // borderWidth: 1,
        // marginVertical: 16,
        // borderRadius: 15,
        flex: 1
    },
    showDateContainer: {
        backgroundColor: colors.dateBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
        borderRadius: 22,
        paddingVertical: 15,
        marginVertical: 15,
    },
    textTitle: {
        color: colors.snow,
        fontSize: 18,
        fontWeight: '700',
        marginVertical: 5,
    },
    textTitleCanchi: {
        color: colors.black,
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 2,

    },
    textSuggest: {
        color: colors.warmgrey,
        fontSize: 13,
        textAlign: 'left',
        marginBottom: 5
    },
    textNavTuvi: {
        color: colors.selectedDate,
        fontSize: 18,
        fontWeight: '400',
        marginVertical: 5,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    textContent: { color: colors.snow, fontSize: 18, fontWeight: '400' },
    ...ApplicationStyles.screen,
    arrowDown: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'black',
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 8,
        borderRadius: 2,
        transform: [{ rotate: '180deg' }],
    },
    arrowContainer: {
        width: (DropDownWidth - DropPadding * 2) / 3,
        height: DropDownHeight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    dropDownItem: {
        width: (DropDownWidth - DropPadding) / 2,
        height: DropDownHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropDownContainer: {
        width: DropDownWidth,
        height: DropDownHeight,
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    label: {
        width: DropDownWidth,
        height: DropDownHeight,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'gray',
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelItem: {
        width: YEAR_BOX_WIDTH,
        marginLeft: 10,
        height: DropDownHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        color: '#0f67b8',
        fontWeight: 'bold',
    },
    expanded: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomWidth: 1,
    },
    topItem: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingRight: 15,
        paddingLeft: width / 21.5,
        alignItems: 'center'
    },
    dayname: {
        paddingLeft: width / 16.4,
        fontSize: 13,
    },
    shouldContainer: { flex: 1, paddingTop: 20, paddingBottom: width / 16, borderBottomWidth: 7, borderBottomColor: '#eff0ef' },
    daynameShow: {
        fontSize: 13,
        // marginLeft: 2,

    },
    eventContainerOut: { flex: 1, paddingTop: 21, paddingBottom: width / 16.8, borderBottomWidth: 7, borderBottomColor: '#eff0ef', borderTopWidth: 7, borderTopColor: '#eff0ef', marginTop: 16 },
    noteContainer: { flex: 1, paddingTop: 20, paddingBottom: width / 10.3, borderBottomWidth: 7, borderBottomColor: '#eff0ef' },
    hourLunar: {
        color: '#888888',
        fontSize: 14,
    },
    evenContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginTop: width / 20 },
    monthDay: {
        fontSize: 22,
        // lineHeight: 35,
        marginTop: width / 80,
        marginLeft: 2
    },
    hoangDao: {
        color: '#ff0000',
        marginLeft: 10,
        fontSize: 12,
        lineHeight: 29, transform: [{ translateY: 1.5 }]
    },
    textNote: {
        marginLeft: 10,
        fontSize: 13,
        lineHeight: 21,
        color: colors.warmgrey,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#ff0000',
    },
    dotColor: {
        width: 8,
        height: 8,
        borderRadius: 4,

    },
    yearLunar: {
        color: '#888888',
        fontSize: 14,
        textAlign: 'left',
        marginTop: width / 160,
        transform: [{ translateY: 1 }]
        // marginLeft: -5
    },
    divide: {
        height: 1,
        backgroundColor: '#e3e3e3',
        marginRight: 14.5,
        marginLeft: 22,
        // marginVertical:5,

    },
    containerWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: "center",
    },
    imageAnimal: {
        width: 36,
        height: 36,
        borderRadius: 1000,

    },
    should: {
        color: '#015cd0',
        fontSize: 13,
        marginTop: width / 32,
        marginBottom: width / 80
    },
    shouldnot: {
        color: '#ff0000',
        fontSize: 13,
        marginTop: width / 22.8,
        marginBottom: width / 80
    },
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ceremoneyContainer: {
        flexDirection: 'row',
        flex: 1, alignItems: 'center',
        marginBottom:8
    },
    dateChoose: {
        borderRadius: 100,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#015cd0',
        width: 122, marginLeft: 15,
        padding: 10
    },
    dateChooseCOntainer: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderRadius: 100, marginBottom: 50 },
    hoangDaoTextContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: -14,
        paddingRight: 13,
        position: 'absolute',
        right: 0, bottom: 0
    },
    hoverCenter: { backgroundColor: 'rgba(1,92,208,0.08)', height: height / 22.5, width: '100%', position: 'absolute', zIndex: -1 },
    hoverTop: { backgroundColor: 'white', height: height / 22.5, width: width, top: 0, position: 'absolute', opacity: 0.7, zIndex: 1 },
    hoverBottom: { backgroundColor: 'rgba(255,255,255,0.7)', height: height / 22.5, width: '100%', position: 'absolute', bottom: 0 },
    emptyText: {
        color: 'gray',
        fontSize: 12
    },
    inforTopContainer: {
        position: 'relative',
        height: 88.857,
        // borderBottomWidth: 7, borderBottomColor: '#eff0ef',
        // paddingBottom: width / 16.8,

    }
});
