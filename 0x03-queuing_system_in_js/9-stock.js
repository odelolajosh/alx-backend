import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const PORT = 1245, HOST = 'localhost';

const app = express();
const client = redis.createClient();

const listProducts = [
	{ id: 1, name: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
	{ id: 2, name: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
	{ id: 3, name: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
	{ id: 4, name: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const getItemById = (id) => {
	return listProducts.find((item) => item.id === id);
}

const reserveStockById = (itemId, stock) => {
	client.set(itemId, stock);
}

const getCurrentReservedStockById = async (itemId) => {
	const stock = await promisify(client.get).bind(client)(itemId);
	return stock;
}

app.get('/list_products', (req, res) => {
	res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
	const itemId = parseInt(req.params.itemId);
	const item = getItemById(itemId);
	if (!item) {
		return res.status(404).json({ status: 'Product not found' });
	}
	let currentQuantity = await getCurrentReservedStockById(itemId);
	currentQuantity = parseInt(currentQuantity) || item.initialAvailableQuantity;
	res.json({ ...item, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
	const itemId = parseInt(req.params.itemId);
	const item = getItemById(itemId);

	if (!item) {
		return res.status(404).json({ status: 'Product not found' });
	}

	let reservedStock = await getCurrentReservedStockById(itemId);
	if (reservedStock) {
		reservedStock = parseInt(reservedStock);
		if (reservedStock == 0) {
			res.status(403).json({ status: 'Not enough stock available', itemId });
		} else {
			reserveStockById(itemId, reservedStock - 1);
			res.json({ status: 'Reservation confirmed', itemId });
		}
	} else {
		reserveStockById(itemId, item.initialAvailableQuantity - 1);
		res.json({ status: 'Reservation confirmed', itemId });
	}
});

app.listen(PORT, HOST, () => {
	console.log(`Running on http://${HOST}:${PORT}`);
});

export default app;
