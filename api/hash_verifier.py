import hashlib
import bcrypt

class password_checker:

    def verify_password_hash(request_json):
        hash_type = str(request_json['hash_type'])
        password = str(request_json['password'])
        hash_password = str(request_json['hashedpassword'])
        status = None
        if(hash_type == 'bcrypt'):
            status = password_checker.bcrypt_verify(password, hash_password)
        else:
            status = password_checker.hashlib_verify(password, hash_password, hash_type)
        return {"status":status}

    def bcrypt_verify(password, hash_password):
        hashed = hash_password.encode('UTF-8')
        password_encoded = password.encode('UTF-8')
        status = False
        try:
            status = bcrypt.checkpw(password_encoded, hashed)
        except Exception as e:
            status = False

        if status:
            return 1
        else:
            return 0
    
    def hashlib_verify(password, hash_password, hash_type):
        encoded_password = password.encode()
        hashed_m = None
        if(hash_type == 'sha224'):
            hashed_m = hashlib.sha224(encoded_password).hexdigest()
        elif(hash_type == 'sha256'):
            hashed_m = hashlib.sha256(encoded_password).hexdigest()
        elif(hash_type == 'sha384'):
            hashed_m = hashlib.sha384(encoded_password).hexdigest()
        elif(hash_type == 'sha1'):
            hashed_m = hashlib.sha1(encoded_password).hexdigest()
        elif(hash_type == 'sha3_224'):
            hashed_m = hashlib.sha3_224(encoded_password).hexdigest()
        elif(hash_type == 'sha3_256'):
            hashed_m = hashlib.sha3_256(encoded_password).hexdigest()
        elif(hash_type == 'sha3_384'):
            hashed_m = hashlib.sha3_384(encoded_password).hexdigest()
        elif(hash_type == 'sha512'):
            hashed_m = hashlib.sha512(encoded_password).hexdigest()
        elif(hash_type == 'sha3_512'):
            hashed_m = hashlib.sha3_512(encoded_password).hexdigest()
        
        if(hashed_m == hash_password):
            # return "Success, Its a valid password hash!"
            return 1
        else:
            # return "Failure, Its not a valid password hash!"
            return 0



 
        
