const catchAsyncErrors = require('../middleware/CatchAsyncErrors');
const Order = require('../models/orderModel');

// Get Sales Data (Revenue + Orders by Day)
exports.getSalesStats = catchAsyncErrors(async (req, res, next) => {
    const days = parseInt(req.query.days) || 7;
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const stats = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: dateLimit }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalPrice" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: stats
    });
});

// Get Category Distribution Stats
exports.getCategoryStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await Order.aggregate([
        { $unwind: "$orderItems" },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $group: {
                _id: "$productDetails.category",
                sales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
                count: { $sum: "$orderItems.quantity" }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats
    });
});

// Get General Business Dashboard Stats
exports.getDashboardKPIs = catchAsyncErrors(async (req, res, next) => {
    const totalStats = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: "$totalPrice" }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: totalStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 }
    });
});
