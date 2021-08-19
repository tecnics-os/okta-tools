import jwt
from jwt import algorithms
class jwt_viewer:
    def decode_encoded_string(body):
        encoded_string = body['encoded_token']
        secret_key = body['secret']
        algorithm = body['algoritm']
        public_key = body['publickey']
        data = None
        if algorithm == 'HS256' or algorithm == 'HS384' or algorithm == 'HS512':
            header = jwt.get_unverified_header(encoded_string)
            if secret_key == None:
                decoded = jwt.decode(encoded_string, options={"verify_signature": False})
            else:
                decoded = jwt.decode(encoded_string, secret_key, algorithms=[algorithm])

            data = {
                    "header": header,
                    "payload": decoded
            }
            return data
            
        else:
            data = jwt.decode(encoded_string, public_key, algorithms=[algorithm])
        
        return data

