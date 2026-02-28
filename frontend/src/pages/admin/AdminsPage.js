import React from 'react';
import {
  SidebarWithHeader,
  AdminsTable,
  CreateNewAdminModal,
} from '../../components/admin';
import { useAdminContext } from '../../context/admin_context';
import { MdRefresh } from 'react-icons/md';

function AdminsPage() {
  const {
    admins,
    admins_loading: loading,
    admins_error: error,
    fetchAdmins,
  } = useAdminContext();

  const handleRefresh = async () => {
    await fetchAdmins();
  };

  return (
    <SidebarWithHeader>
      <div className="flex items-center gap-3 mb-6">
        <CreateNewAdminModal />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 border border-bronze/20 text-bronze/70 text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/5 transition-colors"
        >
          <MdRefresh className="text-base" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-bronze/20 border-t-gold rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-lg font-editorial text-red-500">There was an error loading admins</p>
        </div>
      ) : (
        <AdminsTable admins={admins} />
      )}
    </SidebarWithHeader>
  );
}

export default AdminsPage;
