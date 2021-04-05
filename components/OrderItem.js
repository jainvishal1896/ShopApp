import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import CartItem from "./CartItem";
import Color from "../constants/Color";
import Card from "./UI/Card";

const OrderItem = (props) => {
	const [showCard, setShowCard] = useState(false);
	return (
		<Card style={styles.orderItem}>
			<View style={styles.summary}>
				<Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
				<Text style={styles.date}>{props.date}</Text>
			</View>
			<Button
				title={showCard ? "Hide Details" : "Show Details"}
				color={Color.primary}
				onPress={() => {
					setShowCard((prevSate) => !prevSate);
				}}
			/>
			{showCard && (
				<View>
					{props.cartOrderItem.map((cartItem) => (
						<CartItem
							key={cartItem.productId}
							quantity={cartItem.quantity}
							title={cartItem.productTitle}
							amount={cartItem.productPrice}
						/>
					))}
				</View>
			)}
		</Card>
	);
};

const styles = StyleSheet.create({
	orderItem: {
		margin: 20,
		padding: 10,
		alignItems: "center",
	},
	summary: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		marginBottom: 15,
	},
	totalAmount: {
		fontFamily: "open-sans-bold",
		fontSize: 16,
	},
	date: {
		fontFamily: "open-sans-reg",
		fontSize: 16,
		color: "#888",
	},
});

export default OrderItem;
