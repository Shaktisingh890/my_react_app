import { IDropdown, useServerConstants } from "apiCalls/dashboard";
import { FontFamily, FontSize, Text } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { t } from "i18next";
import { translations } from "locales/translations";
import React, { useEffect } from "react";
import { ReactElement, useState } from "react";
import {
  StyledContainer,
  Container,
  LeftConainer,
  SelectFromItem,
  StyledIconPlus,
  RightContainer,
  SelectedOption,
  StyledIcon,
} from "./style";
export default function MultiSelectType2Component(props): ReactElement {
  const [serverConstants] = useServerConstants(props.ServerConstantKey);
  const [addedOptions, addOptions] = useState<IDropdown[]>([]);
  const [errors, setErrors] = useState<string>("");
  const [validInput, setValidInput] = useState<boolean>(false);

  useEffect(() => {
    if (props.handleDropdownChange) {
      props.handleDropdownChange(addedOptions.map((i) => i.value));
    }
  }, [addedOptions]);

  useEffect(() => {
    props.handleValidationCheck && props.handleValidationCheck(validInput);
  }, [validInput]);

  useEffect(() => {
    if (
      addedOptions.length === 0 &&
      props &&
      props.selected &&
      Array.isArray(props.selected) &&
      serverConstants &&
      props.selected.length > 0
    ) {
      addOptions(
        serverConstants.filter((i) => props.selected.indexOf(i.value) > -1)
      );
      props.schema &&
        checkValidation(
          serverConstants.filter((i) => props.selected.indexOf(i.value) > -1)
        );
    }
  }, [props.selected]);

  const checkValidation = (value: any) => {
    props.schema?.isValid(value).then(function (valid: boolean) {
      setValidInput(valid);
    });

    props.schema?.validate(value).catch(function (err: any) {
      setErrors(err.errors[0]);
    });
  };

  useEffect(() => {
    if (
      addedOptions.length === 0 &&
      props &&
      props.selected &&
      Array.isArray(props.selected) &&
      serverConstants &&
      props.selected.length > 0
    ) {
      addOptions(
        serverConstants.filter((i) => props.selected.indexOf(i.value) > -1)
      );
    }
  }, [serverConstants]);

  const onSelect = (item) => {
    return () => {
      addOptions(
        addedOptions.find((i) => i.value === item.value)
          ? addedOptions
          : [...addedOptions, item]
      );
      props.schema &&
        checkValidation(
          addedOptions.find((i) => i.value === item.value)
            ? addedOptions
            : [...addedOptions, item]
        );
    };
  };

  const onRemove = (item) => {
    return () => {
      addOptions(addedOptions.filter((i: IDropdown) => item.value !== i.value));

      props.schema &&
        checkValidation(
          addedOptions.filter((i: IDropdown) => item.value !== i.value)
        );
    };
  };

  return (
    <div>
      {props.title && (
        <StyledContainer>
          <Text family={FontFamily.Inter} size={FontSize.ExtraSmall}>
            {props.title}
          </Text>
          {props.required && (
            <Text size={FontSize.ExtraSmall} color={colorList.red1}>
              *
            </Text>
          )}
        </StyledContainer>
      )}

      <Container>
        {serverConstants?.length !== addedOptions.length && (
          <LeftConainer>
            {serverConstants
              .filter(
                (i: IDropdown) => !addedOptions.find((o) => o.value === i.value)
              )
              .map((item: IDropdown, index: number) => (
                <SelectFromItem
                  key={index + "_" + item.value}
                  onClick={onSelect(item)}
                >
                  {item.label} <StyledIconPlus></StyledIconPlus>
                </SelectFromItem>
              ))}
          </LeftConainer>
        )}

        <RightContainer>
          {addedOptions.length > 0 ? (
            addedOptions.map((item: IDropdown, index) => (
              <SelectedOption key={index + "_option_"}>
                {item.label}
                <StyledIcon onClick={onRemove(item)}></StyledIcon>
              </SelectedOption>
            ))
          ) : (
            <div className="emptyContainer">
              <Text
                family={FontFamily.Inter}
                size={FontSize.ExtraSmall}
                color={colorList.grey1}
              >
                {t(translations.FORM_LABELS.SELECT_ITEMS_FROM_LEFT)}
              </Text>
            </div>
          )}
        </RightContainer>
      </Container>
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
}
