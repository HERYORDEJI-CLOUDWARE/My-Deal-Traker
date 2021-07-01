import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LogoPage from "../components/LogoPage";
import colors from "../constants/colors";
import DropDownPicker from 'react-native-dropdown-picker';

const PlanUpgrade = () => {
            const [open, setOpen] = useState(false);
            const [value, setValue] = useState('Bronze');
            const [amount, setAmount] = useState('3 \\ 1 Day')
            const [items, setItems] = useState([
            {label: 'Bronze', value: 'Bronze'},
            {label: 'Gold', value: 'Gold'},
            {label: 'Platinum', value:'Platinum'},
            {label: 'Sapphire', value:'Sapphire'},
            {label: 'Master', value:'Master'},
             ]);

            const paypal = require('../../assets/paypal.png')

            const Amount = () => {
                switch(value){
                    case('Bronze'):
                        setAmount('3 \\ 1 Day');
                        break;
                    case('Gold'):
                        setAmount('15 \\ 1 Day');
                        break;
                    case('Platinum'):
                        setAmount('15 \\ 1 Day');
                        break;
                    case('Sapphire'):
                        setAmount('25 \\ 2 Year');
                        break;
                    case('Master'):
                        setAmount('75 \\ 1 Month');
                        break;
                }
            }

    useEffect(() => {
        Amount()
    }, [value])


    return(
        <SafeAreaView style={styles.container}>
                <View style={styles.cardView}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderText}>Upgrade to Plan</Text>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={{fontSize:hp(2.5), fontWeight:'bold', marginBottom:20}}>CAD {amount}</Text>
                            <Text style={{fontSize:hp(2), marginBottom:20, marginTop:10}}>{value} plan</Text>
                            <Text style={{fontSize:hp(2), marginBottom:20, marginTop:10}}>Number of available listing in plan: 100</Text>
                            <Text style={{fontSize:hp(2), marginBottom:20, marginTop:10}}>Allows rollover? No</Text>
                        <View style={{marginTop:hp(10)}}>
                        <DropDownPicker
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            style={{
                                fontSize:10,
                                borderWidth:0,
                                // backgroundColor:'grey',
                                backgroundColor:colors.brown,
                                
                              }}
                              containerStyle={{
                                backgroundColor:colors.brown,
                                borderWidth:0,
                                borderRadius:10,
                            }}
                            textStyle={{
                                fontSize: hp(2.5),
                                color:colors.black,
                              }}
                              labelStyle={{
                                fontWeight: "bold"
                              }}
                            />
                        </View>
                            <TouchableOpacity style={{flexDirection:'row', height:hp(4), paddingTop:6, padding:5, marginTop:hp(3),backgroundColor:colors.brown, borderRadius:5}}>
                                <Text style={{fontSize:hp(1.8), marginRight:10, fontWeight:'bold'}}>Pay with</Text>
                                <Image
                                    source={paypal}
                                    style={{width:wp(18), height:hp(2)}}
                                />
                            </TouchableOpacity>
                        </View>
                </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1, 
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.bgBrown,
    },

    cardView:{
        width:wp(80),
        height:hp(60),
        borderRadius:10
    },

    cardHeader:{
        backgroundColor:colors.white,
        width:'100%',
        height: '15%',
        marginBottom: 4,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius:5,
        borderTopLeftRadius:5
    },

    cardHeaderText:{
        fontSize:hp(3.3),
        fontWeight:'bold',
        color:colors.brown
    },

    cardBody:{
        backgroundColor:colors.white,
        width:'100%',
        height: '85%',
        borderBottomRightRadius:5,
        borderBottomLeftRadius:5,
        alignItems:'center',
        paddingTop:20,
        paddingHorizontal:10
    }
})

export default PlanUpgrade;
