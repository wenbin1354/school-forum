import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth, firestore, storage
from .firebase_utils import get_comments_by_elective_id, get_comments_by_user_id, get_collection_data, insert_data_into_electives, insert_data_into_majors, insert_data_into_requests, get_firebase_user

class CommentsView(APIView):
    def get(self, request, elective_id):
        try:
            data = get_comments_by_elective_id(elective_id)

            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def post(self, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        db = firestore.client()
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        # Parse JSON data
        data = json.loads(request.data.get('data', '{}'))

        comment_data = {
            "userId": decoded_token['uid'],
            "courseId": data.get('courseId'),
            "displayName": data.get('displayName'),
            "semester": data.get('semester'),
            "professor": data.get('professor'),
            "commentHeader": data.get('commentHeader'),
            "commentBody": data.get('commentBody'),
            "tags": data.get('tags'),
            "rating": data.get('rating')
        }
        
        if 'textbook' in data:
            comment_data['textbook'] = data.get('textbook')
    
        if 'attendance' in data:
            comment_data['attendance'] = data.get('attendance')
    
        if 'grade' in data:
            comment_data['grade'] = data.get('grade')
            
        comments_ref = db.collection('Comments')
        comments_doc = comments_ref.add(comment_data)
        
        # if there is a file, upload it to storage and add the URL to the comment data
        if 'file' in request.FILES:
            file = request.FILES['file']
            filename = comments_doc[1].id
            bucket = storage.bucket()
            blob = bucket.blob(filename)
            blob.upload_from_file(file)
            comment_data['fileUrl'] = f"https://firebasestorage.googleapis.com/v0/b/hunter-school-forum.appspot.com/o/{filename}?alt=media"
            
            # Update the comment document with the file URL
            comments_doc[1].update({'fileUrl': comment_data['fileUrl']})
        
        return Response({'message': 'Comment created successfully'}, status=201)
    
class ElectiveView(APIView):
    def get(self , request):
        try:
            data = get_collection_data('Electives')
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def post(self, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        uid = decoded_token['uid']
        user = get_firebase_user(uid)
        
        if 'isSuperUser' in user:
            isSuperUser = user['isSuperUser']
        else:
            isSuperUser = False
        
        if not isSuperUser:
            return Response({'error': 'Not Admin'}, status=401)
        
        insert_data_into_electives(request.data)
        
        return Response({'message': 'Elective created successfully'}, status=201)
            
        

class MajorView(APIView):
    def get(self , request):
        try:
            data = get_collection_data('Majors')
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def post(get, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        uid = decoded_token['uid']
        user = get_firebase_user(uid)
        
        if 'isSuperUser' in user:
            isSuperUser = user['isSuperUser']
        else:
            isSuperUser = False
        
        if not isSuperUser:
            return Response({'error': 'Not Admin'}, status=401)
        
        insert_data_into_majors(request.data)
        
        return Response({'message': 'Elective created successfully'}, status=201)
    
class RequestView(APIView):
    def get(self , request):
        try:
            data = get_collection_data('Request')
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    def post(get, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        insert_data_into_requests(request.data)
        
        return Response({'message': 'Request created successfully'}, status=201)

class UserCommentsView(APIView):
    def get(self, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        uid = decoded_token['uid']
        
        try:
            data = get_comments_by_user_id(uid)
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
    def delete(self, request, comment_id):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        uid = decoded_token['uid']
        comment_ref = firestore.client().collection('Comments').document(comment_id)
        
        # check if comment userId matches current uid, if not, return 401
        comment_data = comment_ref.get().to_dict()  
        if comment_data['userId'] != uid:
            return Response({'error': 'Unauthorized'}, status=401)
        
        # delete blob from storage with name as comment_id
        if 'fileUrl' in comment_data:
            filename = comment_id
            bucket = storage.bucket()
            blob = bucket.blob(filename)
            blob.delete()
        
        # delete comment from firestore
        comment_ref.delete()
        
        return Response({'message': 'Comment deleted successfully'}, status=200)
        

class VotingCommentsView(APIView):
    def patch(self, request, comment_id):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        uid = decoded_token['uid']
        vote_type = request.data['voteType'] # true for 'agree' or false for 'disagree'
        vote_action = request.data['voteAction'] # true for 'increment' or false for 'undo'
        
        # Initialize Firestore client
        db = firestore.Client()
        
        # Reference to the user's document
        user_ref = db.collection('users').document(uid)
        
        # Reference to the comment's document
        comment_ref = db.collection('Comments').document(comment_id)
        
        # Transaction to ensure atomicity
        with db.transaction():
            # check user exist
            user_data = user_ref.get().to_dict()
            if not user_data:
                return Response({'error': 'User not found'}, status=404)
                        
            # Update user's agreedComments or disagreedComments based on vote type and action
            if vote_type == 'agree':
                user_comments_key = 'agreedComments'
            elif vote_type == 'disagree':
                user_comments_key = 'disagreedComments'
            else:
                return Response({'error': 'Invalid vote type'}, status=400)
            
            user_comments = user_data.get(user_comments_key, [])
            
            if vote_action == 'increment' and comment_id in user_comments:
                return Response({'message': f'User has already {vote_type}d on this comment'}, status=200)
            if vote_action == 'undo' and comment_id not in user_comments:
                return Response({'message': f'User has not {vote_type}d on this comment'}, status=200)
            
            if vote_action == 'increment':
                # Update user's document using arrayUnion
                user_comments_field = {user_comments_key: firestore.ArrayUnion([comment_id])}
            elif vote_action == 'undo':
                # Update user's document using arrayRemove
                user_comments_field = {user_comments_key: firestore.ArrayRemove([comment_id])}
            else:
                return Response({'error': 'Invalid vote action'}, status=400)
            
            user_ref.update(user_comments_field)
            
            # Update comment's document based on vote action
            if vote_action == 'increment':
                # Increment upvotes or downvotes based on vote type
                if vote_type == 'agree':
                    comment_ref.update({'upvotes': firestore.Increment(1)})
                elif vote_type == 'disagree':
                    comment_ref.update({'downvotes': firestore.Increment(1)})
            elif vote_action == 'undo':
                # Decrement upvotes or downvotes based on vote type
                if vote_type == 'agree':
                    comment_ref.update({'upvotes': firestore.Increment(-1)})
                elif vote_type == 'disagree':
                    comment_ref.update({'downvotes': firestore.Increment(-1)})
            
            return Response({'message': 'Vote updated successfully'}, status=200)