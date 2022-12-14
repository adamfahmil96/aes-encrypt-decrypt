# AES Encrypt/Decrypt

My personal repository for Encrypt/Decrypt using AES algorithm. For now, I use two languages: Python and JavaScript.

## Installation

First, we have to install the packages.

### Python

```python
python -m venv env
pip install -r requirement.txt
```

### JavaScript (NodeJS)

```
npm install
```

## Step-by-step

### Encryption

1. Applying standard padding
2. Create new AES Cipher using MODE CBC and fix value of iv (initialization vector)
3. Do encryption
4. Reverse the result of encryption
5. Return the result with type result is string

### Decryption

1. Reverse the result of encryption (type: string)
2. Decode the encryption
3. Create new AES Cipher using MODE CBC and fix value of iv
4. Remove the padding
5. Return the result with type result is string

## Usage

For Python, enter the virtual environment first, then run python file

```python
python <file_name.py>
```

For JavaScript, because of using NodeJS, just register your command to package.json then run:

```
npm run start
```

## References

[Encrypt/Decrypt Data between Python 3 and JavaScript (AES algorithm)](https://medium.com/@sachadehe/encrypt-decrypt-data-between-python-3-and-javascript-true-aes-algorithm-7c4e2fa3a9ff)

[Cryptography with Python - Overview](https://www.tutorialspoint.com/cryptography_with_python/cryptography_with_python_quick_guide.htm)
