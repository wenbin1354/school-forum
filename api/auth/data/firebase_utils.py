from firebase_admin import firestore
from google.cloud.firestore_v1 import FieldFilter

def get_collection_data(collection_name):
    # Access Firestore and retrieve data from the specified collection
    db = firestore.client()
    collection_ref = db.collection(collection_name)
    documents = collection_ref.stream()
    data = [{'doc_id': doc.id, **doc.to_dict()} for doc in documents]
    return data

def get_comments_by_user_id(user_id):
    db = firestore.client()
    comments_ref = db.collection('Comments')
    query = comments_ref.where(filter=FieldFilter('userId', '==', user_id))
    
    documents = query.stream()

    comments_with_uid = []

    for doc in documents:
        comment_data = doc.to_dict()
        comments_with_uid.append({'doc_id': doc.id, **comment_data})
        
    return comments_with_uid

def get_comments_by_elective_id(elective_id):
    db = firestore.client()

    comments_ref = db.collection('Comments')
    query = comments_ref.where(filter=FieldFilter('courseId', '==', elective_id))
    documents = query.stream()

    comments_with_uid = []

    for doc in documents:
        comment_data = doc.to_dict()
        comments_with_uid.append({'doc_id': doc.id, **comment_data})

    return comments_with_uid
    
def find_user_by_uid(uid):
    # Initialize Firestore client
    db = firestore.Client()

    # Reference the "users" collection and the document with the specified UID
    user_ref = db.collection('users').document(uid)

    # Get the user document
    user_doc = user_ref.get()

    if user_doc.exists:
        # Return the user data
        return user_doc.to_dict()
    else:
        # User with the given UID not found
        return None
    
def insert_data_into_electives(data):
    db = firestore.client()
    electives_ref = db.collection('Electives')
    electives_ref.add(data)
    return True

def insert_data_into_majors(data):    
    db = firestore.client()
    majors_ref = db.collection('Majors')
    majors_ref.add(data)
    return True

def insert_data_into_requests(data):
    db = firestore.client()
    requests_ref = db.collection('Request')
    requests_ref.add(data)
    return True

def get_firebase_user(uid):
    db = firestore.client()
    user_ref = db.collection('users').document(uid)
    user = user_ref.get()
    return user.to_dict()