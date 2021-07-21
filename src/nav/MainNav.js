import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import colors from '../constants/colors';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

// BUYER'S AGENT
import Homepage from '../screens/BA/Home/Homepage';
import BASettings from '../screens/BA/Settings/Settings';
import SearchResult from '../screens/BA/search/SearchResult';
import BASelectedProperty from '../screens/BA/Property/SelectedProperty';
import NotificationPage from '../screens/BA/Notification/NotificationPage';
import AcceptOffer from '../screens/BA/Notification/AcceptOffer';
import BADealProgress from '../screens/BA/DealProgress/DealProgress';
import BANotification from '../screens/BA/Notification/Notification';

//SELLER'S AGENT
// TODO File does not exist
// import SANotificationPage from "../screens/SA/Notification/SANotificationPage.jsx";
import SAHomepage from '../screens/SA/Home/Homepage';
import NewListing from '../screens/SA/NewListing/NewListing';
import SelectedProperty from '../screens/SA/SelectedProp/SelectedProperty';
// TODO File does not exist
// import SaAcceptOffer from "../screens/SA/Notification/SaAcceptOffer";

//SELLER'S LAWYER
import SLHome from '../screens/SL/SLHome';
import SLSelectedProperty from '../screens/SL/Property/SLSelectedProperty';

//BUYER'S LAWYER
import BLHome from '../screens/BL/BLHome';
import BLSelectedProperty from '../screens/BL/Property/BLSelectedProperty';
import BLSearchResult from '../screens/BL/search/BLSearchResult';
import SLSearchScreen from '../screens/SL/search/SLSearchScreen';
import ListingView from '../screens/SA/Listing/ListingView';
import { Context } from '../context/UserContext';
import SaSearchResult from '../screens/SA/search/SearchResult';
import ListingTransactions from '../screens/SA/Listing/ListingTransactions';
import ListingChecklist from '../screens/SA/Listing/ListingChecklist';
import PropertyInfo from '../screens/BA/Property/views/PropertyTab/PropertyInfo';
import MakePropertyOffer from '../screens/BA/Property/views/PropertyTab/MakeOffer';
// TODO File does not exist
import BaChecklist from '../screens/BA/Conditions/CheckList';
import ListingLawyer from '../screens/SA/Listing/ListingLawyer';
// TODO File does not exist
// import CounterOffer from "../screens/SA/Notification/CounterOffer";
import AddLawyer from '../screens/SA/Listing/AddLawyer';
import BaCounterOffer from '../screens/BA/Notification/CounterOffer';
import SaPropertyInfo from '../screens/SA/Property/views/PropertyTab/PropertyInfo';
import SLPropertyInfo from '../screens/SL/Property/Views/SLPropertyInfo';
import SLClosing from '../screens/SL/closing/SLClosing';
import SLClosingDealForm from '../screens/SL/closing/CloseDealForm';
import SLChecklist from '../screens/SL/conditions/SLChecklist';
import BaLawyerView from '../screens/BA/Lawyer/BaLawyerView';
import BaAddLawyer from '../screens/BA/Lawyer/BaAddLawyer';
import BlPropertyInfo from '../screens/BL/views/BlPropertyInfo';
import BLClosing from '../screens/BL/closing/BLClosing';
import Uploads from '../screens/files/Uploads';
import BuyerHomepage from '../screens/Buyer/Home/BuyerHomepage';
import SellerHomepage from '../screens/Seller/Home/SellerHomepage';
import BuyerSearchScreen from '../screens/Buyer/search/BuyerSearchScreen';
import { Text } from 'react-native';
import BuyerSelectedProperty from '../screens/Buyer/BuyerSelectedProperty/BuyerSelectedProperty';
import { ActivityIndicator } from 'react-native';
import LogoPage from '../components/LogoPage';
import BuyerPropertyDetails from '../screens/Buyer/BuyerSelectedProperty/Property/BuyerPropertyDetails';
import BuyerConditions from '../screens/Buyer/BuyerSelectedProperty/Property/Conditions/BuyerConditions';
import BuyerLawyerView from '../screens/Buyer/BuyerSelectedProperty/Property/Lawyer/BuyerLawyerView';
import ApprovedOffer from '../screens/BL/closing/ApprovedOffer';
import CloseDeal from '../screens/BL/closing/CloseDeal';
import SellerSelectedProp from '../screens/Seller/Property/SellerSelectedProp';
import SellerPropertyDetails from '../screens/Seller/Property/PropertyInfo/SellerPropertyDetails';
import SellerSearch from '../screens/Seller/Search/SellerSearch';
import SaConditions from '../screens/SA/SaConditions/SaConditions';
import PayPage from '../components/IapPage';
import SubscriptionPage from '../screens/SubscriptionPage';
import PlanUpgrade from '../screens/planUpgrade';
// MORTGAGE BROKER
import addMortgageBroker from '../screens/MB/addMortgageBroker';
import MortgageBrokerHome from '../screens/MB/Home';
import MortgageSelectedProperty from '../screens/MB/selectedProperty';
import UpdateMortgageBroker from '../screens/MB/updateMortgageBrokerDetails';
import Financing from '../screens/BA/Conditions/Financing';
import ViewMortgageBroker from '../screens/MB/viewMortgageBroker';
import MortgageSearchScreen from '../screens/MB/mortgageSearchScreen';
import MortgageTransactionDetails from '../screens/MB/mortgageTransactionDetails';
import MortgageBrokerPropertyDetials from '../screens/MB/propertyDetails';
import MortgageFinancing from '../screens/MB/mortgageFinancing';
import _font from '../styles/fontStyles';
import ViewPropertyOffer from '../screens/BA/Property/views/PropertyTab/ViewOffer';
import BuyerCheckList from '../screens/BA/Conditions/BuyerCheckList';
import Conditions from '../screens/BA/Conditions/Conditions';
import SellerCheckList from '../screens/SA/SellerCheckList';
import SellerConditions from '../screens/Seller/Conditions/Conditions';
import CheckMB from '../screens/MB/CheckMB';
import CloseDealForm from '../screens/BL/closing/CloseDealForm';

