import React, { useState } from 'react';
import { useAdminUserStore } from '../../stores';
import { toast } from 'react-toastify';

function CreateNewAdminModal() {
  const {
    newAdmin: { name, email, password, privilege },
    updateNewAdminDetails,
    createNewAdmin,
    fetchAdmins,
  } = useAdminUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password || !privilege) {
      return toast.error('Please enter all the details', { position: 'top-center' });
    }
    setLoading(true);
    const response = await createNewAdmin();
    setLoading(false);
    if (response.success) {
      setIsOpen(false);
      toast.success(`Account created: ${response.data.name}`, { position: 'top-center' });
      return await fetchAdmins();
    } else {
      setIsOpen(false);
      toast.error(response.message, { position: 'top-center' });
    }
  };

  const inputClass = "w-full bg-champagne/50 border border-bronze/20 rounded px-3 py-2.5 text-sm text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 mb-2";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors"
      >
        Create New Admin
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-bronze/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white border border-bronze/10 rounded-lg w-full max-w-md z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-bronze/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-bronze">Create New Admin</h3>
              <button onClick={() => setIsOpen(false)} className="text-bronze/40 hover:text-bronze transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input className={inputClass} placeholder="Full Name" name="name" value={name} onChange={updateNewAdminDetails} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} placeholder="Email" name="email" value={email} onChange={updateNewAdminDetails} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input className={inputClass} type="password" placeholder="Password" name="password" value={password} onChange={updateNewAdminDetails} />
              </div>
              <div>
                <label className={labelClass}>Privilege</label>
                <select className={inputClass} name="privilege" value={privilege} onChange={updateNewAdminDetails}>
                  <option value="super">Super</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-bronze/10">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 hover:text-bronze border border-bronze/20 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 bg-bronze text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded hover:bg-bronze/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateNewAdminModal;
