import { Role } from "./role.enum";

export type CurrentUser = {
    id: number;
    role: Role
}