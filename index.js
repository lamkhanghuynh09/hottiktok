require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Cấu hình EJS & public folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình session
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // thời gian lưu session (14 ngày)
  })
}));
// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Kết nối MongoDB thành công');
}).catch(err => {
  console.error('❌ Lỗi kết nối MongoDB:', err);
});

// Mongoose model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  money: { type: Number, default: 100000 }
});
const User = mongoose.model('User', userSchema);

const Card = require('./models/Card');

// ==== ROUTES ====
app.get('/', (req, res) => {
  const user = req.session.user;
  res.render('index', { user });
});

app.get('/muagame', requireLogin, (req, res) => {
  res.render('muagame');
});

app.get('/vuoctai', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Thiếu link!");
  res.render('vuoctai', { targetUrl });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Tên đăng nhập hoặc mật khẩu sai!' });
  }
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render('register', { error: 'Tên đăng nhập đã tồn tại!' });
  }
  const newUser = new User({ username, password });
  await newUser.save();
  res.redirect('/login');
});

app.post('/napthe', requireLogin, async (req, res) => {
  const { loaiThe, seri, maThe, amount } = req.body;
  const username = req.session.user?.username || 'unknown';
  const newCard = new Card({
    username,
    cardType: loaiThe,
    serial: seri,
    code: maThe,
    amount: parseInt(amount),
    status: 'pending'
  });
  await newCard.save();
  res.send("ok");
});

app.get('/admin', isAdmin, async (req, res) => {
  const cards = await Card.find({ status: 'pending' }).sort({ createdAt: -1 });
  const users = await User.find();
  res.render('admin', { cards, users });
});

app.post('/admin/duyet/:id', isAdmin, async (req, res) => {
  const cardId = req.params.id;
  const card = await Card.findById(cardId);
  if (!card || card.status !== 'pending') {
    return res.status(404).send("Thẻ không tồn tại hoặc đã duyệt");
  }

  // Đổi trạng thái sang đang xử lý
  card.status = 'processing';
  await card.save();

  // Trả lời ngay cho admin (không chờ 1 phút)
  res.redirect('/admin');

  // Sau 60 giây mới cộng tiền
  setTimeout(async () => {
    const user = await User.findOne({ username: card.username });
    if (user) {
      user.money += card.amount || 0;
      await user.save();

      // Cập nhật lại card đã duyệt hoàn tất
      card.status = 'approved';
      await card.save();

      console.log(`✅ Đã cộng ${card.amount} VNĐ cho ${card.username}`);
    }
  }, 60000); // 60 giây
});

app.post('/admin/edit/:username', isAdmin, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send("Không tìm thấy người dùng!");

  const newMoney = parseInt(req.body.money);
  if (isNaN(newMoney)) return res.status(400).send("Số tiền không hợp lệ!");

  user.money = newMoney;
  await user.save();

  // Nếu admin chỉnh chính mình, cập nhật session luôn
  if (req.session.user && req.session.user.username === user.username) {
    req.session.user = user;
  }

  res.redirect('/admin');
});

app.get('/taoadmin', async (req, res) => {
  const existing = await User.findOne({ username: 'admin' });
  if (existing) return res.send("Admin đã tồn tại");
  const admin = new User({ username: 'admin', password: 'admin123', money: 0 });
  await admin.save();
  res.send("✅ Đã tạo admin thành công!");
});

app.get('/admin/login', (req, res) => {
  res.render('admin_login', { error: null });
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin') {
    return res.render('admin_login', { error: 'Bạn không phải admin!' });
  }
  const admin = await User.findOne({ username, password });
  if (!admin) {
    return res.render('admin_login', { error: 'Sai mật khẩu hoặc tài khoản!' });
  }
  req.session.admin = true;
  res.redirect('/admin');
});

function isAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.redirect('/admin/login');
}

app.get('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.post('/buy', requireLogin, async (req, res) => {
  const { game, price } = req.body;
  const user = await User.findById(req.session.user._id);
  if (user.money >= price) {
    user.money -= price;
    await user.save();
    req.session.user = user;
    res.json({ success: true, message: `Đã mua ${game} thành công!` });
  } else {
    res.json({ success: false, message: 'Số dư không đủ để mua game!' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
