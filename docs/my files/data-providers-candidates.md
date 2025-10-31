
# 4 ứng cử viên:
- sportMonks
- football-api
- soccer-api
- Football-Data.org
- 

# sportMonks
- giá: 45$
- độ chính xác:
  - ai: ok
  - từ cộng đồng: vẫn có sai nhưng ít
  - tự test phạm vi nhỏ: chưa
- khả năng mở rộng: ok
- note: ~ lựa chọn sáng giá. data chi tiết hơn, nhiều league hơn (gấp đôi football-api). 14-trial

# football-api
- giá: 20$
- độ chính xác:
  - ai: ok
  - từ cộng đồng: sai sót nhiều hơn, bị nói khá nhiều
  - tự test: chưa
- khả năng mở rộng: ok
- note: cộng đồng nói bad data khá nhiều, sau này khi muốn đổi provider khi scale cũng rất mất thời gian.
- 
# soccer-api
- giá: 40$ (phụ thuộc vào leagues)
- độ chính xác:
  - ai: ok
  - từ cộng đồng: ít có đánh giá
  - tự test phạm vi nhỏ: chưa
- khả năng mở rộng: ?
- note: cộng đồng nhỏ, hơi yếu.

# Football-Data.org
- giá: ? (tiền nhiều thì request/min nhiều)
- độ chính xác:
  - ai: ok
  - từ cộng đồng: ok tốt, owner verify data manually
  - tự test phạm vi nhỏ: chưa
- khả năng mở rộng: ?
- note: cộng đồng vừa, free cho các giải hàng đầu, giới hạn request là vấn đề.
-------------

# table

| Tiêu chí                        | **SportMonks**                                                                                          | **Football-API**                                                                     | **Soccer-API**                                  | **Football-Data.org**                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| 💵 **Giá**                      | $45/tháng                                                                                               | $20/tháng                                                                            | $40/tháng *(tùy league)*                        | Không cố định *(theo request/min)*                                                    |
| ✅ **Độ chính xác (AI)**         | OK                                                                                                      | OK                                                                                   | OK                                              | OK                                                                                    |
| 👥 **Độ chính xác (Cộng đồng)** | Tốt, vẫn có sai nhưng ít                                                                                | Bị phàn nàn nhiều, “bad data” khá phổ biến                                           | Ít đánh giá                                     | Tốt, owner verify data thủ công                                                       |
| 🧪 **Tự test (phạm vi nhỏ)**    | Chưa test                                                                                               | Chưa test                                                                            | Chưa test                                       | Chưa test                                                                             |
| 📈 **Khả năng mở rộng**         | Tốt                                                                                                     | Tốt nhưng khó đổi provider khi scale                                                 | Chưa rõ                                         | Chưa rõ                                                                               |
| 🧩 **Ghi chú / Nhận xét**       | • Lựa chọn sáng giá<br>• Dữ liệu chi tiết hơn, nhiều league hơn (≈2× Football-API)<br>• Có 14-day trial | • Giá rẻ<br>• Dữ liệu thiếu chính xác, nhiều sai sót<br>• Khó chuyển đổi khi mở rộng | • Cộng đồng nhỏ<br>• Thiếu tài liệu và phản hồi | • Free cho các giải lớn<br>• Giới hạn request là điểm yếu<br>• Cộng đồng vừa, ổn định |



# Note
- nếu data có sai, dùng AI + web search để check lại (chi phí ?)
- scrapt data k ổn, vì chi phí để data ổn định (coding, mapping, ...)