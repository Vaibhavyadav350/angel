import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { formatPrice } from '../../utils/helpers';
import { BiChevronDown } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useAdminAuthStore, useAdminOrderStore } from '../../stores';
import { toast } from 'react-toastify';

function OrdersTable({ orders, onRefresh }) {
  const { currentAdmin: currentUser } = useAdminAuthStore();
  const { fetchOrders, deleteOrder, updateOrderStatus, updateReturnStatus } = useAdminOrderStore();
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});

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
    setMenuOpenId(null);
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
    setMenuOpenId(null);
  };

  const toggleMenu = (id) => {
    if (menuOpenId === id) {
      setMenuOpenId(null);
    } else {
      const button = buttonRefs.current[id];
      if (!button) return; // ref not attached yet — avoid throwing and killing the handler
      const rect = button.getBoundingClientRect();
      // Menu is position:fixed (viewport-relative), so use rect coords directly.
      // Adding scrollX/Y here pushed the menu off-screen once the page was scrolled.
      const MENU_HEIGHT = 260; // approx dropdown height; flip up if it would overflow the viewport
      const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight;
      setMenuPosition({
        top: openUp ? Math.max(8, rect.top - MENU_HEIGHT) : rect.bottom,
        left: rect.right - 144, // 144 is w-36 (dropdown width)
      });
      setMenuOpenId(id);
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
                        {orderItems.map((item, idx) => {
                          const { image, name: itemName, price } = item;
                          return (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={image}
                                alt={itemName}
                                className="w-10 h-10 object-cover rounded-md shadow-sm"
                              />
                              <div>
                                <p className="text-[10px] font-black text-bronze uppercase tracking-tight">{itemName.substring(0, 21)}...</p>
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
                      <div className="relative inline-block text-left">
                        <button
                          ref={(el) => (buttonRefs.current[id] = el)}
                          onClick={() => toggleMenu(id)}
                          className="flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze/60 hover:text-bronze hover:bg-bronze/5 rounded transition-colors"
                        >
                          Actions <BiChevronDown />
                        </button>
                        {menuOpenId === id && createPortal(
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setMenuOpenId(null)} />
                            <div
                              className="fixed w-44 bg-white border border-bronze/10 rounded-lg shadow-xl z-[70] py-2 pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`
                              }}
                            >
                              <Link to={`/admin/orders/${id}`} onClick={() => setMenuOpenId(null)}>
                                <div className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-bronze/70 hover:bg-champagne/20 cursor-pointer flex items-center justify-between">
                                  <span>View Archival Record</span>
                                  <span className="material-symbols-outlined text-sm">visibility</span>
                                </div>
                              </Link>

                              <div className="h-px bg-bronze/10 my-1"></div>

                              {/* State Machine Status Actions */}
                              {order.returnStatus !== 'none' ? (
                                // Return Flow Context Map
                                <>
                                  {order.returnStatus === 'requested' && (
                                    <>
                                      <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 cursor-pointer" onClick={() => handleReturnAction(id, 'approved')}>
                                        Approve Return
                                      </div>
                                      <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => handleReturnAction(id, 'rejected')}>
                                        Reject Return
                                      </div>
                                    </>
                                  )}
                                  {order.returnStatus === 'approved' && (
                                    <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 cursor-pointer" onClick={() => handleReturnAction(id, 'processing')}>
                                      Start Processing Return
                                    </div>
                                  )}
                                  {order.returnStatus === 'processing' && (
                                    <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 cursor-pointer" onClick={() => handleReturnAction(id, 'completed')}>
                                      Complete Return & Restock
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Order Flow Context Map
                                <>
                                  {orderStatus === 'processing' && (
                                    <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 cursor-pointer" onClick={() => handleOrderAction(id, 'confirmed')}>
                                      Confirm Order
                                    </div>
                                  )}
                                  {orderStatus === 'confirmed' && (
                                    <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 cursor-pointer" onClick={() => handleOrderAction(id, 'shipped')}>
                                      Mark Shipped
                                    </div>
                                  )}
                                  {orderStatus === 'shipped' && (
                                    <div className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 cursor-pointer" onClick={() => handleOrderAction(id, 'delivered')}>
                                      Mark Delivered
                                    </div>
                                  )}
                                </>
                              )}

                              <div className="h-px bg-bronze/10 my-1"></div>

                              {currentUser.privilege !== 'low' && (
                                <div
                                  className="px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 cursor-pointer flex justify-between items-center"
                                  onClick={() => { handleDelete(id); setMenuOpenId(null); }}
                                >
                                  Delete Order
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </div>
                              )}
                            </div>
                          </>,
                          document.body
                        )}
                      </div>
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
