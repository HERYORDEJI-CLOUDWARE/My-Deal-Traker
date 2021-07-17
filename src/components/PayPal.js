import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WebView, View, Platform } from 'react-native';
// import { Spinner } from '../Reusables';
import { Actions } from 'react-native-router-flux'; // for routing
import { ActivityIndicator } from 'react-native-paper';
const source = require('./paypal.html'); // predesigned and styled html
class PayPal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			sent: false,
		};
		const patchPostMessageFunction = function () {
			var originalPostMessage = window.postMessage;

			var patchedPostMessage = function (message, targetOrigin, transfer) {
				originalPostMessage(message, targetOrigin, transfer);
			};

			patchedPostMessage.toString = function () {
				return String(Object.hasOwnProperty).replace(
					'hasOwnProperty',
					'postMessage',
				);
			};

			window.postMessage = patchedPostMessage;
		};

		this.patchPostMessageJsCode =
			'(' + String(patchPostMessageFunction) + ')();';
	}
	componentWillMount() {
		this.setState({ loading: true });
	}

	handleNavigation(event) {
		console.log(event);
	}
	handleMessage(event) {
		let data = event.nativeEvent.data;
		data = JSON.parse(data);
		if (data.status == 'success') {
			alert(data.reference);
		} else {
			this.setState({ loading: false });
			alert('Failed, ' + data.message);
		}
	}
	passValues() {
		const { amount, paypalFundingDetails } = this.props;

		let data = {
			amount,
			orderID: paypalFundingDetails.result.id, //orderID
		};

		if (!this.state.sent) {
			this.refs.webview.postMessage(JSON.stringify(data));
			this.setState({ loading: false, sent: true });
		}
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				{this.state.loading ? (
					<ActivityIndicator size='large' color={colors.white} />
				) : null}
				<WebView
					style={{ overflow: 'scroll' }}
					source={source}
					originWhitelist={['*']}
					mixedContentMode={'always'}
					useWebKit={Platform.OS == 'ios'}
					onError={() => {
						alert('Error Occured');
						Actions.pop();
					}}
					onLoadEnd={() => this.passValues()}
					ref='webview'
					thirdPartyCookiesEnabled={true}
					scrollEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={true}
					injectedJavaScript={this.patchPostMessageJsCode}
					allowUniversalAccessFromFileURLs={true}
					onMessage={(event) => this.handleMessage(event)}
					onNavigationStateChange={(event) => this.handleNavigation(event)}
					javaScriptEnabled={true}
				/>
			</View>
		);
	}
}
const mapStateToProps = (state) => {
	const { amount, paypalFundingDetails } = state.fund;
	return { amount, paypalFundingDetails };
};
export default connect(mapStateToProps, {})(PayPal);

export const payPalHtml_ = `
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Paypal</title>
    <script src="https://www.paypal.com/sdk/js?client-id={clientID}"></script>

    <style>
        html, body{
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(180deg, #3D40AD 0%, #6B6ED7 100%);
        }
        .container{
            height: 100%;
            display: flex;
            margin-left: 20px;
            margin-right: 20px;
            overflow-y: scroll;
            justify-content: center;
            align-items: center;
        }
        p{
            color: white;
            font-size: 16px;
            text-align: justify;
            margin-bottom: 50px;
        }
        #preloaderSpinner{
          display: none;
        }
    </style>
  </head>
  <body>
      <div class="container">
            <div style="justify-content: center; text-align: center">
                <img width="80px" height="80px" src="logo.png"/>
                <p>
                </p>
                <div id="paypal-button-container"></div>
            </div>
      </div>


    <script>
      function payWithPayPal(amount, orderID) {
        paypal
          .Buttons({

            createOrder: function(data, actions) {
                return new Promise(function(resolve, reject){
                  resolve(orderID);
              });
            },
            onApprove: function(data, actions) {
              window.postMessage(JSON.stringify({
                    reference: data.orderID, 
                    message: 'Transaction Successful',
                    status: 'success'
                }));
            }
          })
          .render("#paypal-button-container");
      }
      document.addEventListener("message", function(data) {
        var details = JSON.parse(data.data);
        document.querySelector('p').innerText = "You are about to fund your wallet with USD "+details.amount+" on XYZ. Click on any of the payment options to proceed. Your account will be credited instantly after payment."
        payWithPayPal(details.amount, details.orderID);
      })

    </script>
  </body>
</html>
`;
