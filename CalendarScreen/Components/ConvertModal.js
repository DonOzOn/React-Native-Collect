import { Button, Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

import ChuyenDoiAmDuong from '../Containers/ChuyenDoiAmDuong';
import Modal from 'react-native-modal';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import SwitchButton from './SwitchButton';
import { backgroundColor } from './react-native-calendars/src/style';
import configuration from '../../../../configuration';
import message from '../../../../core/msg/calendar';
import moment from 'moment';
import { styles } from './Styles/ConvertModalStyle'

const { width, height } = Dimensions.get('window');
export class ConvertModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            activeSwitch: 1,
            daySelect: moment(new Date()).format('YYYY-MM-DD')
        }
    }

    back = () => {
        this.props.modalHandle();
    }

    selectDate = (date) => {
        // this.back()
        this.props.changeDate(date);

    }


    toDaySelect = () => {
        this.convert.reset();
    }

    backToWelcome = () => {
        this.props.backToWelcome();
    }

    render() {
        const { isVisible, formatMessage } = this.props;
        return (
            <Modal
                isVisible={isVisible}
                useNativeDriver={true}
                onBackdropPress={  this.backToWelcome}
                onRequestClose={() => {
                    this.backToWelcome()
                }}
                hasBackdrop={true}
                transparent={true}
                backdropOpacity={0.5}
                animationInTiming={300}
                animationOutTiming={700}
                onModalHide={this.back}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                onDismiss={this.back}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={this.toDaySelect}
                            hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                            style={styles.modalHeaderLeft}>
                            <OpenSansText style={styles.headerLeft}>
                              {formatMessage(message.today)}
                        </OpenSansText>
                        </TouchableOpacity>

                        <View style={styles.modalHeaderCenter}>
                            <SwitchButton
                                onValueChange={(val) => {
                                    this.setState({ activeSwitch: val });
                                }      // this is necessary for this component
                                }
                                useNativeDriver={true}
                                text1={formatMessage(message.solar)}
                                text2={formatMessage(message.lunar)}
                                switchWidth={122}
                                switchHeight={height / 22.5}
                                switchdirection='rtl'
                                switchBorderRadius={16}
                                switchSpeedChange={0}
                                switchBackgroundColor='#d2d2d2'
                                btnBackgroundColor='white'
                                fontColor='#000000'
                                activeFontColor='#000000'
                            />

                        </View>
                        <TouchableOpacity onPress={this.back} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <OpenSansText style={styles.headerRight}>
                            {formatMessage(message.close)}
                        </OpenSansText>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.main}>
                        <ChuyenDoiAmDuong
                            activeSwitch={this.state.activeSwitch}
                            ref={convert => { this.convert = convert }}
                            selectDate={this.selectDate}
                            selectedDate={this.props.selectedDate}
                        />
                    </View>

                    <View style={styles.dateChooseCOntainer} >
                        <TouchableOpacity onPress={() => this.convert.select()} style={styles.dateChoose}>
                            <OpenSansText style={styles.buttonChoose}> {formatMessage(message.chooseADate)}</OpenSansText>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        )
    }
}

export default ConvertModal
