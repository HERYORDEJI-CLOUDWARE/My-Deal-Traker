import React from 'react'
import SLFooterTabs from './FooterTab/SLFooterTabs'

const SLSelectedProperty = ({route, navigation}) => {
    const {property} = route.params
    return (
        <>
            <SLFooterTabs property={property} navigation={navigation} />
        </>
    )
}

export default SLSelectedProperty
