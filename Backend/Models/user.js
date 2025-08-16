const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
biometricEnabled: {
    type: Boolean,
    default: false
  },
  biometricHash: {
    type: String,
    default: null
  },
  biometricRegisteredAt: {
    type: Date,
    default: null
  },
    
refreshToken: String,

}, {
  timestamps: true
});



UserSchema.pre('save', function(next) {
  if (this.isModified('biometricHash') && this.biometricHash && !this.biometricRegisteredAt) {
    this.biometricRegisteredAt = new Date();
  }
  if (!this.biometricHash) {
    this.biometricRegisteredAt = null;
  }
  next();
});
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;