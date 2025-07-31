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

    // Tạo đối tượng đơn hàng
    const order = {
      fullname,
      address,
      phone,
      email,
      cart,
      total,
      createdAt: new Date().toISOString()
    };

    // Lưu đơn hàng vào danh sách
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Xóa giỏ hàng
    localStorage.removeItem("cart");
    localStorage.setItem("latestOrder", JSON.stringify(order));
    window.location.href = "xacnhan.html";
  });

});


