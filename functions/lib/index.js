"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyMidnightReset = exports.onSOSActivated = exports.onTaskCompleted = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// 1. Secure Automated Rewards (`onTaskCompleted` Trigger)
exports.onTaskCompleted = functions.firestore
    .document('tasks/{taskId}')
    .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    // Check if status changed to 'completed'
    if (newValue.status === 'completed' && previousValue.status !== 'completed') {
        const childId = newValue.assignedTo;
        // Calculate reward systematically (e.g., 5 stars)
        const pointsToAdd = 5;
        const rewardRef = db.collection('rewards').where('childId', '==', childId);
        const rewardSnapshot = await rewardRef.get();
        if (!rewardSnapshot.empty) {
            const docRef = rewardSnapshot.docs[0].ref;
            await docRef.update({
                stars: admin.firestore.FieldValue.increment(pointsToAdd)
            });
        }
        else {
            await db.collection('rewards').add({
                childId: childId,
                stars: pointsToAdd
            });
        }
        console.log(`Successfully awarded ${pointsToAdd} stars to child ${childId} for task completion.`);
    }
    return null;
});
// 2. SOS Push Notifications (`onSOSActivated` Trigger)
exports.onSOSActivated = functions.firestore
    .document('alerts/{alertId}')
    .onCreate(async (snap, context) => {
    var _a;
    const newAlert = snap.data();
    if (newAlert.type === 'danger') {
        const childId = newAlert.childId;
        console.log(`CRITICAL SOS ACTIVATED FOR CHILD: ${childId}`);
        console.log(`Alert Message: ${newAlert.message}`);
        // Look up parent assigned to child
        // For children collection, document ID might be the childId or it could be a field. 
        // Based on earlier implementation, childId is the specific doc ID "alex123"
        const childDoc = await db.collection('children').doc(childId).get();
        if (childDoc.exists) {
            const parentId = (_a = childDoc.data()) === null || _a === void 0 ? void 0 : _a.parentId;
            // In a real application we would lookup parent FCM tokens from `parents` collection 
            // and trigger admin.messaging().send(...)
            console.log(`Would dispatch APNS/FCM Push Notification to Parent ID: ${parentId}`);
        }
    }
    return null;
});
// 3. Nightly Status Reset (`dailyMidnightReset` Cron Task)
exports.dailyMidnightReset = functions.pubsub.schedule('0 0 * * *').timeZone('America/New_York').onRun(async (context) => {
    console.log('Running daily midnight reset...');
    // Purge all ephemeral daily completed activities from the dashboard
    const activitiesRef = db.collection('activities');
    const snapshot = await activitiesRef.where('completed', '==', true).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Cleared ${snapshot.size} ephemeral daily activities.`);
    return null;
});
//# sourceMappingURL=index.js.map