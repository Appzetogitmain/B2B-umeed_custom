import Store from '../models/Store.js';

// Get all stores
export const getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 });
    res.status(200).json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Server Error fetching stores' });
  }
};

// Create a new store
export const createStore = async (req, res) => {
  try {
    const { name, storeType, city, address, status } = req.body;

    if (!name || !storeType || !city) {
      return res.status(400).json({ message: 'Name, Store Type, and City are required' });
    }

    const newStore = new Store({
      name,
      storeType,
      city,
      address,
      status: status || 'Active'
    });

    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ message: 'Server Error creating store' });
  }
};

// Update an existing store
export const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ message: 'Server Error updating store' });
  }
};

// Delete a store
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByIdAndDelete(id);
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ message: 'Server Error deleting store' });
  }
};
