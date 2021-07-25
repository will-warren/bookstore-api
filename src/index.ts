import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { BookData } from './types';
import { DbClient } from './database-client';
import e from 'express';

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

const dbClient = new DbClient()

app.use(cors());
app.use(express.json());

// const validateParams = (req:Request, res:Response, next:NextFunction) => {
//     if(req.method === 'POST') {
//         // validate
//     }
//     next();
// }

// app.use(validateParams);

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
        const books:BookData[] = await dbClient.getAll();

        return res.send(books);
    }
    //if query params do filter
});

// app.get('/available-books/', async (req: Request, res: Response) => {
//    // check_auth();
//       const available_books: BookData[] = await dbClient.getAvailableBooks();
//       return res.send(available_books);
// });

// app.get('/books/:id', async (req: Request, res: Response) => {
//    // check_auth();
//     const this_book = await dbClient.getById(req.params.id);

//     if (this_book === undefined) {
//         return res.status(404).send({'message': `No book found for id ${req.params.id}`})
//     } else {
//         return res.send(this_book);
//     }
   
// });

// app.post('/books', async (req: Request, res: Response) => {
//   //  check_auth();
//   // check_params();
//     let booksCreated:BookData[] =  await dbClient.create(req.body);
//     return res.status(201).send(booksCreated)
// });

// app.delete('/books/:id', async (req: Request, res: Response) => {
 //   check_auth();

    // const isDeleted = await dbClient.delete(req.params.id);
    // if(isDeleted) {
    //     return res.status(204).send({'message': `Deleted Book ${req.params.id}`});
    // } else if(isDeleted === undefined) {
    //     return res.status(404).send({'message': `Book ${req.params.id} not found.`})
    // } else {
    //     // error
    // }
    
// });

app.listen(port, () => 
    console.log('app started and listening on port 8888'),    
);