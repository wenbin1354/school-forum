from firebase_admin import auth, firestore

def create_firebase_user(email, password, displayName):
    db = firestore.client()

    try:
        # Create a new Firebase user
        user = auth.create_user(email=email, password=password, display_name=displayName, email_verified=False)
        user_data = {
            'displayName': displayName,
            'email': email,
        }

        # Add the user data to the Firestore collection with the UID as the document ID
        db.collection('users').document(user.uid).set(user_data)
        
        return user
    except Exception as e:
        return str(e)  # Handle the error appropriately

def get_firebase_user(uid):
    db = firestore.client()
    user_ref = db.collection('users').document(uid)
    user = user_ref.get()
    return user.to_dict()