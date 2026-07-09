import React, { useState } from 'react';
import { useAdminUserStore } from '../../stores';
import { toast } from 'react-toastify';

function AdminsTable({ admins }) {
  const { updateAdminPrivilege, deleteAdmin, fetchAdmins } = useAdminUserStore();
  const [loading, setLoading] = useState(false);

  const privilegeClasses = {
    super: 'bg-amber-100 text-amber-700',
    moderate: 'bg-blue-100 text-blue-700',
    low: 'bg-gray-100 text-gray-600',
  };

  const handleEdit = async (e, id) => {
    setLoading(true);
    const privilege = e.target.value;
    const response = await updateAdminPrivilege(id, privilege);
    setLoading(false);
    if (response.success) {
      const { name, privilege } = response.data;
      toast.success(`${name}'s privilege changed to ${privilege}`, { position: 'top-center' });
      return await fetchAdmins();
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await deleteAdmin(id);
    setLoading(false);
    if (response.success) {
      toast.success(response.message, { position: 'top-center' });
      return await fetchAdmins();
    } else {
      toast.error(response.message, { position: 'top-center' });
    }
  };

  if (!admins || admins.length === 0) {
    return (
      <div className="bg-white border border-bronze/10 rounded-lg p-10">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-editorial text-bronze/50">No admins found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bronze/10">
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Name</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Email</th>
                <th className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">Privilege</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => {
                const { name, email, privilege, id: adminId } = admin;
                return (
                  <tr key={index} className="border-b border-bronze/5 hover:bg-champagne/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-bronze">{name}</td>
                    <td className="px-5 py-4 text-sm text-bronze/70">{email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${privilegeClasses[privilege] || 'bg-gray-100 text-gray-600'}`}>
                        {privilege}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <select
                          value={privilege}
                          onChange={(e) => handleEdit(e, adminId)}
                          className="bg-champagne/50 border border-bronze/20 rounded px-3 py-2 text-xs text-bronze focus:outline-none focus:border-gold transition-colors"
                        >
                          <option value="super">Super</option>
                          <option value="moderate">Moderate</option>
                          <option value="low">Low</option>
                        </select>
                        <button
                          onClick={() => handleDelete(adminId)}
                          className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminsTable;
