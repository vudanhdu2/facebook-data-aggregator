"use client";

import { Dialog, Button, Flex, Text } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { UserData } from "@/models/user/UserData";

const userFormSchema = z
    .object({
        username: z.string().min(1, "Vui lòng nhập tên đăng nhập").optional(),
        fullname: z.string().min(1, "Vui lòng nhập họ tên"),
        password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự").optional(),
        confirmPassword: z.string().optional(),
        role: z.enum(["admin", "member"]),
    })
    .refine(
        (data) => {
            if (data.password || data.confirmPassword) {
                return data.password === data.confirmPassword;
            }
            return true;
        },
        {
            message: "Mật khẩu nhập lại không khớp",
            path: ["confirmPassword"],
        }
    );

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormModalProps {
    initialData?: Partial<UserData>;
    onSubmit: (data: any) => void;
}

export default function UserFormModal({
    initialData,
    onSubmit,
}: UserFormModalProps) {
    const isEditMode = Boolean(initialData?.id);
    const passDefaul = "!@#qbcdXX1234";
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            username: "",
            fullname: "",
            password: "",
            confirmPassword: "",
            role: "member",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                username: initialData.username ?? "",
                fullname: initialData.fullname ?? "",
                password: passDefaul,
                confirmPassword: passDefaul,
                role: initialData.role as "admin" | "member",
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit = async (data: UserFormData) => {
        if (isEditMode) {
            const payload = {
                id: initialData?.id,
                fullname: data.fullname,
                username: data.username,
                role: data.role,
                password: "",
            };
            if (data.password !== passDefaul) {
                payload.password = data.password;
            } else {
                delete payload.password;
            }
            onSubmit(payload);
        } else {
            onSubmit({
                username: data.username,
                fullname: data.fullname,
                password: data.password,
                role: data.role,
            });
        }
        reset();
    };

    return (
        <Dialog.Content maxWidth="500px">
            <Dialog.Title>
                {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </Dialog.Title>
            <Dialog.Description>
                {isEditMode
                    ? "Cập nhật thông tin người dùng"
                    : "Nhập thông tin để tạo người dùng mới"}
            </Dialog.Description>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-3 mt-4"
            >
                <Flex direction="column" gap="1">
                    <label htmlFor="fullname">Họ và tên</label>
                    <input
                        {...register("fullname")}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {errors.fullname && (
                        <Text color="red" size="1">
                            {errors.fullname.message}
                        </Text>
                    )}
                </Flex>
                <Flex direction="column" gap="1">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        {...register("username")}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {errors.username && (
                        <Text color="red" size="1">
                            {errors.username.message}
                        </Text>
                    )}
                </Flex>

                <Flex direction="column" gap="1">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        {...register("password")}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {errors.password && (
                        <Text color="red" size="1">
                            {errors.password.message}
                        </Text>
                    )}
                </Flex>

                <Flex direction="column" gap="1">
                    <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        className="border rounded-md px-3 py-2 text-sm"
                    />
                    {errors.confirmPassword && (
                        <Text color="red" size="1">
                            {errors.confirmPassword.message}
                        </Text>
                    )}
                </Flex>

                <Flex direction="column" gap="1">
                    <label htmlFor="role">Vai trò</label>
                    <select
                        {...register("role")}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="admin">Quản trị viên</option>
                        <option value="member">Thành viên</option>
                    </select>
                </Flex>

                <Flex justify="end" gap="3" mt="4">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Hủy
                        </Button>
                    </Dialog.Close>
                    <Button
                        type="submit"
                        variant="solid"
                        color="blue"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? isEditMode
                                ? "Đang lưu..."
                                : "Đang tạo..."
                            : isEditMode
                            ? "Lưu thay đổi"
                            : "Tạo người dùng"}
                    </Button>
                </Flex>
            </form>
        </Dialog.Content>
    );
}
//
