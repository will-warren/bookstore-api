import {BookData, DatabaseClient, GetResponse, DeleteResponse, CreateResponse, RepositoryBook, Query } from './types.js';
import { BookRepository } from './book-repository.js';
import { response } from 'express';


export class DbClient implements DatabaseClient {

    private dbClient:BookRepository;

    constructor() {
        this.dbClient = new BookRepository();
    }

    public async getByIsbn(isbn: string): Promise<RepositoryBook | Error> {
        let response:GetResponse;
        try {
            response =  await this.dbClient.queryBooksByIsbn(isbn);
        } catch (error) {
            throw(error);
        }

        let foundBook = response.books.shift();
        if (foundBook === undefined) {
            return new Error('Book Not Found');
        }

        return foundBook;     
    }

    public async getAll(): Promise<RepositoryBook[] | Error> {
        let response:GetResponse;
        try {
            response =  await this.dbClient.getBooks()
        } catch (error) {
            throw(error)
        }

        return response.books;
    }

    public async getAvailableBooks(): Promise<RepositoryBook[] | Error> {
        let response:GetResponse;
        try {
            response =  await this.dbClient.getAvailableBooks()
        } catch (error) {
            throw(error)
        }

        return response.books;
    }

    public filter(query:Query): Promise<RepositoryBook[] | Error> {
        let bookResults: RepositoryBook[] = []
        if(query.titles !== undefined) {
            let foundBooks:RepositoryBook[] = []
            query.titles?.forEach(async title  => {
                console.log(title)
                let response:GetResponse;
                try {
                    response = await this.dbClient.queryBooksByTitle(title);
                } catch(error) {
                    throw(error)
                }
                foundBooks.concat(response.books);
            });

            bookResults = this.addBookIfNotInList(bookResults, foundBooks);
        }

        if(query.authors !== undefined) {
            // search by author
            let foundBooks:RepositoryBook[] = []
            query.authors?.forEach(async author  => {
                let response:GetResponse;
                try {
                    response = await this.dbClient.queryBooksByAuthor(author);
                } catch(error) {
                    throw(error)
                }
                foundBooks.concat(response.books);
            });

            bookResults = this.addBookIfNotInList(bookResults, foundBooks);
        }

        if(query.categories !== undefined) {
            // search by category
            let foundBooks:RepositoryBook[] = []
            query.categories?.forEach(async category  => {
                let response:GetResponse;
                try {
                    response = await this.dbClient.queryBooksByGenre(category)
                } catch(error) {
                    throw(error)
                }
                foundBooks.concat(response.books);
            });

            bookResults = this.addBookIfNotInList(bookResults, foundBooks);
        }

        console.log('all books', bookResults)
        return new Promise<RepositoryBook[]>((resolve, reject) => resolve(bookResults));
    }

    public async delete(isbn: string): Promise<DeleteResponse | Error> {
        let response:DeleteResponse;
        try {
            response =  await this.dbClient.removeBook(isbn)
        } catch (error) {
            throw(error)
        }

        return response;
    }

    public  async create(books: BookData[]): Promise<RepositoryBook[] | Error> {
        let response:CreateResponse;
        try {
            response = await this.dbClient.addBooks(books);            
        } catch (error) {
            throw(error)
        }

        if(response.result) {
            const books = (await this.dbClient.getBooks()).books
            return books;
        }

        return new Promise<RepositoryBook[]>((resolve, reject) => reject(Error));

        
    }

    private addBookIfNotInList(bookResults:RepositoryBook[], foundBooks:RepositoryBook[]) {
        foundBooks.forEach(book => {
            if(bookResults.find(resultBook => book.isbn === resultBook.isbn) === undefined) {
                bookResults.push(book);
            }
        });

        return bookResults;
    }
    
}