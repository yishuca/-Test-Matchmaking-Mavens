const firebaseConfig = {
  apiKey: "AIzaSyAyWRKIdxgqiSXX5qNVYsRob8SRNqks64g",
  authDomain: "matchmakingmavenssignin-b1843.firebaseapp.com",
  databaseURL: "https://matchmakingmavenssignin-b1843-default-rtdb.firebaseio.com",
  projectId: "matchmakingmavenssignin-b1843",
  storageBucket: "matchmakingmavenssignin-b1843.firebasestorage.app",
  messagingSenderId: "215663945550",
  appId: "1:215663945550:web:3a1a5a5f047d2525c6e01f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// References to DOM elements
const userForm = document.getElementById('userForm');
const firstNameInput = document.getElementById('firstName');
const lastInitialInput = document.getElementById('lastInitial');
const userListContainer = document.getElementById('userListItems');
const mutualListContainer = document.getElementById('mutualListItems');

// User's current name
let currentUserName = "";

// Event listener for name submission
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = firstNameInput.value.trim();
    const lastInitial = lastInitialInput.value.trim();

    if (firstName && lastInitial) {
        currentUserName = `${firstName} ${lastInitial}`;
        await saveUserName(currentUserName);
        fetchUserList();  // Update user list after entering name
    }
});

// Save user's name in Firestore
async function saveUserName(name) {
    const userRef = db.collection('users').doc(name);
    await userRef.set({
        name: name,
        selected: []  // Initialize empty selection
    });
}

// Fetch user list from Firestore
async function fetchUserList() {
    const usersSnapshot = await db.collection('users').get();
    userListContainer.innerHTML = ''; // Clear previous list

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        const listItem = document.createElement('li');
        listItem.textContent = user.name;
        userListContainer.appendChild(listItem);
    });
}

// Fetch mutual selections
async function fetchMutualSelections() {
    const usersSnapshot = await db.collection('users').get();
    const mutualUsers = [];

    usersSnapshot.forEach(doc => {
        const user = doc.data();
        user.selected.forEach(selectedName => {
            if (selectedName !== user.name) {
                const selectedUser = db.collection('users').doc(selectedName).get();
                selectedUser.then(doc => {
                    if (doc.data().selected.includes(user.name)) {
                        mutualUsers.push({ user1: user.name, user2: selectedName });
                    }
                });
            }
        });
    });

    mutualListContainer.innerHTML = '';
    mutualUsers.forEach((pair) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${pair.user1} & ${pair.user2}`;
        mutualListContainer.appendChild(listItem);
    });
}

// Call this function to load mutual selections on the mutual.html page
if (window.location.pathname === '/mutual.html') {
    fetchMutualSelections();
}
