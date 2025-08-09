
window.onload = function () {
    let selectedCategory = "all";
    let currentKeyword = "";
    let currentSort = "";
    const PAGE_SIZE = 6;
    let curPage = 1;
    let curList = sanPhamNoiBat.slice();


    const listEl = document.getElementById("productList");
    const infoEl = document.getElementById("thong-tin-trang");
    const numsEl = document.getElementById("page-numbers");

    //   size
    const sizeBox = document.getElementById("sizeBox");
    const sizesEl = document.getElementById("sizes");
    const btnOk = document.getElementById("ok");
    const btnClose = document.getElementById("close");
    let selectedProductId = null;

    function openSizeBox(sizes) {
        sizesEl.innerHTML = sizes.map(s => `
      <label><input type="radio" name="size" value="${s}"> ${s}</label>
    `).join(" ");
        sizeBox.style.display = "block";
    }
    function closeSizeBox() { sizeBox.style.display = "none"; }
    btnClose.onclick = closeSizeBox;
    btnOk.onclick = () => {
        const picked = document.querySelector('input[name="size"]:checked');
        if (!picked) { alert("Chọn size trước nhé!"); return; }
        addToCart(selectedProductId, picked.value);
        closeSizeBox();
    };

    // giỏ hànggg
    function addToCart(productId, size = null) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const p = sanPhamNoiBat.find(x => x.id === productId);
        if (!p) return;

        const exist = cart.find(i => i.id === productId && i.size === size);
        if (exist) exist.quantity += 1;
        else cart.push({ ...p, size, quantity: 1 });

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`Đã thêm "${p.name}"${size ? ` (size ${size})` : ""} vào giỏ!`);
    }

    // ==== RENDER sp kèm nút
    function renderProducts(items) {
        listEl.innerHTML = "";
        if (!items.length) {
            listEl.innerHTML = "<p style='text-align:center;color:#888'>Không có sản phẩm.</p>";
            return;
        }
        items.forEach(p => {
            const div = document.createElement("div");
            div.className = "product-item";
            div.innerHTML = `
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}">
          <div class="btn-group">
            <button class="add-cart-btn" data-id="${p.id}">Thêm giỏ hàng</button>
            <a class="detail-btn" href="chitiet.html?id=${p.id}">Chi tiết</a>
          </div>
        </div>
        <h5>${p.name}</h5>
        <p>${p.price.toLocaleString()} ₫</p>
      `;
            listEl.appendChild(div);
        });

        //  skiện cho nút Thêm giỏ hàng
        listEl.querySelectorAll(".add-cart-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);
                const product = sanPhamNoiBat.find(x => x.id === id);
                if (!product) return;
                if (product.sizes && product.sizes.length) {
                    selectedProductId = id;
                    openSizeBox(product.sizes);
                } else {
                    addToCart(id); // không có size thì thêm luôn
                }
            };
        });
    }

    // phân trag
    function renderPagination() {
        const totalPages = Math.max(1, Math.ceil(curList.length / PAGE_SIZE));
        numsEl.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const active = i === curPage ? 'class="active"' : "";
            numsEl.innerHTML += `<button ${active} onclick="goToPage(${i})">${i}</button>`;
        }
        document.getElementById("btn-prev").disabled = curPage === 1;
        document.getElementById("btn-next").disabled = curPage === totalPages;
    }

    window.goToPage = function (page) {
        const totalPages = Math.max(1, Math.ceil(curList.length / PAGE_SIZE));
        curPage = Math.min(Math.max(1, page), totalPages);
        const start = (curPage - 1) * PAGE_SIZE;
        renderProducts(curList.slice(start, start + PAGE_SIZE));
        renderPagination();
    };

    //lọc sp + tìm kím
    function applyFilterSort() {
        let filtered = sanPhamNoiBat.slice();

        if (selectedCategory !== "all") {
            filtered = filtered.filter(sp => sp.category === selectedCategory);
        }
        if (currentKeyword) {
            const kw = currentKeyword.toLowerCase();
            filtered = filtered.filter(sp => sp.name.toLowerCase().includes(kw));
        }
        if (currentSort === "asc") filtered.sort((a, b) => a.price - b.price);
        if (currentSort === "desc") filtered.sort((a, b) => b.price - a.price);

        curList = filtered;
        goToPage(1);
    }


    document.getElementById("categoryList").addEventListener("click", (e) => {
        const li = e.target.closest("li"); if (!li) return;
        document.querySelectorAll("#categoryList li").forEach(x => x.classList.remove("active"));
        li.classList.add("active");
        selectedCategory = li.dataset.category || "all";
        applyFilterSort();
    });

    document.getElementById("searchInput").addEventListener("input", (e) => {
        currentKeyword = e.target.value.trim();
        applyFilterSort();
    });

    document.getElementById("sapXepTheoGia").addEventListener("change", (e) => {
        currentSort = e.target.value;
        applyFilterSort();
    });


    document.getElementById("btn-prev").onclick = () => goToPage(curPage - 1);
    document.getElementById("btn-next").onclick = () => goToPage(curPage + 1);

    applyFilterSort();
};

