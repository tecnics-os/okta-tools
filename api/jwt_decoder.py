import jwt
class jwt_viewer:
    def decode_encoded_string(body):
        encoded_string = body['encoded_token']
        error = None
        header = None
        decoded = None
        try:
            header = jwt.get_unverified_header(encoded_string)
            decoded = jwt.decode(encoded_string, options={"verify_signature": False})
        except jwt.exceptions.DecodeError:
            error = "Token is invalid"
        data = {
            "header": header,
            "payload": decoded,
            "error": error
        }
        return data

