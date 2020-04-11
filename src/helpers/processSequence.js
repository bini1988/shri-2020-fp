/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { __, allPass, assoc, compose, concat, curry, gt, ifElse, length, lt, mathMod, not, otherwise, partial, pipe, prop, startsWith, tap, test, toString } from "ramda";

const api = new Api();

export default ({value, writeLog, handleSuccess, handleError}) => {
    const then = fn => pr => pr.then(fn);
    const powTwo = curry(Math.pow)(__, 2);
    const tapWriteLog = tap(writeLog);
    const resultProp = prop('result');

    pipe(
        tapWriteLog,
        ifElse(
            allPass([
                compose(gt(10), length),
                compose(lt(2), length),
                compose(not, startsWith('-')),
                test(/^[0-9]+\.?[0-9]+$/i),
            ]),
            pipe(
                pipe(Number, Math.round, tapWriteLog),
                pipe(
                    assoc('number', __, { from: 10, to: 2 }),
                    api.get('https://api.tech/numbers/base'),
                    then(resultProp),
                    then(tapWriteLog),
                    then(length),
                    then(tapWriteLog),
                    then(powTwo),
                    then(tapWriteLog),
                    then(mathMod(__, 3)),
                    then(tapWriteLog),
                    then(toString),
                    then(concat('https://animals.tech/')),
                    then(api.get(__, null)),
                    then(resultProp),
                    then(handleSuccess),
                    otherwise(handleError),
                )
            ),
            partial(handleError, ['ValidationError']),
        )
    )(value);
};
