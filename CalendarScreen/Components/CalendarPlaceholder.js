import { Dimensions, FlatList, Text, View } from 'react-native'
import React, { Component } from 'react'

import CalendarList from './react-native-calendars/src/calendar-list';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const { height, width } = Dimensions.get('window');
const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
export class CalendarPlaceholder extends Component {
    constructor(props) {
        super(props)
    }


    componentDidMount() {

    }

    renderDate = ({ item }) => {
        return (
            <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 1
            }}>
         <Text>aa</Text>
          </View>
            // <SkeletonPlaceholder>
            //     <SkeletonPlaceholder.Item width={30} height={30} style={{ padding: 10, margin: 10, borderRadius: 10 }} />
            // </SkeletonPlaceholder>
        )
    }

    render() {
        return (
            <View style={{ width: width, height: 300,}}>
                <FlatList
                    data={data}
                    numColumns={7}
                    renderItem={this.renderDate}
                />

            </View>

        )
    }
}

export default CalendarPlaceholder
