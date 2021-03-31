import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, { Component } from 'react';

import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText/index';
import PropTypes from 'prop-types';

export default class SwitchButton extends Component {

    static propTypes = {
        onValueChange: PropTypes.func,
        defaultSwitch: PropTypes.number
    };

    static defaultProps = {
        onValueChange: () => null
    };

    constructor() {
        super();

        this.state = {
            activeSwitch: 1,
            sbWidth: 122,
            sbHeight: 44,
            direction: 'ltr',
            offsetX: new Animated.Value(0)
        };

        this._switchDirection = this._switchDirection.bind(this);
    }

    componentDidMount() {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.defaultSwitch != this.props.defaultSwitch) {
            if (nextProps.defaultSwitch == 2) {
                this.switchOn()
            } else {
                this.switchOff()
            }
        }

    }

    switchOn = () =>{
        this.setState({ activeSwitch: 2 })
                Animated.timing(
                    this.state.offsetX,
                    {
                        toValue: this.props.isBtnRound ? this.props.switchWidth - this.props.switchHeight : (((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * 1,
                        duration: 100,
                        useNativeDriver: true
                    }
                ).start()
    }

    switchOff = () =>{
        this.setState({activeSwitch:1})
        Animated.timing(
            this.state.offsetX,
            {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }
        ).start()
    }

    _switchDirection(direction) {
        let dir = 'row';

        if (direction === 'rtl') {
            dir = 'row-reverse';
        }
        else {
            dir = 'row';
        }
        return dir;
    }

    _switchThump(direction) {
        const { onValueChange, disabled } = this.props;
        let dirsign = 1;
        if (direction === 'rtl') {
            dirsign = -1;
        }
        else {
            dirsign = 1;
        }

        if (this.state.activeSwitch === 1) {
            this.setState({ activeSwitch: 2 }, () => onValueChange(this.state.activeSwitch));

            Animated.timing(
                this.state.offsetX,
                {
                    toValue: this.props.isBtnRound ? this.props.switchWidth - this.props.switchHeight : (((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * dirsign,
                    duration: this.props.switchSpeedChange || 100,
                    useNativeDriver: true
                }
            ).start();
        }
        else {
            this.setState({ activeSwitch: 1 }, () => onValueChange(this.state.activeSwitch));
            Animated.timing(
                this.state.offsetX,
                {
                    toValue: 0,
                    duration: this.props.switchSpeedChange || 100,
                    useNativeDriver: true
                }
            ).start();
        }
    }

    render() {

        return (

            <View>
                <TouchableOpacity activeOpacity={1} onPress={() => { this._switchThump(this.props.switchdirection || this.state.direction) }}>
                    <View
                        style={[{
                            width: this.props.switchWidth || this.state.sbWidth,
                            height: this.props.switchHeight || this.state.sbHeight,
                            borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
                            borderWidth: 0,
                            borderColor: this.props.switchBorderColor || "#d4d4d4",
                            backgroundColor: this.props.switchBackgroundColor || "#fff",
                            marginLeft: -2,

                        }]}
                    >
                        <View style={[{
                            flexDirection: this._switchDirection(this.props.switchdirection || this.state.direction)
                        }]} >

                            <Animated.View style={{ transform: [{ translateX: this.state.offsetX }] }}>
                                <View
                                    style={[switchStyles.wayBtnActive,
                                    {
                                        width: this.props.isBtnRound ? this.props.switchHeight + 2 : this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                        height: this.props.isBtnRound ? this.props.switchHeight + 2 : this.props.switchHeight - 5 || this.state.sbHeight - 5,
                                        borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
                                        borderColor: this.props.btnBorderColor || "transparent",
                                        backgroundColor: this.props.btnBackgroundColor || "#00bcd4",
                                        marginTop: this.props.isBtnRound ? -1 : 2.5,

                                        marginRight: this.props.isBtnRound ? 0 : 3,
                                        marginLeft: this.props.isBtnRound ? 0 : 3
                                    }]}
                                />
                            </Animated.View>

                            <View style={[switchStyles.textPos,
                            {
                                width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                height: this.props.switchHeight - 3 || this.state.sbHeight - 3,
                                left: 0,
                                paddingTop: 5,
                                transform: [{ translateY: 1 }, { translateX: 1 }],
                            }]}
                            >
                                {this.state.activeSwitch === 1 ? <OpenSansSemiBoldText
                                    style={[{ fontSize: 14, marginLeft: -5, color: "#000000" }]}>
                                    {this.props.text1}
                                </OpenSansSemiBoldText> : <OpenSansText style={[{ fontSize: 14, marginLeft: -5, color: "#393939" }]}>
                                        {this.props.text1}
                                    </OpenSansText>}

                            </View>

                            <View
                                style={[switchStyles.textPos,
                                {
                                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                    height: this.props.switchHeight - 3 || this.state.sbHeight - 3,
                                    right: 0,
                                    paddingTop: 6,
                                }]}
                            >
                                {this.state.activeSwitch === 2 ? <OpenSansSemiBoldText
                                    style={[{ fontSize: 14, color: "#000000" }]}>
                                    {this.props.text2}
                                </OpenSansSemiBoldText> : <OpenSansText style={[{ fontSize: 14, color: "#393939" }]}>
                                        {this.props.text2}
                                    </OpenSansText>}

                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
                { this.props.children}
            </View >

        );
    }

}

const switchStyles = StyleSheet.create({
    textPos: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rtl: {
        flexDirection: 'row-reverse'
    },
    ltr: {
        flexDirection: 'row'
    },
    wayBtnActive: {
        borderWidth: 0,
        marginTop: 2.5,
        marginRight: 3,
        marginLeft: 3
    }

});