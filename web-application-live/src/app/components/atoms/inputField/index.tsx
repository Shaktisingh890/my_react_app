import React, { useEffect, useState } from "react";
import {
  StyledInput,
  StyledContainer,
  StyledIcon,
  StyledPasswordInput,
  PasswordContainer,
  Container,
} from "./style";
import { Text, FontFamily, FontSize } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { useTranslation } from "react-i18next";

interface IInputProps {
  handleInputChange?: Function;
  type?: string;
  schema?: any;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  // ref?:string;
  multiple?: boolean;
  showEyeIcon?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  handleValidationCheck?: Function;
  subtitle?: string;
  showBorder?: boolean;
  id?: string;
  reset?: boolean;
  min?: string;
}

export const InputField = (props: IInputProps) => {
  const {
    handleInputChange,
    type = "text",
    schema,
    defaultValue,
    placeholder,
    label,
    required,
    accept,
    multiple,
    showEyeIcon = true,
    autofocus = false,
    disabled = false,
    handleValidationCheck,
    subtitle,
    showBorder = true,
    id,
    reset = false,
    min,
  } = props;

  const [enteredInput, setEnteredInput] = useState("");
  const [validInput, setValidInput] = useState<boolean>(false);
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const { t } = useTranslation();

  const togglePwd = () => {
    setShowPwd(!showPwd);
    var inputElement: any = document.getElementById(`pwdInput-${label}`);
    if (inputElement?.type === "password") {
      inputElement.type = "text";
    } else {
      inputElement.type = "password";
    }
  };

  const onChange = (event: any) => {
    const { value } = event.target;
    setEnteredInput(value);

    schema && checkValidation(value);
    handleInputChange && handleInputChange(value);
  };

  const checkValidation = (value: any) => {
    schema?.isValid(value).then(function (valid: boolean) {
      setValidInput(valid);
    });

    schema?.validate(value).catch(function (err: any) {
      setErrors(err.errors[0]);
    });
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
      schema && checkValidation(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (reset) {
      setEnteredInput("");
    }
  }, [reset]);

  useEffect(() => {
    handleValidationCheck && handleValidationCheck(validInput);
  }, [validInput, enteredInput]);

  return (
    <Container>
      {label && (
        <StyledContainer className="label">
          <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {label}
          </Text>
          {subtitle && (
            <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
              {subtitle}
            </Text>
          )}
          {required && (
            <Text size={FontSize.ExtraSmall} color={colorList.red1}>
              *
            </Text>
          )}
        </StyledContainer>
      )}

      {type === "password" && showEyeIcon ? (
        <PasswordContainer valid={checkValidity()}>
          <StyledPasswordInput
            type={type}
            value={enteredInput}
            onChange={onChange}
            placeholder={placeholder}
            valid={checkValidity()}
            disabled={disabled}
            id={`pwdInput-${label}`}
         
          />
          <div className="passwordIcon">
            <StyledIcon showPwd={showPwd} onClick={togglePwd} />
          </div>
        </PasswordContainer>
      ) : (
        <StyledInput
          type={type}
          min={min}
          
          value={enteredInput}
          onChange={onChange}
          placeholder={placeholder}
          valid={checkValidity()}
          accept={accept}
          multiple={multiple}
          autoFocus={autofocus}
          disabled={disabled}
          showBorder={showBorder}
          id={`input-${id}`}
        // ref={ref}
        />
      )}

      {errors.length > 0 && !validInput && (
        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          color={colorList.red1}
        >
          {t(errors)}
        </Text>
      )}
    </Container>
  );
};
