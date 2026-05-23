import Retailer from '../models/Retailer.js';
import Admin from '../models/Admin.js';
import cloudinary from '../config/cloudinary.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const registerRetailer = async (req, res) => {
  try {
    const {
      name, email, password, deliveryAddress, status, walletBalance,
      shopName, shopType, addressAsPerAadhaar, aadhaarState, aadhaarPin, aadhaarNo, panNo,
      partnerNameA, partnerNameB, phone, whatsappNo, alternateContactName, alternateContactPhone,
      areaOfOperation, pinCode, state, gstNumber, bankName, ifscCode, bankBranch,
      accountHolderName, accountNo, retailShopName, completeAddress, landmark, policeStation,
      addressPinCode, addressState, photo
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide Name, Email and Password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const retailerExists = await Retailer.findOne({ email });
    if (retailerExists) {
      return res.status(400).json({ message: 'Retailer with this email already exists' });
    }

    // Upload photo to Cloudinary if provided
    let photoUrl = '';
    if (photo && photo.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(photo, {
          folder: 'umeed_retailers'
        });
        photoUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error during signup:', err);
      }
    } else if (photo) {
      photoUrl = photo;
    }

    // Create retailer
    const retailer = await Retailer.create({
      name,
      email,
      password,
      deliveryAddress: deliveryAddress || completeAddress || '',
      status: status || 'Pending',
      walletBalance: walletBalance || 'Rs 0',
      registeredBy: 'retailer-app',
      ownerName: name,
      storeName: shopName || retailShopName || '',
      phone: phone || '',
      city: landmark || '',
      gstNumber: gstNumber || '',
      shopName: shopName || '',
      shopType: shopType || '',
      addressAsPerAadhaar: addressAsPerAadhaar || '',
      aadhaarState: aadhaarState || '',
      aadhaarPin: aadhaarPin || '',
      aadhaarNo: aadhaarNo || '',
      panNo: panNo || '',
      partnerNameA: partnerNameA || '',
      partnerNameB: partnerNameB || '',
      whatsappNo: whatsappNo || '',
      alternateContactName: alternateContactName || '',
      alternateContactPhone: alternateContactPhone || '',
      areaOfOperation: areaOfOperation || '',
      pinCode: pinCode || '',
      state: state || '',
      bankName: bankName || '',
      ifscCode: ifscCode || '',
      bankBranch: bankBranch || '',
      accountHolderName: accountHolderName || '',
      accountNo: accountNo || '',
      retailShopName: retailShopName || '',
      completeAddress: completeAddress || deliveryAddress || '',
      landmark: landmark || '',
      policeStation: policeStation || '',
      addressPinCode: addressPinCode || '',
      addressState: addressState || '',
      photo: photoUrl
    });

    if (retailer) {
      res.status(201).json({
        _id: retailer._id,
        name: retailer.name,
        email: retailer.email,
        phone: retailer.phone,
        deliveryAddress: retailer.deliveryAddress,
        partners: retailer.partners || [],
        walletBalance: retailer.walletBalance || 'Rs 0',
        shopName: retailer.shopName,
        shopType: retailer.shopType,
        addressAsPerAadhaar: retailer.addressAsPerAadhaar,
        aadhaarState: retailer.aadhaarState,
        aadhaarPin: retailer.aadhaarPin,
        aadhaarNo: retailer.aadhaarNo,
        panNo: retailer.panNo,
        partnerNameA: retailer.partnerNameA,
        partnerNameB: retailer.partnerNameB,
        whatsappNo: retailer.whatsappNo,
        alternateContactName: retailer.alternateContactName,
        alternateContactPhone: retailer.alternateContactPhone,
        areaOfOperation: retailer.areaOfOperation,
        pinCode: retailer.pinCode,
        state: retailer.state,
        gstNumber: retailer.gstNumber,
        bankName: retailer.bankName,
        ifscCode: retailer.ifscCode,
        bankBranch: retailer.bankBranch,
        accountHolderName: retailer.accountHolderName,
        accountNo: retailer.accountNo,
        retailShopName: retailer.retailShopName,
        completeAddress: retailer.completeAddress,
        landmark: retailer.landmark,
        policeStation: retailer.policeStation,
        addressPinCode: retailer.addressPinCode,
        addressState: retailer.addressState,
        photo: retailer.photo,
        message: 'Retailer registered successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid retailer data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginRetailer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const retailer = await Retailer.findOne({ email });

    if (retailer && (await retailer.matchPassword(password))) {
      res.json({
        _id: retailer._id,
        name: retailer.name,
        email: retailer.email,
        phone: retailer.phone,
        deliveryAddress: retailer.deliveryAddress,
        partners: retailer.partners || [],
        shopName: retailer.shopName || '',
        shopType: retailer.shopType || '',
        addressAsPerAadhaar: retailer.addressAsPerAadhaar || '',
        aadhaarState: retailer.aadhaarState || '',
        aadhaarPin: retailer.aadhaarPin || '',
        aadhaarNo: retailer.aadhaarNo || '',
        panNo: retailer.panNo || '',
        partnerNameA: retailer.partnerNameA || '',
        partnerNameB: retailer.partnerNameB || '',
        whatsappNo: retailer.whatsappNo || '',
        alternateContactName: retailer.alternateContactName || '',
        alternateContactPhone: retailer.alternateContactPhone || '',
        areaOfOperation: retailer.areaOfOperation || '',
        pinCode: retailer.pinCode || '',
        state: retailer.state || '',
        gstNumber: retailer.gstNumber || '',
        bankName: retailer.bankName || '',
        ifscCode: retailer.ifscCode || '',
        bankBranch: retailer.bankBranch || '',
        accountHolderName: retailer.accountHolderName || '',
        accountNo: retailer.accountNo || '',
        retailShopName: retailer.retailShopName || '',
        completeAddress: retailer.completeAddress || '',
        landmark: retailer.landmark || '',
        policeStation: retailer.policeStation || '',
        addressPinCode: retailer.addressPinCode || '',
        addressState: retailer.addressState || '',
        photo: retailer.photo || '',
        message: 'Retailer logged in successfully'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const updateRetailerProfile = async (req, res) => {
  try {
    const { _id, name, email, phone, deliveryAddress, partners } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Retailer ID is required' });
    }

    const retailer = await Retailer.findById(_id);

    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    retailer.name = name || retailer.name;
    retailer.email = email || retailer.email;
    if (phone !== undefined) retailer.phone = phone;
    if (deliveryAddress !== undefined) retailer.deliveryAddress = deliveryAddress;
    if (partners !== undefined) retailer.partners = partners;

    const updatedRetailer = await retailer.save();

    res.json({
      _id: updatedRetailer._id,
      name: updatedRetailer.name,
      email: updatedRetailer.email,
      phone: updatedRetailer.phone,
      deliveryAddress: updatedRetailer.deliveryAddress,
      partners: updatedRetailer.partners,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

export const loginRetailerPartner = async (req, res) => {
  try {
    const { ownerEmail, partnerPhone } = req.body;
    if (!ownerEmail || !partnerPhone) {
      return res.status(400).json({ message: 'Please provide owner email and partner phone number' });
    }

    const retailer = await Retailer.findOne({ email: ownerEmail.toLowerCase() });
    if (!retailer) {
      return res.status(404).json({ message: 'Owner store not found with this email' });
    }

    const partner = retailer.partners.find(p => p.phone.trim() === partnerPhone.trim());
    if (!partner) {
      return res.status(401).json({ message: 'Partner phone number not registered under this owner' });
    }

    res.json({
      _id: retailer._id,
      name: retailer.name,
      email: retailer.email,
      phone: retailer.phone,
      deliveryAddress: retailer.deliveryAddress,
      partners: retailer.partners || [],
      isStaff: true,
      staffName: partner.name,
      staffPhone: partner.phone,
      staffRole: partner.role,
      message: 'Staff / Partner logged in successfully'
    });
  } catch (error) {
    console.error('Partner login error:', error);
    res.status(500).json({ message: 'Server error during partner login' });
  }
};

export const getAdminRetailers = async (req, res) => {
  try {
    // Delete any old seeded static records ending in @retailmail.com
    await Retailer.deleteMany({ email: { $regex: /@retailmail\.com$/i } });

    const retailers = await Retailer.find({});
    res.json(retailers);
  } catch (error) {
    console.error('Get admin retailers error:', error);
    res.status(500).json({ message: 'Server error fetching retailers' });
  }
};

export const createAdminRetailer = async (req, res) => {
  try {
    const {
      storeName, ownerName, phone, email, city, address, gstNumber, status, walletBalance, password,
      shopName, shopType, addressAsPerAadhaar, aadhaarState, aadhaarPin, aadhaarNo, panNo,
      partnerNameA, partnerNameB, whatsappNo, alternateContactName, alternateContactPhone,
      areaOfOperation, pinCode, state, bankName, ifscCode, bankBranch,
      accountHolderName, accountNo, retailShopName, completeAddress, landmark, policeStation,
      addressPinCode, addressState, photo
    } = req.body;

    // Validation
    if (!ownerName || !email || !password) {
      return res.status(400).json({ message: 'Please provide Owner Name, Email and Password' });
    }

    // Phone validation (exactly 10 digits if provided)
    let cleanedPhone = '';
    if (phone) {
      cleanedPhone = phone.trim();
      if (!/^\d{10}$/.test(cleanedPhone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if retailer already exists
    const retailerExists = await Retailer.findOne({ email: email.toLowerCase() });
    if (retailerExists) {
      return res.status(400).json({ message: 'Retailer with this email already exists' });
    }

    // Upload photo if provided
    let photoUrl = '';
    if (photo && photo.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(photo, {
          folder: 'umeed_retailers'
        });
        photoUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
      }
    } else if (photo) {
      photoUrl = photo;
    }

    // Create retailer
    const retailer = await Retailer.create({
      name: ownerName,
      ownerName,
      storeName: storeName || shopName || '',
      email: email.toLowerCase(),
      phone: cleanedPhone,
      city: city || landmark || '',
      deliveryAddress: address || completeAddress || '',
      gstNumber: gstNumber || '',
      status: status || 'Pending',
      walletBalance: walletBalance || '',
      password: password,
      registeredBy: 'admin',
      shopName: shopName || storeName || '',
      shopType: shopType || '',
      addressAsPerAadhaar: addressAsPerAadhaar || '',
      aadhaarState: aadhaarState || '',
      aadhaarPin: aadhaarPin || '',
      aadhaarNo: aadhaarNo || '',
      panNo: panNo || '',
      partnerNameA: partnerNameA || '',
      partnerNameB: partnerNameB || '',
      whatsappNo: whatsappNo || '',
      alternateContactName: alternateContactName || '',
      alternateContactPhone: alternateContactPhone || '',
      areaOfOperation: areaOfOperation || '',
      pinCode: pinCode || '',
      state: state || '',
      bankName: bankName || '',
      ifscCode: ifscCode || '',
      bankBranch: bankBranch || '',
      accountHolderName: accountHolderName || '',
      accountNo: accountNo || '',
      retailShopName: retailShopName || '',
      completeAddress: completeAddress || address || '',
      landmark: landmark || '',
      policeStation: policeStation || '',
      addressPinCode: addressPinCode || '',
      addressState: addressState || '',
      photo: photoUrl
    });

    res.status(201).json(retailer);
  } catch (error) {
    console.error('Create admin retailer error:', error);
    res.status(500).json({ message: 'Server error creating retailer' });
  }
};

export const updateAdminRetailer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      storeName, ownerName, phone, email, city, address, gstNumber, status, walletBalance, password,
      shopName, shopType, addressAsPerAadhaar, aadhaarState, aadhaarPin, aadhaarNo, panNo,
      partnerNameA, partnerNameB, whatsappNo, alternateContactName, alternateContactPhone,
      areaOfOperation, pinCode, state, bankName, ifscCode, bankBranch,
      accountHolderName, accountNo, retailShopName, completeAddress, landmark, policeStation,
      addressPinCode, addressState, photo
    } = req.body;

    // Find retailer
    const retailer = await Retailer.findById(id);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    // Phone validation (if provided)
    if (phone) {
      const cleanedPhone = phone.trim();
      if (!/^\d{10}$/.test(cleanedPhone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
      retailer.phone = cleanedPhone;
    }

    // Email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }

      // Check email uniqueness if changing email
      if (email.toLowerCase() !== retailer.email.toLowerCase()) {
        const emailExists = await Retailer.findOne({ email: email.toLowerCase() });
        if (emailExists) {
          return res.status(400).json({ message: 'Retailer with this email already exists' });
        }
      }
      retailer.email = email.toLowerCase();
    }

    // Handle photo upload
    let photoUrl = retailer.photo || '';
    if (photo && photo.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(photo, {
          folder: 'umeed_retailers'
        });
        photoUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error during update:', err);
      }
    } else if (photo) {
      photoUrl = photo;
    }

    // Update fields
    if (ownerName) {
      retailer.ownerName = ownerName;
      retailer.name = ownerName;
    }
    if (storeName !== undefined) retailer.storeName = storeName;
    if (city !== undefined) retailer.city = city;
    if (address !== undefined) retailer.deliveryAddress = address;
    if (gstNumber !== undefined) retailer.gstNumber = gstNumber;
    if (status !== undefined) retailer.status = status;
    if (walletBalance !== undefined) retailer.walletBalance = walletBalance;
    if (password && password.trim() !== '') {
      retailer.password = password;
    }

    // New form fields updates
    if (shopName !== undefined) retailer.shopName = shopName;
    if (shopType !== undefined) retailer.shopType = shopType;
    if (addressAsPerAadhaar !== undefined) retailer.addressAsPerAadhaar = addressAsPerAadhaar;
    if (aadhaarState !== undefined) retailer.aadhaarState = aadhaarState;
    if (aadhaarPin !== undefined) retailer.aadhaarPin = aadhaarPin;
    if (aadhaarNo !== undefined) retailer.aadhaarNo = aadhaarNo;
    if (panNo !== undefined) retailer.panNo = panNo;
    if (partnerNameA !== undefined) retailer.partnerNameA = partnerNameA;
    if (partnerNameB !== undefined) retailer.partnerNameB = partnerNameB;
    if (whatsappNo !== undefined) retailer.whatsappNo = whatsappNo;
    if (alternateContactName !== undefined) retailer.alternateContactName = alternateContactName;
    if (alternateContactPhone !== undefined) retailer.alternateContactPhone = alternateContactPhone;
    if (areaOfOperation !== undefined) retailer.areaOfOperation = areaOfOperation;
    if (pinCode !== undefined) retailer.pinCode = pinCode;
    if (state !== undefined) retailer.state = state;
    if (bankName !== undefined) retailer.bankName = bankName;
    if (ifscCode !== undefined) retailer.ifscCode = ifscCode;
    if (bankBranch !== undefined) retailer.bankBranch = bankBranch;
    if (accountHolderName !== undefined) retailer.accountHolderName = accountHolderName;
    if (accountNo !== undefined) retailer.accountNo = accountNo;
    if (retailShopName !== undefined) retailer.retailShopName = retailShopName;
    if (completeAddress !== undefined) {
      retailer.completeAddress = completeAddress;
      retailer.deliveryAddress = completeAddress;
    }
    if (landmark !== undefined) retailer.landmark = landmark;
    if (policeStation !== undefined) retailer.policeStation = policeStation;
    if (addressPinCode !== undefined) retailer.addressPinCode = addressPinCode;
    if (addressState !== undefined) retailer.addressState = addressState;
    retailer.photo = photoUrl;

    const updatedRetailer = await retailer.save();
    res.json(updatedRetailer);
  } catch (error) {
    console.error('Update admin retailer error:', error);
    res.status(500).json({ message: 'Server error updating retailer' });
  }
};

export const deleteAdminRetailer = async (req, res) => {
  try {
    const { id } = req.params;
    const retailer = await Retailer.findByIdAndDelete(id);
    if (!retailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    res.json({ message: 'Retailer deleted successfully' });
  } catch (error) {
    console.error('Delete admin retailer error:', error);
    res.status(500).json({ message: 'Server error deleting retailer' });
  }
};

export const forgotPasswordRetailer = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const retailer = await Retailer.findOne({ email: email.toLowerCase() });
    if (!retailer) {
      return res.status(404).json({ message: 'No retailer account found with this email' });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    retailer.resetPasswordToken = resetToken;
    retailer.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await retailer.save();

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/retailer/reset-password/${resetToken}`;

    // Branded Professional Email Template
    const mailOptions = {
      from: `"Umeed Retailers Support" <${process.env.EMAIL_USER}>`,
      to: retailer.email,
      subject: 'Reset Password Request - Umeed Retailers',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            <h1 style="color: #00a877; margin: 0; font-size: 28px; font-weight: 800; tracking-tight: -0.025em;">Umeed</h1>
            <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 5px 0 0 0;">Retailer Network</p>
          </div>
          
          <h2 style="color: #0f172a; font-size: 18px; font-weight: 700; margin-top: 0;">Password Reset Request</h2>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello ${retailer.name || 'Valued Retailer'},</p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">We received a request to reset the password for your Umeed Retailer Account. Click the button below to update your password. This link is valid for <strong>1 hour</strong>.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00a877; color: #ffffff; text-decoration: none; padding: 14px 30px; font-size: 14px; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px rgba(0, 168, 119, 0.15); transition: background-color 0.2s;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 12px; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email. Your current password remains secure.</p>
          
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;" />
          
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 0;">This is an automated security email. Please do not reply directly to this message.</p>
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 5px 0 0 0;">&copy; 2026 Umeed Inc. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset link sent to your registered email address.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error sending password reset email' });
  }
};

export const resetPasswordRetailer = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const retailer = await Retailer.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!retailer) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Set new password (this will trigger schema.pre('save') which hashes the password)
    retailer.password = password;
    retailer.resetPasswordToken = '';
    retailer.resetPasswordExpires = undefined;

    await retailer.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        message: 'Admin logged in successfully'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};
