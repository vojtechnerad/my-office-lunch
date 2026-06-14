CREATE TABLE "groups_to_favorite_restaurants" (
	"group_id" uuid NOT NULL,
	"restaurant_id" uuid NOT NULL,
	CONSTRAINT "groups_to_favorite_restaurants_group_id_restaurant_id_pk" PRIMARY KEY("group_id","restaurant_id")
);
--> statement-breakpoint
ALTER TABLE "groups_to_favorite_restaurants" ADD CONSTRAINT "groups_to_favorite_restaurants_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups_to_favorite_restaurants" ADD CONSTRAINT "groups_to_favorite_restaurants_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;