const Stack = createStackNavigator();

const SellingAgentStack = () => {
	const {
		state: { user },
	} = useContext(Context);
	return (
		<Stack.Navigator initialRouteName={'saHomepage'} headerMode={'none'}>
			<Stack.Screen
				name='saHomepage'
				component={SAHomepage}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				// name='saSearchScreen'
				component={SaSearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='addNewListing'
				component={NewListing}
				options={{
					headerShown: false,
					title: '',
					// headerBackTitle: 'Back',
				}}
			/>
			{/* TODO no route name*/}
			<Stack.Screen
				name={'ListingView'}
				component={ListingView}
				options={{
					headerShown: false,
					title: 'Property Detail',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='listingTransactions'
				component={ListingTransactions}
				options={{
					headerShown: false,
					title: 'Property Transactions',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='viewPropertyInfo'
				component={SaPropertyInfo}
				options={{
					headerShown: false,
					title: 'Property Details',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='saSelected'
				component={SelectedProperty}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			{/*<Stack.Screen*/}
			{/*  name="saNotificationPage"*/}
			{/*  component={SANotificationPage}*/}
			{/*  options={{*/}
			{/*    headerShown: false,*/}
			{/*    headerBackTitle: "Back",*/}
			{/*    headerTitle: "Notification",*/}
			{/*    headerStyle: { backgroundColor: colors.bgBrown },*/}
			{/*    headerTitleStyle: { color: colors.white },*/}
			{/*  }}*/}
			{/*/>*/}
			{/*<Stack.Screen*/}
			{/*  name="saAcceptOffer"*/}
			{/*  component={SaAcceptOffer}*/}
			{/*  options={{*/}
			{/*    headerShown: false,*/}
			{/*    headerTitle: "",*/}
			{/*    headerBackTitle: "Back",*/}
			{/*    headerStyle: { backgroundColor: colors.bgBrown },*/}
			{/*    headerTitleStyle: { color: colors.white },*/}
			{/*  }}*/}
			{/*/>*/}
			{/*<Stack.Screen*/}
			{/*  name="saCounterOffer"*/}
			{/*  component={CounterOffer}*/}
			{/*  options={{*/}
			{/*    headerShown: false,*/}
			{/*    headerTitle: "",*/}
			{/*    headerBackTitle: "Back",*/}
			{/*    headerStyle: { backgroundColor: colors.bgBrown },*/}
			{/*    headerTitleStyle: { color: colors.white },*/}
			{/*  }}*/}
			{/*/>*/}
			<Stack.Screen
				name='listingChecklist'
				component={ListingChecklist}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='listingLawyer'
				component={ListingLawyer}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='addListingLawyer'
				component={AddLawyer}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				component={SaConditions}
				name='saConditions'
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			{/* <Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/> */}
		</Stack.Navigator>
	);
};

const SellersLawyer = () => {
	return (
		<Stack.Navigator headerMode={null}>
			<Stack.Screen
				name='lawyerHome'
				component={SLHome}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='slSearchScreen'
				component={SLSearchScreen}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen name='SLSelectedProperty' component={SLSelectedProperty} />
			<Stack.Screen
				name='SLPropertyInfo'
				component={SLPropertyInfo}
				options={{
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='slClosing'
				component={SLClosingDealForm}
				// component={SLClosing}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='slChecklist'
				component={SLChecklist}
				options={{
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='approvedOffer'
				component={ApprovedOffer}
				options={{
					headerTitle: 'Approved Offer',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='closeDeal'
				component={CloseDeal}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
		</Stack.Navigator>
	);
};

const BuyerStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='buyerName'
				component={BuyerHomepage}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='buyerSearchScreen'
				component={BuyerSearchScreen}
				// component={MortgageSearchScreen}
				options={{
					headerShown: false,
					title: (
						<Text
							style={{
								color: colors.white,
								fontSize: 36,
								fontFamily: 'pop-semibold',
								paddingHorizontal: 20,
							}}
						>
							Search
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
				}}
			/>
			<Stack.Screen
				name='buyerSelectedProperty'
				component={BuyerSelectedProperty}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='buyerPropertyDetails'
				component={BuyerPropertyDetails}
				options={{
					// headerShown: false,
					title: (
						<Text
							style={{
								..._font.H6,
								color: colors.white,
								fontFamily: 'pop-semibold',
								// paddingHorizontal: RFValue(20),
							}}
						>
							Property Details
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='buyerConditions'
				component={BuyerConditions}
				options={{
					headerShown: false,
					title: (
						<Text
							style={{
								color: colors.white,
								fontSize: 20,
								fontFamily: 'pop-semibold',
								paddingHorizontal: 20,
							}}
						>
							Conditions
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='buyerLawyerView'
				component={BuyerLawyerView}
				options={{
					headerShown: false,
					title: (
						<Text
							style={{
								color: colors.white,
								fontSize: 20,
								fontFamily: 'pop-semibold',
								paddingHorizontal: 20,
							}}
						>
							Lawyer
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='buyerChecklist'
				component={BuyerCheckList}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
		</Stack.Navigator>
	);
};

const SellerStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='sellerHome'
				component={SellerHomepage}
				options={{ headerShown: false, headerBackTitle: 'Back' }}
			/>
			<Stack.Screen
				name='SellerSelectedProp'
				component={SellerSelectedProp}
				options={{
					headerShown: false,
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
					headerTitle: 'Transaction',
				}}
			/>
			<Stack.Screen
				name='sellerPropertyDetails'
				component={SellerPropertyDetails}
				options={{
					headerShown: false,
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
					headerTitle: 'Property Details',
				}}
			/>
			<Stack.Screen
				name='sellerSearch'
				component={SellerSearch}
				options={{
					headerShown: false,
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
					headerTitle: 'Search',
				}}
			/>
			<Stack.Screen
				name='sellerConditions'
				component={SellerConditions}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='listingLawyer'
				component={ListingLawyer}
				options={{
					headerShown: false,
					title: (
						<Text
							style={{
								color: colors.white,
								fontSize: 20,
								fontFamily: 'pop-semibold',
								paddingHorizontal: 20,
							}}
						>
							Lawyer
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
		</Stack.Navigator>
	);
};

const BuyersLawyer = ({ navigation }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='blawyerHome'
				component={BLHome}
				options={{
					headerShown: false,
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='blSearchScreen'
				component={BLSearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='BLSelectedProperty'
				component={BLSelectedProperty}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='blPropertyInfo'
				component={BlPropertyInfo}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name={'blClosingScreen'}
				component={CloseDealForm}
				// component={BLClosing}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='approvedOffer'
				component={ApprovedOffer}
				options={{
					headerTitle: 'Approved Offer',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='closeDeal'
				component={CloseDeal}
				options={{
					headerTitle: '',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitle: 'Back',
					headerShown: true,
					headerLeft: () => (
						<AntDesign
							name='arrowleft'
							color={colors.white}
							size={25}
							style={{ paddingLeft: 20 }}
							onPress={() => navigation.goBack()}
						/>
					),
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
		</Stack.Navigator>
	);
};

const MortgageBrokerStack = ({ navigation }) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='mortgageBrokerHome'
				component={MortgageBrokerHome}
				options={{
					headerShown: false,
					// headerTitle: "Files & Uploads",
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
				}}
			/>
			<Stack.Screen
				name='mortgageSearchScreen'
				component={MortgageSearchScreen}
				options={{
					headerShown: false,
					title: (
						<Text
							style={{
								color: colors.white,
								fontSize: 36,
								fontFamily: 'pop-semibold',
								paddingHorizontal: 20,
							}}
						>
							Search
						</Text>
					),
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
				}}
			/>
			<Stack.Screen
				name='mortgageTransactionDetails'
				component={MortgageTransactionDetails}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='mortgageBrokerPropertyDetials'
				component={MortgageBrokerPropertyDetials}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='mortgageSelectedProperty'
				component={MortgageSelectedProperty}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>

			<Stack.Screen
				name='updateMortgageBroker'
				component={UpdateMortgageBroker}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='viewMortgageBroker'
				component={ViewMortgageBroker}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='mortgageFinancing'
				component={MortgageFinancing}
				options={{
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
		</Stack.Navigator>
	);
};

const BuyingAgentStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='homeScreen'
				component={Homepage}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='selectedPropertyScreen'
				component={BASelectedProperty}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baPropertyInfo'
				component={PropertyInfo}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>

			<Stack.Screen
				name='baMakeOffer'
				component={MakePropertyOffer}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baViewOffer'
				component={ViewPropertyOffer}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baConditions'
				component={Conditions}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerBackTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='notificationScreen'
				component={NotificationPage}
				options={{
					headerShown: true,
					headerBackTitle: 'Back',
					headerTitle: 'Notification',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='acceptOffer'
				component={AcceptOffer}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baCounterOffer'
				component={BaCounterOffer}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baLawyerView'
				component={BaLawyerView}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			<Stack.Screen
				name='baAddLawyer'
				component={BaAddLawyer}
				options={{
					headerShown: false,
					headerTitle: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
					headerTitleStyle: { color: colors.white },
				}}
			/>
			{/* <Stack.Screen
				name='searchScreen'
				component={SearchResult}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/> */}
		</Stack.Navigator>
	);
};

const AuthStack = () => {
	return (
		<Stack.Navigator initialRoute={'regScreen'}>
			<Stack.Screen
				name='loginScreen'
				component={Login}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='regScreen'
				component={Register}
				options={{
					headerShown: false,
					title: '',
					headerBackTitle: 'Back',
				}}
			/>
			<Stack.Screen
				name='forgotPassword'
				component={ForgotPassword}
				options={{
					headerShown: true,
					title: '',
					headerBackTitle: 'Back',
					headerStyle: { backgroundColor: colors.bgBrown },
				}}
			/>
		</Stack.Navigator>
	);
};

const RootStack = () => {
	const {
		state: { user },
	} = useContext(Context);

	let Screen = () => (
		<LogoPage>
			<ActivityIndicator color={colors.white} size='large' />
			<Text style={{ textAlign: 'center' }}>LOADING...</Text>
		</LogoPage>
	);
	if (user && user.role === '1') {
		Screen = BuyerStack;
	}

	if (user && user.role === '2') {
		Screen = SellerStack;
	}

	if (user && user.role === '3') {
		Screen = BuyingAgentStack;
	}

	if (user && user.role === '4') {
		Screen = SellingAgentStack;
	}

	if (user && user.role === '5') {
		Screen = SellersLawyer;
	}

	if (user && user.role === '6') {
		Screen = BuyersLawyer;
	}

	if (user && user.role === '7') {
		Screen = MortgageBrokerStack;
	}

	return (
		<Stack.Navigator headerMode='none'>
			{!user ? <Stack.Screen name='root' component={AuthStack} /> : null}
			{user ? <Stack.Screen name='screenStack' component={Screen} /> : null}
			{/*<Stack.Screen name='baStack' component={Login} />*/}
		</Stack.Navigator>
	);
};

const TopLevelStack = () => (
	<Stack.Navigator>
		<Stack.Screen
			name='topLevl'
			component={RootStack}
			options={{ headerShown: false }}
		/>
		<Stack.Screen
			name='fileUpload'
			component={Uploads}
			options={{
				headerShown: false,
				headerTitle: 'Files & Uploads',
				headerBackTitle: 'Back',
				headerStyle: { backgroundColor: colors.bgBrown },
			}}
		/>
		<Stack.Screen
			name='addMortgageBroker'
			component={addMortgageBroker}
			options={{
				headerShown: false,
				// headerTitle: "Files & Uploads",
				headerBackTitle: 'Back',
				headerStyle: { backgroundColor: colors.bgBrown },
			}}
		/>
		<Stack.Screen
			name='viewMortgageBroker'
			component={CheckMB}
			// component={ViewMortgageBroker}
			options={{
				headerShown: false,
				// headerTitle: "Files & Uploads",
				headerBackTitle: 'Back',
				headerStyle: { backgroundColor: colors.bgBrown },
			}}
		/>

		<Stack.Screen
			name='subPaymentPage'
			component={SubscriptionPage}
			options={{
				headerShown: false,
			}}
		/>

		<Stack.Screen
			name='upgradePlan'
			component={PlanUpgrade}
			options={{
				headerShown: false,
			}}
		/>
		<Stack.Screen
			name='searchScreen'
			component={SearchResult}
			options={{
				headerShown: false,
				title: '',
				headerBackTitle: 'Back',
			}}
		/>
	</Stack.Navigator>
);

export default TopLevelStack;
