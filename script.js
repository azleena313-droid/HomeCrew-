Java script 

// ==========================================
// HOME CREW - SCRIPT.JS (PART 1)
// ==========================================

import { auth } from "./firebase.js";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Global Variables
let confirmationResult = null;
let selectedLanguage = "English";
let selectedService = "";
let selectedHouse = "";

// ==============================
// SCREEN NAVIGATION
// ==============================

window.show = function(screenId){

    document.querySelectorAll(".screen").forEach(screen=>{

        screen.classList.remove("active");

    });

    document.getElementById(screenId).classList.add("active");

};

// ==============================
// LANGUAGE
// ==============================

window.setLanguage = function(language){

    selectedLanguage = language;

    localStorage.setItem("language",language);

    show("loginScreen");

};

// ==============================
// FIREBASE RECAPTCHA
// ==============================

window.onload = function(){

    window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
            size:"normal"
        }
    );

};

// ==============================
// SEND OTP
// ==============================

window.sendOTP = async function(){

    const mobile =
    document.getElementById("mobile").value.trim();

    const name =
    document.getElementById("loginName").value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    if(!/^[6-9]\d{9}$/.test(mobile)){

        alert("Enter a valid 10-digit mobile number.");

        return;

    }

    try{

        confirmationResult =
        await signInWithPhoneNumber(

            auth,

            "+91"+mobile,

            window.recaptchaVerifier

        );

        localStorage.setItem("userName",name);
        localStorage.setItem("mobile",mobile);

        alert("OTP Sent Successfully");

        show("otpScreen");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

// ==========================================
// HOME CREW - SCRIPT.JS (PART 2)
// OTP VERIFICATION
// ==========================================

import { db } from "./firebase.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// VERIFY OTP
// ==============================

window.verifyOTP = async function () {

    const otp = document.getElementById("otp").value.trim();

    if (otp.length !== 6) {

        alert("Please enter a valid 6-digit OTP.");

        return;

    }

    try {

        const result = await confirmationResult.confirm(otp);

        const user = result.user;

        const name = localStorage.getItem("userName");
        const mobile = localStorage.getItem("mobile");

        // Save user in Firestore
        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            mobile: mobile,
            language: selectedLanguage,
            createdAt: new Date().toISOString()

        });

        localStorage.setItem("uid", user.uid);

        // Update Profile
        document.getElementById("profileName").textContent = name;
        document.getElementById("profileMobile").textContent = mobile;

        alert("Login Successful");

        show("dashboardScreen");

    }

    catch (error) {

        console.error(error);

        alert("Invalid OTP");

    }

};

// ==============================
// SELECT SERVICE
// ==============================

window.selectService = function(service){

    selectedService = service;

    document.getElementById("selectedService").value = service;

    show("houseScreen");

};

// ==============================
// HOUSE SELECTION
// ==============================

window.goBooking = function(){

    selectedHouse = document.getElementById("house").value;

    if(selectedHouse===""){

        alert("Please select a house.");

        return;

    }

    document.getElementById("selectedHouse").value = selectedHouse;

    show("bookingScreen");

};

// ==========================================
// HOME CREW - SCRIPT.JS (PART 3)
// BOOKING & FIRESTORE
// ==========================================

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// CONFIRM BOOKING
// ==============================

window.confirmBooking = async function () {

    const address = document.getElementById("address").value.trim();
    const date = document.getElementById("bookingDate").value;
    const time = document.getElementById("bookingTime").value;
    const description = document.getElementById("description").value.trim();

    if (address === "") {
        alert("Please enter your address.");
        return;
    }

    if (date === "") {
        alert("Please select a date.");
        return;
    }

    if (time === "") {
        alert("Please select a time.");
        return;
    }

    try {

        await addDoc(collection(db, "bookings"), {

            uid: localStorage.getItem("uid"),
            name: localStorage.getItem("userName"),
            mobile: localStorage.getItem("mobile"),

            service: selectedService,
            house: selectedHouse,

            address: address,
            date: date,
            time: time,
            description: description,

            status: "Pending",

            createdAt: serverTimestamp()

        });

        // Clear form
        document.getElementById("address").value = "";
        document.getElementById("bookingDate").value = "";
        document.getElementById("bookingTime").value = "";
        document.getElementById("description").value = "";

        alert("Booking submitted successfully.");

        show("successScreen");

    }

    catch (error) {

        console.error(error);

        alert("Failed to save booking.");

    }

};

// ==========================================
// HOME CREW - SCRIPT.JS (PART 4)
// MY BOOKINGS & LOGOUT
// ==========================================

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==============================
// LOAD MY BOOKINGS
// ==============================

window.showBookings = async function () {

    show("profileScreen");

    const bookingList = document.getElementById("bookingList");

    bookingList.innerHTML = "<p>Loading...</p>";

    try {

        const q = query(
            collection(db, "bookings"),
            where("uid", "==", localStorage.getItem("uid"))
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            bookingList.innerHTML = "<p>No bookings found.</p>";

            return;

        }

        let html = "";

        snapshot.forEach((bookingDoc) => {

            const booking = bookingDoc.data();

            html += `

            <div class="booking-card">

                <h3>${booking.service}</h3>

                <p><strong>House:</strong> ${booking.house}</p>

                <p><strong>Address:</strong> ${booking.address}</p>

                <p><strong>Date:</strong> ${booking.date}</p>

                <p><strong>Time:</strong> ${booking.time}</p>

                <p><strong>Status:</strong> ${booking.status}</p>

                <button
                    class="cancel-btn"
                    onclick="cancelBooking('${bookingDoc.id}')">

                    Cancel Booking

                </button>

            </div>

            `;

        });

        bookingList.innerHTML = html;

    }

    catch (error) {

        console.error(error);

        bookingList.innerHTML = "<p>Unable to load bookings.</p>";

    }

};

// ==============================
// CANCEL BOOKING
// ==============================

window.cancelBooking = async function (bookingId) {

    if (!confirm("Cancel this booking?")) return;

    try {

        await deleteDoc(doc(db, "bookings", bookingId));

        alert("Booking cancelled.");

        showBookings();

    }

    catch (error) {

        console.error(error);

        alert("Unable to cancel booking.");

    }

};

// ==============================
// LOGOUT
// ==============================

window.logout = function () {

    localStorage.clear();

    show("languageScreen");

};