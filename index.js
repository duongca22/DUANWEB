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

// Tự động chuyển slide mỗi 4 giây
setInterval(nextSlide, 4000);

// Lấy dữ liệu sản phẩm
function renderProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price">${product.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</p>
      <button class="add-to-cart" data-id="${product.id}">Thêm vào giỏ hàng</button>
    `;

    productList.appendChild(productCard);
  });

  // Thêm sự kiện click cho các nút "Thêm vào giỏ hàng"
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = parseInt(button.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
  // Tìm sản phẩm trong danh sách sanPhamNoiBat
  const product = sanPhamNoiBat.find(p => p.id === productId);
  if (!product) return;

  // Lấy giỏ hàng từ localStorage (nếu có) hoặc khởi tạo mảng rỗng
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const existingProduct = cart.find(item => item.id === productId);
  if (existingProduct) {
    // Nếu đã có, tăng số lượng
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    // Nếu chưa có, thêm sản phẩm mới với số lượng 1
    cart.push({ ...product, quantity: 1 });
  }

  // Lưu lại vào localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Thông báo thêm thành công
  alert(`${product.name} đã được thêm vào giỏ hàng!`);
}

// Lọc sản phẩm theo từ khóa
function filterProducts(keyword) {
  const filtered = sanPhamNoiBat.filter(product => {
    return product.name.toLowerCase().includes(keyword.toLowerCase()) ||
           product.category.toLowerCase().includes(keyword.toLowerCase());
  });
  renderProducts(filtered);
}

// Xử lý tìm kiếm
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", (e) => {
  filterProducts(e.target.value.trim());
});

// Khởi tạo trang
renderProducts(sanPhamNoiBat);