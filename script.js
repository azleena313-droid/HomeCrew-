// ==========================================
// HOME CREW - SCRIPT.JS
// PART 1 (NO OTP VERSION)
// ==========================================

// ---------- Imports ----------
import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------- Variables ----------
let selectedLanguage = "English";
let selectedService = "";
let selectedHouse = "";
let currentUserId = "";
// ===============================
// LANGUAGE TRANSLATIONS
// ===============================

const translations = {

English:{

login:"Login",
enterName:"Enter Name",
enterMobile:"Enter Mobile Number",

chooseService:"Choose Service",

electrician:"⚡ Electrician",
plumber:"🔧 Plumber",
cleaning:"🧹 Cleaning",
carpenter:"🪚 Carpenter",
painting:"🎨 Painting",
ac:"❄ AC Service",

bookNow:"Book Now",
profile:"Profile",
bookings:"Bookings",
customerCare:"Customer Care"

},

Kannada:{

login:"ಲಾಗಿನ್",
enterName:"ಹೆಸರು ನಮೂದಿಸಿ",
enterMobile:"ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",

chooseService:"ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",

electrician:"⚡ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್",
plumber:"🔧 ಪ್ಲಂಬರ್",
cleaning:"🧹 ಸ್ವಚ್ಛತೆ",
carpenter:"🪚 ಕಾರ್ಪೆಂಟರ್",
painting:"🎨 ಪೇಂಟಿಂಗ್",
ac:"❄ ಎಸಿ ಸೇವೆ",

bookNow:"ಬುಕ್ ಮಾಡಿ",
profile:"ಪ್ರೊಫೈಲ್",
bookings:"ಬುಕಿಂಗ್‌ಗಳು",
customerCare:"ಗ್ರಾಹಕ ಸಹಾಯ"

},

Hindi:{

login:"लॉगिन",
enterName:"नाम दर्ज करें",
enterMobile:"मोबाइल नंबर दर्ज करें",

chooseService:"सेवा चुनें",

electrician:"⚡ इलेक्ट्रीशियन",
plumber:"🔧 प्लंबर",
cleaning:"🧹 सफाई",
carpenter:"🪚 बढ़ई",
painting:"🎨 पेंटिंग",
ac:"❄ एसी सेवा",

bookNow:"बुक करें",
profile:"प्रोफाइल",
bookings:"बुकिंग",
customerCare:"ग्राहक सहायता"

}

};

// ---------- Screen Navigation ----------
window.show = function(id){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
};

// ---------- Language ----------
window.setLanguage = function(language){

    selectedLanguage = language;
    localStorage.setItem("language", language);

    const t = translations[language];

    // Login screen
    document.querySelector("#loginScreen h2").innerText = t.login;
    document.getElementById("loginName").placeholder = t.enterName;
    document.getElementById("mobile").placeholder = t.enterMobile;

    // Dashboard
    document.querySelector("#dashboardScreen h2").innerText = t.chooseService;

    show("loginScreen");
};
// ==========================================
// SIMPLE LOGIN (NO OTP)
// ==========================================

window.loginUser = async function(){

  const name = document.getElementById("loginName").value.trim();
  const mobile = document.getElementById("mobile").value.trim();

  if(name===""){
    alert("Please enter your name");
    return;
  }

  if(!/^[6-9]\d{9}$/.test(mobile)){
    alert("Please enter a valid mobile number");
    return;
  }

  currentUserId = "USER_" + mobile;

  try{

    await setDoc(doc(db,"users",currentUserId),{

      uid:currentUserId,
      name:name,
      mobile:mobile,
      language:selectedLanguage,
      createdAt:serverTimestamp()

    });

    localStorage.setItem("uid",currentUserId);
    localStorage.setItem("userName",name);
    localStorage.setItem("mobile",mobile);

    document.getElementById("profileName").textContent=name;
    document.getElementById("profileMobile").textContent=mobile;

    alert("Login Successful");

    show("dashboardScreen");

  }

  catch(error){

    console.error(error);
    alert("Unable to login");

  }
  };
// ===============================
// CHANGE LANGUAGE 
// PART 2  
// ===============================

