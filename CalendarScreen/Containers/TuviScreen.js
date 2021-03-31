import 'moment/locale/vi'; // without this line it didn't work

import { CalendarChinese, CalendarVietnamese } from 'date-chinese';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { Component } from 'react';
import {
    calculateCanofDay,
    calculateCanofMonth,
    calculateChiofDay,
    canHour,
    convertSolar2Lunar,
    getCanHour,
    getGioHacDao,
    getGioHoangDao,
    getSuggest,
    getSuggestBad,
    hoangdao,
    hoangdaoEn
} from '../Transforms/ConvertToCanchi';
import {
    can,
    canEn,
    chi,
    chiEN,
    chiENG,
    chiofMonth,
    chiofMonthEN,
    dow,
    dowEN
} from '../Transforms/LunarWord'
import { close, open } from '../../../../core/db/SqliteDb';

import FastImage from 'react-native-fast-image';
import OpenSansSemiBoldText from '../../../../base/components/Text/OpenSansSemiBoldText';
import OpenSansText from '../../../../base/components/Text/OpenSansText';
import configuration from '../../../../configuration';
import message from '../../../../core/msg/calendar';
import moment from 'moment';
import styles from './Styles/TuviScreenStyle';

// Styles
const { width, height } = Dimensions.get('window');
const listOptionLunar = ['Không lặp', 'Hàng tháng', 'Hàng năm'];
const listOptionSolar = [
    'Không lặp',
    'Hàng ngày',
    'Hàng tuần',
    'Hàng tháng',
    'Hàng năm',
];
/**
 * convert date to lunar
 */
const convertToLunar = date => {
    let getDate = date.split(' ');
    const lunar = convertSolar2Lunar(
        parseInt(moment(getDate[0]).format('DD')),
        parseInt(moment(getDate[0]).format('MM')),
        parseInt(moment(getDate[0]).format('YYYY')),
        7,
    );
    return `${lunar[2]}-${lunar[1] < 10 ? '0' : ''}${lunar[1]}-${lunar[0]} ${getDate[1]
        }`;
};
class TuviScreen extends Component {
    constructor(props) {
        super(props);
        this.cal = new CalendarVietnamese();
        this.db = null;
        this.state = {
            markedDates: {},
            selectedDate: {
                day: moment().date(),
                month: moment().month() + 1,
                year: moment().year(),
                dateString: moment().format('YYYY-MM-DD'),
            },
            date: moment().format('YYYY-MM-DD'),
            line: 2
        };
    }
    componentDidMount() {
        this.returnAnimalName()
    }

    componentWillUnmount() {
        this.db = null
    }


    returnAnimalImage = (name) => {
        switch (name) {
            case 'Tý':
                return require('../Themes/icon/Group-91093x.png')
            case 'Sửu':
                return require('../Themes/icon/Group-91073x.png')
            case 'Dần':
                return require('../Themes/icon/Group-91123x.png')
            case 'Mão':
                return require('../Themes/icon/Group-91173x.png')
            case 'Thìn':
                return require('../Themes/icon/Group-91133x.png')
            case 'Tỵ':
                return require('../Themes/icon/Group-91113x.png')
            case 'Ngọ':
                return require('../Themes/icon/Group-91163x.png')
            case 'Mùi':
                return require('../Themes/icon/Group-91083x.png')
            case 'Thân':
                return require('../Themes/icon/Group-91143x.png')
            case 'Dậu':
                return require('../Themes/icon/Group-91103x.png')
            case 'Tuất':
                return require('../Themes/icon/Group-91183x.png')
            case 'Hợi':
                return require('../Themes/icon/Group-91153x.png')
            default:
                break;
        }
    }

    returnAnimalImageEN = (name) => {
        switch (name) {
            case 'Rat':
                return require('../Themes/icon/Group-91093x.png')
            case 'Ox':
                return require('../Themes/icon/Group-91073x.png')
            case 'Tiger':
                return require('../Themes/icon/Group-91123x.png')
            case 'Cat':
                return require('../Themes/icon/Group-91173x.png')
            case 'Dragon':
                return require('../Themes/icon/Group-91133x.png')
            case 'Snake':
                return require('../Themes/icon/Group-91113x.png')
            case 'Horse':
                return require('../Themes/icon/Group-91163x.png')
            case 'Goat':
                return require('../Themes/icon/Group-91083x.png')
            case 'Monkey':
                return require('../Themes/icon/Group-91143x.png')
            case 'Rooster':
                return require('../Themes/icon/Group-91103x.png')
            case 'Dog':
                return require('../Themes/icon/Group-91183x.png')
            case 'Pig':
                return require('../Themes/icon/Group-91153x.png')
            default:
                break;
        }
    }

