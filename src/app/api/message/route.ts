import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_EMAIL_LENGTH = 512
const MAX_MESSAGE_LENGTH = 4096
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/
const TO_EMAIL = 'm@mehrdad.ai'
const FROM_EMAIL = 'contact@mehrdad.ai'

export async function POST(req: Request) {
  try {
    const {email, message} = await req.json()

    if (!email || !EMAIL_PATTERN.test(email)) {
      return Response.json(
        {error: 'Please enter a valid email address'},
        {status: 400}
      )
    }

    if (!message) {
      return Response.json({error: 'Please enter a message'}, {status: 400})
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return Response.json(
        {
          error: `Please enter an email fewer than ${MAX_EMAIL_LENGTH} characters`,
        },
        {status: 400}
      )
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          error: `Please enter a message fewer than ${MAX_MESSAGE_LENGTH} characters`,
        },
        {status: 400}
      )
    }

    const response = await resend.emails.send({
      from: `Portfolio <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New message from ${email}`,
      text: `From: ${email}\n\n${message}`,
    })

    if (response.error) {
      console.error(
        JSON.stringify({
          level: 'error',
          message: response.error.message,
          route: 'POST /api/message',
        })
      )
      throw new Error('Error sending your message.')
    }

    return Response.json({message: 'Message sent successfully'})
  } catch (error) {
    console.error('Failed to send message:', error)
    return Response.json({error: 'Message rejected'}, {status: 500})
  }
}
