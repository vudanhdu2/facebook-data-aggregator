import { UID } from "./uid"

export interface ImportPostParam {
    file_name: string
    posts: any[]
    uid: string
    user_id: number
    data_type_id: number
    account_type_id: number
    file_size: number
}