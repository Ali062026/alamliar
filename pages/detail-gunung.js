/* ======================================================
   ALAMLIAR.COM
   detail-gunung.js
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initMountainPage();

    window.addEventListener("scroll", toggleMobileBooking);

    window.addEventListener("resize", toggleMobileBooking);

    toggleMobileBooking();

});


/* ==========================================
             INIT
========================================== */

function initMountainPage() {

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("mountain");

    if (!slug) {showNotFound();return;}

    if (!window.mountains || !window.mountains[slug]) {
        showNotFound();
        return;
    }

    const mountain = window.mountains[slug];

    renderHero(mountain);
    renderQuickInfo(mountain);
    renderAbout(mountain);
    renderGallery(mountain);
    renderHighlights(mountain);
    renderItinerary(mountain);
    renderPricing(mountain);
    renderFacilities(mountain);
    renderGear(mountain);
    renderFAQ(mountain);
    renderRelated(slug);
    renderBooking(mountain);
    renderMeetingPoint(mountain); 
    renderSchedule(mountain);
    initBooking(mountain);
 

}


/* ==========================================
   RENDER HERO
========================================== */

function renderHero(data) {

    setText("mountainName", data.nama);

    setText("mountainLocation", data.lokasi);

    setText("mountainHeight", data.tinggi + " mdpl");

    setText("mountainDuration", data.durasi);

    const hero = document.getElementById("heroImage");

    if (hero) {

        hero.src = "../assets/mountains/" + data.folder + "/" + data.hero;

        hero.alt = data.nama;

    }

document.title =
`${data.nama} (${data.tinggi} mdpl) | Open Trip AlamLiar`;
}


/* ==========================================
   RENDER QUICK INFO
========================================== */

function renderQuickInfo(data){

    setText("infoHeight", data.tinggi + " mdpl");

    setText("infoRoute", data.jalur);

    setText("infoDuration", data.durasi);

    setText("infoMeeting", data.booking.meetingPoint.join(", "));

}


/* ==========================================
   RENDER ABOUT
========================================== */

function renderAbout(data){

    setHTML("aboutText", data.deskripsi);

}


/* ==========================================
   RENDER GALLERY
========================================== */

function renderGallery(data){

    const gallery = document.getElementById("galleryGrid");

    if(!gallery) return;

    gallery.innerHTML = "";

    data.gallery.forEach(image=>{

        gallery.innerHTML += `
            <div class="gallery-item">
                <img
                    loading="lazy"
                    src="../assets/mountains/${data.folder}/${image}"
                    alt="${data.nama}">
            </div>
        `;

    });

initGalleryLightbox();
}


/* ==========================================
   RENDER HIGHLIGHT
========================================== */

function renderHighlights(data){

    const box = document.getElementById("highlightGrid");

    if(!box) return;

    box.innerHTML = "";

    data.highlight.forEach(item=>{

        box.innerHTML += `
        <div class="highlight-card">

            <div class="highlight-icon">

                ${item.icon}

            </div>

            <h3>${item.title}</h3>

            <p>${item.text}</p>

        </div>
        `;

    });

}


/* ==========================================
   RENDER ITINERARY
========================================== */

function renderItinerary(data){

    const timeline = document.getElementById("timeline");

    if(!timeline) return;

    timeline.innerHTML = "";

    data.itinerary.forEach(item=>{

        const activities = item.activities
            .map(activity=>`<li>${activity}</li>`)
            .join("");

        timeline.innerHTML += `
            <div class="timeline-item">

                <div class="timeline-time">
                    ${item.time}
                </div>

                <div class="timeline-content">

                    <h3>${item.title}</h3>

                    <ul>
                        ${activities}
                    </ul>

                </div>

            </div>
        `;

    });

}


/* ==========================================
   RENDER PRICING
========================================== */

function renderPricing(data){

    setText("tripPrice",

        "Rp " + Number(data.harga).toLocaleString("id-ID")

    );

}


/* ==========================================
   RENDER FACILITIES 
========================================== */

