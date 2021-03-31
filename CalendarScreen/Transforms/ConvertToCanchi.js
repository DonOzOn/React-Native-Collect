import { _28starBad, _28starBadEN, _28starGood, _28starGoodEN, can, canEn, chi, chiEN, chiENG, chiofMonth, tietkhi } from './LunarWord';

import _ from 'lodash'
import configuration from '../../../../configuration';
import moment from 'moment';

export const hoangdao = {
    '1': ['Tý', 'Sửu', 'Tỵ', 'Mùi'],
    '2': ['Dần', 'Mão', 'Mùi', 'Dậu'],
    '3': ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],
    '4': ['Ngọ', 'Mùi', 'Sửu', 'Dậu'],
    '5': ['Thân', 'Dậu', 'Sửu', 'Mão'],
    '6': ['Tuất', 'Hợi', 'Mão', 'Tỵ'],
    '7': ['Tý', 'Sửu', 'Tỵ', 'Mùi'],
    '8': ['Dần', 'Mão', 'Mùi', 'Dậu'],
    '9': ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],
    '10': ['Ngọ', 'Mùi', 'Sửu', 'Dậu'],
    '11': ['Thân', 'Dậu', 'Sửu', 'Mão'],
    '12': ['Tuất', 'Hợi', 'Mão', 'Tỵ'],
};


export const hoangdaoEn = {
    '1': ['Rat', 'Ox', 'Snake', 'Goat'],
    '2': ['Tiger', 'Cat', 'Goat', 'Rooster'],
    '3': ['Dragon', 'Snake', 'Rooster', 'Pig'],
    '4': ['Horse', 'Goat', 'Ox', 'Rooster'],
    '5': ['Monkey', 'Rooster', 'Ox', 'Cat'],
    '6': ['Dog', 'Pig', 'Cat', 'Snake'],
    '7': ['Rat', 'Ox', 'Snake', 'Goat'],
    '8': ['Tiger', 'Cat', 'Goat', 'Rooster'],
    '9': ['Dragon', 'Snake', 'Rooster', 'Pig'],
    '10': ['Horse', 'Goat', 'Ox', 'Rooster'],
    '11': ['Monkey', 'Rooster', 'Ox', 'Cat'],
    '12': ['Dog', 'Pig', 'Cat', 'Snake'],
};

var GIO_HD = [
    '110100101100',
    '001101001011',
    '110011010010',
    '101100110100',
    '001011001101',
    '010010110011',
];

export const getSuggest = (month, chi, index) => {
    let sugget = '';
    const { Language } = configuration;
    if (typeof index !== 'number') {
        index = 0;
    }
    if (_28starGood[index] != '') {
        if (Language === 'vi') {
            sugget += _28starGood[index] + ', ';
        } else {
            sugget += _28starGoodEN[index] + ', ';
        }

    }
    if (sugget == ', ') {
        if (Language === 'vi') {
            sugget = 'Không nên làm gì cả';
        } else {
            sugget = `Shouldn't do anything`;
        }
    } else {
        sugget = sugget.substring(0, sugget.length - 2);
    }
    return sugget;
};

export const getSuggestBad = (month, chi, index) => {
    const { Language } = configuration;
    let sugget = '';
    if (typeof index !== 'number') {
        index = 0;
    }
    if (Language === 'vi') {
        sugget += _28starBad[index] + ', ';
    } else {
        sugget += _28starBadEN[index] + ', ';
    }


    if (sugget == ', ') {
        if (Language === 'vi') {
            sugget = 'Không có gì kiêng kỵ';
        } else {
            sugget = 'No taboo';
        }

    } else {
        sugget = sugget.substring(0, sugget.length - 2);
    }
    return sugget;
};
export const calculateCanofMonth = (year, month) => {
    return can[(year * 12 + month + 3) % 10];
};
export const calculateCanofDay = (year, month, date) => {
    const { Language } = configuration;
    const jd = calculateJuliusDay(year, month, date);
    return can[(jd + 9) % 10];
};
export const calculateChiofDay = (year, month, date) => {
    const jd = calculateJuliusDay(year, month, date);
    const { Language } = configuration;
    return Language === 'vi' ? chi[(jd + 1) % 12] : chiEN[(jd + 1) % 12];
};
export const getCanHour = (year, month, date) => {
    const jd = calculateJuliusDay(year, month, date);
    return can[((jd - 1) * 2) % 10];
};


