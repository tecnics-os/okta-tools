import unittest

import jwt
from jwt_decoder import jwt_viewer
class TestJwtViewer:
    encoded_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    def test_JWT_token(self):
        data = jwt_viewer.decode_encoded_string(TestJwtViewer.encoded_token)
        assert data["header"]["alg"] =="HS256"
        
    
    def test_JWT_header_typ(self):
        data = jwt_viewer.decode_encoded_string(TestJwtViewer.encoded_token)
        assert data["header"]["typ"] == "JWT"
    
    def test_JWT_payload_sub(self):
        data = jwt_viewer.decode_encoded_string(TestJwtViewer.encoded_token)
        assert data["payload"]["sub"] == "1234567890"
    
    def test_JWT_payload_name(self):
        data = jwt_viewer.decode_encoded_string(TestJwtViewer.encoded_token)
        assert data["payload"]["name"] == "John Doe"
    
    def test_fail_token(self):
        data = jwt_viewer.decode_encoded_string("sample")
        assert data["error"] == "Token is invalid"