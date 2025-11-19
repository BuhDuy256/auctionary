import React from "react";
import "./StatusPageLayout.css"; // Chúng ta sẽ dùng file CSS chung này

// 1. Định nghĩa props mà layout này sẽ nhận
interface StatusPageLayoutProps {
  icon: React.ReactNode; // Có thể nhận emoji (🚧) hoặc icon
  title: string;
  message: string;
  children: React.ReactNode; // 'children' sẽ là nơi chúng ta đặt các nút bấm
}

export default function StatusPageLayout({
  icon,
  title,
  message,
  children,
}: StatusPageLayoutProps) {
  return (
    // 2. Sử dụng class chung
    <div className="status-container">
      <div className="status-icon">{icon}</div>
      <h1 className="status-title">{title}</h1>
      <p className="status-message">{message}</p>

      {/* 3. Render các nút bấm (children) ở đây */}
      <div className="status-actions">{children}</div>
    </div>
  );
}
