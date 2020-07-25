import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title : string,
  value : number,
  type  : 'income' | 'outcome',
  category: string
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category} : Request): Promise<Transaction> {
    try{
      const transactionsRepository = getCustomRepository(TransactionRepository);
      const categoriesRepository = getRepository(Category);

      if(type === 'outcome'){
        const balance = (await transactionsRepository.getBalance()).total;
        if(value > balance){
          throw new AppError('Account balance is insufficient');
        }
      }

      let transactionCategory = await categoriesRepository.findOne({
        title: category,
      });

      if(!transactionCategory){
        transactionCategory = categoriesRepository.create({
          title: category,
        });

        await categoriesRepository.save(transactionCategory);
      }

      const transaction = transactionsRepository.create({
        title,
        type,
        value,
        category: transactionCategory,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }catch(err){
      if(err instanceof AppError){
        throw err;
      }
      throw new AppError('Unable to create a new transaction');
    }
  }
}

export default CreateTransactionService;