function renderFacilities(data){

    const includeBox=document.getElementById("includeList");

    const excludeBox=document.getElementById("excludeList");

    if(includeBox){

        includeBox.innerHTML=data.include
            .map(item=>`<li>✔ ${item}</li>`)
            .join("");

    }

    if(excludeBox){

        excludeBox.innerHTML=data.exclude
            .map(item=>`<li>✖ ${item}</li>`)
            .join("");

    }

}


/* ==========================================
   RENDER GEAR
========================================== */

function renderGear(data){

    const gear=document.getElementById("gearGrid");

    if(!gear) return;

    gear.innerHTML="";

    data.gear.forEach(item=>{

        gear.innerHTML += `
            <div>

                🎒

                <p>${item}</p>

            </div>
        `;

    });

}


/* ==========================================
   RENDER FAQ
========================================== */

function renderFAQ(data){

    const faq=document.getElementById("faqList");

    if(!faq) return;

    faq.innerHTML="";

    data.faq.forEach(item=>{

        faq.innerHTML += `

            <details>

                <summary>

                    ${item.question}

                </summary>

                <p>

                    ${item.answer}

                </p>

            </details>

        `;

    });

}

/* ==========================================
   BOOKING CARD
========================================== */

function renderBooking(data){

    const price =
        "Rp " +
        Number(data.harga)
        .toLocaleString("id-ID");

    setText("bookingPrice",price);
    setText("mobilePrice",price);
    setText("bookingMountain",data.nama);
}


/* ==========================================
   RELATED TRIPS
========================================== */

function renderRelated(currentSlug){

    const grid=document.getElementById("relatedGrid");

    if(!grid) return;

    grid.innerHTML="";

    const list=Object.values(window.mountains)
        .filter(item=>item.slug!==currentSlug)
        .slice(0,3);

    list.forEach(item=>{

        grid.innerHTML += `

        <article class="trip-card">

            <img

                loading="lazy"

                src="../assets/mountains/${item.folder}/${item.hero}"

                alt="${item.nama}">

            <div class="trip-card-body">

                <h3>${item.nama}</h3>

                <p>

                    📍 ${item.lokasi}

                </p>

                <p>

                    ⛰ ${item.tinggi} mdpl

                </p>

                <p>

                    💰 Mulai Rp ${Number(item.harga).toLocaleString("id-ID")}

                </p>

                <a

                    href="detail-gunung.html?mountain=${item.slug}"

                    class="btn-secondary full">

                    Lihat Detail

                </a>

            </div>

        </article>

        `;

    });

}

/* ==========================================
   LIGHTBOX
========================================== */

let galleryImages = [];
let currentImage = 0;

function initGalleryLightbox(){

    galleryImages = Array.from(
        document.querySelectorAll(".gallery-item img")
    );

    galleryImages.forEach((img,index)=>{

        img.addEventListener("click",()=>{

            currentImage=index;

            openLightbox();

        });

    });

}

function openLightbox(){

    const lightbox=document.getElementById("lightbox");

    const image=document.getElementById("lightboxImage");

    image.src=galleryImages[currentImage].src;

    lightbox.classList.add("active");

}

function closeLightbox(){

    document
        .getElementById("lightbox")
        .classList.remove("active");

}

function nextImage(){

    currentImage++;

    if(currentImage>=galleryImages.length){

        currentImage=0;

    }

    openLightbox();

}

function prevImage(){

    currentImage--;

    if(currentImage<0){

        currentImage=galleryImages.length-1;

    }

    openLightbox();

}

/* ==========================================
   event listener
========================================== */

const closeBtn =
document.getElementById("lightboxClose");
if(closeBtn){
    closeBtn.addEventListener(
        "click",
        closeLightbox
    );
  }


const nextBtn = 
document.getElementById("lightboxNext");
if(nextBtn){
    nextBtn.addEventListener(
        "click",
        nextImage
    );
 }

const PrevBtn = 
document.getElementById("lightboxPrev");
if(PrevBtn){
    PrevBtn.addEventListener("click",prevImage);
  }

