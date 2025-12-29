
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: any, res: any) {
  const { id } = req.query;
  const { db } = await connectToDatabase();
  const productsCollection = db.collection('products');

  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid product ID format.' });
  }

  try {
    if (req.method === 'PUT') {
      const productData = req.body;
      // Hapus _id dan id dari data update untuk mencegah error
      delete productData._id;
      delete productData.id;

      const result = await productsCollection.updateOne(
        { _id: objectId },
        { $set: productData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({ message: 'Product updated successfully' });
    } else if (req.method === 'DELETE') {
      const result = await productsCollection.deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
