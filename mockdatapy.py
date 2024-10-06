import re
import random
import string

# Hàm tạo một dãy ký tự ngẫu nhiên (ID)
def generate_random_id(length=32):
    letters_and_digits = string.ascii_lowercase + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

# Đọc file 'mockdata'
with open('mockdata.txt', 'r', encoding='utf-8') as file:
    data = file.read()

# Biểu thức chính quy để tìm phần tử đầu tiên của mỗi dữ liệu (ID cũ)
pattern = re.compile(r"\('([a-z0-9\-]+)',")

# Thay thế ID cũ bằng ID ngẫu nhiên
new_data = re.sub(pattern, lambda match: f"('{generate_random_id()}',", data)

# Ghi lại dữ liệu đã chỉnh sửa vào file mới hoặc ghi đè lên file cũ
with open('mockdata_updated', 'w', encoding='utf-8') as file:
    file.write(new_data)

print("Hoàn thành việc thay thế ID ngẫu nhiên!")
