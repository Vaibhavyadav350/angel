import React, { useEffect } from 'react';
import { useAdminCustomerStore } from '../../stores';
import SidebarWithHeader from '../../components/admin/SidebarWithHeader';
import { formatPrice } from '../../utils/helpers';

function CustomersPage() {
    const { customers, loading, fetchCustomers } = useAdminCustomerStore();

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <SidebarWithHeader>
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-editorial font-bold text-bronze uppercase">Customer CRM</h2>
                        <p className="text-bronze/50 text-xs tracking-widest uppercase">Manage loyalty and VIP segmentation</p>
                    </div>
                </div>

                <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-bronze/10 bg-champagne/10">
                                        <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Customer Email</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Lifecycle Status</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Orders</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Lifetime Value</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer._id} className="border-b border-bronze/5 hover:bg-champagne/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-bronze">{customer.email}</span>
                                                    <span className="text-[9px] text-bronze/30 font-mono uppercase">{customer.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {customer.isVIP ? (
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-widest rounded-full border border-amber-200 shadow-sm">
                                                        VIP Elite
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                                        Regular
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-bronze font-medium">{customer.orderCount}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-gold font-bold">{formatPrice(customer.totalSpend)}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-xs text-bronze/50 font-medium">
                                                    {new Date(customer.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <p className="text-bronze/30 font-editorial text-lg italic">The customer registry is currently empty</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </SidebarWithHeader>
    );
}

export default CustomersPage;
