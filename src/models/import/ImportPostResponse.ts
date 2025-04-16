export interface ImportPostResponse {
    uploaded_file_id: number
    inserted_count: number
    skipped_count: number
    inserted_post_uids: string[]
    skipped_post_uids: string[]
}