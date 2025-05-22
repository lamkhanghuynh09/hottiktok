const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

// Toggle giữa 2 form
document.getElementById('showLogin').onclick = () => {
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  loginMessage.innerText = '';
  registerMessage.innerText = '';
};

document.getElementById('showRegister').onclick = () => {
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  loginMessage.innerText = '';
  registerMessage.innerText = '';
};

// Xử lý đăng nhập
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Ghi nhận thông tin người dùng nếu cần
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Chuyển hướng sang trang chính
    window.location.href = 'home.html';
  } else {
    loginMessage.innerText = 'Sai tài khoản hoặc mật khẩu!';
    loginMessage.style.color = 'red';
  }
});
// Xử lý đăng ký
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (password !== confirm) {
    registerMessage.innerText = 'Mật khẩu không khớp!';
    registerMessage.style.color = 'red';
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];

  if (users.find(u => u.username === username)) {
    registerMessage.innerText = 'Tài khoản đã tồn tại!';
    registerMessage.style.color = 'red';
    return;
  }

  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));
  registerMessage.innerText = 'Đăng ký thành công!';
  registerMessage.style.color = 'green';
});
