import jwt
class jwt_viewer:
    def decode_encoded_string(encoded_string, signature, algorithm):
        payload = jwt.decode(encoded_string, signature, algorithms=[algorithm])
        return payload

