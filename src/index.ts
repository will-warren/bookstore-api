import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { BookData, DeleteResponse, RepositoryBook, Query, DatabaseClient, GetResponse } from './types';
import { DbClient } from './database-client';

type Credentials = {
    username: string;
    password: string;
}
const app:Application = express();
const port:number = 8888;
const userCreds:Credentials = {
    username: 'bookstore',
    password: 'user'
}

const validParams:string[] = ['title', 'author', 'category']
const dbClient:DatabaseClient = new DbClient()

app.use(cors());
app.use(express.json());

const validateAuth = (req:Request, res:Response, next:NextFunction) => {
    if(req.headers.authorization === undefined) {
        return res.status(401).send("Unauthorized");
    }

    let credentials = `Basic ${Buffer.from(`${userCreds.username}:${userCreds.password}`).toString('base64')}`;

    if(credentials !== req.headers.authorization) {
        return res.status(403).send("Forbidden");
    }

    next();
}

app.use(validateAuth);


app.get('/books/', async (req: Request, res: Response, next:NextFunction) => {
    if(Object.keys(req.query).length === 0) {
        let books:RepositoryBook[] | Error = [];
        try{
            books = await dbClient.getAll();
        } catch(error) {
            res.status(500).send(error)
        }

        return res.send(books);
    }
    // query  
    if(Object.keys(req.query).filter(key => !validParams.includes(key)).length !== 0) {
        return res.status(400).send('No Valid Query Params Found');
    }
    const query:Query = {
        titles: req.query.title !== undefined ?(<string>req.query.title).split(';') : undefined,
        authors: req.query.author !== undefined ? (<string>req.query.author).split(';') : undefined,
        categories: req.query.author !== undefined ? (<string>req.query.category).split(';') : undefined,
    }

    let filteredBooks:RepositoryBook[] | Error = []

    try {
        filteredBooks = await dbClient.filter(query);
    } catch (error) {
        res.send(500).send(error);
    }

    return res.send(filteredBooks);
});

app.get('/available-books/', async (req: Request, res: Response) => {
      const available_books: RepositoryBook[] | Error = await dbClient.getAvailableBooks();
      if(available_books instanceof Error) {
          return res.status(500).send(available_books);
      }

      if(available_books.length == 0) {
          return res.status(404).send('No available books found');
      }

      return res.send(available_books);
});

app.get('/books/:isbn', async (req: Request, res: Response) => {
    const this_book = await dbClient.getByIsbn(req.params.isbn);

    if (this_book.toString() === 'Error: Book Not Found') {
        return res.status(404).send(this_book.toString());
    }

    return res.send(this_book);
});

app.post('/books', async (req: Request, res: Response) => {
    let booksCreated:BookData[] | Error =  await dbClient.create(req.body);
    if(booksCreated instanceof Error) {
        return res.status(500).send('Internal Server Error');
    }
    return res.status(201).send(booksCreated)
});

app.delete('/books/:id', async (req: Request, res: Response) => {
    const isDeleted :DeleteResponse | Error = (await dbClient.delete(req.params.id));
    console.log(isDeleted);
    if(isDeleted instanceof Error) {
        return res.status(500).send('Internal Server Error');
    }

    if(isDeleted.result) {
        return res.status(204).send(isDeleted.message);      
    } else {
        return res.status(404).send(isDeleted.message)
    } 
});

app.listen(port, () => 
    console.log('Bookstore API listening on port 8888'),    
);