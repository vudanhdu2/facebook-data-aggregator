import { FileDetail } from "./FileDetail"

export interface DetailFileResponse {
    total: number
    totalPages: number
    currentPage: number
    data: FileDetail[]
    
}