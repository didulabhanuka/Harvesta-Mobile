import firebase_admin
from firebase_admin import credentials, firestore

# Firebase Initialization with correct bucket name
def initialize_firebase():
    cred = credentials.Certificate("harvesta-24-25j-250-firebase-adminsdk.json")  # Your Firebase credentials
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'harvesta-24-25j-250.firebasestorage.app'  # Correct bucket name
        })
    
    # Firestore initialization
    db = firestore.client()
    
    return db  # Return Firestore instance to use in other parts of your application
