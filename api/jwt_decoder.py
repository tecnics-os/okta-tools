import jwt
class jwt_viewer:
    def decode_encoded_string(encoded_string):
        error = None
        header = None
        decoded = None
        try:
            header = jwt.get_unverified_header(encoded_string)
            print(header);
            decoded = jwt.decode(encoded_string, options={"verify_signature": False})
        except Exception as e:
            error = "Please Enter a valid token!"
        data = {
            "header": header,
            "payload": decoded,
            "error": error
        }
        return data

