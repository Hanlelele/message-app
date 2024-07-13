'use client';

// xác thực thông tin phiên đăng nhập
import { SessionProvider } from 'next-auth/react';

interface AuthContextProps {
    children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
