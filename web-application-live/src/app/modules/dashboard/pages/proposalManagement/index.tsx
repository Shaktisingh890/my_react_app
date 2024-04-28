import React, { ReactElement, useEffect, useState } from "react";
import { StyledContainer, StyledContainer1 } from "./style";
import ProjectList from "app/components/molecules/projectListing";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import ServiceProposelManagement from "./serviceProposelManagement";
import { getFromLocalStorage } from "localStorage";

export default function ProposalManagement(): ReactElement {
  const [userType, setUserType] = useState<string>("");

  useEffect(() => {
    setUserType(getFromLocalStorage("userRole"));
  }, []);

  const { t } = useTranslation();
  const item1 = {
    _id: "123566",
    name: "Project 1",
    briefType: "iiiiiiiiiTYpe",
    projectType: "project type 1",
    brandName: "brand name 1",
    proposalsReceived: 0,
    brandId: {
      businessName: "business name",
    },
  };

  const item2 = {
    _id: "123566",
    name: "Project 2",
    projectType: "project type 2",
    brandName: "brand name 2",
    proposalsReceived: 3,
    brandId: {
      businessName: "business name",
    },
  };
  const item3 = {
    _id: "123566",
    name: "Project 3",
    briefType: "iiiiiiiiiTYpe",
    projectType: "project type 2",
    brandName: "brand name 2",
    proposalsReceived: 2,
    brandId: {
      businessName: "business name",
    },
  };

  const renderList = () => {
    return (
      <>
        {userType === "brand" && <ProjectList />}
        {userType === "serviceProvider" && (
          <StyledContainer1>
            <ServiceProposelManagement item={item3} />
          </StyledContainer1>
        )}
      </>
    );
  };

  return (
    <div>
      <StyledContainer>
        <Text
          family={FontFamily.Inter}
          size={FontSize.ExtraRegular}
          weight={FontWeight.Light}
        >
          {t(translations.PROPOSALS.PROPOSALS_TITLE)}
        </Text>
      </StyledContainer>

      {renderList()}
    </div>
  );
}
