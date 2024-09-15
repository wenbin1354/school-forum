from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth
from .firebase_utils import create_firebase_user, get_firebase_user
import datetime
     
class RegisterView(APIView):
    # register a new user in firestore
    def post(self, request):
        user = create_firebase_user(request.data['email'], request.data['password'], request.data['displayName'])
        # print(user)
        return Response({'message': 'User created successfully'}, status=201)

class LoginView(APIView):
    def post(self, request):
        uid = request.data['uid']
        
        try:
            auth.get_user(uid=uid)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        id_token = request.data['idToken']
        
        try:
            # Create a session cookie
            session_cookie = auth.create_session_cookie(id_token=id_token, expires_in=datetime.timedelta(days=1))
        except Exception as e:
            return Response({'error': str(e)}, status=500)

        # Set the session cookie in the response
        response = Response({'message': 'User logged in successfully'}, status=200)
        response.set_cookie('session', session_cookie, httponly=True, secure=True, samesite='None')

        return response
        
        
class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('session')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            decoded_token = auth.verify_session_cookie(token, check_revoked=True)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
        try:
            user = auth.get_user(uid=decoded_token['uid'])
        except Exception as e:
            return str(e)
        
        uid = decoded_token['uid']
        user_ref = get_firebase_user(uid)
        
        response = Response()
        response.data = {
            'displayName': user.display_name,
            'uid': user.uid,
            'email': user.email,
            'isVerified': user.email_verified
        }
        
        if 'agreedComments' in user_ref:
            response.data['agreedComments'] = user_ref['agreedComments']
        else:
            response.data['agreedComments'] = []
        
        if 'disagreedComments' in user_ref:
            response.data['disagreedComments'] = user_ref['disagreedComments']
        else:
            response.data['disagreedComments'] = []
        
        return response
    
class SuperUserView(APIView):
    def get(self, request):
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
        
        response = Response()
        response.data = {
            'isSuperUser': isSuperUser,
        }
        
        return response
        
class LogoutView(APIView):
    def delete(self, request):
        response = Response()
        
        response.delete_cookie('session')
        
        response.data = {
            'message': 'successfully logout'
        }
        
        return response