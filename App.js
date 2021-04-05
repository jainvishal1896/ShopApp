import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import ReduxThunk from "redux-thunk";

import productsReducer from "./store/reducer/products";
import cartsReducer from "./store/reducer/cart";
import orderReducer from "./store/reducer/orders";
import authReducer from "./store/reducer/auth";
import NavigationContainer from "./navigation/NavigationContainer";

const rootReducer = combineReducers({
	products: productsReducer,
	carts: cartsReducer,
	orders: orderReducer,
	auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	const [fontLoaded] = useFonts({
		"open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
		"open-sans-reg": require("./assets/fonts/OpenSans-Regular.ttf"),
	});

	if (!fontLoaded) {
		return <AppLoading />;
	}

	return (
		<Provider store={store}>
			<NavigationContainer />
		</Provider>
	);
}
