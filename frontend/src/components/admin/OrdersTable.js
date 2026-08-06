import React, { useState } from 'react';
import { formatPrice, truncate } from '../../utils/helpers';
import { Link } from 'react-router-dom';
import ActionMenu, { ActionMenuItem, ActionMenuDivider } from './ActionMenu';
import { useAdminAuthStore, useAdminOrderStore } from '../../stores';
import { toast } from 'react-toastify';

function OrdersTable({ orders, onRefresh }) {
  const { currentAdmin: currentUser } = useAdminAuthStore();
  const { fetchOrders, deleteOrder, updateOrderStatus, updateReturnStatus } = useAdminOrderStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await deleteOrder(id);
    setLoading(false);
    if (response.success) {
      toast.success(response.message, { position: 'top-center' });
      if (onRefresh) onRefresh();
      else fetchOrders();
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const handleOrderAction = async (id, status) => {
    setLoading(true);
    const res = await updateOrderStatus(status, id);
    setLoading(false);
    if (res.success) {
      toast.success(`Order ${status}`, { position: 'top-center' });
      if (onRefresh) onRefresh();
      else fetchOrders();
    } else {
      toast.error(res.message, { position: 'top-center' });
    }
  };

  const handleReturnAction = async (id, status) => {
    setLoading(true);
    const res = await updateReturnStatus(status, id);
    setLoading(false);
    if (res.success) {
      toast.success(res.message, { position: 'top-center' });
      if (onRefresh) onRefresh();
      else fetchOrders();
    } else {
      toast.error(res.message, { position: 'top-center' });
    }
  };


  const statusClasses = {
    processing: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-bronze/10 rounded-lg p-10">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-editorial text-bronze/50">No orders found</p>
          <p className="text-sm text-bronze/30 mt-2">
            Orders will appear here after customers complete purchases
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bronze/10 bg-champagne/10">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Customer</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Items</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Payment</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Status</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const {
                  user: { name },
                  orderItems,
                  paymentInfo: { status },
                  orderStatus,
                  _id: id,
                } = order;
                return (
                  <tr key={index} className="border-b border-bronze/5 hover:bg-champagne/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-bronze">{name}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-3">
                        {(orderItems || []).map((item, idx) => {
                          const { image, name: itemName, price } = item;
                          return (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={image}
                                alt={itemName}
                                className="w-10 h-10 object-cover rounded-md shadow-sm"
                              />
                              <div>
                                <p className="text-[10px] font-black text-bronze uppercase tracking-tight">{truncate(itemName, 21)}</p>
                                <p className="text-[10px] text-gold font-bold">{formatPrice(price)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 rounded border border-emerald-200">
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${statusClasses[orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                          {orderStatus}
                        </span>
                        {order.returnStatus !== 'none' && (
                          <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-tighter ${order.returnStatus === 'requested' ? 'text-orange-600' :
                            order.returnStatus === 'approved' ? 'text-blue-600' :
                              order.returnStatus === 'completed' ? 'text-emerald-600' :
                                'text-red-600'
                            }`}>
                            <span className={`p-1 rounded-full animate-pulse ${order.returnStatus === 'requested' ? 'bg-orange-600' :
                              order.returnStatus === 'approved' ? 'bg-blue-600' :
                                order.returnStatus === 'completed' ? 'bg-emerald-600' :
                                  'bg-red-600'
                              }`} />
                            Return {order.returnStatus}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ActionMenu>
                        {(close) => (
                          <>
                            <Link to={`/admin/orders/${id}`} onClick={close}>
                              <ActionMenuItem icon="visibility">View Archival Record</ActionMenuItem>
                            </Link>

                            <ActionMenuDivider />

                            {order.returnStatus !== 'none' ? (
                              <>
                                {order.returnStatus === 'requested' && (
                                  <>
                                    <ActionMenuItem tone="blue" onClick={() => { handleReturnAction(id, 'approved'); close(); }}>
                                      Approve Return
                                    </ActionMenuItem>
                                    <ActionMenuItem tone="danger" onClick={() => { handleReturnAction(id, 'rejected'); close(); }}>
                                      Reject Return
                                    </ActionMenuItem>
                                  </>
                                )}
                                {order.returnStatus === 'approved' && (
                                  <ActionMenuItem tone="indigo" onClick={() => { handleReturnAction(id, 'processing'); close(); }}>
                                    Start Processing Return
                                  </ActionMenuItem>
                                )}
                                {order.returnStatus === 'processing' && (
                                  <ActionMenuItem tone="emerald" onClick={() => { handleReturnAction(id, 'completed'); close(); }}>
                                    Complete Return &amp; Restock
                                  </ActionMenuItem>
                                )}
                              </>
                            ) : (
                              <>
                                {orderStatus === 'processing' && (
                                  <ActionMenuItem tone="blue" onClick={() => { handleOrderAction(id, 'confirmed'); close(); }}>
                                    Confirm Order
                                  </ActionMenuItem>
                                )}
                                {orderStatus === 'confirmed' && (
                                  <ActionMenuItem tone="indigo" onClick={() => { handleOrderAction(id, 'shipped'); close(); }}>
                                    Mark Shipped
                                  </ActionMenuItem>
                                )}
                                {orderStatus === 'shipped' && (
                                  <ActionMenuItem tone="emerald" onClick={() => { handleOrderAction(id, 'delivered'); close(); }}>
                                    Mark Delivered
                                  </ActionMenuItem>
                                )}
                              </>
                            )}

                            {currentUser.privilege !== 'low' && (
                              <>
                                <ActionMenuDivider />
                                <ActionMenuItem tone="danger" icon="delete" onClick={() => { handleDelete(id); close(); }}>
                                  Delete Order
                                </ActionMenuItem>
                              </>
                            )}
                          </>
                        )}
                      </ActionMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
