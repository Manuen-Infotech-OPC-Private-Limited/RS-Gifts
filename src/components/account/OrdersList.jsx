import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { OrderTrackerModal } from './OrderTrackerModal';
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  Gift,
  Check
} from 'lucide-react';

export const OrdersList = () => {
  const { orders, cancelOrder } = useAuth();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [invoiceToast, setInvoiceToast] = useState('');

  const filterTabs = ['All', 'In Transit', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((order) => {
    // Filter by status tab
    const matchesFilter =
      filter === 'All' ? true : order.status.toLowerCase() === filter.toLowerCase();

    // Filter by search query
    const matchesQuery =
      searchQuery.trim() === ''
        ? true
        : order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

    return matchesFilter && matchesQuery;
  });

  const handleDownloadInvoice = (orderId) => {
    setInvoiceToast(`Invoice #${orderId}.pdf downloaded successfully!`);
    setTimeout(() => setInvoiceToast(''), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Truck size={12} className="animate-pulse" />
            <span>In Transit</span>
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>Delivered</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle size={12} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Clock size={12} />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Toast Notification */}
      {invoiceToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#1E1217] text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Download size={14} className="text-[#C9A45C]" />
          <span>{invoiceToast}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#ECE7EC] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E1217]">My Orders & Live Tracking</h2>
            <p className="text-xs text-[#6F6870] mt-0.5">
              Track live packages, review past gifts, and download invoices.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-[260px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Gift..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#821D38]"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filter === tab
                  ? 'bg-[#821D38] text-white shadow-xs'
                  : 'bg-[#FAF8FA] text-[#6F6870] hover:text-[#1E1217] hover:bg-[#F2EAEF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-[#ECE7EC] shadow-xs text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FDF2F4] text-[#821D38] flex items-center justify-center mx-auto">
            <Package size={26} />
          </div>
          <h3 className="text-sm font-bold text-[#1E1217]">No Orders Found</h3>
          <p className="text-xs text-[#6F6870] max-w-sm mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}". Try a different keyword.`
              : `You don't have any ${filter.toLowerCase()} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCancelled = order.status === 'Cancelled';
            const isDelivered = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#ECE7EC] shadow-xs hover:border-[#D9CAD2] transition-all overflow-hidden"
              >
                {/* Order Card Top Bar */}
                <div className="bg-[#FAF8FA] px-5 py-3.5 border-b border-[#ECE7EC] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#1E1217]">
                      Order #{order.id}
                    </span>
                    <span className="text-[#6F6870]">
                      Placed on {order.formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#1E1217]">
                      Total: ₹{order.pricing.total.toLocaleString('en-IN')}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Step Progress Bar (Horizontal Stepper) */}
                  {!isCancelled && (
                    <div className="p-4 rounded-xl bg-[#FCFAFB] border border-[#F2EAEF]">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-semibold text-[#821D38] flex items-center gap-1.5">
                          <Truck size={15} />
                          <span>{order.estimatedDelivery}</span>
                        </span>
                        <span className="text-[11px] text-[#6F6870]">
                          Carrier: {order.carrier} (AWB: {order.trackingNumber})
                        </span>
                      </div>

                      {/* Progress Line */}
                      <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-neutral-200 z-0">
                          <div
                            className="h-full bg-[#821D38] transition-all duration-500"
                            style={{
                              width:
                                order.statusStep === 1
                                  ? '15%'
                                  : order.statusStep === 2
                                  ? '45%'
                                  : order.statusStep === 3
                                  ? '75%'
                                  : '100%',
                            }}
                          />
                        </div>

                        {/* Milestones */}
                        {[
                          { step: 1, label: 'Placed' },
                          { step: 2, label: 'Gift Packed' },
                          { step: 3, label: 'Shipped' },
                          { step: 4, label: 'Delivered' },
                        ].map((m) => {
                          const isDone = order.statusStep >= m.step;
                          const isCurrent = order.statusStep === m.step;

                          return (
                            <div key={m.step} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs ${
                                  isDone
                                    ? 'bg-[#821D38] text-white'
                                    : 'bg-neutral-200 text-neutral-500'
                                } ${isCurrent ? 'ring-2 ring-[#821D38]/30 scale-110' : ''}`}
                              >
                                {isDone ? <Check size={12} className="stroke-[3]" /> : m.step}
                              </div>
                              <span
                                className={`text-[10.5px] mt-1 font-semibold whitespace-nowrap ${
                                  isDone ? 'text-[#1E1217]' : 'text-neutral-400'
                                }`}
                              >
                                {m.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#EFEBEF]"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-xl bg-[#FAF8FA] border border-neutral-100 shrink-0"
                          />
                          <div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-[#1E1217]">
                              {item.name}
                            </h4>
                            <span className="text-xs text-[#6F6870]">
                              Qty: {item.quantity} • ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            {item.customization && (
                              <p className="text-[11px] text-[#821D38] font-medium flex items-center gap-1 mt-0.5">
                                <Gift size={12} />
                                <span>{item.customization}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#1E1217] sm:text-right">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recipient Address */}
                  <div className="text-xs text-[#6F6870] pt-2 border-t border-[#F2EAEF]">
                    <span className="font-semibold text-[#1E1217]">Delivering to: </span>
                    <span>{order.shippingAddress.recipient} — {order.shippingAddress.address}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F2EAEF]">
                    <div className="flex items-center gap-2">
                      {/* Live Track Button */}
                      {!isCancelled && (
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          className="px-4 py-2 rounded-xl bg-[#821D38] hover:bg-[#6E162E] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Truck size={14} />
                          <span>Track Live Shipment</span>
                        </button>
                      )}

                      {/* Download Invoice */}
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF8FA] hover:bg-[#F2EAEF] text-[#4A3E45] text-xs font-semibold border border-[#E0D4DC] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={14} />
                        <span>Invoice</span>
                      </button>
                    </div>

                    {/* Secondary Actions */}
                    <div className="flex items-center gap-2">
                      {!isDelivered && !isCancelled && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
                              cancelOrder(order.id);
                            }
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}

                      {isDelivered && (
                        <button
                          onClick={() => alert(`Items from Order #${order.id} added to your cart!`)}
                          className="text-xs text-[#821D38] hover:text-[#6E162E] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={13} />
                          <span>Buy Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrderForTracking && (
        <OrderTrackerModal
          order={selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
        />
      )}
    </div>
  );
};

export default OrdersList;
