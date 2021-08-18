import bcrypt
class password_checker:

    def verify_password_hash(password, hash_password):
        salt = bcrypt.gensalt()
        hashed = hash_password.encode('UTF-8')
        password_encoded = password.encode('UTF-8') 
        if bcrypt.checkpw(password_encoded, hashed):
            return {"status":"success, Its a valid password hash"}
        else:
            return {"status": "Failure, Its not a valid password hash"}
        

