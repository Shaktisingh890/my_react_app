import { IDropdown, useServerConstants } from "apiCalls/dashboard";
import { FontFamily, FontSize, Text } from "app/components/atoms/text";
import { colorList } from "consts/color";
import { t } from "i18next";
import { translations } from "locales/translations";
import React, { useEffect } from "react";
import { ReactElement, useState } from "react";
import {
  Container,
  LeftConainer,
  RightContainer,
  SelectedOption,
  SelectFromItem,
  StyledContainer,
  StyledIcon,
  StyledIconPlus,
} from "./style";

export default function SingleSelectType2Component(props): ReactElement {
  const [serverConstants] = useServerConstants(props.ServerConstantKey);

  const [selected, setSelected] = useState<IDropdown>();
  const [errors, setErrors] = useState<string>("");
  const [validInput, setValidInput] = useState<boolean>(false);

  useEffect(() => {
    if (props.handleDropdownChange && selected) {
      props.handleDropdownChange(selected?.value);
    }
  }, [selected]);

  useEffect(() => {
    props.handleValidationCheck && props.handleValidationCheck(validInput);
  }, [validInput]);

  useEffect(() => {
    if (props.selected && serverConstants) {
      const selectedItem = serverConstants.find(
        (i) => i.value === props.selected
      );
      if (selectedItem) {
        setSelected(selectedItem);
      }

      props.schema && checkValidation(selectedItem?.value);
    }
  }, [props.selected, serverConstants]);

  const onSelect = (item) => {
    return () => {
      setSelected(item);

      props.schema && checkValidation(item.value);
    };
  };

  const onRemove = () => {
    return () => {
      setSelected(undefined);

      props.schema && checkValidation(undefined);
    };
  };

  const checkValidation = (value: any) => {
    props.schema?.isValid(value).then(function (valid: boolean) {
      setValidInput(valid);
    });

    props.schema?.validate(value).catch(function (err: any) {
      setErrors(err.errors[0]);
    });
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
        <LeftConainer>
          {serverConstants
            .filter((i: IDropdown) => selected?.value != i.value)
            .map((item: IDropdown, index: number) => (
              <SelectFromItem
                key={index + "_" + item.value}
                onClick={onSelect(item)}
              >
                {item.label} <StyledIconPlus></StyledIconPlus>
              </SelectFromItem>
            ))}
        </LeftConainer>

        <RightContainer>
          {selected ? (
            <SelectedOption>
              {selected.label}
              <StyledIcon onClick={onRemove()}></StyledIcon>
            </SelectedOption>
          ) : (
            <div className="emptyContainer">
              <Text
                family={FontFamily.Inter}
                size={FontSize.ExtraSmall}
                color={colorList.grey1}
              >
                {t(translations.FORM_LABELS.SELECT_ITEM_FROM_LEFT)}
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
