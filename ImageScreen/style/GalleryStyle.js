import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width
    },
    body:{
        flex:12,
        width: width
    },
    bottom:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-evenly'
    },
    bottomItem:{
        justifyContent:'center',
        alignItems:'center'
    },
    image: {
        height: 178 ,
        width: '99%',
      },
})
