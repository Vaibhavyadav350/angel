import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUserContext } from '../../context/user_context';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../context/cart_context';
import { useProductsContext } from '../../context/products_context';
import { useOrderContext } from '../../context/order_context';
import { formatPrice } from '../../utils/helpers';
import { default_profile_image } from '../../utils/constants';
import { NewArrivalsCarousel } from '../../components/archive';

// Reusable archive input style
const inputClass =
  'w-full bg-white/50 border-none rounded-2xl py-4 px-6 font-editorial text-xl text-bronze focus:ring-1 focus:ring-gold transition-all';

const ProfilePage = () => {
  const {
    currentUser,
    logoutUser,
    updateUserProfileImage,
    updateUserProfileName,
    uploadProfileImage,
    updateUserProfilePassword,
    reauthenticateUser,
  } = useUserContext();
  const { displayName, email, photoURL } = currentUser || {};
  const { clearCart } = useCartContext();
  const { closeSidebar } = useProductsContext();
  const { orders, fetchOrders } = useOrderContext();

  const [image, setImage] = useState(photoURL);
  const [name, setName] = useState(displayName || 'User');
  const [existingPassword, setExistingPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Angel Fashion Studio | Dashboard';
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      handleImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (img) => {
    setLoading(true);
    try {
      const response = await uploadProfileImage(img);
      if (response.success) {
        await updateUserProfileImage(response.data.url);
        toast.success('Profile image updated');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await updateUserProfileName(name);
      toast.success('Name updated');
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  const handleUpdatePassword = async () => {
    if (!existingPassword || !newPassword) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await reauthenticateUser(existingPassword);
      await updateUserProfilePassword(newPassword);
      toast.success('Password updated');
      setExistingPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }


  return (
    <main className="bg-champagne font-body min-h-screen pt-48">
      <section className="container mx-auto px-12 lg:px-24 mb-32">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 space-y-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold mb-8 block">User
                Archive</span>
              <h2 className="text-5xl font-editorial font-black text-bronze uppercase leading-none">Profile</h2>
            </div>
            <nav className="space-y-4">
              <a className="flex items-center gap-6 p-6 bg-white/40 border border-gold/20 rounded-2xl group hover:bg-white transition-all"
                href="#personal">
                <span className="material-symbols-outlined text-gold">account_circle</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze">Personal
                  Info</span>
              </a>
              <a className="flex items-center gap-6 p-6 border border-gold/10 rounded-2xl group hover:bg-white/40 transition-all"
                href="#orders">
                <span
                  className="material-symbols-outlined text-bronze/40 group-hover:text-gold transition-colors">shopping_bag</span>
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze/60 group-hover:text-bronze">Past
                  Orders</span>
              </a>
              <button
                className="w-full flex items-center gap-6 p-6 border border-gold/10 rounded-2xl group hover:bg-red-50/50 transition-all mt-12"
                onClick={() => {
                  clearCart();
                  logoutUser();
                  closeSidebar();
                }}
              >
                <span className="material-symbols-outlined text-red-800/40">logout</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-800/60">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 space-y-24">

            {/* Personal Info Panel */}
            <div className="bg-white/30 backdrop-blur-xl rounded-[40px] p-12 lg:p-16 border border-gold/10 shadow-sm"
              id="personal">
              <div className="flex flex-col md:flex-row gap-16 items-start">
                <div className="relative group shrink-0">
                  <div className="size-48 rounded-full overflow-hidden border-2 border-gold/30 p-1 bg-white shadow-xl relative">
                    <img alt="User Profile"
                      className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                      src={image || default_profile_image} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 size-12 bg-bronze text-champagne rounded-full flex items-center justify-center border-4 border-white shadow-lg pointer-events-none">
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </div>
                </div>

                <div className="flex-1 space-y-12 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold px-2">Display Name</label>
                      <div className="flex gap-2">
                        <input
                          className={inputClass}
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <button onClick={handleUpdateName} disabled={loading} className="p-4 bg-bronze text-champagne rounded-2xl hover:bg-gold transition-colors">
                          <span className="material-symbols-outlined">save</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold px-2">Email Identity</label>
                      <input
                        className="w-full bg-white/20 border-none rounded-2xl py-4 px-6 font-editorial text-xl text-bronze/40 cursor-not-allowed"
                        disabled type="email" value={email} />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gold/10">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-editorial font-bold text-bronze uppercase">Security Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 relative">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold px-2">Current Password</label>
                        <input
                          className={inputClass}
                          placeholder="••••••••••••" type="password"
                          value={existingPassword}
                          onChange={(e) => setExistingPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3 relative">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold px-2">New Password</label>
                        <input
                          className={inputClass}
                          placeholder="••••••••••••" type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          onClick={handleUpdatePassword}
                          disabled={loading}
                          className="bg-bronze text-champagne py-5 px-10 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 shadow-lg disabled:opacity-50">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Panel */}
            <div className="space-y-10" id="orders">
              <div className="flex justify-between items-end px-4">
                <h3 className="text-4xl font-editorial font-black text-bronze uppercase">Order History</h3>
                <p className="text-[10px] font-bold text-bronze/40 uppercase tracking-[0.5em]">{orders.length} Total Archives</p>
              </div>

              {orders.length < 1 ? (
                <div className="space-y-16 mt-10">
                  <div className="p-20 text-center border border-dashed border-bronze/20 rounded-[40px]">
                    <h4 className="text-2xl font-editorial text-bronze/50 mb-6">Your archive is empty</h4>
                    <Link to="/products" className="inline-block px-10 py-4 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gold transition-colors">Start Curating</Link>
                  </div>
                  <div className="border-t border-bronze/10 pt-8">
                    <NewArrivalsCarousel />
                  </div>
                </div>
              ) : (
                orders.map((order) => {
                  const { _id, orderStatus, totalPrice, orderItems } = order;
                  return (
                    <div key={_id} className="order-card bg-white/40 border border-gold/10 rounded-[40px] overflow-hidden">
                      <div className="p-10 flex flex-wrap items-center justify-between gap-8 border-b border-gold/5">
                        <div className="flex items-center gap-10">
                          <div className="p-4 bg-white rounded-2xl shadow-sm border border-gold/10">
                            <span className="material-symbols-outlined text-gold">local_shipping</span>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-gold uppercase tracking-[0.4em]">Order #{String(_id || '').substring(0, 8)}</p>
                            <h4 className="text-2xl font-editorial font-bold text-bronze uppercase">Archive Collection</h4>
                          </div>
                        </div>
                        <div className="flex gap-12 text-center">
                          <div>
                            <p className="text-[9px] font-bold text-bronze/30 uppercase tracking-widest mb-1">Status</p>
                            <span className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border ${orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                              {orderStatus}
                            </span>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-bronze/30 uppercase tracking-widest mb-1">Total</p>
                            <p className="text-xl font-editorial font-black text-bronze leading-none">{formatPrice(totalPrice)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details (Simplified for list view to just show items snippet) */}
                      <div className="p-10 bg-white/20">
                        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                          {(orderItems || []).map((item) => (
                            <div key={item._id} className="min-w-[200px] flex items-center gap-4 p-4 bg-white/40 rounded-3xl border border-gold/5">
                              <div className="size-16 rounded-2xl overflow-hidden border border-gold/10 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h5 className="font-editorial font-bold text-bronze text-sm truncate w-24">{item.name}</h5>
                                <p className="text-[9px] font-bold text-bronze/50 uppercase tracking-widest">{formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Journey Section (Static) */}
      <section className="relative w-full h-[80vh] bg-chocolate overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img alt="Model in lehenga"
            className="w-full h-full object-cover opacity-60"
            src="/assets/landing/bridal-edit-center.jpg" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chocolate/20 to-chocolate/80"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.8em] mb-6 block">CINEMATIC JOURNEY</span>
          <h2 className="text-6xl lg:text-9xl font-editorial font-black text-champagne uppercase tracking-tighter mb-12">
            HERITAGE<br /><span className="italic font-light">IN MOTION</span>
          </h2>
        </div>
      </section>

    </main>
  );
};

export default ProfilePage;
