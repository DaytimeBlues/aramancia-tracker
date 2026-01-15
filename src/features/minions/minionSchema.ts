import { z } from 'zod';

export const MINION_NAME_MAX = 50;
export const MINION_AC_MAX = 30;

export const minionSchema = z.object({
  id: z.string().min(1),
<<<<<<< HEAD
  name: z.string().min(1).max(MINION_NAME_MAX),
  hp: z.number().finite().nonnegative(),
  ac: z.number().finite().min(0).max(MINION_AC_MAX),
});

export const minionListSchema = z.array(minionSchema);
=======
  type: z.enum(['Skeleton', 'Zombie']),
  name: z.string().min(1).max(50),
  hp: z.object({
    current: z.number().int().min(0).max(9999),
    max: z.number().int().min(1).max(9999),
  }),
  ac: z.number().int().min(0).max(30),
  notes: z.string().max(500),
});

export const UpdateMinionActionSchema = z.object({
  payload: z.object({
    id: z.string().min(1),
    changes: z.object({
      name: z.string().min(1).max(50).optional(),
      hp: z.object({
        current: z.number().int().min(0).max(9999),
        max: z.number().int().min(1).max(9999),
      }).optional(),
      ac: z.number().int().min(0).max(30).optional(),
      notes: z.string().max(500).optional(),
    }),
  }),
});
>>>>>>> origin/copilot/sub-pr-54

export type Minion = z.infer<typeof minionSchema>;
