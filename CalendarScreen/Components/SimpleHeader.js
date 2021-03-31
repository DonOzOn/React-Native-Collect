import { Image, Text, TouchableOpacity, View } from 'react-native';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText/index';
import React from 'react';
import styles from './Styles/HeaderStyle';

export default function SimpleHeader(props) {
  const goBack = () => {
    props.goBack();
  };

  const SearchElement = props.searchElement;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={goBack}
          hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
          style={{
            width: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: 2,
          }}>
          <Image
            source={require('../Themes/icon/Path-170703x.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.center}>
        <OpenSansSemiBoldText style={[styles.center__text, {
          marginLeft: props.textMarginLeft,
          marginTop: props.textMarginTop,
        }]}>{props.title}</OpenSansSemiBoldText>
      </View>
      <View style={styles.right} >
        {SearchElement && <SearchElement />}

      </View>
    </View>
  );
}
