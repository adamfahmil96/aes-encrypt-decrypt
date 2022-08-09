import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

# CBC mode with Fix IV

data = 'Praktis-LNW'            # example password
BLOCK_SIZE = 16
KEY_AES = '45436c61696d4b6579436865636b696e'

# iv = get_random_bytes(BLOCK_SIZE) # Random IV more secure
iv = 'PTS&LNWkalibrasi'.encode('utf-8')

def reverse_sentence(sentence):
    translated = ''
    last_two_char = sentence[-2:] # get last '=='
    split_sentence = sentence.rsplit(last_two_char)
    i = len(split_sentence[0]) - 1
    while i >= 0:
        translated = translated + split_sentence[0][i]
        i -= 1
    return translated + last_two_char

def encrypt(data, key, iv):
    # applying standard padding
    data = pad(data.encode(), BLOCK_SIZE)
    # create new AES Cipher
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
    # encrypt
    encrypted = base64.b64encode(cipher.encrypt(data))
    # return with reverse sentence
    return reverse_sentence(encrypted.decode("utf-8", "ignore"))

def decrypt(enc, key, iv):
    # reverse the encrypt sentence
    enc_reverse = reverse_sentence(enc)
    # decode the encryption
    enc = base64.b64decode(enc_reverse)
    # create new AES Cipher
    cipher = AES.new(key.encode('utf-8'), AES.MODE_CBC, iv)
    # return decrypt
    return unpad(cipher.decrypt(enc), BLOCK_SIZE)

print(f'--- value of initial iv: {iv}')

encrypted = encrypt(data=data, key=KEY_AES, iv=iv)
print(f'--- "str" value of encrypted CBC base64: {encrypted}')

decrypted = decrypt(enc=encrypted, key=KEY_AES, iv=iv)
print(f'--- data: {decrypted.decode("utf-8", "ignore")}')
