import React from 'react'
import LogoPage from '../../../components/LogoPage'
import SellingAgentFooter from '../../../components/SAFooter'

const SelectedProperty = ({route, navigation}) => {

    const {property} = route.params;


    return (
        <>
            <SellingAgentFooter property={property} navigation={navigation} />
        </>
    )
}

export default SelectedProperty;
