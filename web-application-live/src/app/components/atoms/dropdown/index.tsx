import React, { ReactElement, useEffect, useState } from "react";
import { Text, FontFamily, FontSize } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { StyledContainer, StyledSelect } from "./style";
import { Container } from "../inputField/style";
import { useTranslation } from "react-i18next";
import { ServerConstantKeys, useServerConstants } from "apiCalls/dashboard";

export interface IOptionType {
  label: string;
  value: string;
}

interface IDropdownProps {
  dropdownList?: IOptionType[];
  handleDropdownChange?: Function;
  defaultValue?: string;
  label?: string;
  required?: boolean;
  schema?: any;
  handleValidationCheck?: Function;
  useServerConstant?: ServerConstantKeys;
  disabled?: boolean;
}

export default function Dropdown(props: IDropdownProps): ReactElement {
  const {
    dropdownList,
    handleDropdownChange,
    defaultValue,
    label,
    required,
    schema,
    handleValidationCheck,
    useServerConstant = null,
    disabled = false,
  } = props;

  const [selectedValue, setSelectedValue] = useState("");
  const [validInput, setValidInput] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [list, setList] = useState<IOptionType[]>([]);
  const [serverConstants] = useServerConstants(useServerConstant);

  const { t } = useTranslation();

  const handleChange = (e: any) => {
    const { value } = e.target;
    setSelectedValue(value);
    handleDropdownChange && handleDropdownChange(value);
    schema && checkValidation(value);
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
      setSelectedValue(defaultValue);
      schema && checkValidation(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    setList(dropdownList || serverConstants);
  }, [dropdownList, serverConstants]);

  useEffect(() => {
    handleValidationCheck && handleValidationCheck(validInput);
  }, [validInput, selectedValue]);

  return (
    <Container>
      {label && (
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
      )}
      <StyledSelect
        value={selectedValue}
        onChange={handleChange}
        valid={checkValidity()}
        disabled={disabled}
      >
        <option value="" disabled>
          Select your option
        </option>
        {list?.map((item, index) => (
          <option value={item.value} key={index}>
            {item.label}
          </option>
        ))}
      </StyledSelect>

      {errors.length > 0 && !validInput && (
        <Text
          family={FontFamily.Inter}
          size={FontSize.Mini}
          color={colorList.red1}
          styles={{ marginTop: "0.2rem" }}
        >
          {t(errors)}
        </Text>
      )}
    </Container>
  );
}
