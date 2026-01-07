import { themes } from "../configs/themes.config";

interface DescriptionUpdatedTemplateProps {
  userName: string;
  productName: string;
  productImage?: string;
  productUrl: string;
  updateContent: string;
}

export const getDescriptionUpdatedTemplate = ({
  userName,
  productName,
  productImage,
  productUrl,
  updateContent,
}: DescriptionUpdatedTemplateProps): string => {
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
    statusInfo: theme["--status-info"],
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Description Updated</title>
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
                colors.statusInfo
              }; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
                📝 Product Description Updated
              </p>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                The seller has updated the description for the product you are interested in: <strong style="color: ${
                  colors.textMain
                };">${productName}</strong>.
              </p>
              
              ${
                productImage
                  ? `
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="${productImage}" alt="${productName}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid ${colors.border};" />
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: ${
                    colors.bgTertiary
                  }; border: 1px solid ${
    colors.border
  }; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 10px;">
                          <span style="color: ${
                            colors.textMain
                          }; font-size: 14px; font-weight: 600;">Update Details:</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 10px; border-top: 1px solid ${
                          colors.border
                        };">
                          <p style="color: ${
                            colors.textMain
                          }; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${updateContent}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${productUrl}" style="background-color: ${
    colors.accent
  }; color: ${
    colors.textInverse
  }; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; transition: background-color 0.3s;">
                      View Product
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: ${
                colors.textMuted
              }; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                Review the changes to make informed bidding decisions.
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
