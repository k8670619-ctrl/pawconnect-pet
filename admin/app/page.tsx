'use client';

import React from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboard from './_dashboard';

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminSidebar>
        <AdminDashboard />
      </AdminSidebar>
    </AdminGuard>
  );
}
