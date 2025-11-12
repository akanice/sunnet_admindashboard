import { useState } from "react";
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput } from "@coreui/react";
import { useToast } from "../Components/ToastNotification";
import axios from "axios";

const ChangePasswordModal = ({ user, visible, onClose }) => {
  const { showToast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/users/${user.id}/change-password`, { password: newPassword });
      showToast("Đổi mật khẩu thành công!", "success");
      onClose();
    } catch (error) {
      showToast("Lỗi khi đổi mật khẩu!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Đổi Mật Khẩu - {user?.name}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <CFormInput
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          className="mt-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>Hủy</CButton>
        <CButton color="primary" onClick={handleChangePassword} disabled={loading}>
          {loading ? "Đang xử lý..." : "Lưu"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ChangePasswordModal;
