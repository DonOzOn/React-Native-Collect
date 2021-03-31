import { Dimensions, StyleSheet } from "react-native";

import { Colors } from '../../Themes/index';

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 50,
        backgroundColor: '#F8F8F8',
        paddingRight: width / 20,
        paddingLeft: width / 21.5,
        justifyContent: 'space-between',
    },
    left: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    center: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 1,
    },
    right: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 1,
        flexDirection: 'row',


    },
    textRight: {
        fontSize: 14,
        color: '#015cd0',
        transform: [{ translateY: 0.5 }]
    },
    textCenter: {
        fontSize: 14,
        textAlign: 'left',
        lineHeight: 29,
        // marginLeft: width / 21.3
    },
    backIcon: {
        height: 12,
        width: 12
    },
    eventText: {
        marginHorizontal: 10
    },
    todayIcon: {
        width: 24,
        height: 22
    },
    settingIcon: {
        width: 22,
        height: 22
    },
    eventIcon: {
        width: 21,
        height: 22,
        marginHorizontal: 24
    },
    center__text: {
        fontSize: 14,
    }
})
