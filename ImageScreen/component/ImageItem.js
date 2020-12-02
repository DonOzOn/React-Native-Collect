import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
    View
} from 'react-native';
import React, { PureComponent } from 'react'

import { CachedImage } from './react-native-cached-image/index';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { Images } from '../../CalendarScreen/Themes/index';
import { LightText } from '../../../../base/components/Text';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import _ from 'lodash';
import configuration from '../../../../configuration';
import { createImageProgress } from 'react-native-image-progress';
import message from '../../../../core/msg/gallery';
import { styles } from './styles/ImageZoomStyle';

const { height, width } = Dimensions.get('window');
const ImageFastContain = createImageProgress(CachedImage);
export default class ImageItem extends PureComponent {
    renderIndicator = () => {
        const { formatMessage } = this.props;
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}>
                <ActivityIndicator size="large" color="gray" />
                <OpenSansSemiBoldText style={styles.textLoading}>
                    {formatMessage(message.loadingPhoto)}...
            </OpenSansSemiBoldText>
                <OpenSansSemiBoldText style={styles.textLoading}>
                    {formatMessage(message.waiting)}
                </OpenSansSemiBoldText>
            </View>
        );
    };

    //on load image
    onLoadImage = async () => {

        //download to cache folder when load image
        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ])
                .then(async result => {
                    if (result['android.permission.WRITE_EXTERNAL_STORAGE']) {
                        // this.download(listImage)
                    }
                })
                .catch(err => console.log('err: ', err));
        } else {
            // this.download(listImage)
        }

    };

    
    renderError = () => {
        return (
            <Image
                source={Images.loadFailImage}
                resizeMethod="resize"
                resizeMode="contain"
            />
        );
    };

    onLoadEvent = (evt) => {
        this.props.onLoadEvent(evt)
    }

    render() {
        const { calHeight, item } = this.props;
        const { Language } = configuration;
        return (<Animated.View style={[{ width: width, height: '100%' }]}>
            <ImageZoom
                style={{ flex: 1, justifyContent: 'center', position: 'relative' }}
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={width}
                imageHeight={'100%'}
                useNativeDriver={true}>
                    <ImageFastContain
                        key={item.UrlImageFull}
                        ref={ref => (this.imageFast = ref)}
                        onLoad={this.onLoadEvent}
                        onLoadStart={this.onLoadImage}
                        renderError={this.renderError}
                        resizeMode={'contain'}
                        renderIndicator={this.renderIndicator}
                        renderError={this.renderError}
                        source={
                            item.uriBK
                                ? item.uriBK
                                : {
                                    uri: item.UrlImageFull,
                                    priority: FastImage.priority.high,
                                }
                        }
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                        }}
                    />
                <LightText
                    style={[
                        styles.titleImg,
                        { bottom: calHeight > 1.5 ? 15 : height / 3.3 },
                    ]}
                    onLayout={this.onLayout}>
                    {Language === 'vi' ? item.DescriptionVi : item.DescriptionEn}
                </LightText>
            </ImageZoom>
        </Animated.View>)
    }
}
