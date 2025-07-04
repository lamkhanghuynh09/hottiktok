<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Trang chủ - Bán thẻ Garena</title>
  <link rel="stylesheet" href="/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div class="nav">
      <% if (user) { %>
        <div class="user-info">
          🎮 <%= user.username %> | 💰 <%= user.money %> VNĐ
          <a href="/logout">Đăng xuất</a>
        </div>
      <% } else { %>
        <a href="/login">Đăng nhập / Đăng ký</a>
      <% } %>
    </div>
  </header>

  <main>
    <h1>💳 Cửa hàng bán thẻ Garena</h1>
    <p>Chào mừng bạn đến với trang web mua thẻ Garena giá tốt!</p>
  </main>
        <!-- Nút nạp thẻ -->
        <% if (user) { %>
          <!-- Hiện nút Nạp thẻ -->
          <button onclick="toggleNapThe()" class="glow-btn">🪙 Nạp thẻ</button>
        <% } else { %>
          <p style="color: red; text-align: center;">Vui lòng <a href="/login" style="color: yellow;">đăng nhập</a> để sử dụng dịch vụ</p>
        <% } %>

        <!-- Form nạp thẻ (ẩn/hiện khi nhấn nút) -->
        <div id="napTheForm" style="display: none; margin-top: 20px; text-align: center;">
            <form id="formNapThe" method="POST" action="/napthe" onsubmit="handleNapThe(event)">
            <!-- Chọn loại thẻ -->
            <select id="loaiThe" required class="form-input">
              <option value="">-- Chọn loại thẻ --</option>
              <option value="Garena">Garena</option>
              <option value="Viettel">Viettel</option>
              <option value="Vinaphone">Vinaphone</option>
              <option value="Mobifone">Mobifone</option>
            </select><br>

            <!-- Nhập Seri -->
            <input type="text" id="seri" class="form-input" placeholder="Nhập số Seri" required><br>

            <!-- Nhập mã thẻ -->
            <input type="text" id="maThe" class="form-input" placeholder="Nhập mã thẻ" required><br>
              <input type="number" id="amount" name="amount" class="form-input" placeholder="Nhập số tiền" required>


            <!-- Nút nạp -->
            <button type="submit" class="glow-btn">Nạp</button>

            <!-- Thông báo sau khi nhấn -->
            <p id="thongBao" style="margin-top: 10px; color: yellow;"></p>
          </form>
        </div>
          <div class="game-title">🎮HACK PUBG</div>

          <div class="game-card">
            <div class="game-name">Dacurla V1</div>
            <a href="https://yeumoney.com/mKHbtJ" class="glow-btn" target="_blank">
              Tải ngay
            </a>
          </div>
          <div class="game-card">
            <div class="game-name">Dacurla V2</div>
            <a href="https://yeumoney.com/3xmy9" class="glow-btn" target="_blank">
              Tải ngay
            </a>
          </div>
           <div class="game-card">
          <div class="game-name">PUBG BEAR NEW UPDATE</div>
            <a href="https://yeumoney.com/3xmy9" class="glow-btn" target="_blank">
              Tải ngay
            </a>
          </div>
          <div class="game-card">
            <div class="gam-name">DRACULA V1 KEY</div>
              <a href="https://yeumoney.com/qLZL3e7W" class="glow-btn" target="_blank">
               Get key
              </a>
            </div>
          <div class="game-card">
            <div class="gam-name">DRACULA V2 KEY</div>
              <a href="https://yeumoney.com/Wk_EypW" class="glow-btn" target="_blank">
               Get key
              </a>
            </div>
          <div class="game-card">
            <div class="gam-name">PUBG BEAR NEW  KEY</div>
              <a href="https://yeumoney.com/cbkZxz5VE" class="glow-btn" target="_blank">
               Get key
              </a>
            </div>
            <div class="game-title">🎮 HACK FREE FIRE-VIP</div>

            <div class="game-card">
              <div class="game-name">HMTMOD V2 (no key)</div>
              <a href="https://yeumoney.com/cmRJTB1g4S" class="glow-btn" target="_blank">
                Tải ngay
              </a>
               </div> 
        </a>Lưu ý đây là hack free cần có DNS mới có thể chơi rank (DNS tránh band id ) Mua DNS liên hệ ADMIN!!</a>
          <div class="game-card">
            <div class="game-name">LEORANK-VIP (no key)</div>
            <a href="https://yeumoney.com/cmRJTB1g4S" class="glow-btn" target="_blank">
              Mua ngay
            </a>
             </div> 
        <script>
          function toggleNapThe() {
            const form = document.getElementById('napTheForm');
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
          }

          function handleNapThe(event) {
            event.preventDefault();

            const loai = document.getElementById('loaiThe').value;
            const seri = document.getElementById('seri').value;
            const maThe = document.getElementById('maThe').value;

            if (!loai || !seri || !maThe) {
              alert("Vui lòng nhập đầy đủ thông tin!");
              return;
            }

            const formData = new URLSearchParams();
            formData.append('loaiThe', loai);
            formData.append('seri', seri);
            formData.append('maThe', maThe);

            formData.append('amount', document.getElementById('amount').value);
            // Gửi dữ liệu đến server
            fetch('/napthe', {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(res => {              setTimeout(() => location.reload(), 1000);
            });
          }
        </script>
          <div id="confirmPopup" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:#000a; z-index:1000; justify-content:center; align-items:center;">
            <div style="background:#222; padding:30px; border-radius:10px; text-align:center; max-width:300px; color:white">
              <h3 id="popupGameName"></h3>
              <p id="popupGamePrice"></p>
              <button onclick="confirmPurchase()" class="glow-btn">Xác nhận</button>
              <button onclick="hidePopup()" class="glow-btn" style="margin-top:10px; background:crimson;">Hủy</button>
              <p id="purchaseMessage" style="margin-top:10px; color:yellow;"></p>
            </div>
          </div>
          <script>
            let selectedGame = '';
            let selectedPrice = 0;

            function showConfirm(game, price) {
              selectedGame = game;
              selectedPrice = price;
              document.getElementById('popupGameName').innerText = `Mua game: ${game}`;
              document.getElementById('popupGamePrice').innerText = `Giá: ${price.toLocaleString()} VNĐ`;
              document.getElementById('purchaseMessage').innerText = '';
              document.getElementById('confirmPopup').style.display = 'flex';
            }

            function hidePopup() {
              document.getElementById('confirmPopup').style.display = 'none';
            }

            function confirmPurchase() {
              fetch('/buy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ game: selectedGame, price: selectedPrice })
              })
              .then(res => res.json())
              .then(data => {
                document.getElementById('purchaseMessage').innerText = data.message;
                if (data.success) {
                  setTimeout(() => location.reload(), 1500);
                }
              });
            }
          </script>
 </body>
</html>
