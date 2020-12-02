import { ActivityIndicator, Alert, Animated, Dimensions, FlatList, Image, LayoutAnimation, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native'
import {
    HEIGHT_DEFAULT,
    HEIGHT_HEADER,
} from '../WelcomeScreen/styles/index.css';
import React, { Component } from 'react'
import { dataEn, dataVi, monthEn } from '../WelcomeScreen/styles/images';
import {
    getDisplayOriginalImg,
    getLastGUID,
    getLastUpdate,
    getListImageUseWelcome,
    getListImageWelcome,
    setDateOfWelcome,
    setDisplayOriginalImg,
    setLastGUID,
    setLastUpdate,
    setListImageUseWelcome,
    setListImageWelcome
} from '../../../core/storage';

import Header from '../WelcomeScreen/Header/Header';
import HeaderFull from '../WelcomeScreen/Header/HeaderFull';
import HeaderImageScreen from './component/HeaderImageScreen'
import { LightText } from '../../../base/components/Text';
import PushNotification from 'react-native-push-notification';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import configuration from '../../../configuration';
import { getImage } from '../../../core/apis/bluezone';
import moment from 'moment';
import { styles } from './style/DetailImageStyle'

const { width } = Dimensions.get('window');

export class DetailImageScreen extends Component {
    constructor(props) {
        super(props)

        this.state = {
            listImages: [],
            display: 'fit',
            images: {},
            width: width,
            info: null,
            date: new Date(),
            setHeight: 0,
            heightImg: 0,
            fromWelcome: false,
            currentIndex: 0,
            changeBG: false,
            xOffset: new Animated.Value(0),
        }
    }
    componentDidMount() {
        this.init()
    }

    componentWillUnmount() {
        if (this.state.changeBG) {
            this.props.route.params.refresh();
        }
    }


    init = () => {
        const { listImage, fromWelcome, image } = this.props.route.params;
        let index = listImage.findIndex(e => e.UrlImageFull === image.UrlImageFull)
        this.setState({
            images: image,
            fromWelcome: fromWelcome,

            listImages: [...listImage]

        }, () => {
            let wait = new Promise((resolve) => setTimeout(resolve, 100));  // Smaller number should work
            wait.then(() => {
                this.setState({ currentIndex: index })
                this.flatListRef.scrollToIndex({ animated: true, index: index });
            });
        });



    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.images !== this.props.route.params.image) {
            this.init();
        }


    }
    async changeDisplay() {
        const displayImg = await getDisplayOriginalImg();
        if (displayImg) {
            this.setState({ display: displayImg });
        }
    }
    getAssetFileAbsolutePath = async () => {
        const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.jpg`;

        try {
            let absolutePath = await RNFS.copyFileAssets('../WelcomeScreen/styles/images/1.jpg', dest, 0, 0);
        } catch (err) {
            console.log(err)
        }
    }
    onDownloadImagePress = () => {
        const imagePath =
            `${Platform.OS === "android" ? `${RNFS.DownloadDirectoryPath}` : RNFS.TemporaryDirectoryPath}/${((Math.random() * 1000) | 0)}.png`;
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]
        ).then((result) => {
            if (result['android.permission.WRITE_EXTERNAL_STORAGE']) {
                RNFS.downloadFile({
                    fromUrl: this.state.listImages[this.state.currentIndex].UrlImageFull,
                    toFile: imagePath,
                }).promise.then(() => {
                    this.setState({ source: { uri: imagePath } });
                    PushNotification.localNotification({
                        channelId: "blue-chanel",
                        showWhen: true,
                        autoCancel: true,
                        largeIcon: 'ic_launcher',
                        largeIconUrl: 'https://www.example.tld/picture.jpg',
                        smallIcon: 'ic_launcher',
                        bigText: "Tải xuống thành công",
                        bigPictureUrl: imagePath,
                        vibrate: true,
                        vibration: 300,
                        priority: "high",
                        visibility: "private",
                        shortcutId: "shortcut-id",
                        onlyAlertOnce: true,
                        usesChronometer: false,
                        messageId: "google:message_id",
                        alertAction: "view",
                        title: "Tải xuống",
                        message: "Tải xuống thành công",
                        invokeApp: false,
                    });
                }).catch(e => console.log('e: ', e));

            }
        }).catch(err => console.log('err: ', err));
    }

    goBack = () => {
        if (this.state.fromWelcome === true) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.navigate("GalleryScreen", { listImage: this.state.listImages });
        }
    }

    goToGallery = () => {
        this.props.navigation.navigate("GalleryScreen", { listImage: this.state.listImages });
    }

    getDate = () => {
        const { Language } = configuration;
        const { date } = this.state;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        if (Language === 'vi') {
            return `${day}/${month}/${year}`;
        }
        return `${monthEn[month - 1]} ${day}, ${year}`;
    };

    share = () => {
        const { Language } = configuration;
        const options = {
            subject: "Chia sẻ ảnh",
            url: this.state.listImages[this.state.currentIndex].UrlImageFull,
            message: Language === 'vi' ? this.state.listImages[this.state.currentIndex].DescriptionVi : this.state.listImages[this.state.currentIndex].DescriptionEn

        };

        Share.open(options)
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });

    }

    getRandomInt = max => {
        return Math.floor(Math.random() * Math.floor(max));
    };
    onLoad = e => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.linear,
            },
        });
        this.setState({
            heightImg: width / (e.nativeEvent.width / e.nativeEvent.height),
            loadingImage: false
        });
    };
    setBG = () => {

        Alert.alert(null, 'Bạn có muốn cập nhật ảnh nền', [
            { text: 'Từ chối', onPress: () => console.warn('NO Pressed'), style: 'cancel' },
            {
                text: 'Đồng ý', onPress: async () => {
                    if (this.state.listImages[this.state.currentIndex].status === 'use') {
                        Alert.alert("Đã được sử dụng làm ảnh nền rồi.");
                        return;
                    }
                    let listUse = await getListImageUseWelcome();
                    let listGallery = await getListImageWelcome();
                    listGallery.map((value, index) => {
                        if (index === this.state.currentIndex) {
                            value.status = 'use';
                        }
                        if (index === listGallery.length - 1) {
                            setListImageWelcome(listGallery)
                        }
                    })
                    this.state.listImages[this.state.currentIndex].status = 'use';
                    listUse.push(this.state.listImages[this.state.currentIndex])
                    setListImageUseWelcome(listUse);
                    const { Language } = configuration;
                    const dayOfWeek = this.getDate();
                    const data = Language === 'vi' ? dataVi : dataEn;
                    const maximNumber = data.length - 1 === data.indexOf(this.state.info) ? 0 : this.getRandomInt(10);
                    setDateOfWelcome({
                        date: dayOfWeek,
                        // image: this.state.currentIndex,
                        image: listUse.length - 1,
                        maxim: maximNumber,
                    });
                    if (listGallery.filter(e => e.status !== 'use').length < 5) {
                        this.getImageFromApi(listGallery);
                    }
                    Alert.alert("Đặt ảnh nền thành công")
                    this.setState({ changeBG: true })
                }
            },
        ])

    }

    getImageFromApi = async (listGallery) => {
        let numLine = listGallery.filter(e => e.status !== 'use').length;
        let lastUpdate = await getLastUpdate();
        let lastGUID = await getLastGUID();

        getImage(lastUpdate ? lastUpdate : '2020-09-01', lastGUID ? lastGUID : 'f4221488-da64-49df-b15e-520a905c6321', 2, res => {
            if ((numLine + res.Object.length) > 50) {
                listGallery.splice(0, res.Object.length);
                listGallery = [...listGallery, ...res.Object]
            } else {
                listGallery = [...listGallery, ...res.Object];
            }
            setLastUpdate(moment(new Date()).format('YYYY-MM-DD'));
            setLastGUID(res.Object.pop().ObjectGuid);
            setListImageWelcome(listGallery);
            this.setState({ loadMore: false })


        }, () => {
            this.setState({ loadMore: false })
        })
    }

    onLayout = e => {
        LayoutAnimation.configureNext({
            duration: 200,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.linear,
            },
        });
        if (e.nativeEvent.layout.height > HEIGHT_DEFAULT) {
            this.setState({ setHeight: e.nativeEvent.layout.height - HEIGHT_DEFAULT });
        } else {
            this.setState({ setHeight: 0 });
        }
    };


    onChange = () => {
        const {
            images,
            setHeight,
        } = this.state;
        const heightNatural = width * images.height / images.width;
        const bars = (HEIGHT_HEADER - setHeight - heightNatural) / HEIGHT_HEADER;
        if (bars > 0.15) {
            this.setState(prev => {
                const scale = prev.display === 'fit' ? 'full' : 'fit';
                setDisplayOriginalImg(scale);
                return { display: scale };
            });
        }
    };


    onLoadEnd = () => {
        this.setState({ loadingImage: false })
    }

    onLoadStart = () => {
        // this.setState({ loadingImage: true })
    }

    transitionAnimation = index => {
        return {
            transform: [
                { perspective: 800 },
                {
                    scale: this.state.xOffset.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: [0.25, 1, 0.25],
                        extrapolate: 'clamp'
                    })
                },
                {
                    rotateX: this.state.xOffset.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: ["45deg", "0deg", "45deg"],
                        extrapolate: 'clamp'
                    })
                },
                {
                    rotateY: this.state.xOffset.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: ["-45deg", "0deg", "45deg"],
                        extrapolate: 'clamp'
                    })
                }
            ]
        };
    };


    renderItem = ({ item, index }) => {
        const {
            setHeight,
            display,
        } = this.state;
        const heightNatural = width * item.height / item.width;
        const bars = (HEIGHT_HEADER - setHeight - heightNatural) / HEIGHT_HEADER;
        const { Language } = configuration;
        return (
            <Animated.View style={[{ flex: 1 }, this.transitionAnimation(index)]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    {display === 'fit' && bars > 0.15 ? (
                        <Header
                            styleImg={{
                                width: width,
                                height: HEIGHT_HEADER - setHeight,
                                zIndex: 100,
                            }}
                            uri={{ uri: item.UrlImageFull }}
                            onLoad={this.onLoad}
                            onLoadStart={this.onLoadStart}
                            onLoadEnd={this.onLoadEnd}
                        />

                    ) : (
                            <HeaderFull
                                styleImg={{
                                    width: width,
                                    height: HEIGHT_HEADER - setHeight,
                                    // flex: 1,
                                    zIndex: 100,
                                    backgroundColor: 'rgba(0,0,0,0.34)',
                                }}
                                uri={{ uri: item.UrlImageFull }}
                                onLoad={this.onLoad}
                                onLoadStart={this.onLoadStart}
                                onLoadEnd={this.onLoadEnd}
                            />

                        )}
                </View>

                <LightText

                    style={[
                        styles.titleImg,
                        {
                            bottom: display === 'fit' && bars > 0.15 ? (HEIGHT_HEADER - setHeight) / 2 + 35 : (HEIGHT_HEADER - setHeight) / 3 + 40,
                        },
                    ]}>
                    {Language === 'vi' ? item.DescriptionVi : item.DescriptionEn}
                </LightText>
            </Animated.View>
        )
    }

    onScrollEnd = (e) => {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);

        this.setState({ currentIndex: pageNum })
    }
    onScrollImage = (event) => Animated.event(
        [{
            nativeEvent: {
                contentOffset: { x: this.state.xOffset },
            },
        }],
        {
            useNativeDriver: true,
            listener: ({ nativeEvent }) => this.state.xOffset.setValue(nativeEvent.contentOffset.x),
        },
    ).__getHandler()(event);
    render() {
        const {
            images,
        } = this.state;
        return (
            <View style={styles.container}>
                <HeaderImageScreen
                    length={this.state.listImages.length} index={this.state.currentIndex + 1}
                    goBack={this.goBack} goToGallery={this.goToGallery} />
                <View style={[styles.body]}>
                    <FlatList
                        onScroll={this.onScrollImage}
                        ref={(ref) => { this.flatListRef = ref; }}
                        horizontal
                        data={this.state.listImages}
                        showsHorizontalScrollIndicator={false}
                        legacyImplementation={false}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item + index.toString()}
                        pagingEnabled={true}
                        onScrollToIndexFailed={(error => {
                            this.flatListRef.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                            setTimeout(() => {
                                if (this.state.listImages.length !== 0 && this.flatListRef !== null) {
                                    this.flatListRef.scrollToIndex({ index: error.index, animated: true });
                                }
                            }, 100);
                        }
                        )
                        }
                        scrollEventThrottle={400}
                        onMomentumScrollEnd={this.onScrollEnd}
                    />
                    {this.state.loadingImage &&
                        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color='white' />
                            <Text style={styles.textLoading}>Đang tải ảnh...</Text>
                            <Text style={styles.textLoading}>Xin vui lòng chờ trong giây lát</Text>
                        </View>}
                </View>

                {/* <Image source={this.state.source} style={{width: 100, height: 100}} />  */}
                <View style={styles.bottom}>
                    <TouchableOpacity onPress={this.share}>
                        <View style={styles.bottomItem}>
                            <Image source={require('../CalendarScreen/Themes/icon/Group-91203x.png')} style={styles.iconBottom} resizeMode='contain' />
                            <Text style={styles.textBottom}>Chia sẻ</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.setBG}>
                        <View style={styles.bottomItem}>
                            <Image source={require('../CalendarScreen/Themes/icon/Group-91213x.png')} style={styles.iconBottom} resizeMode='contain' />
                            <Text style={styles.textBottom}>Đặt làm hình nền</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onDownloadImagePress}>

                        <View style={styles.bottomItem}>
                            <Image source={require('../CalendarScreen/Themes/icon/Group-91223x.png')} style={styles.iconBottom} resizeMode='contain' />
                            <Text style={styles.textBottom}>Lưu lại</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default DetailImageScreen
