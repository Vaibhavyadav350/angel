import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SidebarWithHeader, OrderDetails } from '../../components/admin';
import { useOrderContext } from '../../context/admin_order_context';
import { orderStatusList, admin_order_url } from '../../utils/constants';
import { FaFilePdf } from 'react-icons/fa';
import { toast } from 'react-toastify';

function SingleOrderPage() {
  const { id } = useParams();
  const [statusList, setStatusList] = useState([...orderStatusList]);
  const {
    single_order_loading: loading,
    single_order_error: error,
    single_order: order,
    single_order_status,
    fetchSingleOrder,
    updateOrderStatus,
    updateReturnStatus,
  } = useOrderContext();

  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    carrier: 'Australia Post'
  });

  const handleChange = async (e) => {
    const status = e.target.value;
    const response = await updateOrderStatus(status, id, trackingInfo.trackingNumber, trackingInfo.carrier);
    if (response.success) {
      toast.success(`Order ${response.status}`, { position: 'top-center' });
      fetchSingleOrder(id);
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const handleReturnAction = async (status) => {
    const response = await updateReturnStatus(status, id);
    if (response.success) {
      toast.success(response.message, { position: 'top-center' });
      fetchSingleOrder(id);
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const handleDownloadPDF = async (type) => {
    try {
      const response = await axios.get(`${admin_order_url}${id}/${type}`, {
        responseType: 'blob',
        withCredentials: true
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = `${type}_${id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${type}. Please try again.`);
    }
  };

  useEffect(() => {
    fetchSingleOrder(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    let tempList = [...orderStatusList];
    if (single_order_status === 'processing' || single_order_status === 'rejected') {
      tempList.splice(3, 2);
      setStatusList([...tempList]);
    }
    if (single_order_status === 'confirmed') {
      tempList.splice(0, 2);
      setStatusList([...tempList]);
    }
    if (single_order_status === 'shipped') {
      tempList.splice(0, 3);
      setStatusList([...tempList]);
    }
    if (single_order_status === 'delivered') {
      tempList.splice(0, 4);
      setStatusList([...tempList]);
    }
  }, [id, single_order_status]);

  if (loading) {
    return (
      <SidebarWithHeader>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      </SidebarWithHeader>
    );
  }

  if (error) {
    return (
      <SidebarWithHeader>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-editorial text-red-500 mb-3">There was an error</p>
          <p className="text-sm text-bronze/50">Unable to load order details. Please try again.</p>
          <p className="text-xs text-bronze/30 mt-2">Order ID: {id}</p>
        </div>
      </SidebarWithHeader>
    );
  }

  return (
    <SidebarWithHeader>
      {/* Status Control */}
      <div className="flex items-center justify-between bg-white border border-bronze/10 rounded-lg p-5 mb-5">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50">Status:</span>
          {order && order.returnStatus !== 'none' ? (
            <span className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
              Locked (Return Active)
            </span>
          ) : (
            <select
              value={single_order_status}
              onChange={handleChange}
              className="bg-champagne/50 border border-bronze/20 rounded px-4 py-2 text-sm text-bronze focus:outline-none focus:border-gold transition-colors"
            >
              {statusList.map((status, index) => {
                const { name, value } = status;
                return (
                  <option key={index} value={value}>{name}</option>
                );
              })}
            </select>
          )}

          {single_order_status === 'shipped' && (!order || order.returnStatus === 'none') && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <input
                type="text"
                placeholder="Tracking #"
                value={trackingInfo.trackingNumber}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                className="bg-white border border-bronze/10 rounded px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze focus:border-gold outline-none w-32"
              />
              <select
                value={trackingInfo.carrier}
                onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                className="bg-white border border-bronze/10 rounded px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-bronze focus:border-gold outline-none"
              >
                <option value="Australia Post">Australia Post</option>
                <option value="DHL Express">DHL Express</option>
                <option value="StarTrack">StarTrack</option>
                <option value="Courier Please">Courier Please</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadPDF('invoice')}
            className="flex items-center gap-2 bg-bronze/10 text-bronze px-5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-bronze hover:text-white transition-all border border-bronze/10"
          >
            <FaFilePdf size={14} /> Invoice
          </button>
          <button
            onClick={() => handleDownloadPDF('packingslip')}
            className="flex items-center gap-2 bg-bronze text-white px-5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-gold transition-all"
          >
            <FaFilePdf size={14} /> Packing Slip
          </button>
        </div>
      </div>

      {order && order.returnStatus !== 'none' && order.returnStatus !== 'completed' && (
        <div className="bg-bronze text-champagne p-8 rounded-lg mb-5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl shadow-bronze/20">
          <div className="flex items-center justify-between border-b border-champagne/10 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Archival Return Submission</span>
              <h4 className="text-xl font-editorial font-bold tracking-tight uppercase">Status: {order.returnStatus}</h4>
            </div>
            <div className="flex gap-3">
              {order.returnStatus === 'requested' && (
                <>
                  <button
                    onClick={() => handleReturnAction('approved')}
                    className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleReturnAction('rejected')}
                    className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    Reject Submission
                  </button>
                </>
              )}
              {order.returnStatus === 'approved' && (
                <button
                  onClick={() => handleReturnAction('processing')}
                  className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  Mark as processing
                </button>
              )}
              {order.returnStatus === 'processing' && (
                <button
                  onClick={() => handleReturnAction('completed')}
                  className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Finalize & Restore Stock
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Return Reason</span>
              <p className="text-sm font-medium leading-relaxed italic border-l-2 border-gold/30 pl-4">
                "{order.returnReason || 'No reason provided by client'}"
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Submission Metadata</span>
              <div className="text-[10px] font-bold uppercase tracking-widest space-y-1">
                <p>Requested: <span className="text-gold">{new Date(order.returnRequestedAt).toLocaleDateString('en-AU')}</span></p>
                {order.returnedAt && <p>Restored: <span className="text-gold">{new Date(order.returnedAt).toLocaleDateString('en-AU')}</span></p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="bg-white border border-bronze/10 rounded-lg p-6">
        {order && order._id ? (
          <OrderDetails {...order} order_status={single_order_status} />
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-editorial text-bronze/50">No order data available</p>
            <p className="text-sm text-bronze/30 mt-2">Order details could not be loaded</p>
          </div>
        )}
      </div>
    </SidebarWithHeader>
  );
}

export default SingleOrderPage;
