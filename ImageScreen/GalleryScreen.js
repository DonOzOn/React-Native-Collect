import * as PropTypes from 'prop-types';

import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    NativeModules,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native'
import { CachedImage, ImageCacheManager, ImageCacheProvider } from './component/react-native-cached-image/index';
import React, { Component } from 'react'
import { getLastGUID, getLastUpdate, getListImageWelcome, setLastGUID, setLastUpdate, setListImageWelcome } from '../../../core/storage';
import { injectIntl, intlShape } from 'react-intl';

import FastImage from 'react-native-fast-image';
import HeaderImageScreen from './component/HeaderImageScreen'
import ImageZoomModal from './component/ImageZoomModal';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import configuration from '../../../configuration';
import { createImageProgress } from 'react-native-image-progress';
import { getImage } from '../../../core/apis/bluezone';
import images from '../CalendarScreen/Themes/Images';
import message from '../../../core/msg/welcome';
import messageGallery from '../../../core/msg/gallery';
import moment from 'moment'
import { styles } from './style/GalleryStyle'

const defaultImageCacheManager = ImageCacheManager();
const ImageFast = createImageProgress(CachedImage);
const { width, height } = Dimensions.get('window');
export class GalleryScreen extends Component {
    constructor(props) {
        super(props)
        this.onEndReachedCalledDuringMomentum = true;
        this.state = {
            images: {},
            date: new Date(),
            listImage: [],
            loadMore: false,
            visible: false,
            currIndex: 0,
            changeBG: false,
            online: true,
            idDevice: 2
        }
        this.debouceLoad = _.debounce(() => this.handleLoadMore(), 500)
    }

    componentDidMount() {
        this.init();
        this.CheckConnectivity();
        this.checkSizeOfDevice()
    }

    checkSizeOfDevice = () => {
        //calculate inch of device
        let sizeDevice = Math.sqrt((width * width) + (height * height));
        this.setState({ idDevice: this.checkSizeDevice(sizeDevice) })
    }

    /**
     * check size device to return id
     * @param {*} size 
     */
    checkSizeDevice = (size) => {
        if (size < 720) {
            return 1
        } else if (720 <= size && size < 1080) {
            return 2
        } else if (1080 <= size && size < 1440) {
            return 3
        } else {
            return 4
        }
    }


    /**
     * check connect to internet
     */
    CheckConnectivity = () => {
        // For Android devices
        if (Platform.OS === 'android') {
            NetInfo.fetch().then(state => {
                if (state.isConnected && state.isInternetReachable) {
                    this.setState({ online: true });
                } else {
                    this.setState({ online: false });
                }
            });
        } else {
            // For iOS devices
            NetInfo.addEventListener(state => {
                if (state.isConnected) {
                    this.setState({ online: true });
                } else {
                    this.setState({ online: false });
                }
            });
        }
    };

    init = async () => {
        let listImage = await getListImageWelcome();
        this.setState({ listImage: listImage })
    }

    componentWillUnmount() {
        this.props.route.params.update();
    }

