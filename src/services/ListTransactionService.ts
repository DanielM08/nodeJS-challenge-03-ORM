import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository'
import Category from '../models/Category';

interface Response {
  transactions : transactionDTO[],
  balance: Balance
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface transactionDTO {
  id: string,
  title: string,
  value: number,
  type: "income" | "outcome",
  category?: categoryDTO,
  created_at: Date,
  updated_at: Date
}

interface categoryDTO{
  id?: string,
  title?: string,
  created_at?: Date,
  updated_at?: Date
}

class ListTransactionService {
  public async execute(): Promise<Response> {
    try{
      const transactionsRepository = getCustomRepository(TransactionRepository);
      const categoriesRepository = getRepository(Category);

      const balance = await transactionsRepository.getBalance();

      const transactions = await transactionsRepository.find();

      let response: transactionDTO[] = [];

      await Promise.all(transactions.map( async transaction => {

        const category = await categoriesRepository.findOne(transaction.category_id);

        const newCategory : categoryDTO = {
          id: category?.id,
          title: category?.title,
          created_at: category?.created_at,
          updated_at: category?.updated_at
        };

        const newTransaction: transactionDTO = {
          id: transaction.id,
          title: transaction.title,
          value: transaction.value,
          type: transaction.type,
          category: newCategory,
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }

        response.push(newTransaction);
      }));

      return {transactions: response , balance}

    }catch(err){
      throw new AppError('Unable to create a new transaction');
    }
  }
}

export default ListTransactionService;
