"use client";

import { useState } from "react";
import { Button, Form, Input } from "antd";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";
import { endpoints } from "@/constants/urls";

interface ForgotPasswordValues {
  email: string;
}

export function ForgotPasswordForm() {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const onFinish = async (values: ForgotPasswordValues) => {
    setSubmitting(true);

    const response = await apiCall<{ message: string; devResetLink?: string }>(
      "POST",
      endpoints.FORGOT_PASSWORD,
      { data: values, headers: { loader: false } }
    );

    setSubmitting(false);

    if (!response.success) {
      toast.error(response.message ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
    setDevResetLink(response.data?.devResetLink ?? null);
  };

  if (sent) {
    return (
      <div className="text-center">
        <p className="text-textSecondary">
          If an account exists for that email, we&apos;ve sent a link to reset
          your password. It expires in 1 hour.
        </p>

        {devResetLink && (
          <div className="mt-6 rounded-xl border border-dashed border-primary-300 bg-primary-50 p-4 text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
              Development mode — no email provider configured yet
            </p>
            <Link
              href={devResetLink.replace(/^https?:\/\/[^/]+/, "")}
              className="break-all text-sm font-medium text-primary-600 underline"
            >
              {devResetLink}
            </Link>
          </div>
        )}

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="w-full">
      <Form.Item
        label={<span className="text-sm font-medium text-textPrimary">Email Address</span>}
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input
          prefix={<Mail className="h-4 w-4 text-textMuted" />}
          placeholder="you@example.com"
          className="group h-12 rounded-xl border border-border bg-surface px-4 shadow-sm transition-all hover:bg-surfaceElevated focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
        />
      </Form.Item>

      <Form.Item className="mb-0 mt-2">
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={submitting}
          className="h-12 rounded-xl !bg-primary-600 !text-white font-medium shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] hover:shadow-primary-500/40 active:scale-[0.98]"
        >
          Send Reset Link
        </Button>
      </Form.Item>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </Form>
  );
}
