import {ValidatorConstraint} from "class-validator";
import {Injectable} from "@nestjs/common";

//
// @ValidatorConstraint({ name: 'NameIsExist', async: false })
// @Injectable()
// export class NameIsExistConstraint implements ValidatorConstraintInterface {
//     constructor(private readonly usersRepository: UsersRepository) {}
//     async validation(value: any, args: ValidationArguments) {
//         const nameIsExist = await this.usersRepository.nameIsExist(value);
//         return !nameIsExist;
//     }
//
//     defaultMessage(validationArguments?: ValidationArguments): string {
//         return 'Name already exist';
//     }
// }
//
// export function NameIsExist(
//     property?: string,
//     validationOptions?: ValidationOptions,
// ) {
//     return function (object: Object, propertyName: string) {
//         registerDecorator({
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             constraints: [property],
//             validator: NameIsExistConstraint,
//         });
//     };
// }