
const admin = require('firebase-admin');
admin.initializeApp();

// Set custom claim for an admin user
async function setAdminClaim(userId) {
  await admin.auth().setCustomUserClaims(userId, { admin: true });
  console.log(`User ${userId} has been granted admin privileges.`);
}

// Example usage: Granting admin privileges to a user
setAdminClaim('userId123');  // Replace with the actual user ID
