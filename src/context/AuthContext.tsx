import React, { createContext, useContext, useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { getInitialsAvatar } from '../utils/avatar';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
  category?: 'financial' | 'academic' | 'general';
}

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, customUser?: UserProfile) => void;
  logout: () => void;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const DEMO_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    name: 'School Administrator',
    email: 'admin@kidshinemontessori.edu.gh',
    role: 'admin',
    avatar: getInitialsAvatar('School Administrator'),
    phone: '+233 24 100 2000'
  },
  teacher: {
    id: 'tch-201',
    name: 'Faculty Educator',
    email: 'teacher@kidshinemontessori.edu.gh',
    role: 'teacher',
    avatar: getInitialsAvatar('Faculty Educator'),
    phone: '+233 50 000 0000'
  },
  parent: {
    id: 'parent-01',
    name: 'Parent / Guardian',
    email: 'parent@kidshinemontessori.edu.gh',
    role: 'parent',
    avatar: getInitialsAvatar('Parent Guardian'),
    phone: '+233 24 000 0000'
  }
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('app_user_role') as UserRole;
    return savedRole && ['admin', 'teacher', 'parent'].includes(savedRole)
      ? savedRole
      : 'admin';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('app_is_authenticated');
    return savedAuth === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('app_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role === role) return parsed;
      } catch (e) {}
    }
    return DEMO_USERS[role];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('app_user_role', newRole);
    const updatedUser = DEMO_USERS[newRole];
    setCurrentUser(updatedUser);
    localStorage.setItem('app_current_user', JSON.stringify(updatedUser));
  };

  const login = (selectedRole: UserRole, customUser?: UserProfile) => {
    setRole(selectedRole);
    const userToSet = customUser || DEMO_USERS[selectedRole];
    setCurrentUser(userToSet);
    localStorage.setItem('app_current_user', JSON.stringify(userToSet));
    setIsAuthenticated(true);
    localStorage.setItem('app_is_authenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('app_is_authenticated', 'false');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        currentUser,
        notifications,
        markNotificationAsRead,
        clearNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
