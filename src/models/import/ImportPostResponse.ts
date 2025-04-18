export interface ImportCommonResponse {
    uploaded_file_id: number
    inserted_count: number
    skipped_count: number
    inserted_uids: string[]
    skipped_uids: string[]
}