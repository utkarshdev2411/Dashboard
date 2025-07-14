import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            }
        }
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
        default: () => Date.now() + 5 * 60 * 1000 // 5 minutes from now
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


const User = mongoose.model('User', userSchema);

export default User;
