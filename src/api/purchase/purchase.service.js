const Order = require('../../models/orderModel');

const User = require('../../models/userModel');

const { AppError } = require('../../common/errors/AppError');

module.exports = {
    addItem: async ({ product }, userId) => {
        try {
            await Order.create({
                items: product,
                userId: userId,
            });
            const user = await User.findById(userId);
            for (let i = 0; i < product.length; i++) user.removeFromCart(product[i].productId);
            return {
                error: false,
                msg: 'Item added successfully',
            };
        } catch (error) {
            throw new AppError(500, error.message);
        }
    }, // removeFromCart
    getItems: async (userId) => {
        try {
            let order = await Order.find({ userId });
            // console.log(order);
            return {
                order,
            };
        } catch (error) {
            throw new AppError(500, error.message);
        }
    },
    getTotal: async (userId) => {
        try {
            let order = await Order.find({ userId });
            let total = 0;
            for (let i = 0; i < order.length; i++) {
                const totalOfOrder = await order[i].totalOfOrder();
                total += totalOfOrder;
            }
            return total;
        } catch (error) {
            throw new AppError(500, error.message);
        }
    },
};
