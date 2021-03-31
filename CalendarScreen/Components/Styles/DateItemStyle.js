import { Dimensions, StyleSheet } from 'react-native'

import colors from '../../Themes/Colors'

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 2,
  },
  textDate: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  lunarDate: {
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 11,
  },
  dotContainer: { justifyContent: 'center', alignItems: 'center' },
  dot: { width: 5, height: 5, borderRadius: 5 },
  dateItemCont: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  eventCont:{
    flexDirection: "row", alignItems: 'center', justifyContent: 'center'
    , alignSelf: 'flex-end', position: 'absolute', bottom: 5, right: 3
},
center:{ justifyContent: 'center', alignItems: 'center' },
cereStyle:{ justifyContent: 'center', alignItems: 'center', marginTop: 2 },
isLucky: { width: 4, height: 4, borderRadius: 4, transform: [{ translateY: -2 }] },
cont:{
  height: width / 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
}
})
