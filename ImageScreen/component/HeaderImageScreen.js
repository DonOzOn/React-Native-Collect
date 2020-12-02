import { Dimensions, Image, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import message from '../../../../core/msg/gallery';
import { styles } from './styles/HeaderImageStyle'

export class HeaderImageScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    goBack = () => {
        this.props.goBack();
    }

    goToGallery = () => {
        this.props.goToGallery();
    }

    render() {
        const { gallery, index, length, formatMessage } = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.left, { paddingLeft: !gallery ? 17 : 19 }]}>
                    <TouchableOpacity onPress={this.goBack} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                        <Image source={require('../../CalendarScreen/Themes/icon/Path-170703x.png')} style={styles.backIcon} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={styles.center}>
                    {!gallery ?
                        <View style={styles.center}>
                            <OpenSansSemiBoldText style={{ fontSize: 14 }}>{index}</OpenSansSemiBoldText>
                            <OpenSansSemiBoldText style={{ color: '#a1a1a1', fontSize: 14, }}>/{length}</OpenSansSemiBoldText>
                        </View> :
                        <OpenSansSemiBoldText style={styles.textGalleryTitle}>{formatMessage(message.gallery)}</OpenSansSemiBoldText>}

                </View>

                <View style={styles.right}>
                    {(!gallery) &&
                        <TouchableOpacity onPress={this.goToGallery} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                            <Image source={require('../../CalendarScreen/Themes/icon/Group-91243x.png')} style={styles.rightIcon} resizeMode='contain' />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

export default HeaderImageScreen
