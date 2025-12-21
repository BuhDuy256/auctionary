// src/mails/transaction-cancelled.template.ts

import { themes } from "../configs/themes.config";

interface TransactionCancelledTemplateProps {
  userName: string;
  productName: string;
  productImage?: string;
  finalBidAmount: number;
  cancellationReason: string;
  productUrl: string;
}

export const getTransactionCancelledTemplate = ({
  userName,
  productName,
  productImage,
  finalBidAmount,
  cancellationReason,
  productUrl,
}: TransactionCancelledTemplateProps): string => {
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
    statusError: theme["--status-error"],
  };

  const formattedAmount = finalBidAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Cancelled by Seller</title>
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
              colors.statusError
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
                colors.statusError
              }; font-size: 18px; font-weight: 600; margin-bottom: 20px;">
                ⚠️ Transaction Cancelled by Seller
              </p>
              <p style="color: ${
                colors.textMuted
              }; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Unfortunately, the seller has cancelled your transaction for <strong style="color: ${
                  colors.textMain
                };">${productName}</strong>.
              </p>
              
              ${
                productImage
                  ? `
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <img src="${productImage}" alt="${productName}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid ${colors.border}; opacity: 0.7;" />
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
                        <td style="padding-bottom: 15px;">
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width: 50%;">
                                <span style="color: ${
                                  colors.textMuted
                                }; font-size: 14px;">Your Winning Bid:</span>
                              </td>
                              <td style="width: 50%; text-align: right;">
                                <span style="color: ${
                                  colors.textMain
                                }; font-size: 16px; font-weight: 600;">${formattedAmount}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px; border-top: 1px solid ${
                          colors.border
                        };">
                          <span style="color: ${
                            colors.textMuted
                          }; font-size: 14px;">Reason for Cancellation:</span>
                          <p style="color: ${
                            colors.statusError
                          }; font-size: 15px; line-height: 1.6; margin: 8px 0 0 0; font-weight: 600;">
                            ${cancellationReason}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: rgba(239, 68, 68, 0.1); border-left: 4px solid ${
                    colors.statusError
                  }; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
                    <p style="color: ${
                      colors.textMain
                    }; font-size: 14px; line-height: 1.6; margin: 0;">
                      <strong>Impact on Your Account:</strong><br>
                      This cancellation may result in a -1 rating on your account. If you believe this cancellation was made in error, please contact our support team.
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${productUrl}" style="background-color: ${
    colors.bgTertiary
  }; color: ${
    colors.textMain
  }; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block; border: 1px solid ${
    colors.border
  };">
                      Browse Other Auctions
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: ${
                colors.textMuted
              }; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                We apologize for the inconvenience. There are many other great auctions available.
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
