import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionService from '../services/ListTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const listTransactionService = new ListTransactionService();
  const transactions = await listTransactionService.execute();

  return response.status(200).json(transactions);
});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({title, value, type, category})

  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  const deleteTransactionService = new DeleteTransactionService()

  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(request.file.path)

    return response.json(transactions);
  }
);

export default transactionsRouter;
