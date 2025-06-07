// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2jc-yofbn3o4wpCLBpTQJXQvLrJ0LIZM",
    authDomain: "mobile-doctor-login.firebaseapp.com",
    projectId: "mobile-doctor-login",
    storageBucket: "mobile-doctor-login.firebasestorage.app",
    messagingSenderId: "72261595053",
    appId: "1:72261595053:web:d0765803512f81db14fb24"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// --- AUTHENTICATION FUNCTIONS ---

function signup() {
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            // Set default role as 'user'
            db.ref('users/' + user.uid).set({
                username: username,
                email: email,
                role: 'user'
            });
            alert("Signup successful! Please login.");
            toggleForms(); // Switch to login form
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            window.location.href = "dashboard.html";
        })
        .catch(error => {
            alert("Login failed: " + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
        alert("Logged out successfully!");
        window.location.href = "index.html";
    });
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
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}

// --- UI TOGGLE FUNCTIONS ---

function toggleForms() {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    if (loginContainer.style.display === 'none') {
        loginContainer.style.display = 'flex';
        signupContainer.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'flex';
    }
}

function showResetPassword() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('reset-password-container').style.display = 'flex';
}

function showLogin() {
    document.getElementById('reset-password-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
}


function checkPasswordStrength(password) {
    const msg = document.getElementById("strengthMessage");
    let strength = "";
    if (password.length < 6) {
        strength = "<span class='weak'>Weak</span>";
    } else if (password.length >= 8 && password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/)) {
        strength = "<span class='strong'>Strong</span>";
    } else {
        strength = "<span class='medium'>Medium</span>";
    }
    msg.innerHTML = "Password Strength: " + strength;
}

// --- PROFILE FUNCTIONS ---

function updateProfile() {
    const newUsername = document.getElementById('updateUsername').value;
    const user = auth.currentUser;

    if (user && newUsername) {
        db.ref('users/' + user.uid).update({
            username: newUsername
        }).then(() => {
            alert("Profile updated successfully!");
            location.reload();
        }).catch(error => {
            alert("Error updating profile: " + error.message);
        });
    }
}

// --- ADMIN FUNCTIONS ---

function loadUsers() {
    const userList = document.getElementById('user-list').getElementsByTagName('tbody')[0];
    const usersRef = db.ref('users');

    usersRef.on('value', (snapshot) => {
        userList.innerHTML = ''; // Clear existing list
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const row = userList.insertRow();
            row.innerHTML = `<td>${userData.username}</td><td>${userData.email}</td><td>${userData.role}</td>`;
        });
    });
}

// --- GALLERY FUNCTIONS ---

function searchMobiles() {
    const input = document.getElementById('search-bar');
    const filter = input.value.toUpperCase();
    const gallery = document.getElementById('mobile-gallery');
    const items = gallery.getElementsByClassName('item');

    for (let i = 0; i < items.length; i++) {
        let p = items[i].getElementsByTagName("p")[0];
        let txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
        } else {
            items[i].style.display = "none";
        }
    }
}