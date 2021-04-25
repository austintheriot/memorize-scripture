type ClassName = string;
type Condition = boolean | undefined;
type ConditionPair = string | [ClassName] | [ClassName, Condition];
type StateClassArray = ConditionPair[];
type ConditionalStyles = (...any: StateClassArray[]) => string;

/**
 * Given an array of conditions and classnames, returns a string
 * containing any of the classnames whose conditions were true. 
 * If no condtion is supplied, the classname is kept.
 */
export const conditionalStyles: ConditionalStyles = (array) =>
  array.filter((el) => !Array.isArray(el) || el[1] === undefined || el[1])
    .map((el) => !Array.isArray(el) ? el : el[0]).join(' ');
