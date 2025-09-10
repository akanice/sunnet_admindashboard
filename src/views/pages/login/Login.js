import React, {useState, useContext, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import LogoutButton from '../../admin/Components/LogoutButton'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();

  // Nếu đã đăng nhập, tự động chuyển hướng sang dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Hiển thị lỗi từ AuthContext nếu có
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate("/dashboard"); // Chuyển hướng sau khi đăng nhập thành công
      } else {
        setError(result.error || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const LoggedIn = () => {
    return (
      <div className='d-flex flex-column align-items-center justify-content-center h-100'>
        <p>Bạn đã đăng nhập!</p>
        <CButton color="primary" className="px-4 mb-3" onClick={() => navigate("/dashboard")}>
          Đi tới Dashboard
        </CButton>
        <LogoutButton />
      </div>
    );
  };

  return (
    <div className="login-container min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="login-card p-4">
                <CCardBody>
                  { isAuthenticated ? (
                    <LoggedIn />
                  ) : ( 
                  /* Login form */
                  <CForm onSubmit={handleLogin} className="login-form">
                    <h1>Login</h1>
                    <p className="text-body-secondary">Đăng nhập vào tải khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        type="text" 
                        placeholder="Phone" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput 
                        type="password" 
                        placeholder="Mật khẩu" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                    {error && <div className="error-message">{error}</div>}
                  </CForm>
                  )}
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sunnet Admin Dashboard</h2>
                    <p>
                      Mạng xã hội gia tộc họ Dương 
                    </p>
                    <Link to="https://blueoceanlaundry.vn">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Trang chủ
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
