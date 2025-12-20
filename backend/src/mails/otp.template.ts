// src/mails/otp.template.ts

// 1. Import themes từ file config
import { themes } from "../configs/themes.config";

interface OTPTemplateProps {
  userName: string;
  otp: string;
  expiryMinutes: number;
}

export const getOTPTemplate = ({
  userName,
  otp,
  expiryMinutes,
}: OTPTemplateProps): string => {
  const theme = themes.light;

  const colors = {
    bgPrimary: theme["--bg-secondary"],
    bgSecondary: theme["--bg-primary"],
    bgTertiary: theme["--bg-tertiary"],
    accent: theme["--accent-color"],
    textMain: theme["--text-main"],
    textMuted: theme["--text-muted"],
    border: theme["--border-color"],
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
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
                You initiated a request to verify your email address. Use the verification code below to complete the process.
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
