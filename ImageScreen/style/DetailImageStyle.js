import { Dimensions, StyleSheet } from "react-native";

import { PADDING_HOR } from '../../WelcomeScreen/styles/index.css';

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width
    },
    body: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative'
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    bottomItem: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleImg: {
        position: 'absolute',
        color: '#ffffff',
        fontSize: 11,
        zIndex: 999,
        paddingHorizontal: PADDING_HOR,
    },
    iconBottom:{
        width:20,
        height:20
    },
    textBottom:{
        color:'#545454',
        fontSize:10
    },
    textLoading:{
        color: '#ffffff',
    }
})
