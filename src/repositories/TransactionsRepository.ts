import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    try{

      const transactions = await this.find();

      const balanceInit:Balance = {
        income: 0,
        outcome: 0,
        total: 0,
      }

      const balance = transactions.reduce((arr, cur) => {
        if(cur.type === 'income'){
          arr.income += cur.value;
          arr.total += cur.value;
        }
        else{
          arr.outcome += cur.value;
          arr.total -= cur.value;
        }
        return arr;
      }, balanceInit);

      return balance;
    }catch(err){
      throw new AppError('Unable to get balance');
    }
  }
}

export default TransactionsRepository;
