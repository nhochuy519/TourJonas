const crypto = require('crypto');

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcrypt');

// validator.isEmail kiếm tra email có đúng hay không và trả về boolean
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide tour email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: 'String',
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    unique: true,
    minlength: 8,
    select: false, // để không bao h trường dữ liệu này xuất hiện khi truy vấn
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // chỉ xảy ra khi save
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

  // thuộc tính này sẽ luôn thay đổi khi người dùng thay đổi pass
});

userSchema.pre('save', async function (next) {
  // chỉ chạy khi  password không thay đổi
  if (!this.isModified('password')) {
    return next();
  }

  /*
        ost factor là một số nguyên được sử dụng để tính toán số vòng lặp.
        Mỗi tăng lên một đơn vị cost factor, số vòng lặp hash sẽ tăng gấp
        đôi (2^cost factor).
    */

  // hàm bất đồng bộ
  this.password = await bcrypt.hash(this.password, 12);

  // thông tin đầu vào là bắt buộc nhưng không cần thiết để tồn tại
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  // hàm isNew kiểm tra xem đói tượng có được tạo mới hay không
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangeAt = Date.now();
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPasword,
) {
  // candidatePassword : mật khẩu này đến từ người dùng, khi đăng nhập
  // userPasword : mật khẩu đã được giải mã
  return await bcrypt.compare(candidatePassword, userPasword);
};
userSchema.methods.changedPasswordAfter = function (JWTtimestap) {
  if (this.passwordChangeAt) {
    const changeTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    console.log(typeof JWTtimestap, typeof changeTimestamp);
    return JWTtimestap < changeTimestamp; // 1711238400 < 1711288494 true
  }

  // false chính là không thay đổi
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // tạo ra chuỗi buffer byte ngẫu nhiên có độ dài là 32byte và chuyển đổi sang hex
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // hết hạn sao 10 phút

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
