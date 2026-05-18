const UserService = require('../services/UserService');
const UserError = require('../exceptions/UserError');
const User = require('../models/User');
const Address = require('../models/Address');

const getUserProfileByJwt = async (req, res) => {
    try {
        
        const user = await req.user;
        return res.status(200).json(user);
    } catch (err) {
        handleErrors(err, res);
    }
};

const addAddressToUser = async (req, res) => {
    try {
        const user = await req.user;
        const addressData = req.body;

        const newAddress = await Address.create(addressData);
        user.addresses = user.addresses || [];
        if (!user.addresses.some((id) => id.toString() === newAddress._id.toString())) {
            user.addresses.push(newAddress._id);
        }

        await User.findByIdAndUpdate(user._id, user);
        const updatedUser = await User.findById(user._id).populate('addresses');

        return res.status(200).json(updatedUser);
    } catch (err) {
        handleErrors(err, res);
    }
};

const removeAddressFromUser = async (req, res) => {
  try {
    const user = await req.user;
    const { id } = req.params;

    if (!user.addresses) {
      return res.status(400).json({ message: 'No addresses found for user' });
    }

    user.addresses = user.addresses.filter(
      (addressId) => addressId.toString() !== id
    );

    await User.findByIdAndUpdate(user._id, { addresses: user.addresses });
    await Address.findByIdAndDelete(id);

    const updatedUser = await User.findById(user._id).populate('addresses');
    return res.status(200).json(updatedUser);
  } catch (err) {
    handleErrors(err, res);
  }
};

const getUserByEmail = async (req, res) => {
    const { email } = req.query; 
    try {
        const user = await UserService.findUserByEmail(email);
        return res.status(200).json(user);
    } catch (err) {
        handleErrors(err, res);
    }
};


const handleErrors = (err, res) => {
    if (err instanceof UserError) {
        return res.status(404).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
};

// Export the controller methods
module.exports = {
    getUserProfileByJwt,
    addAddressToUser,
    removeAddressFromUser,
    getUserByEmail,
};
