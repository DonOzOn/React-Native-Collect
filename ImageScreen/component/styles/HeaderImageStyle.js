import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
export const styles = StyleSheet.create({
    container: {
        // flex: 1,
        width: width,
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center',
        // paddingVertical: width / 21.3,
        paddingTop: 15,
        paddingBottom: 15.5,
        height: 48
    }, left: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: 5,
    },
    center: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // marginTop: -1,
    },
    right: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 18
    },
    backIcon: {
        height: 10,
        width: 10,
        marginTop: -1
    },
    rightIcon: {
        height: 16,
        width: 16
    },
    textGalleryTitle: { fontSize: 14, transform: [{ translateX: -0.5 },{translateY: -0.5}] }
})