    returnAnimalName = () => {
        const { Language } = configuration
        let chiName;
        if (Language === 'vi') {
            chiName = chi;
        } else {
            chiName = chiEN;
        }
        let time = moment().hours();
        if (1 <= time && time < 3) {
            return chiName[1]
        } else if (3 <= time && time < 5) {
            return chiName[2]
        } else if (5 <= time && time < 7) {
            return chiName[3]
        } else if (7 <= time && time < 9) {
            return chiName[4]
        } else if (9 <= time && time < 11) {
            return chiName[5]
        } else if (11 <= time && time < 13) {
            return chiName[6]
        } else if (13 <= time && time < 15) {
            return chiName[7]
        } else if (15 <= time && time < 17) {
            return chiName[8]
        } else if (17 <= time && time < 19) {
            return chiName[9]
        } else if (19 <= time && time < 21) {
            return chiName[10]
        } else if (21 <= time && time < 23) {
            return chiName[11]
        } else {
            return chiName[0]
        }
    }

    imageMarginBottom = (index) => {
        switch (index) {
            case 0:

                return 10;

            case 1:

                return 10;

            case 2:

                return 8;

            case 3:

                return 8;

            default:
                return 0;
        }

    }


    imageMarginBottomHacDao = (index) => {
        switch (index) {
            case 0:

                return 10;

            case 1:

                return 9;

            case 2:

                return 6;

            case 3:

                return 6;

            default:
                return 0;
        }

    }

    transformAnimal = (index) => {
        switch (index) {
            case 0:

                return 2;

            case 1:

                return 2;

            case 3:

                return 0.3;

            default:
                return 0;
        }

    }

    transformAnimalImage = (index) => {
        if (index < 4) {
            return 1.4;
        } else {
            return 0
        }
    }

    translateHour = (index) => {
        switch (index) {
            case 0:

                return 0.5;

            case 1:

                return 0.5;

            case 2:

                return -1.5;
            case 3:

                return -1.5;

            case 4:

                return -1.8;

            case 5:

                return -1.8;

            default:
                return 0;
        }

    }

    /**
     * return Heavenly
     * @param {*} name 
     */
    getHeavenlyEN = (name) => {
        if (name === 'Giáp' || name === 'Ất') {
            return 'Wood'
        } else if (name === 'Bính' || name === 'Đinh') {
            return 'Fire'
        } else if (name === 'Mậu' || name === 'Kỷ') {
            return 'Earth'
        } else if (name === 'Canh' || name === 'Tân') {
            return 'Metal'
        } else {
            return 'Water'
        }
    }

    /**
     * return yin/ yang base on chi
     * @param {*} animal 
     */
    nameYinYang = (animal) => {
        if (animal === 'Giáp' || animal === 'Bính' || animal === 'Mậu' || animal === 'Canh' || animal === 'Nhâm') {
            return 'Yang'
        } else {
            return 'Yin'
        }
    }

