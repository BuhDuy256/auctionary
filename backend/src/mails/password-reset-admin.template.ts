// src/mails/password-reset-admin.template.ts

import { themes } from "../configs/themes.config";

interface PasswordResetAdminTemplateProps {
  userName: string;
  temporaryPassword: string;
}

export const getPasswordResetAdminTemplate = ({
  userName,
  temporaryPassword,
}: PasswordResetAdminTemplateProps): string => {
  const theme = themes.light;

  const colors = {
    bgPrimary: theme["--bg-secondary"],
    bgSecondary: theme["--bg-primary"],
    bgTertiary: theme["--bg-tertiary"],
    accent: theme["--accent-color"],
    textMain: theme["--text-main"],
    textMuted: theme["--text-muted"],
    border: theme["--border-color"],
    statusDanger: theme["--status-error"], // Using status-error as status-danger doesn't exist
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset by Administrator</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${
    colors.bgPrimary
  }; font-family: 'Open Sans', Arial, sans-serif;">
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${
    colors.bgPrimary
  }; padding: 40px 0;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: ${
          colors.bgSecondary
        }; border: 1px solid ${
    colors.border
  }; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          
          <tr>
            <td style="background-color: ${colors.accent}; height: 4px;"></td>
          </tr>

          <tr>
            <td align="center" style="padding: 40px 0 20px 0;">
              <h1 style="margin: 0; color: ${
                colors.textMain
              }; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">
                <span style="color: ${colors.accent};">AUCTIONARY</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px;">
              <h2 style="color: ${
                colors.textMain
              }; font-size: 20px; margin-bottom: 20px; font-weight: 600;">
                🔐 Password Reset Notification
              </h2>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                Hello ${userName},
              </p>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Your password has been reset by an administrator for security reasons.
              </p>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="background-color: ${
                      colors.bgTertiary
                    }; border: 1px dashed ${
    colors.border
  }; border-radius: 8px; padding: 20px; display: inline-block; min-width: 300px;">
                      <p style="color: ${
                        colors.textMuted
                      }; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                        Temporary Password
                      </p>
                      <span style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: 700; letter-spacing: 2px; color: ${
                        colors.accent
                      }; display: block; user-select: all; -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all; cursor: text; word-break: break-all;">
                        ${temporaryPassword}
                      </span>
                      <p style="color: ${
                        colors.textMuted
                      }; font-size: 11px; margin: 10px 0 0 0; font-style: italic;">
                        Click to select and copy
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid ${
                    colors.statusDanger
                  }; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: ${
                      colors.textMain
                    }; font-size: 13px; line-height: 1.6; margin: 0;">
                      <strong>⚠️ Important:</strong> Please change this password immediately as soon as possible for security reasons.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${
                      process.env.FRONTEND_URL || "http://localhost:5173"
                    }/profile" style="display: inline-block; background-color: ${
    colors.accent
  }; color: ${
    colors.bgSecondary
  }; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                      Change Password Now →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: ${
                colors.textMuted
              }; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 40px;">
                If you did not request this change or have concerns about your account security, please contact support immediately.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: ${
              colors.bgTertiary
            }; padding: 20px; text-align: center; border-top: 1px solid ${
    colors.border
  };">
              <p style="color: ${
                colors.textMuted
              }; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Auctionary. All rights reserved.
              </p>
              <p style="color: ${
                colors.textMuted
              }; font-size: 12px; margin: 5px 0 0 0;">
                This is an automated message, please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};
