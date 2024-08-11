export type Response<T> = {
    success: boolean;
    result: T;
}

export type ListResponse<T> = Response<{items: Array<T>, total:number}>;