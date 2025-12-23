const SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWdsd255aW1qem9jdnVpemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDI4MTMsImV4cCI6MjA4MTYxODgxM30.eW5nl5yCXnz0V0iya6cZCMj4Pgy05vhClUQ4pLfwYNI";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let productName = "";
let productPrice = 0;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    alert("Product not found");
    return;
  }

  const { data: product, error } = await client
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    alert("Product not found");
    return;
  }

  /* BASIC INFO */
  productName = product.name;
  productPrice = product.price;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("breadcrumbName").textContent = product.name;

  /* IMAGES */
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbs");

  mainImage.src = product.cover_image;
  thumbs.innerHTML = "";

  product.images.forEach(img => {
    const t = document.createElement("img");
    t.src = img;
    t.onclick = () => (mainImage.src = img);
    thumbs.appendChild(t);
  });

  /* SIZES */
  const sizeBox = document.getElementById("sizes");
  const sizeSelect = document.getElementById("sizeSelect");

  sizeBox.innerHTML = "";
  sizeSelect.innerHTML = `<option value="">Select size</option>`;

  product.sizes.forEach(size => {
    const span = document.createElement("span");
    span.textContent = size;
    span.onclick = () => {
      document.querySelectorAll(".sizes span").forEach(s => s.classList.remove("active"));
      span.classList.add("active");
      sizeSelect.value = size;
    };
    sizeBox.appendChild(span);
    sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
  });

  /* COLORS */
  const colorBox = document.getElementById("colors");
  const colorSelect = document.getElementById("colorSelect");

  colorBox.innerHTML = "";
  colorSelect.innerHTML = `<option value="">Select color</option>`;

  product.colors.forEach(color => {
    const span = document.createElement("span");
    span.style.background = color;
    span.onclick = () => {
      document.querySelectorAll(".colors span").forEach(c => c.classList.remove("active"));
      span.classList.add("active");
      colorSelect.value = color;
    };
    colorBox.appendChild(span);
    colorSelect.innerHTML += `<option value="${color}">${color}</option>`;
  });
});

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
