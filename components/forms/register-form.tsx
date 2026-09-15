"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button, Form, Input } from "antd";
import { Mail, Lock, User } from "lucide-react";
import { apiCall } from "@/lib/api";
import { endpoints } from "@/constants/urls";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [form] = Form.useForm<RegisterFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onFinish = async (values: RegisterFormValues) => {
    setSubmitting(true);

    const response = await apiCall("POST", endpoints.REGISTER, {
      data: values,
      headers: { loader: false },
    });

    if (!response.success) {
      toast.error(response.message ?? "Could not create your account");
      setSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setSubmitting(false);

    if (signInResult?.error) {
      toast.success("Account created — please sign in");
      router.push("/login");
      return;
    }

    toast.success("Welcome to Flare!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="w-full">
      <Form.Item
        label={<span className="text-sm font-medium text-textPrimary">Full Name</span>}
        name="name"
        rules={[
          { required: true, message: "Please enter your name" },
          { min: 2, message: "Name must be at least 2 characters" },
        ]}
      >
        <Input
          prefix={<User className="h-4 w-4 text-textMuted transition-colors group-focus-within:text-primary-500" />}
          placeholder="Jane Doe"
          className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
        />
      </Form.Item>

      <Form.Item
        label={<span className="text-sm font-medium text-textPrimary">Email Address</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input
          prefix={<Mail className="h-4 w-4 text-textMuted transition-colors group-focus-within:text-primary-500" />}
          placeholder="you@example.com"
          className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
        />
      </Form.Item>

      <div className="grid gap-4 sm:grid-cols-2">
        <Form.Item
          label={<span className="text-sm font-medium text-textPrimary">Password</span>}
          name="password"
          rules={[
            { required: true, message: "Required" },
            { min: 8, message: "Min 8 chars" },
          ]}
        >
          <Input.Password
            prefix={<Lock className="h-4 w-4 text-textMuted transition-colors group-focus-within:text-primary-500" />}
            placeholder="Create password"
            className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-sm font-medium text-textPrimary">Confirm Password</span>}
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Required" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<Lock className="h-4 w-4 text-textMuted transition-colors group-focus-within:text-primary-500" />}
            placeholder="Confirm password"
            className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
          />
        </Form.Item>
      </div>

      <Form.Item className="mb-0 mt-4">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={submitting}
          className="h-12 rounded-xl !bg-primary-600 !text-white font-medium shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] hover:shadow-primary-500/40 active:scale-[0.98]"
        >
          Create Account
        </Button>
      </Form.Item>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-surface px-4 text-textMuted rounded-full">
            Or sign up with
          </span>
        </div>
      </div>

      <Button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="group flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface shadow-sm transition-all hover:border-primary-300 hover:bg-primary-50 !text-textPrimary"
      >
        <svg className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </Button>
    </Form>
  );
}
