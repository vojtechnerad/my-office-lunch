import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  primaryKey,
  text,
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
  icon: text('icon'),
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

export const groupRestaurantVotes = pgTable('group_restaurant_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  groupId: uuid('group_id')
    .notNull()
    .references(() => groups.id),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  vote: varchar('vote', { length: 10 })
    .$type<'preferred' | 'neutral' | 'unwanted'>()
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