function applyLanguage(language){

    const t = translations[language];

    if(!t) return;

    // Login Screen
    document.querySelector("#loginScreen h2").textContent = t.login;

    document.getElementById("loginName").placeholder = t.enterName;

    document.getElementById("mobile").placeholder = t.enterMobile;

    document.querySelector("#loginScreen button").textContent = t.login;

    // Dashboard Title
    document.querySelector("#dashboardScreen h2").textContent = t.chooseService;

    // Service Buttons
    const serviceButtons = document.querySelectorAll(".service-grid button");

    if(serviceButtons.length >= 6){

        serviceButtons[0].textContent = t.electrician;
        serviceButtons[1].textContent = t.plumber;
        serviceButtons[2].textContent = t.cleaning;
        serviceButtons[3].textContent = t.carpenter;
        serviceButtons[4].textContent = t.painting;
        serviceButtons[5].textContent = t.ac;

    }

    // Bottom Navigation
    const navButtons = document.querySelectorAll(".bottom-nav button");

    if(navButtons.length >= 3){

        navButtons[1].textContent = "📖 " + t.bookings;
        navButtons[2].textContent = "👤 " + t.profile;

    }

    localStorage.setItem("language", language);

}
};
// ==========================================
// HOME CREW - SCRIPT.JS
// PART 3
// ==========================================

// ---------- Select Service ----------
window.selectService = function(service){

    selectedService = service;

    document.getElementById("selectedService").value = service;

    show("houseScreen");

};

// ---------- Select House ----------
window.goBooking = function(){

    selectedHouse = document.getElementById("house").value;

    if(selectedHouse===""){
        alert("Please select house type");
        return;
    }

    document.getElementById("selectedHouse").value = selectedHouse;

    show("bookingScreen");

};

// ---------- Customer Care ----------
window.callCustomerCare = function(){

    window.location.href = "tel:7624802646";

};

// ---------- WhatsApp ----------
window.openWhatsApp = function(){

    window.open(
        "https://wa.me/917624802646",
        "_blank"
    );

};

// ---------- Complaint ----------
window.openComplaint = function(){

    show("complaintScreen");

};
// ==========================================
// HOME CREW - SCRIPT.JS
// PART 4
// ==========================================

// ---------- Confirm Booking ----------
window.confirmBooking = async function(){

    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const description = document.getElementById("description").value.trim();

    if(address===""){
        alert("Enter Address");
        return;
    }

    if(date===""){
        alert("Select Date");
        return;
    }

    if(time===""){
        alert("Select Time");
        return;
    }

    try{

        await addDoc(collection(db,"bookings"),{

            uid:localStorage.getItem("uid"),
            name:localStorage.getItem("userName"),
            mobile:localStorage.getItem("mobile"),

            service:selectedService,
            house:selectedHouse,

            address:address,
            date:date,
            time:time,
            description:description,

            status:"Pending",

            createdAt:serverTimestamp()

        });

        document.getElementById("address").value="";
        document.getElementById("bookingDate").value="";
        document.getElementById("bookingTime").value="";
        document.getElementById("description").value="";

        alert("Booking Submitted Successfully");

        show("successScreen");

    }

    catch(error){

        console.error(error);
        alert("Booking Failed");

    }

};

// ---------- Submit Complaint ----------
window.submitComplaint = async function(){

    const complaint = document.getElementById("complaintText").value.trim();

    if(complaint===""){
        alert("Please enter your complaint");
        return;
    }

    try{

        await addDoc(collection(db,"complaints"),{

            uid:localStorage.getItem("uid"),
            name:localStorage.getItem("userName"),
            mobile:localStorage.getItem("mobile"),

            complaint:complaint,

            status:"Pending",

            createdAt:serverTimestamp()

        });

        document.getElementById("complaintText").value="";

        alert("Complaint Submitted Successfully");

        show("dashboardScreen");

    }

    catch(error){

        console.error(error);
        alert("Failed to submit complaint");

    }

};
// ==========================================
// HOME CREW - SCRIPT.JS
// PART 5 (FINAL)
// ==========================================

// ---------- My Bookings ----------
window.showBookings = async function(){

    show("profileScreen");

    const bookingList = document.getElementById("bookingList");

    bookingList.innerHTML = "<p>Loading...</p>";

    try{

        const q = query(
            collection(db,"bookings"),
            where("uid","==",localStorage.getItem("uid"))
        );

        const snapshot = await getDocs(q);

        if(snapshot.empty){

            bookingList.innerHTML = "<p>No bookings found.</p>";

            return;

        }

        let html = "";

        snapshot.forEach((bookingDoc)=>{

            const booking = bookingDoc.data();

            html += `

            <div class="booking-card">

                <h3>${booking.service}</h3>

                <p><strong>House:</strong> ${booking.house}</p>

                <p><strong>Address:</strong> ${booking.address}</p>

                <p><strong>Date:</strong> ${booking.date}</p>

                <p><strong>Time:</strong> ${booking.time}</p>

              let color = "#ffc107"; // Pending

if (booking.status === "Accepted") color = "#198754";
if (booking.status === "Rejected") color = "#dc3545";
if (booking.status === "Completed") color = "#0d6efd";

html += `
<div class="booking-card">
    <h3>${booking.service}</h3>

    <p><strong>Date:</strong> ${booking.date}</p>

    <p><strong>Status:</strong>
        <span style="
            color:white;
            background:${color};
            padding:4px 10px;
            border-radius:20px;
            font-weight:bold;">
            ${booking.status}
        </span>
    </p>
</div>
`;

                <button class="cancel-btn"
                onclick="cancelBooking('${bookingDoc.id}')">
                Cancel Booking
                </button>

            </div>

            `;

        });

        bookingList.innerHTML = html;

    }

    catch(error){

        console.error(error);

        bookingList.innerHTML =
        "<p>Unable to load bookings.</p>";

    }

};

