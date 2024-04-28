import React, { useEffect, useState } from "react";
import { StyledTextArea, StyledContainer, StyledWrapper } from "./style";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import { useTranslation } from "react-i18next";

interface ITextAreaProps {
  handleTextAreaChange?: Function;
  schema?: any;
  defaultValue?: string;
  placeholder?: string;
  text?: string;
  label?: string;
  required?: boolean;
  rows?: number;
  cols?: number;
  maxCharacters?: number;
  handleValidationCheck?: Function;
}

export const TextArea = (props: ITextAreaProps) => {
  const {
    handleTextAreaChange,
    schema,
    defaultValue,
    placeholder,
    text,
    label,
    required = false,
    rows,
    cols,
    maxCharacters,
    handleValidationCheck,
  } = props;

  const [enteredInput, setEnteredInput] = useState("");
  const [validInput, setValidInput] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [remainingChar, setRemainingChar] = useState<number>(0);

  const { t } = useTranslation();

  const checkContentValidation = (value: any) => {
    schema?.isValid(value).then(function (valid: boolean) {
      setValidInput(valid);
    });

    schema?.validate(value).catch(function (err: any) {
      setErrors(err.errors[0]);
    });
  };

  const checkCharacterLeft = (value: any) => {
    if (maxCharacters) {
      setRemainingChar(maxCharacters - value.length);
    }
  };

  const onChange = (event: any) => {
    const { value } = event.target;
    setEnteredInput(value);

    schema && checkContentValidation(value);
    handleTextAreaChange && handleTextAreaChange(value);
    maxCharacters && checkCharacterLeft(value);
  };

  const checkValidity = () => {
    if (schema && errors.length > 0 && !validInput) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (defaultValue && defaultValue?.length > 0) {
      setEnteredInput(defaultValue);
      schema && checkContentValidation(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (maxCharacters) {
      setRemainingChar(maxCharacters);
      defaultValue && checkCharacterLeft(defaultValue);
    }
  }, [maxCharacters]);

  useEffect(() => {
    handleValidationCheck && handleValidationCheck(validInput);
  }, [validInput, enteredInput]);

  return (
    <div>
      {label && (
        <StyledWrapper>
          <StyledContainer>
            <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
              {label}
            </Text>
            {required && (
              <Text size={FontSize.ExtraSmall} color={colorList.red1}>
                *
              </Text>
            )}
          </StyledContainer>
          {maxCharacters && (
            <Text
              size={FontSize.ExtraSmall}
              color={colorList.grey1}
              weight={FontWeight.Light}
            >
              {`${remainingChar} characters left`}
            </Text>
          )}
        </StyledWrapper>
      )}
      <StyledTextArea
        value={enteredInput || text}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        valid={checkValidity()}
        maxLength={maxCharacters}
      />
      {errors.length > 0 && !validInput && (
        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          color={colorList.red1}
        >
          {t(errors)}
        </Text>
      )}
    </div>
  );
};
