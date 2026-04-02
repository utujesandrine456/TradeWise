import { registerEnumType } from "@nestjs/graphql";

export enum ENNotificationTimeFilters {
    Read = "read",
    Recent = "recent",
    Unread = "unread",
    Old = "old"
}

registerEnumType(ENNotificationTimeFilters, {
  name: "ENNotificationTimeFilters"
});
