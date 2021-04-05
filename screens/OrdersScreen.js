import React, { useEffect, useState } from "react";
import {
	Text,
	FlatList,
	StyleSheet,
	Platform,
	ActivityIndicator,
	View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/UI/HeaderButton";
import OrderItem from "../components/OrderItem";
import * as orderActions from "../store/action/orders";
import Color from "../constants/Color";

const OrdersScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const orderItems = useSelector((state) => state.orders.orders);

	useEffect(() => {
		setIsLoading(true);
		dispatch(orderActions.fetchOrders()).then(() => {
			setIsLoading(false);
		});
	}, [dispatch]);
	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Color.primary} />
			</View>
		);
	}

	if (orderItems.length === 0) {
		return (
			<View
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<Text style={{ fontFamily: "open-sans-reg" }}>
					No orders, start purchasing.
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={orderItems}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<OrderItem
					amount={itemData.item.totalAmount}
					date={itemData.item.readableDate}
					cartOrderItem={itemData.item.items}
				/>
			)}
		/>
	);
};

OrdersScreen.navigationOptions = (navData) => {
	return {
		headerTitle: "Order Screen",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default OrdersScreen;
