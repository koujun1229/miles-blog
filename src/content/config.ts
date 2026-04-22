import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  hasAffiliate: z.boolean().default(false), // 広告開示フラグ
  draft: z.boolean().default(false),
});

export const collections = {
  cards: defineCollection({
    type: 'content',
    schema: postSchema.extend({
      cardName: z.string(),          // カード名（例: "アメックスゴールドプリファード"）
      annualFee: z.number(),          // 年会費（円）
      pointRate: z.string(),          // 基本ポイント還元率
      rating: z.number().min(1).max(5),
    }),
  }),
  hotels: defineCollection({
    type: 'content',
    schema: postSchema.extend({
      hotelName: z.string(),
      hotelBrand: z.string().optional(), // "Hyatt", "Marriott" など
      location: z.string(),
      stayDate: z.coerce.date().optional(),
      pointsUsed: z.number().optional(), // 使用ポイント数
    }),
  }),
  strategy: defineCollection({
    type: 'content',
    schema: postSchema,
  }),
};
