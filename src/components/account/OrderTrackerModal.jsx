import React, { useState } from 'react';
import { X, Check, Truck, Package, Clock, MapPin, Copy, CheckCheck, ExternalLink } from 'lucide-react';

export const OrderTrackerModal = ({ order, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-neutral-200 font-sans"
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-[#F0E6EC] flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#1E1217]">
                Track Order #{order.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2F4] text-[#821D38]">
                {order.status}
              </span>
            </div>
            <span className="text-xs text-[#6F6870]">
              Placed on {order.formattedDate}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Courier & ETA Highlight Card */}
          <div className="p-4 rounded-2xl bg-[#FAF6F8] border border-[#F2E8EE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-[#821D38] uppercase tracking-wider block">
                Estimated Delivery
              </span>
              <span className="text-sm sm:text-base font-bold text-[#1E1217] block mt-0.5">
                {order.estimatedDelivery}
              </span>
              {order.carrier && (
                <span className="text-xs text-[#6F6870] mt-0.5 block">
                  Carrier: <strong className="text-neutral-800">{order.carrier}</strong>
                </span>
              )}
            </div>

            {/* AWB Tracking Pill with Copy */}
            {order.trackingNumber && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 self-start sm:self-center">
                <div className="text-left">
                  <span className="text-[9.5px] text-neutral-400 block uppercase font-bold">AWB Number</span>
                  <span className="text-xs font-mono font-bold text-neutral-800">{order.trackingNumber}</span>
                </div>
                <button
                  onClick={handleCopy}
                  title="Copy tracking number"
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer ml-1"
                >
                  {copied ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>

          {/* Vertical Timeline Checkpoints */}
          <div>
            <h4 className="text-xs font-bold text-[#29252A] uppercase tracking-wider mb-4">
              Live Shipment Activity
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
              {order.checkpoints?.map((cp, idx) => (
                <div key={idx} className="relative flex items-start gap-3.5">
                  {/* Step Bullet */}
                  <div
                    className={`absolute -left-[24px] top-0.5 w-[24px] h-[24px] rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs ${
                      cp.done ? 'bg-[#821D38]' : 'bg-neutral-300'
                    }`}
                  >
                    {cp.done ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  {/* Checkpoint Details */}
                  <div className="flex-1">
                    <span className={`text-xs font-bold block ${cp.done ? 'text-[#1E1217]' : 'text-neutral-400'}`}>
                      {cp.title}
                    </span>
                    <span className="text-[11px] text-[#6F6870] block mt-0.5">
                      {cp.time} • {cp.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Recipient Details */}
          <div className="pt-4 border-t border-[#F2EAEF]">
            <h4 className="text-xs font-bold text-[#29252A] uppercase tracking-wider mb-2">
              Shipping Destination
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-[#EFEBEF] flex items-start gap-3">
              <MapPin size={16} className="text-[#821D38] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#1E1217] block">
                  {typeof order.shippingAddress?.recipient === 'string'
                    ? order.shippingAddress.recipient
                    : order.shippingAddress?.recipientName || 'Gift Recipient'}
                </span>
                <span className="text-[#6F6870] block mt-0.5">
                  {typeof order.shippingAddress?.address === 'string'
                    ? order.shippingAddress.address
                    : [
                        order.shippingAddress?.addressLine1,
                        order.shippingAddress?.addressLine2,
                        order.shippingAddress?.city,
                        order.shippingAddress?.state,
                        order.shippingAddress?.postalCode,
                      ].filter(Boolean).join(', ') || 'Standard Shipping Address'}
                </span>
                {order.shippingAddress?.phone && (
                  <span className="text-[#6F6870] block mt-0.5">Phone: {order.shippingAddress.phone}</span>
                )}
              </div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="pt-4 border-t border-[#F2EAEF]">
            <h4 className="text-xs font-bold text-[#29252A] uppercase tracking-wider mb-2">
              Items in this Package ({order.items.length})
            </h4>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8FA] border border-[#F0E8EE]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-11 h-11 object-cover rounded-lg bg-white shrink-0 border border-neutral-100"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#1E1217] truncate block">{item.name}</span>
                    <span className="text-[11px] text-[#6F6870]">Qty: {item.quantity} • ₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#FAF8FA] border-t border-[#F2EAEF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#821D38] text-white text-xs font-semibold hover:bg-[#6E162E] transition-colors cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackerModal;
