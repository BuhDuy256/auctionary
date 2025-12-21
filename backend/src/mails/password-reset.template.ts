// src/mails/password-reset.template.ts

import { themes } from "../configs/themes.config";

interface PasswordResetTemplateProps {
  userName: string;
  otp: string;
  expiryMinutes: number;
}

export const getPasswordResetTemplate = ({
  userName,
  otp,
  expiryMinutes,
}: PasswordResetTemplateProps): string => {
  const theme = themes.light;

  const colors = {
    bgPrimary: theme["--bg-secondary"],
    bgSecondary: theme["--bg-primary"],
    bgTertiary: theme["--bg-tertiary"],
    accent: theme["--accent-color"],
    textMain: theme["--text-main"],
    textMuted: theme["--text-muted"],
    border: theme["--border-color"],
    statusWarning: theme["--status-warning"],
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
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
                Hello ${userName},
              </h2>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                You requested to reset your password. Use the verification code below to complete the process.
              </p>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 30px;">
                    <div style="background-color: ${
                      colors.bgTertiary
                    }; border: 1px dashed ${
    colors.border
  }; border-radius: 8px; padding: 20px; display: inline-block; min-width: 200px;">
                      <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${
                        colors.accent
                      }; display: block;">
                        ${otp}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: ${
                colors.textMuted
              }; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 40px;">
                This code will expire in <strong style="color: ${
                  colors.textMain
                };">${expiryMinutes} minutes</strong>.<br>
                If you didn't request this code, you can safely ignore this email.
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: rgba(255, 153, 0, 0.1); border-left: 4px solid ${
                    colors.statusWarning
                  }; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: ${
                      colors.textMain
                    }; font-size: 13px; line-height: 1.6; margin: 0;">
                      <strong>Security Tip:</strong> Never share this code with anyone. Auctionary will never ask for your password or verification codes via email or phone.
                    </p>
                  </td>
                </tr>
              </table>
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
