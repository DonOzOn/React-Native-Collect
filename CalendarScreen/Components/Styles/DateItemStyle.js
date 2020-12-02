import { StyleSheet } from 'react-native'

import colors from '../../Themes/Colors'
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
  dot:{ width: 5, height: 5, borderRadius: 5 }
})
