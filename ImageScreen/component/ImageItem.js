import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    PermissionsAndroid,
    Platform,
    View
} from 'react-native';
import React, { PureComponent, useRef } from 'react'

import { CachedImage } from './react-native-cached-image/index';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { Images } from '../../CalendarScreen/Themes/index';
import { LightText } from '../../../../base/components/Text';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import _ from 'lodash';
import configuration from '../../../../configuration';
import { createImageProgress } from 'react-native-image-progress';
import message from '../../../../core/msg/gallery';
import { styles } from './styles/ImageZoomStyle';

const { height, width } = Dimensions.get('window');
const ImageFastContain = createImageProgress(CachedImage);
const ImageFast = createImageProgress(FastImage);
export default function ImageItem(props) {

    const scaleValue = useRef(1);
    const { calHeight, item } = props;
    const { Language } = configuration;

    const renderIndicator = () => {
        const { formatMessage } = props;
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
    const onLoadImage = async () => {

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
    const renderError = () => {
        return (
            <Image
                source={Images.loadFailImage}
                resizeMethod="resize"
                resizeMode="contain"
            />
        );
    };

    const onLoadEvent = (evt) => {
        props.onLoadEvent(evt)
    }


    const onMove = ({ scale }) => {
        scaleValue.current = scale;
        // onMove && onMove({ scale });
    }

    return (
        <View style={[{ width: width, height: '100%' }]}>
            <ImageZoom
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={Dimensions.get('window').width}
                imageHeight={'100%'}
                minScale={1}
                style={{ flex: 1, justifyContent: 'center', position: 'relative' }}
                onStartShouldSetPanResponder={(e) => {
                    return e.nativeEvent.touches.length === 2 || scaleValue.current > 1;
                }}
                onMove={onMove}>
                <View
                    style={{ width: '100%', height: '100%' }}
                    onStartShouldSetResponder={(e) => {
                        console.log(
                            scaleValue.current,
                            e.nativeEvent.touches.length < 2 && scaleValue.current <= 1,
                        );
                        return e.nativeEvent.touches.length < 2 && scaleValue.current <= 1;
                    }}>
                    {item.uriBK
                        ? <ImageFast
                            key={item.UrlImageFull}
                            onLoad={onLoadEvent}
                            onLoadStart={onLoadImage}
                            renderError={renderError}
                            resizeMode={'contain'}
                            resizeMethod={'resize'}
                            renderIndicator={renderIndicator}
                            renderError={renderError}
                            source={item.uriBK}
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                            }} />
                        : <ImageFastContain
                            key={item.UrlImageFull}
                            onLoad={onLoadEvent}
                            onLoadStart={onLoadImage}
                            renderError={renderError}
                            resizeMode={'contain'}
                            resizeMethod={'resize'}
                            renderIndicator={renderIndicator}
                            renderError={renderError}
                            source={
                                {
                                    uri: item.UrlImageFull,
                                    priority: FastImage.priority.high,
                                }
                            }
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                            }}
                        />}
                    <LightText
                        style={[
                            styles.titleImg,
                            { bottom: calHeight > 1.5 ? 15 : height / 3.3 },
                        ]}
                    >
                        {Language === 'vi' ? item.DescriptionVi : item.DescriptionEn}
                    </LightText>
                </View>
            </ImageZoom>
        </View>

    )
}