    onDismiss = () => {
        this.init();
        this.CheckConnectivity();
        this.setState({ visible: false, calcImgHeight: 0 })
    }
    goBack = () => {
        this.props.navigation.goBack();
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

    /**
     * show detail image
     * @param {*} item 
     * @param {*} index 
     */
    goToDetail = (item, index) => {
        this.setState({ visible: true, currIndex: index, currIndexShow: 0 })

        if (this.state.online) {
            Image.getSize(
                this.state.listImage[index].UrlImageFull,
                (widthImg, heightImg) => {
                    this.setState({
                        calcImgHeight: heightImg / widthImg,
                    })
                }
            );
        } else {
            if (this.state.listImage[index].height) {
                this.setState({
                    calcImgHeight:
                        this.state.listImage[index].height / this.state.listImage[index].width,
                })
            } else {
                this.setState({
                    calcImgHeight:
                        0.5,
                });
            }
        }
    }

    /**
     * get current index when scroll image
     * @param {*} index 
     */
    setCurrIndex = (index) => {
        this.setState({ currIndex: index });
    }

    renderFooter = () => {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loadMore ? <ActivityIndicator color='#015cd0' /> : null}
            </View>
        )
    }

    getRandomInt = max => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    /**
     * set BG for welcome screen
     */
    setBG = () => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ])
                .then(result => {
                    if (result['android.permission.WRITE_EXTERNAL_STORAGE']) {
                        {
                            if (this.state.listImage[this.state.currIndex].uriBK) {
                                let imageBK = this.state.listImage[this.state.currIndex].uriBKName.split('.');
                                this.zoomModal.toast.close()
                                let toPath = `${RNFS.DocumentDirectoryPath}/${(Math.random() * 1000) | 0}.${imageBK.pop()}`;
                                //copy local image asset to device
                                RNFS.copyFileAssets('images/' + this.state.listImage[this.state.currIndex].uriBKName, toPath)
                                    .then(() => {
                                        //setBG
                                        NativeModules.WallpaperModule.showText(toPath, true);
                                    }
                                    ).catch((error) => console.log(error, 'ERROR'));
                            } else {
                                defaultImageCacheManager.downloadAndCacheUrl(this.state.listImage[this.state.currIndex].UrlImageFull, {}).then(
                                    response => {
                                        this.zoomModal.toast.close()
                                        if (response) {
                                            NativeModules.WallpaperModule.showText(`${response}`, true);
                                        } else {
                                            NativeModules.WallpaperModule.showText(this.state.listImage[this.state.currIndex].UrlImageFull, false)
                                        }

                                    }).catch(err => {
                                        if (this.state.online) {
                                            this.zoomModal.toast.close()
                                            NativeModules.WallpaperModule.showText(this.state.listImage[this.state.currIndex].UrlImageFull, false)
                                        } else {
                                            this.zoomModal.toast.close()
                                            ToastAndroid.show("Không thể tải hình này làm ảnh hình nền!", ToastAndroid.SHORT);
                                        }
                                    });
                            }

                        }
                    }
                })
                .catch(err => {
                    this.zoomModal.toast.close()
                });

        }

    }

    /**
     * get more image when less than 5
     * @param {*} listGallery 
     */
    getImageFromApi = async (listGallery) => {
        // let numLine = listGallery.filter(e => e.status !== 'use').length;
        let lastUpdate = await getLastUpdate();
        let lastGUID = await getLastGUID();
        //fetch image from server
        getImage(
            lastUpdate ? lastUpdate : '2020-09-01',
            lastGUID ? lastGUID : 'f4221488-da64-49df-b15e-520a905c6321', this.state.idDevice ? this.state.idDevice : 2,
            res => {
                if ((listGallery.length + res.Object.length) > 50) {
                    //delete when galley more than 50 image
                    listGallery.splice(0, (listGallery.length + res.Object.length - 50));
                    listGallery = [...listGallery, ...res.Object]
                } else {
                    listGallery = [...listGallery, ...res.Object];
                }

                //add image when have data
                if (res.Object.length > 0) {
                    //update last update && last GUID
                    setLastUpdate(moment(new Date()).format('YYYY-MM-DD'));
                    setLastGUID(res.Object.pop().ObjectGuid);
                    if (listGallery.length > 50) {
                        listGallery.splice(0, (listGallery.length - 50))
                    }
                    setListImageWelcome(listGallery);
                    this.setState({ listImage: listGallery })
                }

                this.setState({ loadMore: false })
            }, () => {
                this.setState({ loadMore: false })
            })
    }

    /**
     * load more
     */
    handleLoadMore = async () => {
        let listGallery = await getListImageWelcome();
        this.setState({ loadMore: true })
        this.getImageFromApi(listGallery)
    }

    /**
     * on scroll list to end
     */
    onEndReached = () => {
        // check scroll to end already
        this.CheckConnectivity()
        if (!this.onEndReachedCalledDuringMomentum) {
            this.debouceLoad();
            this.onEndReachedCalledDuringMomentum = true;
        }
    }


    renderError = () => {
        return (
            <Image
                style={styles.image}
                source={images.loadFailImage}
                resizeMethod="resize"
                resizeMode="contain"
            />
        );
    };

    renderIndicator = () => {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}>
                <ActivityIndicator size="small" color="gray" />
            </View>
        );
    };

    render() {
        const { intl } = this.props;
        const { formatMessage } = intl;
        return (
            <SafeAreaView style={styles.container}>
                <HeaderImageScreen gallery={true} goBack={this.goBack} formatMessage={formatMessage} />
                <View style={styles.body}>
                    <FlatList
                        style={{ flex: 1, width: '100%' }}
                        data={this.state.listImage}
                        bounces={true}
                        bouncesZoom={true}
                        renderItem={({ item, index }) => (
                            <View style={{ marginBottom: 4, width: '50%', elevation: 2, marginRight: index % 2 == 0 ? 2 : 0 }}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() => {
                                        this.goToDetail(item, index);
                                    }}>
                                    <ImageFast
                                        renderIndicator={this.renderIndicator}
                                        renderError={this.renderError}
                                        resizeMode={"cover"}
                                        style={styles.image}
                                        source={item.uriBK
                                            ? item.uriBK : {
                                                uri: item.UrlImageThumbnail,
                                            }}
                                    />

                                </TouchableOpacity>
                            </View>
                        )}
                        scrollEventThrottle={100}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.onEndReached}
                    />
                </View>
                <ImageZoomModal

                    formatMessage={formatMessage}
                    visibleModalImage={this.state.visible}
                    onDismiss={this.onDismiss}
                    images={this.state.listImage}
                    fromWelcome={false}
                    goToGallery={this.onDismiss}
                    currIndex={this.state.currIndex}
                    setBG={this.setBG}
                    setCurrIndex={this.setCurrIndex}
                    ref={ref => this.zoomModal = ref}
                    calcImgHeight={this.state.calcImgHeight}
                    online={this.state.online}
                    checkConnectivity={this.CheckConnectivity}
                    formatMessage={formatMessage}
                />
            </SafeAreaView>
        )
    }
}
GalleryScreen.propTypes = {
    intl: intlShape.isRequired,
};

GalleryScreen.contextTypes = {
    language: PropTypes.string,
};

export default injectIntl(GalleryScreen)
