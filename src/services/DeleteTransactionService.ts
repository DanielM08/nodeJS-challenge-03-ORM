import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository'
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionsRepository.findOne(id);

    if(!transaction){
      throw new AppError("Transaction doesn't exists");
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
