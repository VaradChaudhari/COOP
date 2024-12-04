import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Sender's email credentials
sender_email = "shrimanikelectronics@gmail.com"  # Sender's Gmail address
app_password = "zevp hqsd hwos pzsh"  # Your generated app password
receiver_email = "shrimanikelectronics@gmail.com"  # Receiver's email address

# Set up the MIME message
msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = receiver_email
msg['Subject'] = 'Order Confirmation'

# Body of the email
body = 'Your payment was successful! Thank you for your order.'
msg.attach(MIMEText(body, 'plain'))

# Send the email
try:
    # Connect to Gmail's SMTP server
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()  # Start TLS for security
    server.login(sender_email, app_password)  # Login using the app password
    text = msg.as_string()  # Convert the MIME message to a string
    server.sendmail(sender_email, receiver_email, text)  # Send the email
    server.quit()  # Close the connection
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
