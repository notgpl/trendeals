document.addEventListener("DOMContentLoaded", () => {

  /* ================= HOME → PRODUCT PAGE ================= */

  window.openProduct = function (card) {
    const name = card.dataset.name;
    const price = card.dataset.price;
    const images = card.dataset.images || "";
    const sizes = card.dataset.sizes || "";
    const colors = card.dataset.colors || "";

    const url =
      "product.html" +
      "?name=" + encodeURIComponent(name) +
      "&price=" + price +
      "&images=" + encodeURIComponent(images) +
      "&sizes=" + encodeURIComponent(sizes) +
      "&colors=" + encodeURIComponent(colors);

    window.location.href = url;
  };

  /* ================= PRODUCT DATA ================= */

  const params = new URLSearchParams(window.location.search);
  let productName = "";
  let productPrice = 0;

  /* ================= LOAD PRODUCT ================= */

  if (params.has("name")) {
    productName = params.get("name");
    productPrice = Number(params.get("price")) || 0;
    document.getElementById("breadcrumbName").textContent = productName;


    const images = (params.get("images") || "").split(",").filter(Boolean);
    const sizes = (params.get("sizes") || "").split(",").filter(Boolean);
    const colors = (params.get("colors") || "").split(",").filter(Boolean);

    document.getElementById("productName").textContent = productName;
    document.getElementById("productPrice").textContent = productPrice;

    /* Images */
    const mainImage = document.getElementById("mainImage");
    const thumbs = document.getElementById("thumbs");

    if (images.length) {
      mainImage.src = images[0];

      images.forEach(img => {
        const t = document.createElement("img");
        t.src = img;
        t.onclick = () => mainImage.src = img;
        thumbs.appendChild(t);
      });
    }

    /* Sizes */
    const sizeBox = document.getElementById("sizes");
    const sizeSelect = document.getElementById("sizeSelect");

    sizes.forEach(size => {
      const btn = document.createElement("span");
      btn.textContent = size;
      btn.onclick = () => {
        document.querySelectorAll(".sizes span").forEach(s => s.classList.remove("active"));
        btn.classList.add("active");
        sizeSelect.value = size;
      };
      sizeBox.appendChild(btn);

      sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
    });

    /* Colors */
    const colorBox = document.getElementById("colors");
    const colorSelect = document.getElementById("colorSelect");

    colors.forEach(color => {
      const dot = document.createElement("span");
      dot.style.background = color.toLowerCase();
      dot.onclick = () => {
        document.querySelectorAll(".colors span").forEach(c => c.classList.remove("active"));
        dot.classList.add("active");
        colorSelect.value = color;
      };
      colorBox.appendChild(dot);

      colorSelect.innerHTML += `<option value="${color}">${color}</option>`;
    });
  }

  /* ================= MODAL ================= */

  window.openOrderModal = function () {
    document.getElementById("orderModal").classList.add("active");
    document.body.style.overflow = "hidden";
    updateTotal();
  };

  window.closeOrderModal = function () {
    document.getElementById("orderModal").classList.remove("active");
    document.body.style.overflow = "";
  };

  /* ================= TOTAL ================= */

  const qtyInput = document.getElementById("qty");
  if (!qtyInput) return;
  const totalEl = document.getElementById("total");

  function updateTotal() {
    const qty = Math.max(1, Number(qtyInput.value) || 1);
    qtyInput.value = qty;
    totalEl.textContent = productPrice * qty;
  }

  qtyInput.addEventListener("input", updateTotal);

  /* ================= WHATSAPP ORDER ================= */

  window.sendWhatsApp = function () {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const qty = Math.max(1, Number(qtyInput.value));
    const size = document.getElementById("sizeSelect").value;
    const color = document.getElementById("colorSelect").value;
    const notes = document.getElementById("notes").value.trim();

    if (!name) return alert("Enter your full name");
    if (!/^[6-9]\d{9}$/.test(phone)) return alert("Enter valid Indian phone number");
    if (!size) return alert("Select a size");
    if (!color) return alert("Select a color");

    const total = productPrice * qty;
    const orderId = "TD" + Date.now();

    const msg = `
🛒 *NEW ORDER*
🆔 Order ID: ${orderId}

📦 Product: ${productName}
📏 Size: ${size}
🎨 Color: ${color}
🔢 Qty: ${qty}

👤 Name: ${name}
📞 Phone: ${phone}

💰 Total: ₹${total}
📝 Notes: ${notes || "None"}
`;

    window.open(
      `https://wa.me/919946586151?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

});
