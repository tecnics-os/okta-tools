import bcrypt
import unittest
from hash_verifier import password_checker
class TestPasswordHash(unittest.TestCase):
    def test_password_hash(self):
        password = b"password"
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password, salt).decode('UTF-8')
        status = password_checker.bcrypt_verify("password", hashed)
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha1(self):
        password = "password"
        hashed = "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"
        status = password_checker.hashlib_verify("password", hashed,'sha1')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha224(self):
        password = "password"
        hashed = "d63dc919e201d7bc4c825630d2cf25fdc93d4b2f0d46706d29038d01"
        status = password_checker.hashlib_verify("password", hashed,'sha224')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha256(self):
        password = "password"
        hashed = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
        status = password_checker.hashlib_verify("password", hashed,'sha256')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha384(self):
        password = "password"
        hashed = "a8b64babd0aca91a59bdbb7761b421d4f2bb38280d3a75ba0f21f2bebc45583d446c598660c94ce680c47d19c30783a7"
        status = password_checker.hashlib_verify("password", hashed,'sha384')
        self.assertEqual(status,'success, Its a valid password hash')
        
    def test_password_hash_sha3_224(self):
        password = "password"
        hashed = "c3f847612c3780385a859a1993dfd9fe7c4e6d7f477148e527e9374c"
        status = password_checker.hashlib_verify("password", hashed,'sha3_224')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha3_256(self):
        password = "password"
        hashed = "c0067d4af4e87f00dbac63b6156828237059172d1bbeac67427345d6a9fda484"
        status = password_checker.hashlib_verify("password", hashed,'sha3_256')
        self.assertEqual(status,'success, Its a valid password hash')

    def test_password_hash_sha3_384(self):
        password = "password"
        hashed = "9c1565e99afa2ce7800e96a73c125363c06697c5674d59f227b3368fd00b85ead506eefa90702673d873cb2c9357eafc"
        status = password_checker.hashlib_verify("password", hashed,'sha3_384')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha512(self):
        password = "password"
        hashed = "b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86"
        status = password_checker.hashlib_verify("password", hashed,'sha512')
        self.assertEqual(status,'success, Its a valid password hash')
    
    def test_password_hash_sha3_512(self):
        password = "password"
        hashed = "e9a75486736a550af4fea861e2378305c4a555a05094dee1dca2f68afea49cc3a50e8de6ea131ea521311f4d6fb054a146e8282f8e35ff2e6368c1a62e909716"
        status = password_checker.hashlib_verify("password", hashed,'sha3_512')
        self.assertEqual(status,'success, Its a valid password hash')