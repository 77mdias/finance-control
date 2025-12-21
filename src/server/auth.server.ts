import { createServerFn } from '@tanstack/react-start'

import { prisma } from '@/db'
import { INACTIVITY_DELETION_DAYS } from '@/lib/auth-constants'
import { requireUser } from '@/lib/session'

const MS_PER_DAY = 1000 * 60 * 60 * 24

function scheduleDeletionDate() {
  return new Date(Date.now() + INACTIVITY_DELETION_DAYS * MS_PER_DAY)
}

export const touchUserActivity = createServerFn({ method: 'POST' }).handler(async ({ request }) => {
  const user = await requireUser(request)
  const now = new Date()

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: now,
      deletionScheduledAt: scheduleDeletionDate(),
      isDisabled: false,
    },
    select: {
      id: true,
      lastLoginAt: true,
      deletionScheduledAt: true,
      isDisabled: true,
    },
  })

  return updated
})
