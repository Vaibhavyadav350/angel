import React, { useEffect } from 'react';
import { SidebarWithHeader, PreLoader } from '../../components/admin';
import { useNewsletterContext } from '../../context/newsletter_context';
import { toast } from 'react-toastify';
import { FiTrash2, FiRefreshCcw } from 'react-icons/fi';

const NewsletterPage = () => {
    const {
        subscribers,
        subscribers_loading,
        subscribers_error,
        fetchSubscribers,
        deleteSubscriber,
    } = useNewsletterContext();

    useEffect(() => {
        fetchSubscribers();
    }, [fetchSubscribers]);

    const handleDelete = async (id, email) => {
        if (window.confirm(`Are you sure you want to remove ${email} from the newsletter?`)) {
            const { success, message } = await deleteSubscriber(id);
            if (success) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        }
    };

    if (subscribers_loading) {
        return (
            <SidebarWithHeader>
                <PreLoader />
            </SidebarWithHeader>
        );
    }

    if (subscribers_error) {
        return (
            <SidebarWithHeader>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <p className="text-xl text-red-600 font-medium mb-4">Failed to load subscribers</p>
                    <button
                        onClick={fetchSubscribers}
                        className="flex items-center gap-2 px-4 py-2 bg-bronze text-white rounded-md hover:bg-bronze/90 transition-colors"
                    >
                        <FiRefreshCcw /> Retry
                    </button>
                </div>
            </SidebarWithHeader>
        );
    }

    return (
        <SidebarWithHeader title="Newsletter Subscribers">
            <div className="bg-white rounded-lg shadow-sm border border-bronze/10 overflow-hidden">
                <div className="p-6 border-b border-bronze/10 flex justify-between items-center bg-champagne/30">
                    <div>
                        <h2 className="text-xl font-semibold text-bronze">Archive Members</h2>
                        <p className="text-sm text-bronze/60 mt-1">
                            Total Subscribers: {subscribers.length}
                        </p>
                    </div>
                    <button
                        onClick={fetchSubscribers}
                        className="p-2 text-bronze/60 hover:bg-champagne/30 rounded-full transition-colors"
                        title="Refresh list"
                    >
                        <FiRefreshCcw className={subscribers_loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-champagne/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-bronze/70 border-b border-bronze/10">Email Address</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-bronze/70 border-b border-bronze/10">Subscribed On</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-bronze/70 border-b border-bronze/10 text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-bronze/70 border-b border-bronze/10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-bronze/5">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-bronze/50">
                                        No subscribers found in the archive.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-champagne/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-bronze font-medium">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-bronze/60">
                                            {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sub.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {sub.active ? 'Active' : 'Unsubscribed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(sub._id, sub.email)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Subscriber"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SidebarWithHeader>
    );
};

export default NewsletterPage;
