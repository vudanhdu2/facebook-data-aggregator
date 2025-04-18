import { UID } from "./uid"

export interface ImportStatsParam {
    file_name: string
    stats: any[]
    uid: string
    user_id: number
    data_type_id: number
    account_type_id: number
    file_size: number
    relation_type: string
    type: string
}