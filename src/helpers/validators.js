import {
    all,
    allPass,
    any,
    compose,
    converge,
    equals,
    filter,
    includes,
    invert,
    length,
    lte,
    not,
    prop,
    propEq,
    propOr,
    values
} from "ramda";

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (input) => {
    return allPass([
        propEq('star', 'red'),
        propEq('square', 'green'),
        propEq('triangle', 'white'),
        propEq('circle', 'white'),
    ])(input);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (input) => {
    return compose(lte(2), length, propOr([], 'green'), invert)(input);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (input) => {
    const prop = propOr([]);
    const redsLength = compose(length, prop('red'));
    const bluesLength = compose(length, prop('blue'));
    const equalsLengths = converge(equals, [redsLength, bluesLength]);

    return compose(equalsLengths, invert)(input);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (input) => {
    return allPass([
        propEq('circle', 'blue'),
        propEq('star', 'red'),
        propEq('square', 'orange'),
    ])(input);
};

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = (input) => {
    const equalsWhite = equals('white');
    const notWhite = compose(not, equalsWhite);

    return compose(equals(3), length, filter(notWhite), values)(input);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (input) => {
    const includeTriangle = includes('triangle');
    const lengthTwo = compose(equals(2), length);
    const greenProp = propOr([], 'green');
    const equalsRed = equals('red');

    return allPass([
        compose(allPass([includeTriangle, lengthTwo]), greenProp, invert),
        compose(any(equalsRed), values),
    ])(input);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (input) => {
    return compose(all(equals('orange')), values)(input);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (input) => {
    const equalsWhite = equals('white');
    const equalsRed = equals('red');
    const starProp = prop('star');

    return allPass([
        compose(not, equalsRed, starProp),
        compose(not, equalsWhite, starProp),
    ])(input);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (input) => {
    return compose(all(equals('green')), values)(input);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (input) => {
    const equalsWhite = equals('white');
    const triangleProp = prop('triangle');
    const squareProp = prop('square');

    return allPass([
        converge(equals, [triangleProp, squareProp]),
        compose(not, equalsWhite, triangleProp),
        compose(not, equalsWhite, squareProp),
    ])(input);
};
