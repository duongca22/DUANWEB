document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const orderSummary = document.getElementById("order-summary");
  const confirmBtn = document.getElementById("confirm-btn");
  const message = document.getElementById("message");

  if (cart.length === 0) {
    orderSummary.innerHTML = "<p>Không có sản phẩm trong giỏ hàng.</p>";
    confirmBtn.disabled = true;
    return;
  }

  // Hiển thị đơn hàng lúc đầu
  let total = 0;
  cart.forEach(item => {
    const line = document.createElement("div");
    line.innerHTML = `<span>${item.name} x${item.quantity}</span><span>${(item.price * item.quantity).toLocaleString()}đ</span>`;
    orderSummary.appendChild(line);
    total += item.price * item.quantity;
  });
  const totalLine = document.createElement("div");
  totalLine.innerHTML = `<strong>Tổng cộng:</strong><strong>${total.toLocaleString()}đ</strong>`;
  orderSummary.appendChild(totalLine);

  // Xử lý nút xác nhận
  confirmBtn.addEventListener("click", () => {
    const fullname = document.getElementById("fullname").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    // Kiểm tra đủ thông tin
    if (!fullname || !address || !phone || !email) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    // Kiểm tra SĐT Việt Nam
    if (!/^0\d{9}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 0.");
      return;
    }
    // Kiểm tra email
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }

    const order = {
      fullname,
      address,
      phone,
      email,
      cart,
      total,
      createdAt: new Date().toISOString()
    };

    // Lưu đơn hàng
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Xóa giỏ hàng
    localStorage.removeItem("cart");

    // Hiện lại toàn bộ thông tin
   let infoHTML = `
  <h2 class="order-success-title">✅ Đơn hàng đã được xác nhận!</h2>
  <div class="customer-info">
    <h3>Thông tin khách hàng</h3>
    <p><strong>Họ tên:</strong> ${fullname}</p>
    <p><strong>Địa chỉ:</strong> ${address}</p>
    <p><strong>SĐT:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
  </div>
  <div class="order-info">
    <h3>Thông tin đơn hàng</h3>
    <div class="order-table-wrapper">
      <table class="order-table">
        <tr>
          <th>Tên sản phẩm</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Thành tiền</th>
        </tr>`;
cart.forEach(item => {
  infoHTML += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString()}đ</td>
          <td>${(item.price * item.quantity).toLocaleString()}đ</td>
        </tr>
      `;
});
infoHTML += `
        <tr>
          <td colspan="3" align="right"><strong>Tổng cộng:</strong></td>
          <td><strong>${total.toLocaleString()}đ</strong></td>
        </tr>
      </table>
    </div>
  </div>
`;
    orderSummary.innerHTML = `<div class="order-success-box">${infoHTML}</div>`;
    document.getElementById("checkout-form").reset();
    document.getElementById("checkout-form").style.display = "none"; 
    confirmBtn.style.display = "none";
    message.textContent = "Cảm ơn bạn đã đặt hàng!";
    const buttonBox = document.createElement("div");
    buttonBox.className = "order-action-buttons";
    buttonBox.innerHTML = `
      <button onclick="window.location.href='ao.html'">🛍️ Tiếp tục mua sắm</button>
      <button onclick="window.location.href='index.html'">🏠 Về trang chủ</button>
    `;
    orderSummary.appendChild(buttonBox);


  });
});


