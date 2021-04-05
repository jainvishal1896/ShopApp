import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import * as cartActions from "../store/action/cart";
import * as orderAction from "../store/action/orders";

import Color from "../constants/Color";
import CartItem from "../components/CartItem";
import Card from "../components/UI/Card";

const CartScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);

	const cartTotalAmount = useSelector((state) => state.carts.totalAmount);
	const cartItem = useSelector((state) => {
		const transformedCartItems = [];
		for (const key in state.carts.items) {
			transformedCartItems.push({
				productId: key,
				productTitle: state.carts.items[key].productTitle,
				productPrice: state.carts.items[key].productPrice,
				quantity: state.carts.items[key].quantity,
				sum: state.carts.items[key].sum,
			});
		}
		return transformedCartItems.sort((a, b) =>
			a.productId > b.productId ? 1 : -1
		);
	});
	const dispatch = useDispatch();
	const sendOrderHandler = async () => {
		setIsLoading(true);
		await dispatch(orderAction.addOrder(cartItem, cartTotalAmount));
		setIsLoading(false);
	};

	return (
		<View style={styles.screen}>
			<Card style={styles.summary}>
				<Text style={styles.summaryText}>
					Total:
					<Text style={styles.amount}>
						${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
					</Text>
				</Text>
				{isLoading ? (
					<ActivityIndicator size="large" color={Color.primary} />
				) : (
					<Button
						color={Color.accent}
						title="Order Now"
						disabled={cartItem.length === 0}
						onPress={sendOrderHandler}
					/>
				)}
			</Card>
			<FlatList
				data={cartItem}
				keyExtractor={(item) => item.productId}
				renderItem={(itemData) => (
					<CartItem
						quantity={itemData.item.quantity}
						title={itemData.item.productTitle}
						amount={itemData.item.sum}
						deletable
						onRemove={() => {
							dispatch(
								cartActions.deleteFromCart(itemData.item.productId)
							);
						}}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		margin: 20,
	},
	summary: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		padding: 10,
	},
	summaryText: {
		fontFamily: "open-sans-bold",
		fontSize: 18,
	},
	amount: {
		color: Color.primary,
	},
});

CartScreen.navigationOptions = {
	headerTitle: "Cart Screen",
};

export default CartScreen;
