export interface BookData {
    title: string;
    author: string;
    isbn: string;
    category: string;
    notes: string | null;
}

export interface RepositoryBook {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    inventory: number;
    notes: string | null;
}

export interface GetResponse {
    result: Boolean,
    books: RepositoryBook[]
}

export interface CreateResponse {
    result: Boolean;
}

export interface DeleteResponse {
    result: Boolean;
    message: string;
}

export interface Query {
    titles?: string[];
    authors?: string[];
    categories?: string[];
}
export interface DatabaseClient {
    getByIsbn(id: string): Promise<RepositoryBook | Error>;
    getAll(): Promise<RepositoryBook[] | Error>;
    getAvailableBooks(): Promise<RepositoryBook[] | Error>;
    filter(searchObject: object): Promise<RepositoryBook[] | Error>;
    delete(id: string): Promise<DeleteResponse | Error>;
    create(books: BookData[]): Promise<RepositoryBook[] | Error>;
}