    defineLunarYear = () => {
        const numberYearDiffLunar = 1983 // con số chênh lệch của năm âm, cần cộng số này để lấy giá trị convert năm dương
        const [cycle, year, month, leap, day] = this.cal.get()
        return {
            year: year + numberYearDiffLunar,
            month,
            day,
            dateString: `${year + numberYearDiffLunar}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
        }
    }

    ceremonyHandle = (cere) => {
        let cereDate = cere.value;
        if (cere.private) {
            if (cere.lunar) {
                cereDate = cere.dateSolar
            }
        }
        let getDate = cereDate.split('/');
        let date = moment().month(getDate[1] - 1).date(getDate[0])
        this.db = open();
        this.db.transaction(txn => {
            if (cere.private) {
                txn.executeSql(
                    'Select * from bluzone_event where id = ?',
                    [cere.id],
                    (tx, res) => {
                        let listEvent = []
                        if (res.rows.length > 0) {
                            for (let i = 0; i < res.rows.length; i++) {
                                let row = res.rows.item(i);
                                listEvent.push(row);
                            }
                            this.props.goToDetail(listEvent[0])
                        }
                    },
                );
            } else {
                txn.executeSql(
                    'Select * from bluzone_event where event_date like ? and event_default = ? and type_event = ? and event_name_convert like ?',
                    [`${date.format('YYYY-MM-DD')}%`, true, cere.lunar ? true : false, `%${this.xoa_dau(cere.label)}%`],
                    (tx, res) => {
                        let listEvent = []
                        if (res.rows.length > 0) {
                            for (let i = 0; i < res.rows.length; i++) {
                                let row = res.rows.item(i);
                                listEvent.push(row);
                            }
                            this.props.goToDetail(listEvent[0])
                        } else {
                            //insert event
                            this.addDefaultEvent(cere, date.format('YYYY-MM-DD'))
                        }
                    },
                );
            }

        });
    }
    xoa_dau = str => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        return str.toLowerCase();
    };

    addDefaultEvent = (cere, date) => {
        this.db = open();
        let dateTime = moment(!cere.lunar ? this.props.date.dateString : date, 'YYYY-MM-DD')
            .hour(0)
            .minute(0).
            format('YYYY-MM-DD HH:mm')
        this.db.transaction((txn) => {
            txn.executeSql(
                'INSERT INTO bluzone_event(event_name, event_date,event_date_lunar, type_event, remind_time,remind_type, loop_type,day_loop, show_time_new, show_new,expire_show_new, status,event_default, event_name_EN,event_name_convert) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [cere?.label,
                    dateTime,
                cere?.lunar ? dateTime : null,
                cere?.lunar ? true : false,
                    1,
                    'd',
                cere?.lunar ? listOptionLunar.length - 1 : listOptionSolar.length - 1,
                    null,
                    null,
                    null,
                    null,
                    true,
                    true,
                cere?.labelEN,
                this.xoa_dau(cere?.label)
                ],
                (tx, res) => {
                    if (res.rowsAffected > 0) {
                        txn.executeSql(
                            "Select * from bluzone_event where id = ?",
                            [res.insertId],
                            (txx, result) => {
                                let item = [];
                                if (result.rows.length > 0) {
                                    for (let i = 0; i < result.rows.length; i++) {
                                        let row = result.rows.item(i);
                                        item.push(row)
                                    }
                                    this.props.goToDetail(item[0])
                                }

                            }
                        );
                    } else alert('Tạo sự kiện thất bại');

                }
            );
        })
        this.db = close()
    }

    render() {
        const date = this.props.date;
        const ceremoney = this.props.ceremoney;
        const { formatMessage } = this.props;
        const { Language } = configuration;
        this.cal.fromGregorian(date.year, date.month, date.day);

        let year = date.year;
        if (date.month - 1 === 0) {
            year = date.year - 1;
        }
        let day = moment(
            `${date.year}-${date.month}-${date.day}`,
            'YYYY-MM-DD',
        );

        let dateToTest = moment('2020-02-21', 'YYYY-MM-DD');
        let result = day.diff(dateToTest, 'days');
        if (result < 0) {
            result *= -1;
        }
        let circle = Math.floor(result / 28);
        let index = result - circle * 28;
        getSuggestBad(
            date.month,
            calculateChiofDay(date.year, date.month, date.day),
            index,
        );
        const yearLunar = this.defineLunarYear().year;
        const [, , month,] = this.cal.get();
        let isHoangdao = false;
        const chiofDay = calculateChiofDay(
            date.year ? date.year : moment().getYear(),
            date.month ? date.month : moment().getMonth() + 1,
            date.day ? date.day : moment().date(),
        );
        const datehoangdao = Language === 'vi' ? hoangdao[month] : hoangdaoEn[month];
        if (datehoangdao.indexOf(chiofDay) > -1) {
            isHoangdao = true;
        }
        let dayOfWeek = '';
        date.dateString
            ? (dayOfWeek = Language === 'vi' ? dow[moment(date.dateString, 'YYYY-MM-DD').weekday()] : moment(date.dateString).locale('en').format('dddd'))
            : (dayOfWeek = Language === 'vi' ? dow[moment().weekday()] : moment(date.dateString).locale('en').format('dddd'));
        return (
            <View style={[styles.container]}>
                <ScrollView contentContainerStyle={{ backgroundColor: '#fff' }}>
                    <View style={styles.inforContainer}>
                        <View style={styles.inforTopContainer}>
                            <View style={[styles.topItem]}>
                                <OpenSansSemiBoldText style={{ ...styles.daynameShow, transform: [{ translateY: 1.4 }], marginLeft: 2 }}>{dayOfWeek ? dayOfWeek.toUpperCase() : ''}</OpenSansSemiBoldText>
                                {Language === 'vi' ? <OpenSansText style={{ ...styles.hourLunar, marginTop: -5 }}>Giờ {canHour(calculateCanofDay(
                                    date.year,
                                    date.month,
                                    date.day,
                                ))} {this.returnAnimalName()}</OpenSansText> :
                                    <OpenSansText style={{ ...styles.hourLunar, marginTop: -5 }}>{this.nameYinYang(canHour(calculateCanofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    )))} {this.getHeavenlyEN(canHour(calculateCanofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    )))} {this.returnAnimalName()} Hour</OpenSansText>
                                }

                            </View>
                            <View style={[styles.topItem]}>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', }}>

                                    {Language === 'vi'
                                        ? <OpenSansSemiBoldText style={styles.monthDay}>{this.defineLunarYear().day} tháng {this.defineLunarYear().month}</OpenSansSemiBoldText>
                                        :
                                        <OpenSansSemiBoldText style={styles.monthDay}>{moment(this.defineLunarYear().dateString).locale('en').format('MMM DD')}</OpenSansSemiBoldText>
                                    }
                                    {Language === 'vi' ? <OpenSansText style={styles.yearLunar}> Năm {can[(this.defineLunarYear().year + 6) % 10]
                                    } {chi[(this.defineLunarYear().year + 8) % 12]}
                                    </OpenSansText> : <OpenSansText style={styles.yearLunar}> {this.nameYinYang(can[(this.defineLunarYear().year + 6) % 10])} {this.getHeavenlyEN(can[(year + 6) % 10]
                                    )} {chiEN[(this.defineLunarYear().year + 8) % 12]} Year
                                        </OpenSansText>}

                                </View>
                                <View style={{ alignItems: 'flex-end', justifyContent: "flex-start", marginTop: -15 }}>
                                    {Language === 'vi' ? <OpenSansText style={{ ...styles.hourLunar, marginBottom: 3 }}>Ngày {calculateCanofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    )} {calculateChiofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    )}</OpenSansText> :
                                        <OpenSansText style={{ ...styles.hourLunar, marginBottom: 3 }}>{this.nameYinYang(calculateCanofDay(
                                            date.year,
                                            date.month,
                                            date.day,
                                        ))} {this.getHeavenlyEN(calculateCanofDay(
                                            date.year,
                                            date.month,
                                            date.day,
                                        ))} {calculateChiofDay(
                                            date.year,
                                            date.month,
                                            date.day,
                                        )} Day</OpenSansText>}
                                    {Language === 'vi' ? <OpenSansText style={styles.hourLunar}>Tháng {calculateCanofMonth(
                                        yearLunar,
                                        month,
                                    )} {chiofMonth[month - 1]}</OpenSansText> : <OpenSansText style={styles.hourLunar}>
                                        {this.nameYinYang(calculateCanofMonth(
                                            yearLunar,
                                            month,
                                        ))} {this.getHeavenlyEN(calculateCanofMonth(
                                            yearLunar,
                                            month,
                                        ))} {chiofMonthEN[month - 1]} Month</OpenSansText>}


                                </View>


                            </View>
                            {isHoangdao && (
                                <View
                                    style={[
                                        styles.hoangDaoTextContainer
                                    ]}>
                                    <View
                                        style={[styles.dot, { transform: [{ translateY: 2.5 }] }]}
                                    />
                                    <OpenSansText style={styles.hoangDao}>{formatMessage(message.zodiacDay)}</OpenSansText>
                                </View>
                            )}
                        </View>




                        {ceremoney !== null && ceremoney.length > 0 ? <View style={styles.eventContainerOut}>
                            <View style={{ paddingLeft: width / 21.5, paddingRight: width / 20 }}>
                                <OpenSansSemiBoldText style={{ ...styles.daynameShow, marginBottom: 10 }}>{formatMessage(message.event).toUpperCase()} </OpenSansSemiBoldText>
                                {ceremoney == null || ceremoney.length == 0 ? <OpenSansText style={styles.emptyText}>{formatMessage(message.noEvents)}</OpenSansText> : <View>
                                    {ceremoney.map((cere, index) =>
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.ceremoneyContainer} onPress={() => this.ceremonyHandle(cere)}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                <View
                                                    style={[styles.dot, { backgroundColor: '#004cff', marginRight: 5 }]}
                                                />
                                                {/* <Text>{cere.value} : </Text> */}
                                            </View>

                                            <OpenSansText
                                                adjustsFontSizeToFit={true}
                                                numberOfLines={20}
                                            >
                                                {Language === 'vi' ?
                                                    cere.label : cere.labelEN} </OpenSansText>
                                        </TouchableOpacity>
                                    )}
                                </View>}
                            </View>

                        </View> : <View style={[styles.divide, { marginTop: 5 }]}>
                        </View>}

                        <View style={styles.hoangDaoContainer}>
                            <OpenSansSemiBoldText style={styles.dayname}>{formatMessage(message.zodiacHour).toUpperCase()}</OpenSansSemiBoldText>
                            <View style={[styles.containerWrap, { paddingLeft: width / 21.5, marginTop: 5, paddingRight: 6 }]}>
                                {getGioHoangDao(date.year, date.month, date.day).map(
                                    (text, indexOf) => {
                                        return (
                                            <View
                                                key={indexOf}
                                                style={{
                                                    width: indexOf % 2 != 0 ? '30%' : '69%',
                                                    paddingRight: indexOf % 2 != 0 ? 5 : 0
                                                }}>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <FastImage source={Language === 'vi'
                                                        ? this.returnAnimalImage(text.split(" ")[0])
                                                        : this.returnAnimalImageEN(text.split(" ")[0])
                                                    }
                                                        defaultSource={Language === 'vi'
                                                            ? this.returnAnimalImage(text.split(" ")[0])
                                                            : this.returnAnimalImageEN(text.split(" ")[0])
                                                        }
                                                        resizeMode="stretch"
                                                        style={[styles.imageAnimal,
                                                        {
                                                            marginBottom: this.imageMarginBottom(indexOf),
                                                            transform: [{ translateX: 1.4 }, {
                                                                translateY: this.transformAnimalImage(indexOf)
                                                            }]
                                                        }]}
                                                    />
                                                    <View style={{ marginLeft: indexOf % 2 === 0 ? 18 : 14, }}>
                                                        <OpenSansSemiBoldText
                                                            key={text}
                                                            style={{
                                                                ...styles.textTitleCanchi,
                                                                textAlign: 'left',
                                                                transform: [{ translateY: this.transformAnimal(indexOf) }, { translateX: 0.5 }]
                                                            }}>
                                                            {text.split(" ")[0]}
                                                        </OpenSansSemiBoldText>
                                                        <OpenSansText style={{
                                                            ...styles.hourLunar,
                                                            textAlign: 'left', marginBottom: this.imageMarginBottom(indexOf),
                                                            transform: [{ translateY: this.translateHour(indexOf) }, { translateX: indexOf % 2 === 0 ? 1 : 0 }]
                                                        }}>
                                                            {text.split(" ").pop()}
                                                        </OpenSansText>
                                                    </View>

                                                </View>

                                            </View>

                                        );
                                    },
                                )}
                            </View>
                        </View>
                        <View style={[styles.divide, { marginTop: 20, transform: [{ translateY: 1 }] }]} />
                        <View style={{ paddingTop: 18, paddingRight: 14 }}>
                            <OpenSansSemiBoldText style={{ ...styles.dayname, transform: [{ translateY: 2 }] }}>{formatMessage(message.blackHour).toUpperCase()}</OpenSansSemiBoldText>
                            <View style={[styles.containerWrap, { paddingLeft: width / 21.5, marginTop: 6, paddingRight: 6 }]}>
                                {getGioHacDao(date.year, date.month, date.day).map(
                                    (text, indexOf) => {
                                        return (
                                            <View
                                                key={indexOf}
                                                style={{ width: indexOf % 2 != 0 ? '30%' : '69%' }}>

                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    {/* <Text>{text.split(" ")[0]}</Text> */}
                                                    <FastImage source={Language === 'vi'
                                                        ? this.returnAnimalImage(text.split(" ")[0])
                                                        : this.returnAnimalImageEN(text.split(" ")[0])
                                                    }
                                                        defaultSource={Language === 'vi'
                                                            ? this.returnAnimalImage(text.split(" ")[0])
                                                            : this.returnAnimalImageEN(text.split(" ")[0])
                                                        }
                                                        resizeMode="stretch"
                                                        style={[styles.imageAnimal, {
                                                            marginRight: indexOf % 2 === 0 ? 18 : 14,
                                                            marginBottom: this.imageMarginBottomHacDao(indexOf),
                                                            transform: [{ translateX: 1 }]
                                                        }]}
                                                    />
                                                    <View>
                                                        <OpenSansSemiBoldText
                                                            key={text}
                                                            style={{ ...styles.textTitleCanchi, textAlign: 'left' }}>
                                                            {text.split(" ")[0]}
                                                        </OpenSansSemiBoldText>
                                                        <OpenSansText style={{
                                                            ...styles.hourLunar, ...{
                                                                textAlign: 'left',
                                                                marginBottom: this.imageMarginBottomHacDao(indexOf),
                                                                transform: [{ translateY: -2 }, { translateX: indexOf % 2 === 0 ? 1 : 0 }]
                                                            }
                                                        }}>
                                                            {text.split(" ").pop()}</OpenSansText>
                                                    </View>

                                                </View>
                                            </View>

                                        );
                                    },
                                )}
                            </View>
                        </View>

                    </View>


                    <View style={styles.shouldContainer}>
                        <View style={{ paddingLeft: width / 21.5, paddingRight: width / 20 }}>
                            <OpenSansSemiBoldText style={styles.daynameShow}>{formatMessage(message.dosAndDonts).toUpperCase()} </OpenSansSemiBoldText>
                            <OpenSansText style={styles.should}>{formatMessage(message.dos)}: </OpenSansText>
                            <OpenSansText style={styles.textSuggest}>
                                {getSuggest(
                                    date.month,
                                    calculateChiofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    ),
                                    index,
                                )}
                            </OpenSansText>
                            <OpenSansText style={styles.shouldnot}>{formatMessage(message.donts)}: </OpenSansText>
                            <OpenSansText style={styles.textSuggest}>
                                {getSuggestBad(
                                    date.month,
                                    calculateChiofDay(
                                        date.year,
                                        date.month,
                                        date.day,
                                    ),
                                    index,
                                )}
                            </OpenSansText>
                        </View>

                    </View>
                    <View style={styles.noteContainer}>
                        <View style={{ paddingLeft: width / 21.5, paddingRight: width / 20 }}>
                            <OpenSansSemiBoldText style={{ ...styles.daynameShow, marginBottom: width / 16 }}>{formatMessage(message.notes).toUpperCase()}</OpenSansSemiBoldText>
                            <View style={styles.noteItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View
                                        style={[styles.dot, { backgroundColor: '#ff0000' }]}
                                    />
                                    <OpenSansText style={styles.textNote}>{formatMessage(message.zodiacDay)}</OpenSansText>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View
                                        style={[styles.dot, { backgroundColor: '#a2a2a2' }]}
                                    />
                                    <OpenSansText style={styles.textNote}>{formatMessage(message.blackDay)}</OpenSansText>
                                </View>
                            </View>
                            <View style={styles.noteItem}>
                                <View style={styles.evenContainer}>
                                    <View
                                        style={[styles.dot, { backgroundColor: '#004cff' }]}
                                    />
                                    <OpenSansText style={styles.textNote}>{formatMessage(message.event)}</OpenSansText>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start', flex: 1, marginTop: width / 20
                                }}>
                                    {/* <View
                                        style={[styles.dot, { backgroundColor: '#ff9100' }]}
                                    />
                                    <OpenSansText style={styles.textNote}>
                                        {formatMessage(message.holidays)}
                                    </OpenSansText> */}
                                </View>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default (TuviScreen);
