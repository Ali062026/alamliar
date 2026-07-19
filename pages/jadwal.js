/* =====================================================
   ALAMLIAR.COM
   JADWAL.JS
===================================================== */


/* =====================================================
   GLOBAL
===================================================== */

let allSchedules = [];

let filteredSchedules = [];


/* =====================================================
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", initPage);


function initPage(){

    loadSchedules();
    sortSchedules();
    renderMountainFilter();
    renderMonthFilter();
    renderSchedule(filteredSchedules);
    initFilter();

}


/* =====================================================
   LOAD DATA
===================================================== */

function loadSchedules(){

    allSchedules = [];

    Object.values(MOUNTAINS).forEach(mountain=>{

        mountain.schedule.forEach(schedule=>{

            allSchedules.push({

                mountainSlug: mountain.slug,

                mountainName: mountain.nama,

                hero: mountain.hero,

                folder: mountain.folder,

                harga: mountain.harga,

                meetingPoint: mountain.booking.meetingPoint,

                whatsapp: mountain.booking.whatsapp,

                admin: mountain.booking.admin,

                date: schedule.date,

                quota: schedule.quota,

                booked: schedule.booked,

                status: schedule.status,

                slug: schedule.slug

            });

        });

    });

    filteredSchedules = [...allSchedules];

}


/* =====================================================
   RENDER FILTER
===================================================== */

function renderMountainFilter(){

    const select = document.getElementById("filterMountain");

    if(!select) return;

    Object.values(MOUNTAINS).forEach(mountain=>{

        const option = document.createElement("option");

        option.value = mountain.slug;

        option.textContent = mountain.nama;

        select.appendChild(option);

    });

}


function renderMonthFilter(){

    const select = document.getElementById("filterMonth");

    if(!select) return;

    const months = new Set();

    allSchedules.forEach(schedule=>{

        const parts = schedule.date.split(" ");

        if(parts.length >= 3){

            months.add(`${parts[1]} ${parts[2]}`);

        }

    });

    [...months].forEach(month=>{

        const option = document.createElement("option");

        option.value = month;

        option.textContent = month;

        select.appendChild(option);

    });

}


/* =====================================================
   RENDER SCHEDULE
===================================================== */

function renderSchedule(data){

    const grid = document.getElementById("scheduleGrid");

    const counter = document.getElementById("scheduleCount");

    if(!grid) return;

    grid.innerHTML = "";

    if(counter){

        counter.textContent =
        `Menampilkan ${data.length} Jadwal`;

    }

    if(data.length===0){

        grid.innerHTML=`

            <div class="empty-state">

                <h3>

                    Jadwal tidak ditemukan

                </h3>

                <p>

                    Coba ubah filter pencarian Anda.

                </p>

            </div>

        `;

        return;

    }

    data.forEach(item=>{

        const sisaSeat = getRemainingSeat(item);

        const image =
        `../assets/${item.folder}/${item.hero}`;

        grid.innerHTML += `

        <article class="schedule-card">

            <div class="schedule-image">

                <img
                    src="${image}"
                    alt="${item.mountainName}"
                    loading="lazy">

<span class="schedule-status ${getStatusClass(item.status)}">

                    ${item.status}

                </span>

            </div>

            <div class="schedule-content">

                <h3>

                    ${item.mountainName}

                </h3>

                <div class="schedule-info">

                    <p>

                        📅 ${item.date}

                    </p>

                    <p>

                        📍 ${item.meetingPoint.join(" • ")}

                    </p>

                    <p>

                        👥 ${sisaSeat} Seat Tersisa

                    </p>

                </div>

                <div class="schedule-price">

                    <span>

                        Mulai dari

                    </span>

                    <strong>

                        ${formatPrice(item.harga)}

                    </strong>

                </div>

                <div class="schedule-buttons">

                    <a
                        href="detail-gunung.html?gunung=${item.mountainSlug}"
                        class="btn-secondary">

                        Detail

                    </a>

                    <a
                        href="https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
`Halo ${item.admin},

Saya ingin booking Open Trip ${item.mountainName}.

Tanggal : ${item.date}

Meeting Point : ${item.meetingPoint.join(", ")}

Mohon informasi ketersediaan seat.

Terima kasih.`
)}

                        target="_blank"

                        class="btn-primary">

                        Booking

                    </a>

                </div>

            </div>

        </article>

        `;

    });

}


/* =====================================================
   FILTER
===================================================== */

function initFilter(){

    const mountainFilter =
    document.getElementById("filterMountain");

    const monthFilter =
    document.getElementById("filterMonth");

    const statusFilter =
    document.getElementById("filterStatus");

    const resetButton =
    document.getElementById("resetFilter");

    if(mountainFilter){

        mountainFilter.addEventListener(
            "change",
            applyFilter
        );

    }

    if(monthFilter){

        monthFilter.addEventListener(
            "change",
            applyFilter
        );

    }

    if(statusFilter){

        statusFilter.addEventListener(
            "change",
            applyFilter
        );

    }

    if(resetButton){

        resetButton.addEventListener(
            "click",
            resetFilter
        );

    }

}


/* =====================================================
   APPLY FILTER
===================================================== */

function applyFilter(){

    const mountain =
    document.getElementById("filterMountain").value;

    const month =
    document.getElementById("filterMonth").value;

    const status =
    document.getElementById("filterStatus").value;


    filteredSchedules =
    allSchedules.filter(item=>{

        let match = true;

        if(
            mountain !== "all" &&
            item.mountainSlug !== mountain
        ){

            match = false;

        }

        if(
            month !== "all"
        ){

            const parts =
            item.date.split(" ");

            const itemMonth =
            `${parts[1]} ${parts[2]}`;

            if(itemMonth !== month){

                match = false;

            }

        }

        if(
            status !== "all" &&
            item.status !== status
        ){

            match = false;

        }

        return match;

    });

    sortSchedules();
    renderSchedule(filteredSchedules);

}


/* =====================================================
   RESET FILTER
===================================================== */

function resetFilter(){

    document.getElementById(
        "filterMountain"
    ).value = "all";

    document.getElementById(
        "filterMonth"
    ).value = "all";

    document.getElementById(
        "filterStatus"
    ).value = "all";

    filteredSchedules = [...allSchedules]; 
    
    sortSchedules();
    renderSchedule(filteredSchedules);

}


/* =====================================================
   UTILITIES
===================================================== */


/* ==========================
SORT SCHEDULE
========================== */

function sortSchedules(){

    filteredSchedules.sort((a,b)=>{

        return new Date(a.slug)-new Date(b.slug);

    });

}


/* ==========================
GET REMAINING SEAT
========================== */

function getRemainingSeat(item){

    return Math.max(
        item.quota-item.booked,
        0
    );

}


/* ==========================
GET STATUS CLASS
========================== */

function getStatusClass(status){

    switch(status){

        case "Open":

            return "open";

        case "Full":

            return "full";

        default:

            return "open";

    }

}


/* ==========================
FORMAT PRICE
========================== */

function formatPrice(price){

    return "Rp"+price.toLocaleString("id-ID");

}








