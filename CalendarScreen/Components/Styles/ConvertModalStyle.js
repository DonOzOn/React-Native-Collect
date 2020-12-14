import { Dimensions, StyleSheet } from 'react-native'

import colors from '../../Themes/Colors'

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height / 48,
        // paddingHorizontal: width / 16,
        paddingRight:width/20,
        marginBottom: 15,
        alignItems: "center",
        width: '100%'
    },
    headerRight: {
        fontSize: 14,
        color: '#ff0000',
        transform:[{translateY: 1}]
    }
    ,
    headerLeft: {
        color: '#015cd0',
        transform:[{translateY: 1}]
    },
    main: {
        flex: 1, 
    },
    dateChoose: {
        borderRadius: 16,
        height: height / 22.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#015cd0',
        width: 122,
        borderWidth:0
        //  marginLeft: 15,
        // padding: 10
    },
    dateChooseCOntainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 100,
        marginBottom: height / 34,
        width: '100%'
    },
    modalHeaderCenter: { flexDirection: 'row', flex:3, justifyContent: 'center', alignItems: 'center' },
    modalContainer: {
        height: height / 2.5,
        width: '100%', backgroundColor:
            'white', borderTopLeftRadius: 20, borderTopRightRadius: 20,
            // position: 'absolute', bottom: 0
    },
    modalHeaderLeft: { flex: 1, justifyContent: 'flex-start', flexDirection: 'row', paddingLeft:width/16.4},
    buttonChoose:{
        color: 'white', fontSize: 14 , transform: [{translateY: -1}]
    }
})