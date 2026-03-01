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

async def send_results_email(email: str, nickname: str, matches: list):
    # matches: list of {nick_name, score}
    
    match_list_html = "".join([f"<li><strong>{m['nick_name']}</strong> (Similarity: {m['score']:.2f})</li>" for m in matches])
    
    html = f"""
    <html>
    <body>
        <h3>Hi {nickname},</h3>
        <p>Here are your top 3 most similar players in the room:</p>
        <ul>
            {match_list_html}
        </ul>
        <p>Thanks for playing <strong>We Are Alike</strong>!</p>
    </body>
    </html>
    """

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
