import { Text } from 'native-base'
import React from 'react'
import { View, Dimensions } from 'react-native'

const { width, height } = Dimensions.get("window");

const Report = () => {
    return (
        <View>
            <Text>REPORT</Text>
            <View style={{ height: height / 2.5 }} />
        </View>
    )
}

export default Report
