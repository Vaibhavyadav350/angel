import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOrderContext } from '../../context/order_context';
import { useUserContext } from '../../context/user_context';
import { formatPrice, getOrderStatusColor } from '../../utils/helpers';
import { Loading, Error } from '../../components';
import { domain } from '../../utils/constants';

const SingleOrderPage = () => {
    const { id } = useParams();
    const { currentUser } = useUserContext();
    const {
        single_order_loading: loading,
        single_order_error: error,
        single_order: order,
        fetchSingleOrder,
    } = useOrderContext();

    useEffect(() => {
        if (!id) return;
        fetchSingleOrder(id);
        document.title = `Order #${String(id).slice(-8).toUpperCase()} | Angel Archive`;
    }, [id, fetchSingleOrder]);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!order || !order._id) return null;

    const {
        _id,
        createdAt,
        totalPrice,
        shippingPrice,
        itemsPrice,
        discountAmount,
        couponCode,
        addOns = [],
        orderStatus,
        orderItems,
        shippingInfo,
        user,
    } = order;

    const statusColor = getOrderStatusColor(orderStatus);

    const handleDownloadInvoice = async () => {
        try {
            // The invoice route is now customer-authenticated, so it needs the
            // same Firebase ID token as the rest of the order endpoints.
            const token = currentUser ? await currentUser.getIdToken() : null;
            const response = await axios.get(`${domain}/api/orders/${_id}/invoice`, {
                responseType: 'blob', // Important: tell Axios to expect binary data
                withCredentials: true,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            // Create a Blob from the PDF Stream
            const file = new Blob([response.data], { type: 'application/pdf' });

            // Create a link and simulate click to download
            const fileURL = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download = `Tax_Invoice_${_id}.pdf`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            URL.revokeObjectURL(fileURL);
        } catch (err) {
            console.error(err);
            toast.error("Failed to download invoice. Please try again.");
        }
    };

    return (
        <main className="bg-champagne font-body min-h-screen pt-40 pb-32">
            <div className="container mx-auto px-8 lg:px-24 max-w-7xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-4 mb-12">
                    <Link to="/orders" className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/40 hover:text-gold transition-colors">
                        Orders
                    </Link>
                    <span className="material-symbols-outlined text-[10px] text-bronze/20">chevron_right</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Details</span>
                </div>

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
                    <div className="space-y-4">
                        <span className="text-gold text-[11px] font-bold uppercase tracking-[0.8em] block">
                            Archival Acquisition
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
                            #{String(_id || '').slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze/40">
                            Secured on {new Date(createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <button onClick={handleDownloadInvoice} className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-bronze text-champagne rounded-full border border-champagne/20 hover:bg-gold hover:text-white transition-all duration-300 shadow-md">
                            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Download Tax Invoice</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-sm ${statusColor === 'orange' ? 'border-orange-200 bg-orange-50 text-orange-600' :
                            statusColor === 'blue' ? 'border-blue-200 bg-blue-50 text-blue-600' :
                                statusColor === 'green' ? 'border-green-200 bg-green-50 text-green-600' :
                                    'border-red-200 bg-red-50 text-red-600'
                            }`}>
                            {orderStatus}
                        </div>
                    </div>

                    {shippingInfo.trackingNumber && (
                        <div className="flex items-center gap-6 bg-white/50 border border-bronze/10 px-8 py-4 rounded-3xl animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="bg-bronze/5 p-3 rounded-2xl">
                                <span className="material-symbols-outlined text-bronze text-xl">local_shipping</span>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-1">Transit Monitoring</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-bronze">{shippingInfo.carrier}:</span>
                                    <span className="text-[11px] font-medium text-bronze/70 tracking-widest">{shippingInfo.trackingNumber}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-8">
                            <h3 className="text-2xl font-editorial font-bold text-bronze uppercase tracking-tight pb-4 border-b border-bronze/10">
                                Curated Items
                            </h3>
                            <div className="space-y-6">
                                {(orderItems || []).map((item, index) => (
                                    <div key={index} className="flex gap-8 group">
                                        <div className="size-24 lg:size-32 rounded-3xl overflow-hidden border border-bronze/5 shadow-xl shadow-bronze/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center space-y-2">
                                            <h4 className="text-lg font-bold text-bronze uppercase tracking-wide group-hover:text-gold transition-colors">{item.name}</h4>
                                            <div className="flex gap-6">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Size: <span className="text-bronze">{item.size}</span></span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Color: <span className="text-bronze">{item.color}</span></span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-xs font-bold text-bronze/60">{item.quantity} x {formatPrice(item.price)}</span>
                                                <span className="font-editorial font-bold text-lg text-bronze">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Purchase Progress Tracker */}
                        {order.returnStatus === 'none' && (
                            <div className="bg-white/40 border border-bronze/5 rounded-[40px] p-12 space-y-12 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Archival Acquisition Tracker</h3>
                                        <p className="text-2xl font-editorial font-bold text-bronze uppercase tracking-tighter">Securing Your Heritage</p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-white border border-bronze/10 shadow-sm text-bronze`}>
                                        {orderStatus}
                                    </div>
                                </div>

                                <div className="relative pt-8 pb-4">
                                    {/* Progress Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-bronze/10 -translate-y-1/2" />
                                    <div
                                        className="absolute top-1/2 left-0 h-px bg-gold -translate-y-1/2 transition-all duration-1000 ease-out"
                                        style={{
                                            width:
                                                orderStatus === 'processing' ? '0%' :
                                                    orderStatus === 'confirmed' ? '33%' :
                                                        orderStatus === 'shipped' ? '66%' :
                                                            orderStatus === 'delivered' ? '100%' : '0%'
                                        }}
                                    />

                                    {/* Steps */}
                                    <div className="relative flex justify-between">
                                        {[
                                            { id: 'processing', label: 'Secured' },
                                            { id: 'confirmed', label: 'Confirmed' },
                                            { id: 'shipped', label: 'Dispatched' },
                                            { id: 'delivered', label: 'Acquired' }
                                        ].map((step, idx) => {
                                            const statuses = ['processing', 'confirmed', 'shipped', 'delivered'];
                                            const currentIdx = statuses.indexOf(orderStatus);
                                            const stepIdx = statuses.indexOf(step.id);
                                            const isCompleted = stepIdx < currentIdx || orderStatus === 'delivered';
                                            const isActive = stepIdx === currentIdx;

                                            return (
                                                <div key={step.id} className="flex flex-col items-center gap-4 relative z-10">
                                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-gold border-gold text-white' :
                                                        isActive ? 'bg-white border-gold text-gold scale-125' :
                                                            'bg-white border-bronze/10 text-bronze/20'
                                                        }`}>
                                                        {isCompleted ? (
                                                            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                                        ) : (
                                                            <div className={`size-1.5 rounded-full ${isActive ? 'bg-gold' : 'bg-bronze/10'}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive || isCompleted ? 'text-bronze' : 'text-bronze/20'
                                                        }`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Return Progress Tracker */}
                        {order.returnStatus !== 'none' && (
                            <div className="bg-white/40 border border-bronze/5 rounded-[40px] p-12 space-y-12 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Archival Return Tracker</h3>
                                        <p className="text-2xl font-editorial font-bold text-bronze uppercase tracking-tighter">Monitoring Your Submission</p>
                                    </div>
                                    <div className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-white border border-bronze/10 shadow-sm text-bronze`}>
                                        {order.returnStatus}
                                    </div>
                                </div>

                                <div className="relative pt-8 pb-4">
                                    {/* Progress Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-px bg-bronze/10 -translate-y-1/2" />
                                    <div
                                        className="absolute top-1/2 left-0 h-px bg-gold -translate-y-1/2 transition-all duration-1000 ease-out"
                                        style={{
                                            width:
                                                order.returnStatus === 'requested' ? '0%' :
                                                    order.returnStatus === 'approved' ? '33.33%' :
                                                        order.returnStatus === 'processing' ? '66.66%' :
                                                            order.returnStatus === 'completed' ? '100%' : '0%'
                                        }}
                                    />

                                    {/* Steps */}
                                    <div className="relative flex justify-between">
                                        {[
                                            { id: 'requested', label: 'Requested' },
                                            { id: 'approved', label: 'Approved' },
                                            { id: 'processing', label: 'Processing' },
                                            { id: 'completed', label: 'Restored' }
                                        ].map((step, idx) => {
                                            const statuses = ['requested', 'approved', 'processing', 'completed'];
                                            const currentIdx = statuses.indexOf(order.returnStatus);
                                            const stepIdx = statuses.indexOf(step.id);
                                            const isCompleted = stepIdx < currentIdx || order.returnStatus === 'completed';
                                            const isActive = stepIdx === currentIdx;

                                            return (
                                                <div key={step.id} className="flex flex-col items-center gap-4 relative z-10">
                                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-gold border-gold text-white' :
                                                        isActive ? 'bg-white border-gold text-gold scale-125' :
                                                            'bg-white border-bronze/10 text-bronze/20'
                                                        }`}>
                                                        {isCompleted ? (
                                                            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                                        ) : (
                                                            <div className={`size-1.5 rounded-full ${isActive ? 'bg-gold' : 'bg-bronze/10'}`} />
                                                        )}
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive || isCompleted ? 'text-bronze' : 'text-bronze/20'
                                                        }`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Business Logic/Return Info */}
                        <div className="bg-white/40 border border-bronze/5 rounded-[40px] p-12 space-y-6">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">Archival Policy</h4>
                            <p className="text-sm font-medium leading-relaxed text-bronze/60 italic">
                                Each piece in the Angel Archive is a testament to heritage craftsmanship. Returns are subject to strict archival inspection to ensure the preservation of artisanal integrity.
                            </p>
                            {order.returnStatus === 'requested' && (
                                <div className="pt-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
                                        Your return request has been received. Our atelier specialists will review the submission within 48 archival hours.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Totals & Shipping */}
                    <div className="space-y-8 lg:space-y-12 h-fit sticky top-32">
                        {/* Totals Card */}
                        <div className="bg-bronze text-champagne rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-bronze/20 space-y-10">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40">Valuation</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="opacity-60">Subtotal</span>
                                    <span>{formatPrice(itemsPrice)}</span>
                                </div>
                                {addOns && addOns.length > 0 && addOns.map((a, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                                        <span className="opacity-60">{a.name}</span>
                                        <span>+{formatPrice(a.price)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="opacity-60">Shipping</span>
                                    <span>{formatPrice(shippingPrice)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-sm font-medium text-gold">
                                        <span className="opacity-70">Discount ({couponCode})</span>
                                        <span>-{formatPrice(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="h-px bg-champagne/10 pt-4" />
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.4em]">Total</span>
                                    <span className="text-3xl font-editorial font-bold text-gold">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info Card */}
                        <div className="bg-white border border-bronze/5 rounded-[40px] p-8 lg:p-12 shadow-xl shadow-bronze/5 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-gold text-lg">local_shipping</span>
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze/40">Shipping Address</h3>
                                </div>
                                <p className="text-lg font-bold text-bronze uppercase tracking-widest">{user.name}</p>
                                <div className="text-sm font-medium text-bronze/60 leading-loose">
                                    <p>{shippingInfo.address}</p>
                                    <p>{shippingInfo.city}, {shippingInfo.state}</p>
                                    <p className="text-bronze font-bold">{shippingInfo.country} — {shippingInfo.pinCode}</p>
                                </div>
                            </div>

                            <div className="h-px bg-bronze/5" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-gold text-lg">contact_mail</span>
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-bronze/40">Contact Details</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-bronze/60">
                                        <span className="material-symbols-outlined text-base opacity-50">mail</span>
                                        <p className="text-sm font-medium">{user.email}</p>
                                    </div>
                                    {shippingInfo.phoneNumber && (
                                        <div className="flex items-center gap-3 text-bronze/60">
                                            <span className="material-symbols-outlined text-base opacity-50">call</span>
                                            <p className="text-sm font-medium">{shippingInfo.phoneNumber}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SingleOrderPage;
