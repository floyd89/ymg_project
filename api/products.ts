
import { connectToDatabase } from '../lib/mongodb';
import { Product } from '../types';

// Data awal untuk di-seed jika database kosong
const initialProducts: Omit<Product, 'id'>[] = [
    {
        name: 'Urban Explorer Backpack',
        category: 'Backpack',
        price: 'Rp 450.000',
        shortDescription: 'Ransel serbaguna dengan desain modern untuk aktivitas harian dan perjalanan.',
        fullDescription: 'Didesain untuk petualang kota, Urban Explorer Backpack memadukan gaya dan fungsi. Dengan kompartemen laptop empuk dan banyak saku, tas ini siap menemani semua kesibukan Anda dari kantor hingga akhir pekan.',
        highlights: [],
        imageUrl: 'https://picsum.photos/seed/backpack-black/800/600',
        variants: [
            { id: 'ueb-black', colorName: 'Hitam Arang', colorHex: '#333333', imageUrl: 'https://picsum.photos/seed/backpack-black/800/600' },
            { id: 'ueb-navy', colorName: 'Biru Dongker', colorHex: '#1E3A8A', imageUrl: 'https://picsum.photos/seed/backpack-navy/800/600' },
            { id: 'ueb-grey', colorName: 'Abu-abu Batu', colorHex: '#A0AEC0', imageUrl: 'https://picsum.photos/seed/backpack-grey/800/600' },
        ]
    },
    // ... (tambahkan produk awal lainnya jika perlu)
];

export default async function handler(req: any, res: any) {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');

    try {
        if (req.method === 'GET') {
            let products = await productsCollection.find({}).toArray();

            // Jika tidak ada produk, seed database dengan data awal
            if (products.length === 0) {
                console.log('Database kosong, seeding produk awal...');
                await productsCollection.insertMany(initialProducts);
                products = await productsCollection.find({}).toArray();
            }

            // Map _id ke id untuk konsistensi di frontend
            const formattedProducts = products.map(p => ({
                ...p,
                id: p._id.toString(),
            }));

            res.status(200).json(formattedProducts);
        } else if (req.method === 'POST') {
            const newProduct = req.body;
            delete newProduct.id; // Hapus id sementara dari frontend

            const result = await productsCollection.insertOne(newProduct);
            const insertedProduct = { ...newProduct, id: result.insertedId.toString() };

            res.status(201).json(insertedProduct);
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
