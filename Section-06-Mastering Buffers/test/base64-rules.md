1. At least 3 bytes should be there to work with.
2. if 3 bytes are not there then base64 encoding will add multiple zeros
to fill the remaining bits.
3. Data should be in the multiples of 3 bytes.
4. 