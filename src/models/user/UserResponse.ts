import { Pagination } from "../response/Pagination"
import { UserData } from "./UserData"

export interface UserResponse {
    users: UserData[]
    pagination: Pagination
}