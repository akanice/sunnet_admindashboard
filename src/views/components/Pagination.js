
import React from 'react';
import { CPagination, CPaginationItem } from '@coreui/react';

const Pagination = ({ totalPages, currentPage, onPageChange, length, totalItems }) => {
  if (totalPages <= 1) return null;

  const getPageItems = () => {
    // Trường hợp ít trang (<= 6), hiển thị toàn bộ để dễ thao tác
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [];

    // Nhóm 3 trang đầu
    const startPages = [1, 2, 3];
    // Nhóm 3 trang cuối
    const endPages = [totalPages - 2, totalPages - 1, totalPages];

    // Helper: thêm trang nếu trong phạm vi hợp lệ và chưa tồn tại
    const addPage = (p) => {
      if (p >= 1 && p <= totalPages && !items.includes(p)) items.push(p);
    };

    // Thêm 3 trang đầu
    startPages.forEach(addPage);

    // Xác định xem currentPage có nằm giữa hay không
    const inStartBlock = currentPage <= 3;
    const inEndBlock = currentPage >= totalPages - 2;

    // Nếu không ở khối đầu hoặc cuối, hiển thị khối giữa: current-1, current, current+1
    if (!inStartBlock && !inEndBlock) {
      // Thêm dấu ... bên trái nếu có khoảng cách với khối đầu
      if (items[items.length - 1] < currentPage - 1) {
        items.push('ellipsis-left');
      }
      addPage(currentPage - 1);
      addPage(currentPage);
      addPage(currentPage + 1);
    } else {
      // Nếu ở trang 3 (trang cuối của khối đầu), thêm trang 4 để người dùng có thể điều hướng
      if (inStartBlock && currentPage === 3 && totalPages > 4) {
        addPage(4);
      }
      // Nếu ở trang đầu của khối cuối (totalPages - 2), thêm trang totalPages - 3 để người dùng có thể điều hướng
      if (inEndBlock && currentPage === totalPages - 2 && totalPages > 4) {
        // Lưu số lớn nhất trước khi thêm trang mới để kiểm tra khoảng cách
        const lastNumberBefore = Math.max(...items.filter(item => typeof item === 'number'), 0);
        addPage(totalPages - 3);
        // Kiểm tra xem có khoảng cách với khối đầu không, nếu có thì thêm ellipsis-left trước trang vừa thêm
        if (lastNumberBefore > 0 && lastNumberBefore < totalPages - 3 - 1) {
          // Tìm vị trí của trang totalPages - 3 và chèn ellipsis-left trước nó
          const targetPage = totalPages - 3;
          const targetIndex = items.findIndex(item => item === targetPage);
          if (targetIndex > 0) {
            items.splice(targetIndex, 0, 'ellipsis-left');
          }
        }
      }
      // Nếu ở khối đầu mà vẫn còn xa khối cuối, thêm ...
      // Lưu ý: Không thêm ellipsis-left nếu đã thêm trang 4 (vì không còn khoảng cách)
      if (inStartBlock && !(currentPage === 3 && totalPages > 4)) {
        items.push('ellipsis-left');
      }
    }

    const lastAdded = items[items.length - 1];
    const shouldSkipEllipsisRight = inEndBlock && currentPage === totalPages - 2 && totalPages > 4;
    if (typeof lastAdded === 'number' && lastAdded < endPages[0] - 1 && !shouldSkipEllipsisRight) {
      items.push('ellipsis-right');
    }

    if (inEndBlock) {
    }

    // Thêm 3 trang cuối
    endPages.forEach(addPage);

    // Loại bỏ trường hợp hai dấu ... liên tiếp (an toàn)
    const compacted = [];
    for (let i = 0; i < items.length; i++) {
      const cur = items[i];
      const prev = compacted[compacted.length - 1];
      if ((cur === 'ellipsis-left' || cur === 'ellipsis-right') && (prev === 'ellipsis-left' || prev === 'ellipsis-right')) {
        continue;
      }
      compacted.push(cur);
    }

    return compacted;
  };

  const pageItems = getPageItems();

  return (
    <>
      <div className="d-flex justify-content-center mt-3">
        <CPagination>
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="cursor-pointer"
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {pageItems.map((item, idx) => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <CPaginationItem key={`ellipsis-${idx}`} disabled>
                  ...
                </CPaginationItem>
              );
            }
            return (
              <CPaginationItem
                key={`page-${item}`}
                active={currentPage === item}
                onClick={() => onPageChange(item)}
                className="cursor-pointer"
              >
                {item}
              </CPaginationItem>
            );
          })}
          <CPaginationItem
            aria-label="Next"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="cursor-pointer"
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </div>

      {/* Hiển thị thông tin phân trang */}
      <div className="text-center">
        <small>
          Hiển thị {length} trong tổng số {totalItems} kết quả
        </small>
      </div>
    </>
  );
};

export default Pagination; 