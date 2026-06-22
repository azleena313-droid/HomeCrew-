// ==========================================
// HOME CREW - SCRIPT.JS
// PART 1
// ==========================================
// ---------- Imports ----------
import { auth, db } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
// ---------- Variables ----------
let confirmationResult = null;
let selectedLanguage = "English";
let selectedService = "";
let selectedHouse = "";
// ---------- Screen Navigation ----------
window.show = function(id){
document.querySelectorAll(".screen").forEach(screen=>{
screen.classList.remove("active");
});
document.getElementById(id).classList.add("active");
};
// ---------- Language ----------
window.setLanguage=function(language){
selectedLanguage=language;
localStorage.setItem("language",language);
show("loginScreen");
};
// ---------- Firebase ----------
window.onload=function(){
window.recaptchaVerifier=new RecaptchaVerifier(
auth,
"recaptcha-container",
{
size:"normal"
}
);
};
// ---------- Send OTP ----------
window.sendOTP=async function(){
const name=document.getElementById("loginName").value.trim();
const mobile=document.getElementById("mobile").value.trim();
if(name===""){
alert("Enter your name");
return;
}
if(!/^[6-9]\d{9}$/.test(mobile)){
alert("Enter valid mobile number");
return;
}
try{
confirmationResult=await signInWithPhoneNumber(
auth,
"+91"+mobile,
window.recaptchaVerifier
);
localStorage.setItem("userName",name);
localStorage.setItem("mobile",mobile);
alert("OTP Sent");
show("otpScreen");
}
catch(error){
console.error(error);
alert(error.message);
}
};
// ==========================================
// HOME CREW - SCRIPT.JS
// PART 2
// ==========================================
// ---------- Verify OTP ----------
window.verifyOTP = async function () {
const otp = document.getElementById("otp").value.trim();
if (otp.length !== 6) {
alert("Enter valid OTP");
return;
}
try {
const result = await confirmationResult.confirm(otp);
const user = result.user;
const name = localStorage.getItem("userName");
const mobile = localStorage.getItem("mobile");
// Save User
await setDoc(doc(db,"users",user.uid),{
uid:user.uid,
name:name,
mobile:mobile,
language:selectedLanguage,
createdAt:serverTimestamp()
});
localStorage.setItem("uid",user.uid);
document.getElementById("profileName").textContent=name;
document.getElementById("profileMobile").textContent=mobile;
alert("Login Successful");
show("dashboardScreen");
}
catch(error){
console.error(error);
alert("Invalid OTP");
}
};
// ---------- Select Service ----------
window.selectService=function(service){
selectedService=service;
document.getElementById("selectedService").value=service;
show("houseScreen");
};
// ---------- House ----------
window.goBooking=function(){
selectedHouse=document.getElementById("house").value;
if(selectedHouse===""){
alert("Please select house");
return;
}
document.getElementById("selectedHouse").value=selectedHouse;
show("bookingScreen");
};
// ---------- Customer Care ----------
window.callCustomerCare=function(){
window.location.href="tel:7624802646";
};
// ---------- WhatsApp ----------
window.openWhatsApp=function(){
window.open(
"https://wa.me/917624802646",
"_blank"
);
};
// ---------- Complaint ----------
window.openComplaint=function(){
show("complaintScreen");
};
// ==========================================
// HOME CREW - SCRIPT.JS
// PART 3
// ==========================================
// ---------- Confirm Booking ----------
window.confirmBooking = async function(){
const address=document.getElementById("address").value.trim();
const date=document.getElementById("bookingDate").value;
const time=document.getElementById("bookingTime").value;
const description=document.getElementById("description").value.trim();
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
const complaint=document.getElementById("complaintText").value.trim();
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
// PART 4 (FINAL)
// ==========================================
// ---------- My Bookings ----------
window.showBookings = async function(){
show("profileScreen");
const bookingList=document.getElementById("bookingList");
bookingList.innerHTML="<p>Loading...</p>";
try{
const q=query(
collection(db,"bookings"),
where("uid","==",localStorage.getItem("uid"))
);
const snapshot=await getDocs(q);
if(snapshot.empty){
bookingList.innerHTML="<p>No bookings found.</p>";
return;
}
let html="";
snapshot.forEach((bookingDoc)=>{
const booking=bookingDoc.data();
html+=`
<div class="booking-card">
<h3>${booking.service}</h3>
<p><strong>House:</strong> ${booking.house}</p>
<p><strong>Address:</strong> ${booking.address}</p>
<p><strong>Date:</strong> ${booking.date}</p>
<p><strong>Time:</strong> ${booking.time}</p>
<p><strong>Status:</strong> ${booking.status}</p>
<button class="cancel-btn"
onclick="cancelBooking('${bookingDoc.id}')">
Cancel Booking
</button>
</div>
`;
});
bookingList.innerHTML=html;
}
catch(error){
console.error(error);
bookingList.innerHTML="<p>Unable to load bookings.</p>";
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
window.logout = async function(){
try{
await signOut(auth);
}catch(e){
console.log(e);
}
localStorage.clear();
show("languageScreen");
};
// ---------- Auto Login ----------
window.addEventListener("load",()=>{
if(localStorage.getItem("uid")){
document.getElementById("profileName").textContent=
localStorage.getItem("userName")||"";
document.getElementById("profileMobile").textContent=
localStorage.getItem("mobile")||"";
show("dashboardScreen");
}
});