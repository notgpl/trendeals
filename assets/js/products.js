const SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWdsd255aW1qem9jdnVpemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDI4MTMsImV4cCI6MjA4MTYxODgxM30.eW5nl5yCXnz0V0iya6cZCMj4Pgy05vhClUQ4pLfwYNI";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.openProduct = id => {
  window.location.href = `product.html?id=${id}`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const { data } = await client
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  const grouped = {};
  data.forEach(p => (grouped[p.category] ||= []).push(p));

  products.innerHTML = "";

  Object.keys(grouped).forEach(category => {
    products.innerHTML += `
      <h2>${category}</h2>

      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[category].map(p => `
            <div class="swiper-slide">
              <div class="product-card" onclick="openProduct('${p.id}')">

                <div class="product-image">
                  <img src="${p.cover_image}" alt="${p.name}">
                  <span class="price-tag">₹${p.price}</span>
                </div>

                <h4 class="product-title">${p.name}</h4>

              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  });

  // 🔥 INIT SWIPER AFTER DOM IS READY
  document.querySelectorAll(".productSwiper").forEach(swiper => {
    new Swiper(swiper, {
      slidesPerView: "auto",
      spaceBetween: 16,
    });
  });
});
