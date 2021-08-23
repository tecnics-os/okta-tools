import jwt
class jwt_viewer:
    def decode_encoded_string(body):
        encoded_string = body['encoded_token']
        header = jwt.get_unverified_header(encoded_string)
        decoded = jwt.decode(encoded_string, options={"verify_signature": False})
            
        data = {
                "header": header,
                "payload": decoded
        }
        return data

