const SUPABASE_URL = "https://ctiglwnyimjzocvuizdq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWdsd255aW1qem9jdnVpemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNDI4MTMsImV4cCI6MjA4MTYxODgxM30.eW5nl5yCXnz0V0iya6cZCMj4Pgy05vhClUQ4pLfwYNI";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const section = document.getElementById("products");
  section.innerHTML = "";

  // Group by category
  const grouped = {};
  data.forEach(p => {
    grouped[p.category] = grouped[p.category] || [];
    grouped[p.category].push(p);
  });

  Object.keys(grouped).forEach(category => {
    const html = `
      <h2 style="margin-top:20px;">${category}</h2>
      <div class="swiper productSwiper">
        <div class="swiper-wrapper">
          ${grouped[category].map(p => `
            <div class="swiper-slide product-card"
              onclick="openProduct(this)"
              data-name="${p.name}"
              data-price="${p.price}"
              data-images="${p.images.join(",")}"
              data-sizes="${(p.sizes || []).join(",")}"
              data-colors="${(p.colors || []).join(",")}">

              <div class="price-tag">₹${p.price}</div>

              <div class="product-image">
                <img src="${p.images[0]}" alt="">
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

  // Re-init Swiper
  new Swiper(".productSwiper", {
    slidesPerView: 1.3,
    spaceBetween: 15,
    breakpoints: {
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 }
    }
  });
});
