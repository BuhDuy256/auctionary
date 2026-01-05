import { useState, useEffect } from "react";
import * as adminService from "../services/adminService";
import type { AdminUser } from "../types/admin";
import { toast } from "sonner";

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getAllUsers();
      setUsers(response.users);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspendUser = async (userId: number, userName: string) => {
    try {
      await adminService.suspendUser(userId);
      toast.success(`User ${userName} suspended successfully`);
      // Refresh users list
      await fetchUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to suspend user";
      toast.error(errorMessage);
      console.error("Failed to suspend user:", err);
    }
  };

  const handleResetPassword = async (userId: number) => {
    try {
      const response = await adminService.resetUserPassword(userId);
      return response; // Return the response containing temporary password
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      toast.error(errorMessage);
      console.error("Failed to reset password:", err);
      throw err; // Re-throw so the UI can handle it
    }
  };

  return {
    users,
    isLoading,
    error,
    refreshUsers: fetchUsers,
    handleSuspendUser,
    handleResetPassword,
  };
};
