import React, { useState, useEffect } from "react";
import {
  Text,
  FontFamily,
  FontSize,
  FontWeight,
} from "app/components/atoms/text";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import {
  StyledCard,
  StyledContainer,
  StyledTitle,
  ToggleDiv,
  StyledCardContent,
} from "./style";
import { colorList } from "consts/color";
import { privatePaths } from "consts/paths";
import { ServerConstantKeys, useServerConstants } from "apiCalls/dashboard";
import Proposals from "../proposals";
import { Button } from "app/components/atoms/mybutton";
import { generatePath, useHistory } from "react-router-dom";
import Notify from "utils/notification";
import { getProjectBriefList } from "apiCalls/projectBriefing";
import { brandShowProposals } from "apiCalls/proposalManagement";
import { ChevronDown, ChevronUp } from "@styled-icons/bootstrap";
import { GetConstantValues } from "../getConstantValues";
import NoContent from "app/components/atoms/noContent";
import { SearchField } from "../searchField";

//for brand

export default function ProjectList() {
  const [loading, setLoading] = useState(false);
  const [showProposal, setShowProposal] = useState<any>({});
  const [projects, setProjects] = useState<any>([]);
  const [proposal, setProposal] = useState<object>({});
  const [searchedProjectsData, setSearchedProjectsData] = useState<any>([]);

  const [serverConstants] = useServerConstants(
    ServerConstantKeys.projectBriefingTypes
  );

  const { t } = useTranslation();
  const history = useHistory();

  const handleViewProject = (id: string) => {
    return () => {
      history.push(
        generatePath(privatePaths.viewProject, {
          screenName: "marketplace",
          id,
        })
      );
    };
  };

  const handleShowProposals = async (id: string) => {
    setLoading(true);
    try {
      const proposals = await brandShowProposals({ projectId: id });
      const obj = {};
      obj[id.toString()] = proposals;
      setProposal(obj);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Notify({
        title: t(translations.ERROR_NOTIFY.BRAND_PROPOSAL),
        message: "error",
        type: "danger",
      });
    }
  };
  const handleButtonLabel = (id: string) => {
    return () => {
      setShowProposal((obj: any) => {
        return { ...obj, [id]: !obj[id] };
      });
      handleShowProposals(id);
    };
  };

  const brandProposalsList = async () => {
    setLoading(true);
    try {
      const projects = await getProjectBriefList();
      setProjects(projects);
      setSearchedProjectsData(projects);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Notify({
        title: t(translations.ERROR_NOTIFY.BRAND_PROPOSAL),
        message: "error",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    brandProposalsList();
  }, []);

  const handleSearch = (items) => {
    setSearchedProjectsData(items);
  };

  return (
    <StyledContainer>
      {projects.length > 0 && (
        <SearchField
          searchArray={projects}
          searchKeys={["name"]}
          handleSearch={handleSearch}
        />
      )}

      <div className="list">
        {searchedProjectsData?.length ? (
          searchedProjectsData.map((item, i) => (
            <StyledCard key={i} >
              <StyledCardContent>
                <div onClick={handleViewProject(item._id)} className="first-container">
                  <div>
                    <StyledTitle onClick={handleViewProject(item._id)}>
                      <Text
                        family={FontFamily.Inter}
                        size={FontSize.ExtraRegular}
                        weight={FontWeight.SemiBold}
                        color={colorList.blue7}
                      >
                        {item.name}
                      </Text>
                    </StyledTitle>
                    <div className="divider" />
                    {item.briefType ? (
                      <Text
                        family={FontFamily.Inter}
                        size={FontSize.Mini}
                        color={colorList.grey3}
                      >
                        <GetConstantValues
                          serverConstantKey={
                            ServerConstantKeys.projectBriefingTypes
                          }
                          value={item.briefType}
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
                  </div>
                </div>

                <div>

                  <Button
                    textColor={
                      item?.proposalsReceived
                        ? colorList.blue1
                        : colorList.grey4
                    }
                    color={colorList.white1}
                    borderColor={colorList.grey4}
                    paddingHorizontal={"1rem"}
                    text={
                      t(translations.BUTTONS.PROPOSALS_RECIEVED) +
                      " " +
                      item.proposalsReceived
                    }
                    onClick={handleButtonLabel(item._id)}
                    disabled={item?.proposalsReceived === 0 ? true : false}
                    rendorRightIcon={() => {
                      if (showProposal[item._id]) {
                        return (
                          <ChevronUp
                            style={{ marginLeft: "0.5rem" }}
                            size={15}
                            className="weight"
                          />
                        );
                      } else {
                        return (
                          <ChevronDown
                            style={{ marginLeft: "0.5rem" }}
                            size={15}
                            className="weight"
                          />
                        );
                      }
                    }}
                  ></Button>
                </div>
              </StyledCardContent>
              <ToggleDiv>
                {showProposal[item._id] && proposal && (
                  <Proposals items={proposal[item._id.toString()]} />
                )}
              </ToggleDiv>
            </StyledCard>
          ))
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
      </div>
    </StyledContainer>
  );
}
