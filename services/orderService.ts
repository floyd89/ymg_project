
import { Order } from '../types';

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2405-AB7C1',
    customerName: 'Budi Hartono',
    date: '2024-05-20T10:30:00Z',
    total: 128000,
    status: 'Selesai',
    items: [{ productId: 'prod-1', productName: 'Ransel Urban', quantity: 2, price: 64000 }]
  },
  {
    id: 'ORD-2405-DE4F2',
    customerName: 'Citra Lestari',
    date: '2024-05-22T14:00:00Z',
    total: 75000,
    status: 'Dikirim',
    items: [{ productId: 'prod-2', productName: 'Tote Bag Kanvas', quantity: 1, price: 75000 }]
  },
  {
    id: 'ORD-2405-GHI89',
    customerName: 'Ahmad Subagja',
    date: '2024-05-23T09:15:00Z',
    total: 55000,
    status: 'Diproses',
    items: [{ productId: 'prod-3', productName: 'Sling Bag Minimalis', quantity: 1, price: 55000 }]
  },
   {
    id: 'ORD-2404-JK1L2',
    customerName: 'Dewi Anggraini',
    date: '2024-04-15T11:00:00Z',
    total: 64000,
    status: 'Selesai',
    items: [{ productId: 'prod-1', productName: 'Ransel Urban', quantity: 1, price: 64000 }]
  },
  {
    id: 'ORD-2404-MN4O5',
    customerName: 'Eko Prasetyo',
    date: '2024-04-28T18:45:00Z',
    total: 130000,
    status: 'Dibatalkan',
    items: [{ productId: 'prod-2', productName: 'Tote Bag Kanvas', quantity: 1, price: 75000 }, { productId: 'prod-3', productName: 'Sling Bag Minimalis', quantity: 1, price: 55000 }]
  },
];


const getOrders = async (): Promise<Order[]> => {
  // Dalam aplikasi nyata, ini akan menjadi panggilan ke Supabase atau API lainnya.
  // Untuk saat ini, kita simulasikan dengan data statis dan delay.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_ORDERS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, 500); // Delay 0.5 detik untuk simulasi pengambilan data jaringan
  });
};

export const orderService = {
  getOrders,
};
