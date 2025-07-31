let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);
setInterval(nextSlide, 4000);

// =================== GIỎ HÀNG ======================
let selectedProductId = null;

// Render sản phẩm
function renderProducts(products) {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  if (products.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:40px 0;color:#888;">Không có sản phẩm</div>`;
    return;
  }

  products.forEach(p => {
    const item = document.createElement("div");
    item.className = "product-card"; // ✅ đúng class theo CSS
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="price">${p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
      <div class="button-group">
        <button class="add-to-cart" data-id="${p.id}">Thêm giỏ hàng</button>
        <a class="btn-detail" href="chitiet.html?id=${p.id}">Chi tiết</a>
      </div>
    `;
    list.appendChild(item);
  });

  // Gán sự kiện "Thêm giỏ hàng"
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const product = sanPhamNoiBat.find(p => p.id === id);
      if (!product) return;

      selectedProductId = id;
      showBox(product.sizes);
    });
  });
}

// Hàm hiển thị hộp chọn size
function showBox(sizes) {
  document.getElementById("sizes").innerHTML = sizes.map(size => `
    <label><input type="radio" name="s" value="${size}"> ${size}</label><br>
  `).join("");
  document.getElementById("sizeBox").style.display = "block";
}

// Ẩn hộp chọn size
function hideBox() {
  document.getElementById("sizeBox").style.display = "none";
}

// Nút hủy chọn
document.getElementById("close").addEventListener("click", hideBox);

// Nút xác nhận thêm giỏ hàng
document.getElementById("ok").addEventListener("click", () => {
  const selected = document.querySelector('input[name="s"]:checked');
  if (!selected) {
    alert("Vui lòng chọn size!");
    return;
  }
  const size = selected.value;
  addToCart(selectedProductId, size);
  hideBox();
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(id, size) {
  const product = sanPhamNoiBat.find(p => p.id === id);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exists = cart.find(item => item.id === id && item.size === size);

  if (exists) {
    exists.quantity += 1;
  } else {
    cart.push({ ...product, size, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} (Size ${size}) đã được thêm vào giỏ hàng!`);
}

// Lọc sản phẩm theo từ khóa
function filterProducts(keyword) {
  const filtered = sanPhamNoiBat.filter(product => {
    return product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.category.toLowerCase().includes(keyword.toLowerCase());
  });
  renderProducts(filtered);
}

// Tìm kiếm
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  filterProducts(e.target.value.trim());
});

// Khởi tạo trang
renderProducts(sanPhamNoiBat.slice(0, 4));