const lightbox =
document.getElementById("lightbox");
if(lightbox){
    lightbox.addEventListener(("click",(e)=>{
    if(e.target.id==="lightbox"){closeLightbox();}
    }
  );


document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        closeLightbox();
    }

    if(e.key==="ArrowRight"){
        nextImage();
    }

    if(e.key==="ArrowLeft"){
        prevImage();
    }

});


/* ==========================================
   UTILITIES
========================================== */

function setText(id,value){

    const el=document.getElementById(id);

    if(el){
        el.textContent=value;
      }
}


function setHTML(id,value){

    const el=document.getElementById(id);

    if(el){
        el.innerHTML=value;
     }
}


function showNotFound(){

    document.body.innerHTML=`
        <section style="padding:120px;text-align:center">

            <h1>Gunung tidak ditemukan</h1>

            <p>Silakan kembali ke halaman utama.</p>

            <a href="../index.html" class="btn-primary">

                Kembali

            </a>

        </section>

    `;

}




/* ==========================================
   toggleMobileBooking
========================================== */

function toggleMobileBooking(){

    const bar = document.getElementById("mobileBooking");

    if (!bar) return;

    if (window.innerWidth > 768){

        bar.classList.remove("show");

        return;

    }

    if (window.scrollY > 500){

        bar.classList.add("show");

    } else {

        bar.classList.remove("show");

    }

}

/* ==========================================
   renderMeetingpoint
========================================== */

function renderMeetingPoint(data){

    const select=document.getElementById("meetingPoint");

    if(!select) return;

    select.innerHTML="";

    data.booking.meetingPoint.forEach(point=>{

        select.innerHTML += `
            <option value="${point}">
                ${point}
            </option>
        `;

    });

}


/* ==========================================
   BOOKING
========================================== */

function initBooking(data){

    const button = document.getElementById("bookingButton");

    if(!button) return;

    button.addEventListener("click",()=>{

        const nama = document
            .getElementById("customerName")
            .value
            .trim();

        const phone = document
            .getElementById("customerPhone")
            .value
            .trim();

        const peserta = document
            .getElementById("participantCount")
            .value;

        const meeting = document
            .getElementById("meetingPoint")
            .value;

        const tripDate = document
            .getElementById("tripDate")
            .value;

        const note = document
            .getElementById("customerNote")
            .value
            .trim();

        /* ==========================
           VALIDASI
        ========================== */

        if(nama === ""){
            alert("Silakan isi Nama Lengkap.");
            return;
         }

        if(phone === ""){
            alert("Silakan isi Nomor WhatsApp.");
            return;
           }

         const cleanedPhone = phone.replace(/\D/g,"");
         if(cleanedPhone.length < 10){
            alert("Nomor WhatsApp tidak valid.");
            return;
          }

        /* ==========================
           FORMAT PESAN
        ========================== */

        const pesan = `Halo ${data.booking.admin},

Saya ingin booking Open Trip *${data.nama}*.

━━━━━━━━━━━━━━━━━━

👤 Nama
${nama}

📱 Nomor WhatsApp
${phone}

👥 Jumlah Peserta
${peserta}

📍 Meeting Point
${meeting}

📅 Tanggal Trip
${tripDate}

📝 Catatan
${note || "-"}

━━━━━━━━━━━━━━━━━━

Mohon informasi mengenai proses booking selanjutnya.

Terima kasih.`;

        const url =
            `https://wa.me/${data.booking.whatsapp}?text=${encodeURIComponent(pesan)}`;

        window.open(url,"_blank");

    });

}


/* ==========================================
   RENDER SCHEDULE
========================================== */

function renderSchedule(data){

    const select=document.getElementById("tripDate");

    if(!select) return;

    select.innerHTML="";

    data.schedule.forEach(item=>{

        const option=document.createElement("option");

        option.value=item.date;

        option.textContent=
            `${item.date} (${item.status})`;

        if(item.status==="Full"){

            option.disabled=true;

        }

        select.appendChild(option);

    });

}



