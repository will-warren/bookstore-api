import { BookData, GetResponse, DeleteResponse, RepositoryBook, CreateResponse } from './types';

export class BookRepository {
    private books:RepositoryBook[] = [ 
        { 
            id: 1, 
            title: "Fundamentals of Wavelets", 
            author: "Goswami, Jaideva", 
            isbn: "3726362789", 
            category: "nonfiction", 
            inventory: 9, 
            notes: null 
        }, 
        { 
            id: 2, 
            title: "Age of Wrath, The", 
            author: "Eraly, Abraham", 
            isbn: "3876253647", 
            category: "nonfiction", 
            inventory: 0, 
            notes: "Backordered until the end of the year" 
        }, 
        { 
            id: 3, 
            title: "Slaughterhouse Five", 
            author: "Vonnegut, Kurt", 
            isbn: "09283746523", 
            category: "fiction", 
            inventory: 3, 
            notes: null 
        }, 
        { 
            id: 4, 
            title: "Moon is Down, The", 
            author: "Steinbeck, John", 
            isbn: "37463567283", 
            category: "fiction", 
            inventory: 12, 
            notes: null 
        }, 
        { 
            id: 5, 
            title: "Dylan on Dylan", 
            author: "Dylan, Bob", 
            isbn: "28710924383", 
            category: "nonfiction", 
            inventory: 12, 
            notes: null 
        }, 
        { 
            id: 6, 
            title: "Journal of a Novel", 
            author: "Steinbeck, John", 
            isbn: "239847201093", 
            category: "fiction", 
            inventory: 8, 
            notes: "Reorder in November" 
        } 
    ];

    public getBooks():GetResponse {
        return {result: true, books: this.books};
    }

    public getAvailableBooks():Promise<GetResponse> {
        const availableBooks = this.books.filter(book => book.inventory > 0);
        const response:GetResponse = {result: true, books:availableBooks}
        return new Promise<GetResponse>((resolve, reject) => resolve(response));
    }

    public queryBooksByAuthor(author:string):Promise<GetResponse> {
        const books = this.books.filter(book => book.author === author);
        const response:GetResponse = {result: true, books:books}
        return new Promise<GetResponse>((resolve, reject) => resolve(response));
    }

    public queryBooksByTitle(title:string):Promise<GetResponse> {
        const books = this.books.filter(book => book.title === title);
        const response:GetResponse = {result: true, books:books}
        return new Promise<GetResponse>((resolve, reject) => resolve(response));
    }

    public queryBooksByIsbn(isbn:string):Promise<GetResponse> {
        const books = this.books.filter(book => book.isbn === isbn);
        const response:GetResponse = {result: true, books:books}
        return new Promise<GetResponse>((resolve, reject) => resolve(response));
    }

    public queryBooksByGenre(genre:string):Promise<GetResponse> {
        const books = this.books.filter(book => book.category === genre);
        const response:GetResponse = {result: true, books:books}
        return new Promise<GetResponse>((resolve, reject) => resolve(response));
    }

    public addBooks(bookList:BookData[]):Promise<CreateResponse> {
        bookList.forEach(bookData => {
            const bookInInventory = this.books.find(book => book.isbn === bookData.isbn);
            if(bookInInventory === undefined) {
                const newBook:RepositoryBook = {
                    id: this.books.length + 1,
                    title: bookData.title,
                    author: bookData.author,
                    isbn: bookData.isbn,
                    category: bookData.category,
                    inventory: 1,
                    notes: bookData.notes
                }

                this.books.push(newBook);
            } else {
                bookInInventory.inventory = bookInInventory.inventory + 1;
            }
        });
        const response:CreateResponse = { result: true };
        return new Promise<CreateResponse>((resolve, reject) => resolve(response));
    }

    public removeBook(bookIsbn:string):Promise<DeleteResponse> {
        let bookToRemove: RepositoryBook | undefined = this.books.find(book => book.isbn === bookIsbn);
        let response: DeleteResponse;
        if(bookToRemove === undefined) {
            response = {result: false, message: "book not found"};
        } else if(bookToRemove.inventory > 0) {
            bookToRemove.inventory = bookToRemove.inventory - 1;
            response = {result: true, message: "book removed"};
        } 
        return new Promise<DeleteResponse>((resolve, reject) => resolve(response));
    }


}