import {
  Alert,
  Animated,
  Dimensions,
  Image,
  InteractionManager,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {PureComponent} from 'react';
import Toast , {DURATION} from 'react-native-easy-toast';

import CameraRoll from '@react-native-community/cameraroll';
import {FlatList} from 'react-native-gesture-handler';
import HeaderImageScreen from './HeaderImageScreen';
import {ImageCacheManager} from './react-native-cached-image/index';
import ImageItem from './ImageItem';
import ImgToBase64 from 'react-native-image-base64';
import {LightText} from '../../../../base/components/Text';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import _ from 'lodash';
import configuration from '../../../../configuration';
import {
  getListObjectGuid,
} from '../../../../core/storage';
import message from '../../../../core/msg/gallery';
import {styles} from './styles/ImageZoomStyle';

const defaultImageCacheManager = ImageCacheManager();
const {width} = Dimensions.get('window');
class ImageZoomModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      showModalSuccess: false,
      interactionsComplete: false,
      listImages: [],
      position: 0,
      loadText: false,
      pageScrolling: true,
      xOffset: new Animated.Value(0),
      listImage: [],
    };
    this.linkCurrent = '';
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({interactionsComplete: true});
    });
    //check internet
    this.CheckConnectivity();
  }

  onDismiss = () => {
    this.props.onDismiss();
  };

  goBack = () => {
    this.setState({calcImgHeight: 0});
    this.props.onDismiss();
  };

  goToGallery = () => {
    this.setState({calcImgHeight: 0});
    this.props.goToGallery();
  };

  renderHeader = () => {
    return (
      <View
        style={{
          height: 48,
          width: '100%',
          position: 'absolute',
          zIndex: 10,
          flex: 1,
        }}>
        <HeaderImageScreen
          length={this.props.images.length}
          index={this.props.currIndex + 1}
          goBack={this.goBack}
          goToGallery={this.goToGallery}
        />
      </View>
    );
  };

  /**
   * share image
   */
  share = () => {
    const {formatMessage} = this.props;
    const {Language} = configuration;
    const options = {
      subject: formatMessage(message.sharePhoto),
      url: '',
      message:
        Language === 'vi'
          ? this.props.images[this.props.currIndex].DescriptionVi
          : this.props.images[this.props.currIndex].DescriptionEn,
      title: formatMessage(message.sharePhoto),
    };
    if (this.props.images[this.props.currIndex].uriBK) {
      if (Platform.OS === 'android') {
        RNFS.readFileAssets(
          'images/' + this.props.images[this.props.currIndex].uriBKName,
          'base64',
        )
          .then(base64String => {
            options.url = `data:image/png;base64,${base64String}`;
            this.shareImage(options);
          })
          .catch(err => {
            console.log('err', err);
          });
      }else{
        RNFS.readFile(RNFS.MainBundlePath+'/images/' + this.props.images[this.props.currIndex].uriBKName,'base64').then(base64String=> {
          options.url = `data:image/png;base64,${base64String}`;
          this.shareImage(options);
        }).catch(errIos => console.log('errIos', errIos))
      }
    } else {
      this.toast.show(formatMessage(message.waiting), DURATION.FOREVER);
      this.setState({loadingShare: true});
      defaultImageCacheManager
        .downloadAndCacheUrl(
          this.props.images[this.props.currIndex].UrlImageFull,
          {},
        )
        .then(response => {
          if (response) {
            this.toast.close();
            options.url = `file://${response}`;
            this.shareImage(options);
            this.setState({loadingShare: false});
          } else {
            this.shareFromServer(options);
          }
        })
        .catch(err => {
          console.log('err: ', err);

          this.shareFromServer(options);
        });
    }
  };

  shareFromServer = options => {
    const {formatMessage} = this.props;
    ImgToBase64.getBase64String(
      encodeURI(this.props.images[this.props.currIndex].UrlImageFull),
    )
      .then(base64String => {
        options.url = `data:image/png;base64,${base64String}`;
        if (this.props.online) {
          this.shareImage(options);
        } else {
          this.toast.close();
          this.setState({loadingShare: false});
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              formatMessage(message.checkInternet) + '!',
              ToastAndroid.SHORT,
            );
          } else {
            Alert.alert(formatMessage(message.checkInternet) + '!');
          }
        }
      })
      .catch(() => {
        if (Platform.OS === 'android') {
          ToastAndroid.show(
            formatMessage(message.checkInternet) + '!',
            ToastAndroid.SHORT,
          );
        } else {
          Alert.alert(formatMessage(message.checkInternet) + '!');
        }
        this.setState({loadingShare: false});
        this.toast.close();
      });
  };

  /**
   * share image action
   * @param {*} options
   */
  shareImage = options => {
    Share.open(options)
      .then(() => {
        this.setState({loadingShare: false});
        this.toast.close();
      })
      .catch(err => {
        this.setState({loadingShare: false});
        err && console.log(err);
        this.toast.close();
      });
  };

  setBG = () => {
    const {formatMessage} = this.props;
    this.toast.show(formatMessage(message.waiting), DURATION.FOREVER);
    this.props.setBG();
  };

  /**
   * download image
   */
  onDownloadImagePress = () => {
    const {formatMessage} = this.props;
    // check internet connect
    // if (this.state.online) {
    const imagePath = `${
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}`
        : `${RNFS.TemporaryDirectoryPath}`
    }/${(Math.random() * 1000) | 0}.png`;
    //android download
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ])
        .then(async result => {
          if (result['android.permission.WRITE_EXTERNAL_STORAGE']) {
            if (this.props.online) {
              if (this.props.images[this.props.currIndex].uriBK) {
                this.downloadAndroidOffline(imagePath);
              } else {
                this.setState({loadingDownload: true});
                this.downloadImageAndroid(imagePath);
              }
            } else {
              this.downloadAndroidOffline(imagePath);
            }
          }
        })
        .catch(err => console.log('err: ', err));
    } else {
      //ios download
      if (this.props.online) {
        this.downloadImageIOS(imagePath);
      } else {
        if (this.props.images[this.props.currIndex].uriBKName) {
          CameraRoll.saveToCameraRoll(
            RNFS.MainBundlePath +
              '/images/' +
              this.props.images[this.props.currIndex].uriBKName,
            'photo',
          )
            .then(() => {
              this.toast.close();
              setTimeout(() => {
                this.toastSave.show(formatMessage(message.saved), 700);
              }, 700);
            })
            .catch(() =>
              this.toast.show(formatMessage(message.saveFailed), 700),
            );
        } else {
          this.setState({loadingDownload: true});
          this.downloadImageIOS(imagePath);
        }
      }
    }
  };

  downloadAndroidOffline = imagePath => {
    const {formatMessage} = this.props;
    if (this.props.images[this.props.currIndex].uriBK) {
      let imageBK = this.props.images[this.props.currIndex].uriBKName.split(
        '.',
      );
      let toPath = `${RNFS.DownloadDirectoryPath}/${(Math.random() * 1000) |
        0}.${imageBK.pop()}`;
      //copy local image asset to device
      RNFS.copyFileAssets(
        'images/' + this.props.images[this.props.currIndex].uriBKName,
        toPath,
      )
        .then(() => {
          this.toast.close();
          setTimeout(() => {
            this.toastSave.show(formatMessage(message.saved), 700);
          }, 700);
        })
        .catch(() => this.toast.show(formatMessage(message.saveFailed), 700));
    } else {
      this.downloadImageAndroid(imagePath);
    }
  };

  /**
   * download android online
   * @param {*} params
   */
  downloadImageAndroid = () => {
    const {formatMessage} = this.props;
    let imageBK = this.props.images[this.props.currIndex].UrlImageFull.split(
      '.',
    );
    //path destination
    let toPath = `${RNFS.DownloadDirectoryPath}/${(Math.random() * 1000) |
      0}.${imageBK.pop()}`;
    this.toast.show(formatMessage(message.loading) + '...', DURATION.FOREVER);
    defaultImageCacheManager
      .downloadAndCacheUrl(
        this.props.images[this.props.currIndex].UrlImageFull,
        {},
      )
      .then(response => {
        if (response) {
          RNFS.copyFile(`file://${response}`, toPath)
            .then(() => {
              this.toast.close();
              setTimeout(() => {
                this.toastSave.show(formatMessage(message.saved), 700);
              }, 700);

              this.setState({loadingDownload: false});
            })
            .catch(() => {
              this.setState({loadingDownload: false});
              this.toast.show(formatMessage(message.saveFailed), 700);
              this.downloadImage();
            });
        } else {
          this.downloadImage();
        }
      })
      .catch(() => {
        this.setState({loadingShare: false});
        this.downloadImage();
        this.toast.close();
      });
  };

  downloadImage = () => {
    const {formatMessage} = this.props;
    const {Language} = configuration;
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        notification: true,
        mime: 'image/png',
        description: formatMessage(message.loadingPhoto) + '...',
        title:
          Language === 'vi'
            ? this.props.images[this.props.currIndex].DescriptionVi
            : this.props.images[this.props.currIndex].DescriptionEn,
        mediaScannable: true,
      },
    })
      .fetch(
        'GET',
        encodeURI(this.props.images[this.props.currIndex].UrlImageFull),
      )
      .then(() => {
        this.setState({loadingDownload: false});
        this.toast.close();
        setTimeout(() => {
          this.toastSave.show(formatMessage(message.saved), 700);
        }, 700);
      })
      .catch(() => {
        this.setState({loadingDownload: false});
        ToastAndroid.show(
          formatMessage(message.unableLoadPhoto),
          ToastAndroid.SHORT,
        );
      });
  };

  /**
   * down load on ios
   * @param {*} imagePath
   */
  downloadImageIOS = imagePath => {
    const {formatMessage} = this.props;
    this.toast.show(formatMessage(message.loading) + '...');
    defaultImageCacheManager
      .downloadAndCacheUrl(
        this.props.images[this.props.currIndex].UrlImageFull,
        {},
      )
      .then(response => {
        if (response) {
          CameraRoll.saveToCameraRoll(`${response}`, 'photo')
            .then(() => {
              this.setState({loadingDownload: false});
              this.toast.close();
              setTimeout(() => {
                this.toastSave.show(formatMessage(message.saved), 700);
              }, 700);
            })
            .catch(() => {
              setTimeout(() => {
                this.toast.show(formatMessage(message.saveFailed), 700);
              }, 700);
              this.setState({loadingDownload: false});
            });
        } else {
          this.downloadIos(imagePath);
        }
      })
      .catch(() => {
        this.downloadIos(imagePath);
        this.setState({loadingShare: false});
        this.toast.close();
      });
  };

  downloadIos = imagePath => {
    const {formatMessage} = this.props;
    RNFS.downloadFile({
      fromUrl: encodeURI(this.props.images[this.props.currIndex].UrlImageFull),
      toFile: imagePath,
    })
      .promise.then(() => {
        CameraRoll.saveToCameraRoll(imagePath, 'photo')
          .then(() => {
            this.setState({loadingDownload: false});
            this.toast.close();
            setTimeout(() => {
              this.toastSave.show(formatMessage(message.saved), 700);
            }, 700);
          })
          .catch(() => {
            setTimeout(() => {
              this.toast.show(formatMessage(message.saveFailed), 700);
            }, 700);
            this.setState({loadingDownload: false});
          });
      })
      .catch(() => {
        Alert.alert(formatMessage(message.errorSavePhoto) + '!');
        this.setState({loadingDownload: false});
        this.toast.close();
      });
  };

  /**
   * render image of custom slide
   * @param {*} param0
   */
  renderItem = ({item, index}) => {
    let calHeight;
    if (this.state.calcImgHeight) {
      calHeight = this.state.calcImgHeight;
    } else {
      calHeight = this.props.calcImgHeight;
    }
    return (
      <ImageItem
        item={item}
        currIndex={this.props.currIndex}
        images={this.props.images}
        calHeight={calHeight}
        formatMessage={this.props.formatMessage}
        index={index}
        onLoadEvent={this.onLoadEvent}
        ref={ref => (this.imageItem = ref)}
      />
    );
  };

  onLoadEvent = evt => {
    if (this.props.currIndex === 0) {
      this.setState({
        calcImgHeight: evt.nativeEvent.height / evt.nativeEvent.width, // By this, you keep the image ratio
      });
    }
  };

  /**
   * check connect to internet
   */
  CheckConnectivity = () => {
    this.props.checkConnectivity();
  };

  /**
   * dispatch when swipe to other image
   * @param {*} index
   */
  onChangeHandle = index => {
    if (index <= this.props.images.length - 1) {
      this.props.setCurrIndex(index);
    }
    this.CheckConnectivity();
  };

  onScrollEnd = async e => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum !== this.props.currIndex) {
      this.nextImage(pageNum);
      this.CheckConnectivity();
    }
  };

  nextImage = index => {
    this.props.setCurrIndex(index);

    if (this.props.online) {
      Image.getSize(
        this.props.images[index].UrlImageFull,
        (widthImg, heightImg) => {
          this.setState({
            calcImgHeight: heightImg / widthImg,
          });
        },
      );
    } else {
      if (this.props.images[index].height) {
        this.setState({
          calcImgHeight:
            this.props.images[index].height / this.props.images[index].width,
        });
      } else {
        this.setState({
          calcImgHeight: 0.5,
        });
      }
    }
  };

  /**
   * check image exist cache folder
   return image path
   */
  checkImageExistCacheFolder = async objectGuid => {
    let linkImage;

    let returnLink = RNFS.readDir(RNFS.CachesDirectoryPath).then(res => {
      let value;
      res.forEach((element) => {
        if (element.name === objectGuid) {
          value = element.path;
          this.linkCurrent = element.path;
        }
      });
      return value;
    });
    linkImage = await returnLink;
    return linkImage;
  };

  /**
   * check image exist list objectGuid
   * return image path
   */
  checkImageExistainList = async objectGuid => {
    let listImage = await getListObjectGuid();
    if (listImage.includes(objectGuid)) {
      return true;
    }
    return false;
  };

  getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  render() {
    const {visibleModalImage, images, formatMessage} = this.props;
    // images.map(e => {
    //   newImages.push({ url: e.UrlImageFull, props: e });
    // });
    return (
      <Modal
        propagateSwipe
        hasBackdrop={true}
        animationIn={'zoomInUp'}
        animationOut={'fadeOutRight'}
        isVisible={visibleModalImage}
        transparent={true}
        backdropOpacity={0.5}
        style={{backgroundColor: 'white'}}
        useNativeDriver={true}
        animationInTiming={300}
        animationOutTiming={200}
        style={{marginLeft: 0}}
        onRequestClose={() => {
          this.onDismiss();
        }}>
        <SafeAreaView style={styles.containerDialogConfirm}>
          {/* <StatusBar hidden /> */}
          <View
            style={{
              height: 48,
            }}>
            <HeaderImageScreen
              length={this.props.images.length}
              index={this.props.currIndex + 1}
              goBack={this.goBack}
              goToGallery={this.goToGallery}
            />
          </View>
          <View
            style={{
              width: width,
              flex: 1,
              position: 'relative',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              keyExtractor={(index, item) => item + index.toString()}
              ref={ref => (this.flatListImage = ref)}
              data={images}
              horizontal
              pagingEnabled={true}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}
              getItemLayout={this.getItemLayout}
              onMomentumScrollEnd={this.onScrollEnd}
              initialScrollIndex={this.props.currIndex}
              scrollEventThrottle={250}
              initialNumToRender={1}
              maxToRenderPerBatch={1}
              removeClippedSubviews={true}
            />
          </View>
          <View style={{width: width, height: 49, justifyContent: 'center'}}>
            <View style={styles.bottom}>
              <TouchableOpacity
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                disabled={this.state.loadingShare}
                onPress={this.share}
                style={styles.transformShare}>
                <View style={styles.bottomItem}>
                  <Image
                    source={require('../../CalendarScreen/Themes/icon/Group-91203x.png')}
                    style={styles.iconBottomShare}
                    resizeMode="contain"
                  />

                  <LightText
                    style={[styles.textBottom, {transform: [{translateX: 2}]}]}>
                    {formatMessage(message.share)}
                  </LightText>
                </View>
              </TouchableOpacity>
              {Platform.OS === 'android' && (
                <TouchableOpacity
                  hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                  onPress={this.setBG}>
                  <View style={styles.bottomItem}>
                    <Image
                      source={require('../../CalendarScreen/Themes/icon/Group-91213x.png')}
                      style={styles.iconBottomGallery}
                      resizeMode="contain"
                    />
                    <LightText style={styles.textBottom}>
                      {formatMessage(message.setWallpaper)}
                    </LightText>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                disabled={this.state.loadingDownload}
                onPress={this.onDownloadImagePress}>
                <View style={styles.bottomItem}>
                  <Image
                    source={require('../../CalendarScreen/Themes/icon/Group-91223x.png')}
                    style={styles.iconBottomSave}
                    resizeMode="contain"
                  />
                  <LightText
                    style={[styles.textBottom, {transform: [{translateX: 2}]}]}>
                    {formatMessage(message.save)}
                  </LightText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Toast
            ref={ref => (this.toast = ref)}
            useNativeDriver={true}
            style={{
              backgroundColor: 'rgba(201,201,201,0.8)',
              borderRadius: 15,
            }}
            textStyle={{
              color: 'black',
              fontFamily: 'OpenSans-Regular',
            }}
          />
          <Toast
            ref={ref => (this.toastSave = ref)}
            useNativeDriver={true}
            style={{
              backgroundColor: 'rgba(1,102,222,0.8)',
              borderRadius: 15,
            }}
            textStyle={{
              color: 'white',
              fontFamily: 'OpenSans-Regular',
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

export default ImageZoomModal;
