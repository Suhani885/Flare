"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Form, Input } from "antd";
import { Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";
import { endpoints } from "@/constants/urls";

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm() {
  const [form] = Form.useForm<ResetPasswordValues>();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-textSecondary">
          This reset link is missing required information. Please request a
          new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  const onFinish = async (values: ResetPasswordValues) => {
    setSubmitting(true);

    const response = await apiCall<{ message: string }>("POST", endpoints.RESET_PASSWORD, {
      data: { ...values, token, email },
      headers: { loader: false },
    });

    setSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "This reset link is invalid or has expired.");
      return;
    }

    toast.success("Password reset — please sign in.");
    router.push("/login");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="w-full">
      <Form.Item
        label={<span className="text-sm font-medium text-textPrimary">New Password</span>}
        name="password"
        rules={[
          { required: true, message: "Required" },
          { min: 8, message: "Min 8 chars" },
        ]}
      >
        <Input.Password
          prefix={<Lock className="h-4 w-4 text-textMuted" />}
          placeholder="Create new password"
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
          prefix={<Lock className="h-4 w-4 text-textMuted" />}
          placeholder="Confirm new password"
          className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
        />
      </Form.Item>

      <Form.Item className="mb-0 mt-4">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={submitting}
          className="h-12 rounded-xl !bg-primary-600 !text-white font-medium shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] hover:shadow-primary-500/40 active:scale-[0.98]"
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}
