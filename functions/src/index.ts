import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((_request, response) => {
 response.send("Hello World!");
});


export const getAllTours = functions.https.onRequest((_request, response) => {
  admin.firestore().collection('tours').get().then(data => {
    const tours:any[] = [];
    data.forEach(doc => {
      tours.push(doc.data());
    });
    return response.json(tours);
  }).catch(err => console.error(err));
});

export const getTours = functions.https.onRequest(async (_request, response) => {
  try {
    const tours:any[] = [];
    const snapshot = await admin.firestore().collection('tours').get();
    snapshot.forEach(doc => {
      tours.push(doc.data());
    });
    return response.json(tours);
  }catch (err) {
    // Handle error
    console.error('Get all tours Error: ', err);
    return response.status(500).send(err)
  }
});


export const createNewTour = functions.https.onRequest(async (request, response) => {
  try {
    const newTour = {
      tourTitle: request.body.tourTitle,
      postedBy: request.body.postedBy,
      tourShortDescription: request.body.tourShortDescription,
      tourLongDescription: request.body.tourLongDescription,
      createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    const newDoc = await admin.firestore().collection('tours').add(newTour);

    response.status(201).send(`Created a new contact: ${newDoc.id}`);
  } catch (error) {
      response.status(400).send(`Contact should only contains firstName, lastName and email!!!`)
  }  
})