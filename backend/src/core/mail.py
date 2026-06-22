from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from src.core.config import settings

# Only configure if credentials are provided
use_credentials = bool(settings.MAIL_USERNAME and settings.MAIL_PASSWORD)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME or "user",
    MAIL_PASSWORD=settings.MAIL_PASSWORD or "pwd",
    MAIL_FROM=settings.MAIL_FROM or "noreply@example.com",
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER or "localhost",
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=use_credentials,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

MEDALS = ["🥇", "🥈", "🥉"]

def _build_match_cards(matches: list) -> str:
    cards = []
    for i, m in enumerate(matches):
        medal = MEDALS[i] if i < len(MEDALS) else "🎯"
        score_pct = int(m['score'] * 100)
        bar_color = "#4f46e5" if i == 0 else "#7c3aed" if i == 1 else "#a855f7"
        cards.append(f"""
        <tr>
          <td style="padding: 10px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-size:28px; width:44px; vertical-align:middle;">{medal}</td>
                      <td style="vertical-align:middle; padding-left:12px;">
                        <div style="font-size:16px; font-weight:700; color:#1e1b4b; margin-bottom:6px;">{m['nick_name']}</div>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="width:100%; background:#e5e7eb; border-radius:99px; height:8px;">
                              <div style="width:{score_pct}%; background:{bar_color}; height:8px; border-radius:99px;"></div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td style="vertical-align:middle; padding-left:16px; white-space:nowrap;">
                        <span style="font-size:20px; font-weight:800; color:{bar_color};">{score_pct}%</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>""")
    return "".join(cards)

async def send_results_email(email: str, nickname: str, matches: list):
    # matches: list of {nick_name, score}

    match_cards = _build_match_cards(matches)

    html = f"""<!DOCTYPE html> /Users/jayson.yang79/Library/Metadata/CoreSpotlight/PasteboardHistory/2026-03-11_01-47-38.png
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Results – We Are Alike</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6; padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#a855f7 100%);
                        border-radius:16px 16px 0 0; padding:40px 32px 32px; text-align:center;">
              <div style="font-size:36px; margin-bottom:8px;">🎭</div>
              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.5px;">We Are Alike</h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:14px;">Your Similarity Results Are In!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#f8f7ff; padding:32px; border-left:1px solid #e5e7eb; border-right:1px solid #e5e7eb;">
              <p style="margin:0 0 8px; font-size:22px; font-weight:700; color:#1e1b4b;">
                Hi {nickname}! 👋
              </p>
              <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.6;">
                The voting has ended. Based on everyone's ratings, here are your
                <strong>top matches</strong> — the people who think most like you:
              </p>

              <!-- Match Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                {match_cards}
              </table>

              <p style="margin:28px 0 0; font-size:14px; color:#6b7280; line-height:1.6; text-align:center;">
                Similarity score reflects how closely your ratings aligned with theirs.<br/>
                The higher, the more you two think alike! 🧠
              </p>
            </td>
          </tr>

          <!-- CTA / Footer -->
          <tr>
            <td style="background:#1e1b4b; border-radius:0 0 16px 16px; padding:28px 32px; text-align:center;">
              <p style="margin:0 0 4px; color:rgba(255,255,255,0.6); font-size:12px;">Thanks for playing</p>
              <p style="margin:0; color:#ffffff; font-size:16px; font-weight:700;">We Are Alike 🎭</p>
              <p style="margin:16px 0 0; color:rgba(255,255,255,0.4); font-size:11px;">
                This email was sent automatically. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    message = MessageSchema(
        subject="Your Similarity Results - We Are Alike",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        if use_credentials:
            await fm.send_message(message)
        else:
            print(f"[MOCK EMAIL] To: {email}, Matches: {matches}")
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")
