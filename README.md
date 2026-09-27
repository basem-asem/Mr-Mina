# Alberchi-Admin-NextJS

DEMO 👉️ https://alberchi-admin-next-js.vercel.app/

## Prerequisites
You will need Node.js Version 14.21.1

## Setup 
Get the code using `git clone` 
```
https://github.com/my-technology-source/Alberchi-Admin-NextJS.git
```
# 
`main` is the branch with the latest changes.
#
Once downloaded, open the terminal in the project directory, and install dependencies with:
```
npm install
```

Once dependencies are installed successfully, Create a .env.local file with your firebase configuration values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID= <your-firebase-measurement-id>
```

Then start the example app with:
```
npm run dev
``` 

## English Teacher Dashboard (Firestore)

The teacher dashboard is available at `/teacher-dashboard` after signing in. It stores records in the top-level `students`, `groups`, `notes`, `attendance`, `exams`, `examResults`, and `lessons` collections. Every record includes `teacherId` (the Firebase Auth UID); linked records refer to students, groups, and exams by document ID. An exam targets one grade type, grade, and class name; its roster page saves a result for each student, and the student profile displays those results in a chart. On first dashboard load, records in the former `teacherDashboards/{uid}/{collection}` subcollections are copied to the top-level collections while preserving their document IDs.

Enable **Cloud Firestore** and merge rules like these with existing rules (the admin app may need additional access):

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isTeacherRecord() {
      return request.auth != null && resource.data.teacherId == request.auth.uid;
    }
    function isNewTeacherRecord() {
      return request.auth != null && request.resource.data.teacherId == request.auth.uid;
    }
    match /{collectionName}/{recordId} {
      allow read, delete: if isTeacherRecord();
      allow create, update: if isNewTeacherRecord();
    }
    match /teacherDashboards/{teacherId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == teacherId;
    }
  }
}
```

The root rule should be limited to the dashboard collections when merging into a production ruleset. Keep existing rules for other app collections, and verify that the migration can read the old subtree and write the new collections. The project ID is `mina-b613e` in `src/configs/firebaseConfig.js`.

The student profile filters exam results, notes, and attendance by both `teacherId` and `studentId`. Their composite indexes are declared in `firestore.indexes.json`; deploy them with `firebase deploy --only firestore:indexes --project mina-b613e` after installing and signing in to the Firebase CLI. Single-field indexes used by the other dashboard reads are managed automatically by Firestore.
