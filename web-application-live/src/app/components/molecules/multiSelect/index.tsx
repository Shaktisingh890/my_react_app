import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { colorList } from "consts/color";
import {
  OptionContainer,
  SelectedItemsContainer,
  SelectedOption,
  StyledContainer,
  StyledIcon,
  StyledOption,
  StyledSelect,
} from "./style";
import PopUp from "app/components/atoms/popup";
import { Container } from "app/components/atoms/inputField/style";
import { useTranslation } from "react-i18next";
import { ServerConstantKeys, useServerConstants } from "apiCalls/dashboard";
import { ArrowDownLeftSquare, ChevronDown } from "@styled-icons/bootstrap";

export interface IOptionType {
  label: string;
  value: string;
}

interface IDropdownProps {
  dropdownList?: IOptionType[];
  handleDropdownChange?: Function;
  defaultValues?: string[];
  label?: string;
  required?: boolean;
  schema?: any;
  dropdownDefaultText?: string;
  handleValidationCheck?: Function;
  useServerConstant?: ServerConstantKeys;
  position?: string;
  sort?: boolean;
}

const formatDropdownItems = (
  allItems: IOptionType[],
  defaultValues?: string[]
) => {
  return allItems?.filter((item, index) => {
    if (defaultValues?.includes(item.value)) {
      return {
        label: allItems[index].label,
        value: allItems[index].value,
      };
    }
  });
};

export default function MultiSelect(props: IDropdownProps): ReactElement {
  const {
    dropdownList,
    handleDropdownChange,
    defaultValues,
    label,
    required,
    schema,
    sort,
    dropdownDefaultText = "Select items...",
    handleValidationCheck,
    useServerConstant = null,
    position = "bottom left",
  } = props;

  const [list, setList] = useState<IOptionType[]>([]);
  const [selectedList, setSelectedList] = useState<IOptionType[]>([]);
  const [remainingList, setRemainingList] = useState<IOptionType[]>([]);
  const [validInput, setValidInput] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [serverConstants] = useServerConstants(useServerConstant);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { t } = useTranslation();

  const filterRemainingOptions = (option: IOptionType) => {
    let tempList = [...remainingList];
    tempList = tempList.filter((item) => item.value !== option.value);
    setRemainingList(tempList);
  };

  const addRemainingOptions = (option: IOptionType) => {
    let tempList = [...remainingList];
    tempList.push(option);

    if (sort) {
      tempList = tempList.sort((a, b) => a.value > b.value ? 1 : -1);
    }
    setRemainingList(tempList);
  };

  const addSelectedOptions = (option: IOptionType) => {
    let tempList = [...selectedList];
    tempList.push(option);
    setSelectedList(tempList);

    handleDropdownChange && handleDropdownChange(tempList.map((i) => i.value));
    schema && checkValidation(tempList);
  };

  const filterSelectedOptions = (option: IOptionType) => {
    let tempList = [...selectedList];
    tempList = tempList.filter((item) => item.value !== option.value);
    setSelectedList(tempList);

    handleDropdownChange && handleDropdownChange(tempList.map((i) => i.value));
    schema && checkValidation(tempList);
  };

  const handleOptionSelect = (option: IOptionType) => {
    addSelectedOptions(option);
    filterRemainingOptions(option);
  };

  const handlePopup = () => {
    setShowPopup((f) => !f);
  };

  const handleOptionDeletion = (option: IOptionType) => {
    setShowPopup(false);
    addRemainingOptions(option);
    filterSelectedOptions(option);
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
    if (defaultValues && defaultValues?.length > 0) {
      const selectedValues = formatDropdownItems(list, defaultValues);
      setSelectedList(selectedValues);
      schema && checkValidation(selectedValues);
    }
  }, [defaultValues, list]);

  useEffect(() => {
    setList(dropdownList || serverConstants);
  }, [dropdownList, serverConstants]);

  useEffect(() => {
    if (list && list?.length > 0) {
      let selected = formatDropdownItems(list, defaultValues);
      var remaining = list.filter((x) => !selected.includes(x));
      setRemainingList(remaining);
    }
  }, [list]);

  useEffect(() => {
    if (remainingList && remainingList?.length === 0) {
      setShowPopup(false);
    }
  }, [remainingList]);

  useEffect(() => {
    handleValidationCheck && handleValidationCheck(validInput);
  }, [validInput, selectedList]);

  return (
    <Container>
      {label && (
        <StyledContainer>
          <Text
            family={FontFamily.Inter}
            size={FontSize.ExtraSmall}
            weight={FontWeight.Medium}
            color={colorList.grey2}
          >
            {label}
          </Text>
          {required && (
            <Text size={FontSize.ExtraSmall} color={colorList.red1}>
              *
            </Text>
          )}
        </StyledContainer>
      )}

      <PopUp
        position={position}
        open={showPopup}
        trigger={
          <SelectedItemsContainer valid={checkValidity()}>
            <StyledSelect onClick={handlePopup}>
              {selectedList.length > 0 ? (
                selectedList?.map((item, index) => (
                  <SelectedOption key={index}>
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraSmall}
                      color={colorList.grey2}
                    >
                      {item.label}
                    </Text>
                    <StyledIcon onClick={(e) => {
                      e.stopPropagation();
                      handleOptionDeletion(item)
                    }} />
                  </SelectedOption>
                ))
              ) : (
                <div className="selectText">
                  <Text
                    family={FontFamily.Inter}
                    size={FontSize.ExtraSmall}
                    color={colorList.grey3}
                    weight={FontWeight.Light}
                  >
                    {dropdownDefaultText}
                  </Text>
                </div>
              )}
            </StyledSelect>

            <ChevronDown
              size={15}
              color={colorList.blue1}

              className="weight"
            />
          </SelectedItemsContainer>
        }
      >
        {showPopup && (
          <OptionContainer>
            {remainingList.length > 0 ? (
              remainingList?.map((item, index) => (
                <StyledOption
                  key={index}
                  onClick={() => handleOptionSelect(item)}
                >
                  {item.label}
                </StyledOption>
              ))
            ) : (
              <div className="remainingText">
                <Text
                  family={FontFamily.Inter}
                  size={FontSize.ExtraSmall}
                  color={colorList.grey3}
                  weight={FontWeight.Light}
                >
                  Nothing to select...
                </Text>
              </div>
            )}
          </OptionContainer>
        )}
      </PopUp>

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
