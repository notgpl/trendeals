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
  Object.keys(grouped).forEach(cat => {
    products.innerHTML += `
      <h2>${cat}</h2>
      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[cat].map(p => `
            <div class="swiper-slide product-card" onclick="openProduct('${p.id}')">
              <img src="${p.cover_image}">
              <div class="price-tag">₹${p.price}</div>
              <h4>${p.name}</h4>
            </div>`).join("")}
        </div>
      </div>`;
  });

  new Swiper(".productSwiper", { slidesPerView: 1.3, breakpoints: { 768:{slidesPerView:3} }});
});
