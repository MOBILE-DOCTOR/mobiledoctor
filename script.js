// Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2jc-yofbn3o4wpCLBpTQJXQvLrJ0LIZM",
  authDomain: "mobile-doctor-login.firebaseapp.com",
  projectId: "mobile-doctor-login",
  storageBucket: "mobile-doctor-login.firebasestorage.app",
  messagingSenderId: "72261595053",
  appId: "1:72261595053:web:d0765803512f81db14fb24"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

function signup() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      const uid = user.user.uid;
      db.ref("users/" + uid).set({ email, username });  // REMOVE password from here
      alert("Signup successful!");
    })
    .catch(err => alert(err.message));
}


function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      window.location.href = "dashboard.html";
    })
    .catch(err => alert("Login failed: " + err.message));
}

function logout() {
  auth.signOut().then(() => alert("Logged out!"));
}
function resetPassword() {
  const email = document.getElementById("forgotEmail").value;
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Check your inbox.");
      // Optionally clear the input
      document.getElementById("forgotEmail").value = "";
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}


