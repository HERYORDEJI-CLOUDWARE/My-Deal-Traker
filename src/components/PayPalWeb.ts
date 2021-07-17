import React from 'react';
import ReactDOM from 'react-dom';

const PayPalButton = window?.paypal?.Buttons?.driver('react', {
	React,
	ReactDOM,
});

const payPalHtml = `<div className='App'>
			<PayPalButton
				createOrder={(data, actions) => _createOrder(data, actions)}
				onApprove={(data, actions) => _onApprove(data, actions)}
				onCancel={() => _onError('Canceled')}
				onError={(err) => _onError(err)}
			/>
		</div>`;
