// ==========================================
// HOME CREW - MULTILINGUAL CUSTOMER APP
// PART 1
// Firebase + Variables + Languages
// ==========================================
// ---------- Firebase ----------
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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

console.log("Script Loaded Successfully");
// ---------- Global Variables ----------
let selectedLanguage = "English";
let selectedService = "";
let selectedHouse = "";
let currentUserId = "";
// ==========================================
// TRANSLATIONS
// ==========================================
const translations = {
English:{
login:"Login",
enterName:"Enter Name",
enterMobile:"Enter Mobile Number",
chooseService:"Choose Service",
electrician:"⚡ Electrician",
plumber:"🔧 Plumber",
cleaning:"🧹 Cleaning",
painting:"🎨 Painting",
homeShifting:"🚚 Home Shifting",
generalWorker:"👷 General Worker",
ac:"❄ AC Service",
bookNow:"Book Now",
profile:"Profile",
bookings:"Bookings",
complaint:"Complaint",
submitComplaint:"Submit Complaint",
customerCare:"Customer Care",
whatsapp:"WhatsApp Support",
selectHouse:"Select House Type",
success:"Booking Submitted Successfully",
logout:"Logout"
},
Kannada:{
login:"ಲಾಗಿನ್",
enterName:"ಹೆಸರು ನಮೂದಿಸಿ",
enterMobile:"ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
chooseService:"ಸೇವೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
electrician:"⚡ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್",
plumber:"🔧 ಪ್ಲಂಬರ್",
cleaning:"🧹 ಸ್ವಚ್ಛತೆ",
painting:"🎨 ಪೇಂಟಿಂಗ್",
homeShifting:"🚚 ಮನೆ ಸ್ಥಳಾಂತರ",
generalWorker:"👷 ಸಾಮಾನ್ಯ ಕೆಲಸಗಾರ",
ac:"❄ ಎಸಿ ಸೇವೆ",
bookNow:"ಬುಕ್ ಮಾಡಿ",
profile:"ಪ್ರೊಫೈಲ್",
bookings:"ಬುಕಿಂಗ್‌ಗಳು",
complaint:"ದೂರು",
submitComplaint:"ದೂರು ಸಲ್ಲಿಸಿ",
customerCare:"ಗ್ರಾಹಕ ಸಹಾಯ",
whatsapp:"ವಾಟ್ಸಾಪ್ ಸಹಾಯ",
selectHouse:"ಮನೆಯ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",
success:"ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ",
logout:"ಲಾಗ್ ಔಟ್"
},
Hindi:{
login:"लॉगिन",
enterName:"नाम दर्ज करें",
enterMobile:"मोबाइल नंबर दर्ज करें",
chooseService:"सेवा चुनें",
electrician:"⚡ इलेक्ट्रीशियन",
plumber:"🔧 प्लंबर",
cleaning:"🧹 सफाई",
painting:"🎨 पेंटिंग",
homeShifting:"🚚 घर शिफ्टिंग",
generalWorker:"👷 सामान्य कर्मचारी",
ac:"❄ एसी सेवा",
bookNow:"बुक करें",
profile:"प्रोफ़ाइल",
bookings:"बुकिंग",
complaint:"शिकायत",
submitComplaint:"शिकायत दर्ज करें",
customerCare:"ग्राहक सहायता",
whatsapp:"व्हाट्सऐप सहायता",
selectHouse:"घर का प्रकार चुनें",
success:"बुकिंग सफलतापूर्वक जमा हुई",
logout:"लॉग आउट"
}
};
// ==========================================
// SCREEN NAVIGATION
// ==========================================
window.show = function(id){
  document.querySelectorAll(".screen").forEach(screen=>{
      screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
};
// ==========================================
// APPLY LANGUAGE TO ENTIRE APP
// ==========================================
window.applyLanguage = function(language){
    const t = translations[language];
    if(!t) return;
    // Login Screen
    const loginTitle =
    document.querySelector("#loginScreen h2");
    if(loginTitle)
        loginTitle.textContent = t.login;
    const nameInput =
    document.getElementById("loginName");
    if(nameInput)
        nameInput.placeholder = t.enterName;
    const mobileInput =
    document.getElementById("mobile");
    if(mobileInput)
        mobileInput.placeholder = t.enterMobile;
    // Dashboard Title
    const dashboardTitle =
    document.querySelector("#dashboardScreen h2");
    if(dashboardTitle)
        dashboardTitle.textContent =
        t.chooseService;
};
// ==========================================
// CHANGE LANGUAGE
// ==========================================
window.setLanguage = function(language){
    selectedLanguage = language;
    localStorage.setItem(
        "language",
        language
    );
    applyLanguage(language);
    show("loginScreen");
};
// ==========================================
// HOME CREW - MULTILINGUAL CUSTOMER APP
// PART 2
// Login + Profile + Auto Login
// ==========================================
// ==========================================
// CUSTOMER LOGIN
// ==========================================
window.loginUser = async function(){
    const name =
    document.getElementById("loginName").value.trim();
    const mobile =
    document.getElementById("mobile").value.trim();
    if(name === ""){
        alert("Please enter your name");
        return;
    }
    if(!/^[6-9]\d{9}$/.test(mobile)){
        alert("Please enter valid mobile number");
        return;
    }
    currentUserId = "USER_" + mobile;
    try{
        await setDoc(
            doc(db,"users",currentUserId),
            {
                uid: currentUserId,
                name: name,
                mobile: mobile,
                language: selectedLanguage,
                createdAt: serverTimestamp()
            }
        );
        localStorage.setItem(
            "uid",
            currentUserId
        );
        localStorage.setItem(
            "userName",
            name
        );
        localStorage.setItem(
            "mobile",
            mobile
        );
        document.getElementById(
            "profileName"
        ).textContent = name;
        document.getElementById(
            "profileMobile"
        ).textContent = mobile;
        show("dashboardScreen");
    }
    catch(error){
        console.error(error);
        alert("Unable to login");
    }
};
// ==========================================
// PROFILE SCREEN
// ==========================================
window.openProfile = function(){
    const name =
    localStorage.getItem("userName") || "";
    const mobile =
    localStorage.getItem("mobile") || "";
    const profileName =
    document.getElementById("profileName");
    const profileMobile =
    document.getElementById("profileMobile");
    if(profileName){
        profileName.textContent = name;
    }
    if(profileMobile){
        profileMobile.textContent = mobile;
    }
    show("profileScreen");
};
// ==========================================
// LOGOUT
// ==========================================
window.logout = function(){
    localStorage.removeItem("uid");
    localStorage.removeItem("userName");
    localStorage.removeItem("mobile");
  
  document.getElementById(
    "bottomNav"
).style.display = "none";
  
    show("languageScreen");
};
// ==========================================
// AUTO RESTORE LANGUAGE
// ==========================================
window.restoreLanguage = function(){
    const savedLanguage =
    localStorage.getItem("language");
    if(savedLanguage){
        selectedLanguage =
        savedLanguage;
        applyLanguage(savedLanguage);
    }
};
// ==========================================
// AUTO LOGIN
// ==========================================
window.autoLogin = function(){
    const uid =
    localStorage.getItem("uid");
    if(!uid) return;
    currentUserId = uid;
    const profileName =
    document.getElementById("profileName");
    const profileMobile =
    document.getElementById("profileMobile");
    if(profileName){
        profileName.textContent =
        localStorage.getItem("userName") || "";
    }
    if(profileMobile){
        profileMobile.textContent =
        localStorage.getItem("mobile") || "";
    }
  document.getElementById(
    "bottomNav"
).style.display = "flex";
  
show("dashboardScreen");
};
// ==========================================
// APP STARTUP
// ==========================================
window.addEventListener(
    "load",
    ()=>{
        const nav =
        document.getElementById("bottomNav");

        if(nav){
            nav.style.display = "none";
        }

        restoreLanguage();
        autoLogin();
    }
);
// ==========================================
// HOME CREW - MULTILINGUAL CUSTOMER APP
// PART 3
// Services + House Selection + Support
// ==========================================
// ==========================================
// SELECT SERVICE
// ==========================================
window.selectService = function(service){
    selectedService = service;
    const serviceInput =
    document.getElementById("selectedService");
    if(serviceInput){
        serviceInput.value = service;
    }
    show("houseScreen");
};
// ==========================================
// OPEN HOUSE SCREEN
// ==========================================
window.openHouseScreen = function(){
    show("houseScreen");
};
// ==========================================
// HOUSE TYPE SELECTION
// ==========================================
window.goBooking = function(){
    const house =
    document.getElementById("house").value;
    if(house === ""){
        const lang =
        translations[selectedLanguage];
        alert(lang.selectHouse);
        return;
    }
    selectedHouse = house;
    const houseInput =
    document.getElementById("selectedHouse");
    if(houseInput){
        houseInput.value = house;
    }
    show("bookingScreen");
};
// ==========================================
// CUSTOMER CARE CALL
// ==========================================
window.callCustomerCare = function(){
    window.location.href =
    "tel:7624802646";
};
// ==========================================
// WHATSAPP SUPPORT
// ==========================================
window.openWhatsApp = function(){
    window.open(
        "https://wa.me/917624802646",
        "_blank"
    );
};
// ==========================================
// OPEN COMPLAINT SCREEN
// ==========================================
window.openComplaint = function(){
    show("complaintScreen");
};
// ==========================================
// BACK TO DASHBOARD
// ==========================================
window.backToDashboard = function(){
    show("dashboardScreen");
};
// ==========================================
// UPDATE SERVICE BUTTONS
// ==========================================
window.updateServiceLanguage = function(){

const t = translations[selectedLanguage];
const buttons =
document.querySelectorAll(".service-grid button");
if(buttons.length >= 7){
    buttons[0].textContent = t.electrician;
    buttons[1].textContent = t.plumber;
    buttons[2].textContent = t.cleaning;
    buttons[3].textContent = t.painting;
    buttons[4].textContent = t.ac;
    buttons[5].textContent = t.homeShifting;
    buttons[6].textContent = t.generalWorker;
}

};
// ==========================================
// OVERRIDE APPLY LANGUAGE
// ==========================================
const oldApplyLanguage =
window.applyLanguage;
window.applyLanguage =
function(language){
    oldApplyLanguage(language);
    updateServiceLanguage();
};
// ==========================================
// SHOW BOOKINGS
// ==========================================
window.showBookings = async function(){
    show("profileScreen");
    const bookingList =
    document.getElementById("bookingList");
    bookingList.innerHTML =
    "<p>Loading...</p>";
    try{
        const q = query(
            collection(db,"bookings"),
            where(
                "uid",
                "==",
                localStorage.getItem("uid")
            )
        );
        const snapshot =
        await getDocs(q);
        if(snapshot.empty){
            bookingList.innerHTML =
            "<p>No bookings found.</p>";
            return;
        }
        let html = "";
        snapshot.forEach((bookingDoc)=>{
            const booking =
            bookingDoc.data();
            let color = "#ffc107";
            if(
                booking.status ===
                "Accepted"
            ){
                color = "#198754";
            }
            if(
                booking.status ===
                "Rejected"
            ){
                color = "#dc3545";
            }
            if(
                booking.status ===
                "Completed"
            ){
                color = "#0d6efd";
            }
            html += `
            <div class="booking-card">
                <h3>
                    ${booking.service}
                </h3>
                <p>
                    <strong>House:</strong>
                    ${booking.house || "-"}
                </p>
                <p>
                    <strong>Address:</strong>
                    ${booking.address}
                </p>
                <p>
                    <strong>Date:</strong>
                    ${booking.date}
                </p>
                <p>
                    <strong>Time:</strong>
                    ${booking.time}
                </p>
                <p>
                    <strong>Status:</strong>
                    <span style="
                        background:${color};
                        color:white;
                        padding:4px 10px;
                        border-radius:20px;
                        font-weight:bold;
                    ">
                        ${booking.status}
                    </span>
                </p>
                <button
                class="cancel-btn"
                onclick="
                cancelBooking(
                '${bookingDoc.id}'
                )">
                Cancel Booking
                </button>
            </div>
            `;
        });
        bookingList.innerHTML =
        html;
    }
    catch(error){
        console.error(error);
        bookingList.innerHTML =
        "<p>Unable to load bookings.</p>";
    }
};
// ==========================================
// CANCEL BOOKING
// ==========================================
window.cancelBooking = async function(id){
    if(
        !confirm(
            selectedLanguage === "Kannada"
            ? "ಈ ಬುಕಿಂಗ್ ರದ್ದುಪಡಿಸಬೇಕೇ?"
            : selectedLanguage === "Hindi"
            ? "क्या आप यह बुकिंग रद्द करना चाहते हैं?"
            : "Cancel this booking?"
        )
    ){
        return;
    }
    try{
        await deleteDoc(
            doc(db,"bookings",id)
        );
        alert(
            selectedLanguage === "Kannada"
            ? "ಬುಕಿಂಗ್ ರದ್ದುಪಡಿಸಲಾಗಿದೆ"
            : selectedLanguage === "Hindi"
            ? "बुकिंग रद्द कर दी गई"
            : "Booking Cancelled"
        );
        showBookings();
    }
    catch(error){
        console.error(error);
        alert(
            selectedLanguage === "Kannada"
            ? "ರದ್ದುಪಡಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"
            : selectedLanguage === "Hindi"
            ? "बुकिंग रद्द नहीं हुई"
            : "Unable to cancel booking"
        );
    }
};
  // ==========================================
// HOME CREW - MULTILINGUAL CUSTOMER APP
// PART 4
// Booking System
// ==========================================

// ==========================================
// CONFIRM BOOKING
// ==========================================
window.confirmBooking = async function(){

const address =
document.getElementById("address").value.trim();
const date =
document.getElementById("bookingDate").value;
const time =
document.getElementById("bookingTime").value;
const description =
document.getElementById("description").value.trim();
if(address === ""){
    alert("Please enter address");
    return;
}
if(date === ""){
    alert("Please select date");
    return;
}
if(time === ""){
    alert("Please select time");
    return;
}
try{
    await addDoc(
        collection(db,"bookings"),
        {
            uid:
            localStorage.getItem("uid"),
            name:
            localStorage.getItem("userName"),
            mobile:
            localStorage.getItem("mobile"),
            service:
            selectedService,
            house:
            selectedHouse,
            address:
            address,
            date:
            date,
            time:
            time,
            description:
            description,
            status:
            "Pending",
            createdAt:
            serverTimestamp()
        }
    );
    document.getElementById("address").value = "";
    document.getElementById("bookingDate").value = "";
    document.getElementById("bookingTime").value = "";
    document.getElementById("description").value = "";
    alert(
        selectedLanguage === "Kannada"
        ? "ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ"
        : selectedLanguage === "Hindi"
        ? "बुकिंग सफलतापूर्वक जमा हुई"
        : "Booking Submitted Successfully"
    );
    show("successScreen");
}
catch(error){
    console.error(error);
    alert(
        selectedLanguage === "Kannada"
        ? "ಬುಕಿಂಗ್ ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"
        : selectedLanguage === "Hindi"
        ? "बुकिंग जमा नहीं हुई"
        : "Booking Failed"
    );
}

};
// ==========================================
// HOME CREW - MULTILINGUAL CUSTOMER APP
// PART 5 (FINAL)
// Complaint System + My Bookings
// ==========================================
// ==========================================
// SUBMIT COMPLAINT
// ==========================================
window.submitComplaint = async function(){
    const complaint =
    document.getElementById("complaintText").value.trim();
    if(complaint === ""){
        alert(
            selectedLanguage === "Kannada"
            ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರನ್ನು ನಮೂದಿಸಿ"
            : selectedLanguage === "Hindi"
            ? "कृपया अपनी शिकायत दर्ज करें"
            : "Please enter your complaint"
        );
        return;
    }
    try{
        await addDoc(
            collection(db,"complaints"),
            {
                uid:
                localStorage.getItem("uid"),
                name:
                localStorage.getItem("userName"),
                mobile:
                localStorage.getItem("mobile"),
                complaint:
                complaint,
                status:
                "Pending",
                createdAt:
                serverTimestamp()
            }
        );
        document.getElementById(
            "complaintText"
        ).value = "";
        alert(
            selectedLanguage === "Kannada"
            ? "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ"
            : selectedLanguage === "Hindi"
            ? "शिकायत सफलतापूर्वक जमा हुई"
            : "Complaint Submitted Successfully"
        );
        show("dashboardScreen");
    }
    catch(error){
        console.error(error);
        alert(
            selectedLanguage === "Kannada"
            ? "ದೂರು ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ"
            : selectedLanguage === "Hindi"
            ? "शिकायत जमा नहीं हुई"
            : "Unable to submit complaint"
        );
    }
};
// ==========================================
// WELCOME SCREEN STARTUP
// ==========================================

window.addEventListener("load", () => {

    const uid = localStorage.getItem("uid");

    if(uid){
        autoLogin();
    }else{
        show("welcomeScreen");
    }

});