// ---------- Cancel Booking ----------
window.cancelBooking = async function(id){

    if(!confirm("Cancel this booking?")) return;

    try{

        await deleteDoc(doc(db,"bookings",id));

        alert("Booking Cancelled");

        showBookings();

    }

    catch(error){

        console.error(error);

        alert("Unable to cancel booking");

    }

};

// ---------- Logout ----------
window.logout = function(){

    localStorage.clear();

    currentUserId = "";

    show("languageScreen");

};

// ---------- Auto Login ----------
window.addEventListener("load",()=>{

    const uid = localStorage.getItem("uid");

    if(uid){

        currentUserId = uid;

        document.getElementById("profileName").textContent =
        localStorage.getItem("userName") || "";

        document.getElementById("profileMobile").textContent =
        localStorage.getItem("mobile") || "";

        show("dashboardScreen");

    }

});
// ==========================================
// ADMIN LOGIN
// ==========================================

window.adminLogin = function () {

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (username === "admin" && password === "HomeCrew@123") {

        localStorage.setItem("adminLoggedIn", "true");

        alert("Welcome Admin");

        show("adminDashboard");

        loadAdminBookings();

    } else {

        alert("Invalid Username or Password");

    }

};


// ==========================================
// ADMIN LOGOUT
// ==========================================

window.adminLogout = function () {

    localStorage.removeItem("adminLoggedIn");

    document.getElementById("adminUsername").value = "";
    document.getElementById("adminPassword").value = "";

    show("languageScreen");

};
// ==========================================
// LOAD ALL BOOKINGS (ADMIN)
// ==========================================

window.loadAdminBookings = async function () {

    const bookingsDiv = document.getElementById("adminBookings");
    const totalBookings = document.getElementById("totalBookings");

    bookingsDiv.innerHTML = "<p>Loading...</p>";

    try {

        const snapshot = await getDocs(collection(db, "bookings"));

        totalBookings.textContent = snapshot.size;

        if (snapshot.empty) {
            bookingsDiv.innerHTML = "<p>No bookings available.</p>";
            return;
        }

        let html = "";

        snapshot.forEach((bookingDoc) => {

            const booking = bookingDoc.data();

            html += `

            <div class="booking-card">

                <h3>${booking.service}</h3>

                <p><strong>Name:</strong> ${booking.name}</p>

                <p><strong>Mobile:</strong> ${booking.mobile}</p>

                <p><strong>House:</strong> ${booking.house}</p>

                <p><strong>Address:</strong> ${booking.address}</p>

                <p><strong>Date:</strong> ${booking.date}</p>

                <p><strong>Time:</strong> ${booking.time}</p>

                <p><strong>Status:</strong>
                    <span id="status-${bookingDoc.id}">
                        ${booking.status}
                    </span>
                </p>

                <button onclick="updateBookingStatus('${bookingDoc.id}','Accepted')">
                    ✅ Accept
                </button>

                <button onclick="updateBookingStatus('${bookingDoc.id}','Rejected')">
                    ❌ Reject
                </button>

                <button onclick="updateBookingStatus('${bookingDoc.id}','Completed')">
                    ✔ Complete
                </button>

            </div>

            <hr>

            `;

        });

        bookingsDiv.innerHTML = html;

    } catch (error) {

        console.error(error);

        bookingsDiv.innerHTML = "<p>Unable to load bookings.</p>";

    }

};


// ==========================================
// AUTO ADMIN LOGIN
// ==========================================

window.addEventListener("load", () => {

    if (localStorage.getItem("adminLoggedIn") === "true") {

        show("adminDashboard");

        loadAdminBookings();

    }

});

// ======================================
// ADMIN PANEL - PART 4
// Logout & Navigation
// ======================================

window.openAdminLogin = function () {
    show("adminLoginScreen");
};

window.openAdminDashboard = function () {
    show("adminDashboard");
};

window.adminLogout = function () {

    if (!confirm("Logout from Admin Panel?")) {
        return;
    }

    localStorage.removeItem("adminLoggedIn");

    show("languageScreen");

    alert("Admin Logged Out Successfully");
};