const controlCanArr = (listCan, number) => {
    let newArr = [...listCan]
    for (let index = 0; index < number; index++) {
        newArr.splice(0, 2)
        newArr = [...newArr, ..._.take(newArr, 2)]
    }
    return newArr;
}

const getChiIndex = () => {
    let time = moment().hours();
    if (1 <= time && time < 3) {
        return 1
    } else if (3 <= time && time < 5) {
        return 2
    } else if (5 <= time && time < 7) {
        return 3
    } else if (7 <= time && time < 9) {
        return 4
    } else if (9 <= time && time < 11) {
        return 5
    } else if (11 <= time && time < 13) {
        return 6
    } else if (13 <= time && time < 15) {
        return 7
    } else if (15 <= time && time < 17) {
        return 8
    } else if (17 <= time && time < 19) {
        return 9
    } else if (19 <= time && time < 21) {
        return 10
    } else if (21 <= time && time < 23) {
        return 11
    } else {
        return 0
    }
}

export const canHour = (canDay) => {
    let listCanHour = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
    listCanHour = [...listCanHour, ..._.take(listCanHour, 2)];
    if (canDay === 'Giáp' || canDay === 'Kỷ') {
        listCanHour = [...listCanHour];
    } else if (canDay === 'Ất' || canDay === 'Canh') {
        listCanHour = controlCanArr(listCanHour, 1);
    } else if (canDay === 'Bính' || canDay === 'Tân') {
        listCanHour = controlCanArr(listCanHour, 2);
    } else if (canDay === 'Đinh' || canDay === 'Nhâm') {
        listCanHour = controlCanArr(listCanHour, 3);
    } else {
        listCanHour = controlCanArr(listCanHour, 4);
    }
    return listCanHour[getChiIndex()];
};





