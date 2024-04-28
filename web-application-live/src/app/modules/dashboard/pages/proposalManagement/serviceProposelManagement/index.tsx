import React, { useCallback, useEffect, useState } from "react";
import { Check } from "@styled-icons/bootstrap";
import { Button } from "app/components/atoms/mybutton";

import {
  StyledCard,
  StyledCardContent,
  ViewButton,
  ProposelButton,
  ButtonContainer,
  Divider,
  MarginBottom,
  StyledContainer,
  Margin
} from "./style";
import { colorList } from "consts/color";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { getServiceProvidersList } from "apiCalls/proposalManagement";
import Notify from "utils/notification";
import { privatePaths } from "consts/paths";
import PopUp from "app/components/atoms/popup";
import EditProposelCoverLetter from "../editProposalCoverLetter";
import { generatePath, useHistory } from "react-router-dom";
import {
  getConstantLabel,
  ServerConstantKeys,
  useServerConstants,
} from "apiCalls/dashboard";
import { GetConstantValues } from "app/components/molecules/getConstantValues";
import NoContent from "app/components/atoms/noContent";
import { SearchField } from "app/components/molecules/searchField";

export default function ServiceProposelManagement({ item }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [proposals, setProposals] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [searchedProposalData, setSearchedProposalData] = useState<any>([]);

  const { t } = useTranslation();
  const history = useHistory();

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const renderTick = () => {
    return (
      <Check
        style={{ marginLeft: "0.2rem" }}
        size={23}
        color={colorList.green1}
        className="weight"
      />
    );
  };

  const serviceProvidersProposalsList = async () => {
    setLoading(!isOpen);
    try {
      const proposals = await getServiceProvidersList();
      setProposals(proposals);
      setSearchedProposalData(proposals);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProposals([]);
      setSearchedProposalData([]);
      Notify({
        title: t(translations.ERROR_NOTIFY.SERVICE_PROVIDER_PROPOSAL),
        message: "error",
        type: "danger",
      });
    }
  };

  const handleViewProject = (id: string) => {
    return () => {
      history.push(
        generatePath(privatePaths.viewProject, {
          screenName: "marketplace",
          id: id,
        })
      );
    };
  };

  const handleShowProposal = (id: string, status: string) => {
    return async () => {
      setSelectedId(id);
      setIsOpen(true);
      setStatus(status);
    };
  };

  useEffect(() => {
    serviceProvidersProposalsList();
  }, []);

  const handleSearch = (items) => {
    setSearchedProposalData(items);
  };

  const handlePayments = (id: string) => {
    return () => {
      history.push(
        generatePath(privatePaths.payments, { id: id })
      );
    }
  }

  return (
    <StyledContainer>
      <PopUp
        modal={false}
        position="bottom right"
        open={isOpen && !!selectedId}
        onClose={onClose}
        closeOnDocumentClick={false}
      >
        {selectedId && (

          <EditProposelCoverLetter
            onClose={onClose}
            id={selectedId}
            status={status}
            showInvoice={""}
          />

        )}
      </PopUp>

      {proposals.length > 0 && (
        <SearchField
          searchArray={proposals}
          searchKeys={["projectId.name"]}
          handleSearch={handleSearch}
        />
      )}

      <StyledCard>
        {searchedProposalData?.length > 0 ? (
          searchedProposalData?.map((item: any, index: number) => {
            return (
              <StyledCardContent key={index}>
                <div className="first-container">
                  <div>
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraRegular}
                      weight={FontWeight.SemiBold}
                      color={colorList.blue7}
                    >
                      {item.projectId.name}
                    </Text>
                    <div className="divider" />

                    {item.projectId.briefType ? (
                      <Text
                        family={FontFamily.Inter}
                        size={FontSize.Mini}
                        color={colorList.grey3}
                      >
                        <GetConstantValues
                          serverConstantKey={
                            ServerConstantKeys.projectBriefingTypes
                          }
                          value={item.projectId.briefType}
                        />
                      </Text>
                    ) : (
                      <NoContent />
                    )}

                    <div className="divider" />
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.Mini}
                      color={colorList.grey3}
                    >
                      {item.brandId.businessName}
                    </Text>
                    <div className="divider" />
                    {item?.isHiringDone && (
                      <Button
                        textColor={colorList.green1}
                        color={colorList.variant16}
                        borderColor={colorList.green1}
                        padding={"0.1px"}
                        borderRadius={"0.4rem"}
                        fontSize={FontSize.Small}
                        text={t(translations.BUTTONS.HIRED)}
                        rendorRightIcon={renderTick}
                      ></Button>
                    )}
                  </div>
                </div>
                <ButtonContainer>

                  <ViewButton onClick={handleViewProject(item?.projectId?._id)}>
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraSmall}
                      color={colorList.white1}
                      weight={FontWeight.Bold}
                    >
                      {t(translations.BUTTONS.VIEW_PROJECT)}
                    </Text>
                  </ViewButton>
                  <Margin />
                  {/* <Divider /> */}
                  {item?.isHiringDone && (
                    <ViewButton onClick={handlePayments(item?._id)}>
                      <Text
                        family={FontFamily.Inter}
                        size={FontSize.ExtraSmall}
                        color={colorList.white1}
                        weight={FontWeight.Bold}
                      >
                        {"Payments"}
                      </Text>
                    </ViewButton>

                  )}

                  <Margin />
                  {/* <Divider /> */}
                  <ProposelButton
                    onClick={handleShowProposal(item?._id, item?.status)}
                  >
                    <Text
                      family={FontFamily.Inter}
                      size={FontSize.ExtraSmall}
                      color={colorList.blue1}
                      weight={FontWeight.Bold}
                    >
                      {t(translations.BUTTONS.SHOW_PROPOSAL)}
                      {/* {item?.isHiringDone
                        ? t(translations.COVER_LETTER.SEND_INVOICE)
                        : t(translations.BUTTONS.SHOW_PROPOSAL)} */}
                    </Text>
                  </ProposelButton>
                </ButtonContainer>
              </StyledCardContent>
            );
          })
        ) : (
          <div className="center">
            <Text
              family={FontFamily.Inter}
              size={FontSize.Small}
              weight={FontWeight.Light}
            >
              {t(translations.GENERIC.NO_DATA_FOUND)}
            </Text>
          </div>
        )}
      </StyledCard>
    </StyledContainer>
  );
}
