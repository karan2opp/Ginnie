import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema/user'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const primaryEmail = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || primaryEmail?.split('@')[0] || 'User'

    try {
      await db.insert(users).values({
        id: id,
        email: primaryEmail || "",
        name: name,
        imageUrl: image_url || "",
      })
      console.log(`User ${id} inserted into database from Clerk webhook`)
    } catch (dbError) {
      console.error('Failed to insert user into DB:', dbError)
      return new Response('Database error', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
     const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const primaryEmail = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || primaryEmail?.split('@')[0] || 'User'

    const { eq } = await import('drizzle-orm')
    try {
        await db.update(users).set({
            email: primaryEmail || "",
            name: name,
            imageUrl: image_url || "",
            updatedAt: new Date()
        }).where(eq(users.id, id))
        console.log(`User ${id} updated in database from Clerk webhook`)
    } catch (dbError) {
      console.error('Failed to update user in DB:', dbError)
      return new Response('Database error', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
      const { id } = evt.data
      if (id) {
          const { eq } = await import('drizzle-orm')
          try {
              await db.delete(users).where(eq(users.id, id))
              console.log(`User ${id} deleted from database via Clerk webhook`)
          } catch (dbError) {
              console.error('Failed to delete user in DB:', dbError)
          }
      }
  }

  return new Response('', { status: 200 })
}
