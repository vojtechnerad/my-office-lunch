import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 255 }),
  dailyMenuUrl: varchar('daily_menu_url', { length: 255 }),
});

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  adminUserId: uuid('admin_user_id')
    .notNull()
    .references(() => users.id),
});

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const groupsToFavoriteRestaurants = pgTable(
  'groups_to_favorite_restaurants',
  {
    groupId: uuid('group_id')
      .notNull()
      .references(() => groups.id),
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.restaurantId] })],
);
