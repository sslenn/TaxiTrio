import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';
import LogoutConfirmModal from '../components/LogoutConfirmModal';

const LogoutConfirmContext = createContext();

export function LogoutConfirmProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const triggerLogout = () => {
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <LogoutConfirmContext.Provider value={{ confirmLogout: triggerLogout }}>
      {children}
      <LogoutConfirmModal 
        isOpen={isOpen} 
        onClose={handleClose} 
        onConfirm={handleConfirm} 
      />
    </LogoutConfirmContext.Provider>
  );
}

export function useLogoutConfirm() {
  const context = useContext(LogoutConfirmContext);
  if (!context) {
    throw new Error('useLogoutConfirm must be used within a LogoutConfirmProvider');
  }
  return context;
}
