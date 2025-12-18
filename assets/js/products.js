const SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWdsd255aW1qem9jdnVpemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDI4MTMsImV4cCI6MjA4MTYxODgxM30.eW5nl5yCXnz0V0iya6cZCMj4Pgy05vhClUQ4pLfwYNI";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ================= OPEN PRODUCT ================= */
window.openProduct = function (id) {
  window.location.href = `product.html?id=${id}`;
};

/* ================= LOAD PRODUCTS ================= */
document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const section = document.getElementById("products");
  if (!section) return;
  section.innerHTML = "";

  /* GROUP BY CATEGORY */
  const grouped = {};
  data.forEach(p => {
    grouped[p.category] = grouped[p.category] || [];
    grouped[p.category].push(p);
  });

  /* RENDER PRODUCTS */
  Object.keys(grouped).forEach(category => {
    const html = `
      <h2 style="margin-top:20px;">${category}</h2>
      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[category].map(p => `
            <div class="swiper-slide product-card"
                 onclick="openProduct('${p.id}')">

              <div class="price-tag">₹${p.price}</div>

              <div class="product-image">
                <img src="${p.cover_image}" alt="${p.name}">
                <div class="availability-box">
                  <span class="status">Available</span>
                </div>
              </div>

              <h4>${p.name}</h4>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    section.insertAdjacentHTML("beforeend", html);
  });

  /* INIT SWIPER */
  new Swiper(".productSwiper", {
    slidesPerView: 1.3,
    spaceBetween: 15,
    breakpoints: {
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 }
    }
  });
});
