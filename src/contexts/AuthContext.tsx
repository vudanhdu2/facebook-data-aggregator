import React, { createContext, useState, useContext, useEffect } from "react";
import { UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { doLogin } from "@/services/apis";
import { consoleLogUtil } from "@/utils/consoleLogUtil";
import { useDispatch, useSelector } from "react-redux";
import { saveUserInfo } from "@/redux/action";
import { UserInfo } from "@/models/login/UserInfo";

interface AuthContextType {
    user: UserInfo | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAdmin: () => boolean;
    isMember: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const dispatch = useDispatch();
    const userReducer = useSelector((state: any) => state.userReducer);
    useEffect(() => {
        if (userReducer && userReducer.data) {
            setUser(userReducer?.data?.user);
        }
        setIsLoading(false);
    }, [userReducer]);

    const login = async (
        username: string,
        password: string
    ): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await doLogin({ username, password });
            consoleLogUtil("Login response", response);
            if (response && response.success) {
                dispatch(saveUserInfo(response.data));
                toast({
                    title: "Đăng nhập thành công",
                    description: `Chào mừng bạn!`,
                });
                return true;
            } else {
                toast({
                    title: "Đăng nhập thất bại",
                    description: "Email hoặc mật khẩu không đúng",
                    variant: "destructive",
                });
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Lỗi đăng nhập",
                description: "Có lỗi xảy ra trong quá trình đăng nhập",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        dispatch(saveUserInfo(null));
        toast({
            title: "Đã đăng xuất",
            description: "Bạn đã đăng xuất khỏi hệ thống",
        });
    };

    const isAdmin = () => {
        return user?.role === UserRole.ADMIN;
    };

    const isMember = () => {
        return user?.role === UserRole.MEMBER;
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, login, logout, isAdmin, isMember }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
