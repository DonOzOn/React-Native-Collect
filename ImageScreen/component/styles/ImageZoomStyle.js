import { Dimensions, StyleSheet } from "react-native";

import { PADDING_HOR } from '../../../WelcomeScreen/styles/index.css';

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
    position: 'relative'
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between', paddingRight: 59, paddingLeft: 60,
    transform: [{translateY: 4}]
  },
  bottomItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleImg: {
    position: 'absolute',
    color: 'white',
    fontSize: 11,
    zIndex: 100,
    // bottom:0,
    paddingHorizontal: PADDING_HOR,
  },
  iconBottom: {
    width: 18,
    height: 18,
  },
  iconBottomSave:{
    width: 18,
    height: 18,
    transform: [{ translateY: -2 }, { translateX: 2 }]
  },
  iconBottomGallery: {
    width: 18,
    height: 18,
    transform: [{ translateY: -3 }, { translateX: -3 }]
  },
  iconBottomShare: {
    width: 20,
    height: 20,
    transform: [{ translateY: -2 }, { translateX: -2 }]
  },
  textBottom: {
    color: '#545454',
    fontSize: 9,
    // transform: [{ translateX: 2 }],
    letterSpacing: 0
  },
  textLoading: {
    color: 'gray',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  containerDialogConfirm: {
    height: height,
    width: width,

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 10,
    backgroundColor: 'white',
    // marginHorizontal: 20,
    paddingHorizontal: 0, 
    marginHorizontal:0
  },
  itemTag: {
    backgroundColor: "#23a036",
    padding: 7,
    marginHorizontal: 3,
    borderRadius: 20,
    marginVertical: 5
  },
  textAreaContainer: {
    borderColor: 'gray',
    borderWidth: 1.5,
    padding: 5,
    borderRadius: 10,
    width: "95%"
    // paddingHorizontal: 10
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    textAlignVertical: "top"
  },
  textStatusBarPost: {
    color: 'white'
  },
  transformShare:{
    transform:[{translateX: -2}]
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  imageZoom:{
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  }
})
