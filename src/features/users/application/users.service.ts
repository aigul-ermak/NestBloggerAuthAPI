import {Injectable} from '@nestjs/common';
import {User} from '../domain/users.entity';

import {UsersRepository} from '../infrastructure/users.repository';
import {UserOutputModel, UserOutputModelMapper} from "../api/models/output/user.output.model";
import {UsersQueryRepository} from "../infrastructure/users.query-repository";
import {SortUserDto} from "../api/models/output/sort.user.dto";
import {PaginatedDto} from "../api/models/output/paginated.users.dto";


@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {
    }

    //
    // async findAll(): Promise<User[]> {
    //     return this.usersRepository.findAll();
    // }
    //
    // async findOneByEmail(email: string): Promise<User | null> {
    //     const user = await this.usersQueryRepository.findOneByEmail(email);
    //     if (user) {
    //         return user;
    //     }
    //     return null;
    // }
    //
    // async findOneByLogin(login: string): Promise<any | null> {
    //     const user = await this.usersRepository.findOneByLogin(login);
    //     if (user) {
    //         return user;
    //     }
    //     return null;
    // }

    // async deleteUserById(id: string): Promise<boolean> {
    //     return await this.usersRepository.deleteById(id);
    // }

    // async getAllUsers(
    //     sortData: SortUserDto
    // ): Promise<PaginatedDto<UserOutputModel>> {
    //     const sortBy = sortData.sortBy ?? 'createdAt';
    //     const sortDirection = sortData.sortDirection ?? 'desc';
    //     const pageNumber = sortData.pageNumber ?? 1;
    //     const pageSize = sortData.pageSize ?? 10;
    //     const searchLoginTerm = sortData.searchLoginTerm ?? null;
    //     const searchEmailTerm = sortData.searchEmailTerm ?? null;
    //
    //     let filter: any = {};
    //
    //     if (searchEmailTerm || searchLoginTerm) {
    //         filter['$or'] = [];
    //         if (searchEmailTerm) {
    //             filter['$or'].push({
    //                 'accountData.email':
    //                     {
    //                         $regex: searchEmailTerm,
    //                         $options: 'i'
    //                     }
    //             });
    //         }
    //         if (searchLoginTerm) {
    //             filter['$or'].push({
    //                 'accountData.login':
    //                     {
    //                         $regex: searchLoginTerm,
    //                         $options: 'i'
    //                     }
    //             });
    //         }
    //     }
    //
    //     if (!filter['$or']?.length) {
    //         filter = {};
    //     }
    //
    //     const users = await this.usersQueryRepository
    //         .findAll(filter, sortBy, sortDirection, (pageNumber - 1) * pageSize, pageSize);
    //     const totalCount = await this.usersQueryRepository.countDocuments(filter);
    //     const pageCount = Math.ceil(totalCount / pageSize);
    //
    //     return {
    //         pagesCount: pageCount,
    //         page: +pageNumber,
    //         pageSize: +pageSize,
    //         totalCount: totalCount,
    //         items: users.map(UserOutputModelMapper),
    //     }
    // }

}


