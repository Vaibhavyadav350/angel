const router = require('express').Router();

const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

const auth = require('../middleware/Auth');

router.route('/auth').post(adminController.sendCurrentUser);

// register new admin
router
  .route('/register')
  .post(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('super'),
    adminController.registerAdmin
  );

// login admin
router.route('/login').post(adminController.loginAdmin);

// logout admin
router.route('/logout').get(adminController.logoutAdmin);

// get all admin details
router
  .route('/users')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('super'),
    adminController.getAllAdminDetails
  );

// get single admin details
router
  .route('/users/:id')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('super'),
    adminController.getSingleAdminDetails
  )
  .put(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('super'),
    adminController.updateAdminPrivilege
  )
  .delete(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('super'),
    adminController.deleteAdmin
  );

// create a new product
router
  .route('/product/new')
  .post(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    productController.createProduct
  );

// Export Product archive
router
  .route('/product/export/excel')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    productController.exportProductsExcel
  );

// send, update, delete a single product
router
  .route('/product/:id')
  .put(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    productController.updateProduct
  )
  .delete(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    productController.deleteProduct
  );

// delete product reviews
router
  .route('/product/review/:id')
  .delete(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    productController.deleteReview
  );

// send all orders
router
  .route('/orders')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super', 'low'),
    orderController.getAllOrders
  );

// Export/Bulk Orders
router
  .route('/orders/export/excel')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super', 'low'),
    orderController.exportOrdersExcel
  );

router
  .route('/orders/bulk-update')
  .put(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    orderController.bulkUpdateOrders
  );

// send single order
router
  .route('/order/:id')
  .get(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super', 'low'),
    orderController.getSingleOrder
  )
  .put(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super', 'low'),
    orderController.updateOrderStatus
  )
  .delete(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super'),
    orderController.deleteOrder
  );

router
  .route('/order/:id/return')
  .put(
    auth.checkUserAuthentication,
    auth.checkAdminPrivileges('moderate', 'super', 'low'),
    orderController.updateReturnStatus
  );

// Financial & Fulfullment Documents
router.route('/order/:id/invoice').get(
  auth.checkUserAuthentication,
  auth.checkAdminPrivileges('moderate', 'super', 'low'),
  orderController.getOrderInvoice
);

router.route('/order/:id/packingslip').get(
  auth.checkUserAuthentication,
  auth.checkAdminPrivileges('moderate', 'super', 'low'),
  orderController.getPackingSlip
);

module.exports = router;
