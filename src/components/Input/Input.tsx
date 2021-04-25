import useStateIfMounted from 'hooks/useStateIfMounted';
import React, { useEffect, memo, ChangeEvent, FocusEvent, forwardRef, ReactNode } from 'react';
import { conditionalStyles } from 'utils/conditionalStyles';
import styles from './Input.module.scss';

/**
 * Input component for receiving text-based user input.
 * Uses the normal onChange, onBlur, and onFocus handler props.
 * Optionally provides sanitizeOnChange & sanitizeOnBlur to clean up user input
 * before calling the corresponding onChangeSanitized and onBlurSanitized handler props.
 *
 * Order of precedence for determing input errors:
 * 1.. Any custom input validation provided
 * 2.. "This field is required" error (show on empty input)
 *
 * Order of precedence for determing input captions:
 * 1. Max input length reached
 * 2. Any caption provided
 *
 */
interface Props {
  id: string,
  label: string,
  value: string,
  type?: HTMLInputElement['type'],
  required?: boolean,
  disabled?: boolean,
  maxLength?: number,
  caption?: string,
  list?: string,
  children?: ReactNode,
  autoComplete?: string,
  onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void,
  onChangeSanitized?: (value: string) => void,
  onBlur?: (e: FocusEvent<HTMLInputElement>, value: string) => void,
  onBlurSanitized?: (e: FocusEvent<HTMLInputElement>, value: string) => void,
  onFocus?: (e: FocusEvent<HTMLInputElement>, value: string) => void,
  validate?: (value: string) => string,
  sanitizeOnChange?: (value: string) => string,
  sanitizeOnBlur?: (value: string) => string,
  hasErrorCallback?: (...args: any[]) => any,
  validateOnBlur?: boolean,
  validateOnChange?: boolean,
}

const Input = forwardRef<HTMLInputElement, Props>(({
  id,
  value,
  type = 'text',
  required = false,
  disabled = false,
  maxLength = Infinity,
  label = '',
  caption = '',
  list = '',
  children = null,
  autoComplete = "off",
  onChange,
  onChangeSanitized,
  onBlur,
  onBlurSanitized,
  onFocus,
  hasErrorCallback,
  sanitizeOnChange,
  sanitizeOnBlur,
  validate,
  validateOnBlur,
  validateOnChange,
  ...rest
}, ref) => {
  const [error, setError] = useStateIfMounted('');

  caption = (maxLength && value.length === maxLength)
    ? `${maxLength} character limit reached` : caption;

  useEffect(() => {
    if (hasErrorCallback) hasErrorCallback(!!error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className={styles.InputContainer}>
      <input
        placeholder=" "
        list={list}
        autoComplete={autoComplete}
        id={id}
        ref={ref}
        type={type || 'text'}
        value={value}
        aria-required={!!required}
        disabled={disabled}
        maxLength={maxLength}
        className={conditionalStyles([
          styles.Input,
          [styles.InputError, !!error]
        ])}
        onChange={(e) => {
          // sanitize input
          const inputValue = e.target.value;
          const sanitizedInputValue = sanitizeOnChange ? sanitizeOnChange(inputValue) : inputValue;

          // call any onChange functions
          if (onChangeSanitized) onChangeSanitized(sanitizedInputValue);
          if (onChange) onChange(e, inputValue);
          if (validate && validateOnChange) {
            setError(validate(sanitizedInputValue));
          }
        }}
        onBlur={(e) => {
          // sanitize input
          const inputValue = e.target.value || value;
          const sanitizedInputValue = sanitizeOnBlur ? sanitizeOnBlur(inputValue) : inputValue;
          if (onChangeSanitized && sanitizedInputValue !== inputValue) onChangeSanitized(sanitizedInputValue);

          // validate with sanitized value
          let newError = error;
          if (sanitizedInputValue.length < 1 && required) newError = 'This field is required';
          if (validate && validateOnBlur) newError = validate(sanitizedInputValue);
          if (newError !== error) setError(newError);

          // call any onBlur functions
          if (onBlurSanitized) onBlurSanitized(e, sanitizedInputValue);
          if (onBlur) onBlur(e, inputValue);
        }}
        onFocus={(e) => {
          if (error) setError('');
          if (onFocus) onFocus(e, value);
        }}
        {...rest}
      />
      <label htmlFor={id} className={styles.Label}>{label}</label>
      {(error || caption) && (
        <div role={error ? 'alert' : ''}>
          <p>{error || caption}</p>
        </div>
      )}
      {children}
    </div>
  );
})

export default memo(Input);
