export const initialUserData = {
  id: 'usr_8492',
  firstName: 'Abdul',
  lastName: 'Rehaman',
  email: 'abdul.rehaman@example.com',
  phone: '+91 98765 43210',
  dob: '1998-08-14',
  anniversary: '2023-11-20',
  gender: 'Male',
  avatar: null,
  membershipTier: 'RS Gold Club',
  rewardPoints: 340,
  whatsappUpdates: true,
  emailNewsletter: true,
  smsUpdates: false,
};

export const initialAddresses = [
  {
    id: 'addr_1',
    name: 'Abdul Rehaman',
    phone: '+91 98765 43210',
    street: 'Flat 402, Lotus Heights, Road No. 12, Banjara Hills',
    landmark: 'Near City Center Mall',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500034',
    tag: 'Home',
    isDefault: true,
  },
  {
    id: 'addr_2',
    name: 'Farhana & Rehan (Anniversary Gift)',
    phone: '+91 98123 45678',
    street: 'Plot 88, Green Park Enclave, Jubilee Hills',
    landmark: 'Opposite Metro Pillar 142',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    tag: 'Gift Recipient',
    isDefault: false,
  },
  {
    id: 'addr_3',
    name: 'Abdul Rehaman (Office)',
    phone: '+91 98765 43210',
    street: 'Cyber Gateway, 3rd Floor, HITEC City',
    landmark: 'Phase 2',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    tag: 'Work',
    isDefault: false,
  }
];

export const initialOrders = [
  {
    id: 'RS-84920',
    date: '2026-09-28T10:15:00Z',
    formattedDate: '28 Sep 2026',
    status: 'In Transit', // 'Placed', 'Packed', 'In Transit', 'Delivered', 'Cancelled'
    statusStep: 3, // 1: Placed, 2: Packed, 3: In Transit, 4: Delivered
    estimatedDelivery: 'Tomorrow, 30 Sep (by 7:00 PM)',
    carrier: 'BlueDart Express',
    trackingNumber: 'BD794021948IN',
    items: [
      {
        id: 'prod-3',
        name: 'Luxury Gift Hamper',
        price: 1999,
        quantity: 1,
        image: '/images/products/luxury-hamper.png',
        customization: 'Card message: "Wishing you countless blessings & joyful celebrations!"',
        giftWrap: true,
      },
      {
        id: 'prod-6',
        name: 'Personalized Mug',
        price: 399,
        quantity: 1,
        image: '/images/products/personalized-mug.png',
        customization: 'Engraved: "Happy Celebrations"',
        giftWrap: false,
      }
    ],
    shippingAddress: {
      recipient: 'Farhana & Rehan',
      phone: '+91 98123 45678',
      address: 'Plot 88, Green Park Enclave, Jubilee Hills, Hyderabad, Telangana - 500033'
    },
    paymentMethod: 'UPI (Google Pay)',
    pricing: {
      subtotal: 2398,
      giftWrap: 50,
      delivery: 0,
      discount: 200,
      total: 2248
    },
    checkpoints: [
      { title: 'Order Placed', time: '28 Sep, 10:15 AM', location: 'RS Gifts Hub, Hyderabad', done: true },
      { title: 'Handcrafted & Luxury Gift Packed', time: '28 Sep, 02:40 PM', location: 'Fulfillment Center, Hyderabad', done: true },
      { title: 'Dispatched via BlueDart Express', time: '29 Sep, 09:10 AM', location: 'Logistics Facility, Hyderabad', done: true },
      { title: 'Out for Delivery', time: 'Expected 30 Sep, 11:00 AM', location: 'Local Delivery Station', done: false },
      { title: 'Delivered to Recipient', time: 'Expected 30 Sep, Evening', location: 'Doorstep', done: false }
    ]
  },
  {
    id: 'RS-78142',
    date: '2026-09-15T14:30:00Z',
    formattedDate: '15 Sep 2026',
    status: 'Delivered',
    statusStep: 4,
    estimatedDelivery: 'Delivered on 17 Sep 2026',
    carrier: 'Delhivery Surface',
    trackingNumber: 'DEL994102941IN',
    items: [
      {
        id: 'prod-2',
        name: 'Personalized Photo Frame',
        price: 499,
        quantity: 1,
        image: '/images/products/photo-frame.png',
        customization: 'High-res Photo Frame with golden lacquer finish',
        giftWrap: true,
      }
    ],
    shippingAddress: {
      recipient: 'Abdul Rehaman',
      phone: '+91 98765 43210',
      address: 'Flat 402, Lotus Heights, Road No. 12, Banjara Hills, Hyderabad, Telangana - 500034'
    },
    paymentMethod: 'Credit Card (Visa)',
    pricing: {
      subtotal: 499,
      giftWrap: 40,
      delivery: 0,
      discount: 0,
      total: 539
    },
    checkpoints: [
      { title: 'Order Placed', time: '15 Sep, 02:30 PM', location: 'RS Gifts Hub', done: true },
      { title: 'Custom Laser Engraving Completed', time: '15 Sep, 06:15 PM', location: 'Studio Hub', done: true },
      { title: 'Shipped via Delhivery Express', time: '16 Sep, 11:00 AM', location: 'Hyderabad Hub', done: true },
      { title: 'Delivered Successfully with Signature', time: '17 Sep, 04:22 PM', location: 'Banjara Hills, Hyderabad', done: true }
    ]
  }
];

export const initialOccasions = [
  {
    id: 'occ_1',
    title: "Mom's Birthday",
    date: '2026-10-18',
    daysLeft: 19,
    relation: 'Mother',
    suggestedCategory: 'Flowers & Hampers',
    giftIdea: 'Luxury Celebration Hamper with Custom Greeting Card'
  },
  {
    id: 'occ_2',
    title: "Sister's Wedding Anniversary",
    date: '2026-11-20',
    daysLeft: 52,
    relation: 'Sister & Brother-in-law',
    suggestedCategory: 'Personalized Gifts',
    giftIdea: 'LED Moon Lamp or Handcrafted Wooden Keepsake Frame'
  }
];
