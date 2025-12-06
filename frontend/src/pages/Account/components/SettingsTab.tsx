import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Separator } from "../../../components/ui/separator";
import { Button } from "../../../components/ui/button";
import { CheckCircle2, Lock, Shield, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as userService from "../../../services/userService";
import toast from "react-hot-toast";

export const SettingsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(user?.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailConfirmPassword, setEmailConfirmPassword] = useState(""); // For email change

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const hasPassword = user?.hasPassword;

  const handleSaveProfile = async () => {
    try {
      setIsProfileLoading(true);
      // 1. Update basic profile
      await userService.updateProfile({ fullName: displayName, address });

      // 2. Check if email changed
      if (email !== user?.email) {
        if (!emailConfirmPassword && hasPassword) {
          toast.error("Password required to change email");
          setIsProfileLoading(false);
          return;
        }
        await userService.updateEmail(email, emailConfirmPassword);
      }

      toast.success("Profile updated successfully");
      window.location.reload();
    } catch (error: any) {
      toast.error("Error updating profile");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsPasswordLoading(true);
      if (hasPassword) {
        await userService.changePassword(currentPassword, newPassword);
        toast.success("Password updated successfully");
      } else {
        await userService.changePassword("", newPassword);
        toast.success("Password set successfully");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Account Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account information and security
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-accent" />
              Edit Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {email !== user?.email && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="emailConfirmPassword">
                  {hasPassword
                    ? "Confirm Password to Change Email"
                    : "Confirm Change (Social Login)"}
                </Label>
                {hasPassword ? (
                  <Input
                    id="emailConfirmPassword"
                    type="password"
                    value={emailConfirmPassword}
                    onChange={(e) => setEmailConfirmPassword(e.target.value)}
                    placeholder="Required for email change"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Verifying via current session...
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your shipping address"
              />
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={handleSaveProfile}
              disabled={isProfileLoading}
            >
              {isProfileLoading && (
                <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {!isProfileLoading && <CheckCircle2 className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Change/Set Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" />
              {hasPassword ? "Change Password" : "Set Password"}
            </CardTitle>
            <CardDescription>
              {hasPassword
                ? "Update your account password"
                : "Secure your account with a password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoComplete="new-password"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                {hasPassword ? "New Password" : "Password"}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Separator />

            <Button
              className="w-full"
              onClick={handleUpdatePassword}
              disabled={isPasswordLoading}
            >
              <Lock className="mr-2 h-4 w-4" />
              {hasPassword ? "Update Password" : "Set Password"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Security & Privacy
          </CardTitle>
          <CardDescription>
            Additional security options and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div>
              <div className="text-sm mb-1">Two-Factor Authentication</div>
              <div className="text-xs text-muted-foreground">
                Add an extra layer of security to your account
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigate("/under-development");
              }}
            >
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
