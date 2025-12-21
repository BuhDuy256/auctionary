// src/mails/seller-upgrade-approved.template.ts

import { themes } from "../configs/themes.config";

interface SellerUpgradeApprovedTemplateProps {
  userName: string;
  dashboardUrl: string;
}

export const getSellerUpgradeApprovedTemplate = ({
  userName,
  dashboardUrl,
}: SellerUpgradeApprovedTemplateProps): string => {
  const theme = themes.light;

  const colors = {
    bgPrimary: theme["--bg-secondary"],
    bgSecondary: theme["--bg-primary"],
    bgTertiary: theme["--bg-tertiary"],
    accent: theme["--accent-color"],
    accentHover: theme["--accent-hover"],
    textMain: theme["--text-main"],
    textMuted: theme["--text-muted"],
    textInverse: theme["--text-inverse"],
    border: theme["--border-color"],
    statusSuccess: theme["--status-success"],
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Account Upgrade Approved</title>
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
  }; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background-color: ${
              colors.statusSuccess
            }; height: 4px;"></td>
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
                colors.statusSuccess
              }; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
                🎉 Great News! Your Seller Account Has Been Approved!
              </p>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Your request to upgrade to a seller account has been approved by our admin team. You can now start posting auction products and reach thousands of potential buyers!
              </p>
              
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: ${
                    colors.bgTertiary
                  }; border: 1px solid ${
    colors.border
  }; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: ${
                      colors.textMain
                    }; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0; font-weight: 600;">
                      What you can do now:
                    </p>
                    <ul style="color: ${
                      colors.textMuted
                    }; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>Create and manage auction listings</li>
                      <li>Upload product photos and descriptions</li>
                      <li>Set starting prices and auction duration</li>
                      <li>Respond to buyer questions</li>
                      <li>Track bids in real-time</li>
                      <li>Manage orders and transactions</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: ${
                    colors.bgTertiary
                  }; border-left: 4px solid ${
    colors.statusSuccess
  }; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: ${
                      colors.textMain
                    }; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>Next Steps:</strong><br>
                      Access your seller dashboard to create your first auction listing and start selling!
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${dashboardUrl}" style="background-color: ${
    colors.accent
  }; color: ${
    colors.textInverse
  }; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; transition: background-color 0.3s;">
                      Go to Seller Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: ${
                colors.textMuted
              }; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                Welcome to the Auctionary seller community!
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
