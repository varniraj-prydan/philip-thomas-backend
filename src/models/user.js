const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Address"
    },
    role:{ type: String, enum: ['user', 'admin'], default: 'user' }
    // cart_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"Cart"
    // }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;