const calculateJuliusDay = (yy, mm, dd) => {
    var a, y, m, jd;
    a = Math.floor((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd =
        dd +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045;
    if (jd < 2299161) {
        jd =
            dd +
            Math.floor((153 * m + 2) / 5) +
            365 * y +
            Math.floor(y / 4) -
            32083;
    }
    return jd;
    // return (
    //   date + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083
    // )
};

var PI = Math.PI;

/* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
export const INT = d => {
    return Math.floor(d);
};

/* Compute the longitude of the sun at any time.
 * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
 * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
 */
export const SunLongitude = jdn => {
    var T, T2, dr, M, L0, DL, lambda, theta, omega;
    T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = PI / 180; // degree to radian
    M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL =
        DL +
        (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
        0.00029 * Math.sin(dr * 3 * M);
    theta = L0 + DL; // true longitude, degree
    // obtain apparent longitude by correcting for nutation and aberration
    omega = 125.04 - 1934.136 * T;
    lambda = theta - 0.00569 - 0.00478 * Math.sin(omega * dr);
    // Convert to radians
    lambda = lambda * dr;
    lambda = lambda - PI * 2 * INT(lambda / (PI * 2)); // Normalize to (0, 2*PI)
    return lambda;
};

/* Compute the sun segment at start (00:00) of the day with the given integral Julian day number.
 * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
 * The export const returns a number between 0 and 23.
 * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
 * After that, return 1, 2, 3 ...
 */
export const getSolarTerm = (year, month, date, timeZone) => {
    const jd = calculateJuliusDay(year, month, date);
    return INT((SunLongitude(jd + 1 - 0.5 - timeZone / 24.0) / PI) * 12);
};

export const getGioHoangDao = (year, month, date) => {
    const { Language } = configuration;
    const jd = calculateJuliusDay(year, month, date);

    var chiOfDay = (jd + 1) % 12;
    var gioHD = GIO_HD[chiOfDay % 6]; // same values for Ty' (1) and Ngo. (6), for Suu and Mui etc.
    var ret = '';
    var count = 0;

    let array = [];
    for (var i = 0; i < 12; i++) {
        if (gioHD.charAt(i) == '1') {
            ret += Language === 'vi' ? chi[i] : chiEN[i];
            ret +=
                ' (' + ((i * 2 + 23) % 24) + '-' + ((i * 2 + 1) % 24) + 'h)';
            if (count++ < 6) {
                array.push(ret);
                ret = '';
            }
            //if (count == 3) ret += '\n';
        }
    }
    return array;
};
export const getGioHacDao = (year, month, date) => {
    const { Language } = configuration;
    const jd = calculateJuliusDay(year, month, date);

    var chiOfDay = (jd + 1) % 12;
    var gioHD = GIO_HD[chiOfDay % 6]; // same values for Ty' (1) and Ngo. (6), for Suu and Mui etc.
    var ret = '';
    var count = 0;
    let array = [];
    for (var i = 0; i < 12; i++) {
        if (gioHD.charAt(i) != '1') {
            ret += Language === 'vi' ? chi[i] : chiEN[i];
            ret +=
                ' (' + ((i * 2 + 23) % 24) + '-' + ((i * 2 + 1) % 24) + 'h)';
            if (count++ < 6) {
                array.push(ret);
                ret = '';
            }
            //if (count == 3) ret += '\n';
        }
    }
    return array;
};
export const getLunarMonth11 = (yy, timeZone) => {
    var k, off, nm, sunLong;
    off = jdFromDate(31, 12, yy) - 2415021;
    k = INT(off / 29.530588853);
    nm = getNewMoonDay(k, timeZone);
    sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
};

export const jdFromDate = (dd, mm, yy) => {
    var a, y, m, jd;
    a = INT((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd =
        dd +
        INT((153 * m + 2) / 5) +
        365 * y +
        INT(y / 4) -
        INT(y / 100) +
        INT(y / 400) -
        32045;
    if (jd < 2299161) {
        jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
};
export const jdToDate = jd => {
    var a, b, c, d, e, m, day, month, year;
    if (jd > 2299160) {
        // After 5/10/1582, Gregorian calendar
        a = jd + 32044;
        b = INT((4 * a + 3) / 146097);
        c = a - INT((b * 146097) / 4);
    } else {
        b = 0;
        c = jd + 32082;
    }
    d = INT((4 * c + 3) / 1461);
    e = c - INT((1461 * d) / 4);
    m = INT((5 * e + 2) / 153);
    day = e - INT((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * INT(m / 10);
    year = b * 100 + d - 4800 + INT(m / 10);
    return new Array(day, month, year);
};

export const getLeapMonthOffset = (a11, timeZone) => {
    var k, last, arc, i;
    k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
};

export const getSunLongitude = (jdn, timeZone) => {
    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.5 - timeZone / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = PI / 180; // degree to radian
    M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL =
        DL +
        (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
        0.00029 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - PI * 2 * INT(L / (PI * 2)); // Normalize to (0, 2*PI)
    return INT((L / PI) * 6);
};

export const getNewMoonDay = (k, timeZone) => {
    var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = PI / 180;
    Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    C1 =
        (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
        0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 =
        C1 -
        0.0074 * Math.sin(dr * (M - Mpr)) +
        0.0004 * Math.sin(dr * (2 * F + M));
    C1 =
        C1 -
        0.0004 * Math.sin(dr * (2 * F - M)) -
        0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 =
        C1 +
        0.001 * Math.sin(dr * (2 * F - Mpr)) +
        0.0005 * Math.sin(dr * (2 * Mpr + M));
    if (T < -11) {
        deltat =
            0.001 +
            0.000839 * T +
            0.0002261 * T2 -
            0.00000845 * T3 -
            0.000000081 * T * T3;
    } else {
        deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    JdNew = Jd1 + C1 - deltat;
    return INT(JdNew + 0.5 + timeZone / 24);
};

export const convertLunar2Solar = (
    lunarDay,
    lunarMonth,
    lunarYear,
    lunarLeap,
    timeZone,
) => {
    var k, a11, b11, off, leapOff, leapMonth, monthStart;
    if (lunarMonth < 11) {
        a11 = getLunarMonth11(lunarYear - 1, timeZone);
        b11 = getLunarMonth11(lunarYear, timeZone);
    } else {
        a11 = getLunarMonth11(lunarYear, timeZone);
        b11 = getLunarMonth11(lunarYear + 1, timeZone);
    }
    off = lunarMonth - 11;
    if (off < 0) {
        off += 12;
    }
    if (b11 - a11 > 365) {
        leapOff = getLeapMonthOffset(a11, timeZone);
        leapMonth = leapOff - 2;
        if (leapMonth < 0) {
            leapMonth += 12;
        }
        if (lunarLeap != 0 && lunarMonth != leapMonth) {
            return new Array(0, 0, 0);
        } else if (lunarLeap != 0 || off >= leapOff) {
            off += 1;
        }
    }
    k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    monthStart = getNewMoonDay(k + off, timeZone);
    return jdToDate(monthStart + lunarDay - 1);
};
export const convertSolar2Lunar = (dd, mm, yy, timeZone) => {
    var k,
        dayNumber,
        monthStart,
        a11,
        b11,
        lunarDay,
        lunarMonth,
        lunarYear,
        lunarLeap;
    dayNumber = jdFromDate(dd, mm, yy);
    k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    a11 = getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    const diff = INT((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
            lunarMonth = diff + 10;
            if (diff == leapMonthDiff) {
                lunarLeap = 1;
            }
        }
    }
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
    }
    return new Array(lunarDay, lunarMonth, lunarYear);
};
export const leapYear = (year) => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

export const isNhuanYear = year => {
    const remain = year % 19;
    switch (remain) {
        case 0:
            return true;
        case 3:
            return true;
        case 6:
            return true;
        case 9:
            return true;
        case 11:
            return true;
        case 14:
            return true;
        case 17:
            return true;
        default:
            return false;
    }
};


const hacDaoJan = ['Ngọ', 'Mão', 'Hợi', 'Dậu']
const hacDaoFeb = ['Thân', 'Tỵ', 'Sửu', 'Hợi']
const hacDaoMar = ['Tuất', 'Mùi', 'Sửu', 'Mão']
const hacDaoJul = ['Tý', 'Dậu', 'Tỵ', 'Mão']
const hacDaoMay = ['Dần', 'Hợi', 'Mùi', 'Tỵ']
const hacDaoJun = ['Thìn', 'Sửu', 'Dậu', 'Mùi']

export const checkBadDay = (month, nameAnimal) => {
    if ((month === 1 || month === 7) && hacDaoJan.includes(nameAnimal)) {
        return true

    } else
        if ((month === 2 || month === 8) && hacDaoFeb.includes(nameAnimal)) {
            return true
        }
        else
            if ((month === 3 || month === 9) && hacDaoMar.includes(nameAnimal)) {
                return true

            }
            else
                if ((month === 4 || month === 10) && hacDaoJul.includes(nameAnimal)) {
                    return true

                }
                else
                    if ((month === 5 || month === 11) && hacDaoMay.includes(nameAnimal)) {
                        return true

                    }
                    else
                        if (month === 6 || month === 12 && hacDaoJun.includes(nameAnimal)) {
                            return true

                        } else {
                            return false
                        }


}
