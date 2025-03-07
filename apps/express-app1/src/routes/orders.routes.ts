import { Router } from 'express';
import { Order } from '../interfaces/order.interface';

const router = Router();
const orders: Order[] = [];

router.post('/', (req, res) => {
  const { customerName, totalAmount } = req.body;

  const newOrder: Order = {
    id: (orders.length + 1).toString(),
    customerName,
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

router.get('/', (_req, res) => {
  res.json(orders);
});

router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order)
    return res.status(404).json({ message: 'Order not found', code: 404 });
  res.json(order);
});

router.patch('/:id', (req, res) => {
  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  if (orderIndex === -1)
    return res.status(404).json({ message: 'Order not found', code: 404 });

  const updatedOrder: Order = {
    ...orders[orderIndex],
    ...req.body,
  };

  orders[orderIndex] = updatedOrder;
  res.json(updatedOrder);
});

router.delete('/:id', (req, res) => {
  const orderIndex = orders.findIndex((o) => o.id === req.params.id);
  if (orderIndex === -1)
    return res.status(404).json({ message: 'Order not found', code: 404 });

  const deletedOrder = orders.splice(orderIndex, 1);
  res.json(deletedOrder);
});

export default router;
