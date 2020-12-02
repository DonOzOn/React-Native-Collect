import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { Component } from 'react';
import Toast, { DURATION } from 'react-native-easy-toast'

import { Colors } from '../../Themes';
import { Header } from 'react-native-elements';
import ModalDetailProduct from './component/ModalDetailProduct';
import OrderActions from '../../Redux/OrderRedux';
import Profile from '../../Model/Profile';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ResultWareHouse from '../../Model/ResultWareHouse';
import { connect } from 'react-redux';

class ScannerProduct extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            item: null,
            amount: 0,
            store: null,
            visible: false,
            storeFromSelect: null,
            listStore: [],
            importWarehouse: false
        }
    }

    componentDidMount() {
        let listStore = this.props.navigation.getParam('listStore')
        let storeFromSelect = this.props.navigation.getParam('storeFromSelect')
        let importWarehouse = this.props.navigation.getParam('importWarehouse')
        if (listStore) {
            this.setState({ listStore: listStore })
        }
        if (storeFromSelect) {
            this.setState({ storeFromSelect: storeFromSelect })
        }
        if (importWarehouse) {
            this.setState({ importWarehouse: true })
        }
    }


    /**
     * add product to card
     * @param {*} obj 
     */
    addProduct = (obj) => {
        this.closeModalDetail();
        this.toast.show('Đã thêm vào giỏ hàng', 700)
        this.props.addProduct(obj)
    }

    /**
     * close modal detail
     */
    closeModalDetail = () => {
        this.setState({ visible: false, store: 0, amount: 0 })
    }


    /**
     * get product infor
     * @param {*} id 
     * @param {*} store 
     */
    getProduct = (id, store = 1) => {
        console.log('storegetProduct: ', store)
        this.setState({ loading: true }, async () => {
            let optionalParams = {
                productId: id,
            };
            let options = {};
            let filteredData = null;
            try {
                filteredData = await ResultWareHouse.getWarehouseResult(
                    optionalParams,
                    options,
                );
                let found = false;
                if (filteredData.status === 200) {
                    if (filteredData.data.length > 0) {
                        filteredData.data.forEach((ele, index) => {
                            if (ele.storeResponseDTO.id == store) {
                                found = true;
                                this.setState({
                                    item: ele.product,
                                    store: ele.storeResponseDTO,
                                    amount: ele.amount,

                                });
                            }
                            if (index === filteredData.data.length - 1) {
                                if (!found) {
                                    this.setState({ amount: 0 })
                                }
                                this.setState({ visible: true })
                            }
                        });
                    } else {
                        let optionalParamsElse = {};
                        let options = {
                            idModel: id,
                        };
                        let productResultById = await Profile.getProduct(
                            optionalParamsElse,
                            options,
                        );

                        this.setState({
                            loading: false,
                            visible: false,
                            item: productResultById,
                            amount: 0,
                            store: null
                        });
                    }
                } else {
                    this.setState({ loading: false, visible: false }, () => {
                        Alert.alert('Lấy thông tin sản phẩm thất bại.Vui lòng thử lại');
                    });
                }
            } catch (error) {
                Alert.alert('Có lỗi xảy ra.Vui lòng thử lại');
                this.setState({ loading: false, visible: false });
            }

        });
    };

    /**
     * get infor scanner
     * @param {*} e 
     */
    onSuccess = async (e) => {
        const normalUrl = e.data.toString().replace('&', '/');
        const arr = normalUrl.split('/');
        let storeId = arr.pop();
        let productId = arr.pop();
        if (productId.includes('-')) {
            productId = storeId;
            storeId = 1;
        }
        this.getProduct(productId, storeId);

    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    leftComponent={{
                        icon: 'ios-arrow-back',
                        type: 'ionicon',
                        color: '#fff',
                        size: 30,
                        onPress: () => this.props.navigation.goBack(),
                        hitSlop: { top: 20, bottom: 20, left: 50, right: 50 },
                    }}
                    // leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', color: '#fff', size: 30,onPress: () => this.props.navigation.pop() }}
                    centerComponent={{
                        text: 'Quét Mã QRCode',
                        style: { color: '#fff', fontWeight: '600', fontSize: 18 },
                    }}
                    containerStyle={styles.headerContainer}
                    backgroundColor={Colors.mainColor}
                />
                <QRCodeScanner onRead={this.onSuccess.bind(this)}
                    ref={(node) => { this.scanner = node }}
                    reactivate={!this.state.visible}

                // reactivateTimeout={5000} 
                />
                <ModalDetailProduct
                    visible={this.state.visible}
                    key={this.state.item}
                    closeModal={this.closeModalDetail}
                    addProduct={this.addProduct}
                    store={this.state.store}
                    item={this.state.item}
                    listStore={this.state.listStore}
                    storeChoose={this.state.storeFromSelect}
                    scanner={true}
                    amount={this.state.amount}
                    getProduct={this.getProduct}
                    importScreen={this.state.importWarehouse}
                />
                <Toast ref={ref => this.toast = ref}
                    useNativeDriver={true}
                    style={{
                        backgroundColor: 'rgba(1,102,222,0.7)',
                        borderRadius: 15,
                    }}
                    textStyle={{
                        color: 'white',
                    }} />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        userList: state.user.userList,
        role: state.user.role,
        user: state.user.info,
    };
};

const mapDispatchToProps = {
    getUser: (search, types) => UserActions.userRequest(search, types),
    addProduct: data => OrderActions.addProduct(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(ScannerProduct);
const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});
