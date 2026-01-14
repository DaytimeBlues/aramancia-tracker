import { z } from 'zod';

export const MinionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['Skeleton', 'Zombie']),
  name: z.string().min(1).max(50),
  hp: z.number().int().min(0).max(9999),
  maxHp: z.number().int().min(1).max(9999),
  ac: z.number().int().min(0).max(30),
  notes: z.string().max(500),
});

export const UpdateMinionActionSchema = z.object({
  payload: z.object({
    id: z.string().min(1),
    changes: z.object({
      name: z.string().min(1).max(50).optional(),
      hp: z.number().int().min(0).max(9999).optional(),
      maxHp: z.number().int().min(1).max(9999).optional(),
      ac: z.number().int().min(0).max(30).optional(),
      notes: z.string().max(500).optional(),
    }),
  }),
});

export type Minion = z.infer<typeof MinionSchema>;
