import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 50,
        backgroundColor: '#f8f8f8',
        paddingRight: width / 20,
        paddingLeft: width / 21.5,
        justifyContent: 'space-between'
    },
    left: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop:1
    },
    right: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:1

    },
    textRight: {
        fontSize: 14,
        color: '#015cd0',
        transform:[{translateY: 0.5}]
    },
    textCenter: {
        fontSize: 14,
        textAlign: 'center', 
        lineHeight: 29, 
        marginLeft:width/21.3
    },
    backIcon: {
        height: 12,
        width: 12
    }
})
