import { ServerConstantKeys, useServerConstants } from "apiCalls/dashboard";
import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import { privatePaths } from "consts/paths";
import React, { ReactElement, useState } from "react";
import { generatePath, useHistory } from "react-router-dom";
import { routesNames } from "router/routeNames";
import {
  BriefTypeCard,
  BriefTypeCardContainer,
  Container,
  ProjectBriefingDescription,
} from "./style";

export default function SelectNewBrief(): ReactElement {

  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [projectBriefingTypes] = useServerConstants(
    ServerConstantKeys.projectBriefingTypes
  );
  const [projectBriefingDescription] = useServerConstants(
    ServerConstantKeys.projectBriefingDescription
  );

  const history = useHistory();

  const handleStartButton = () => {
    history.push(
      generatePath(privatePaths.createProjectBriefingForm, {
        briefType:
          selected !== undefined && selected > -1
            ? projectBriefingTypes[selected].value
            : "",
      })
    );
  };

  return (
    <Container>
      <div>
        <h3>Select project type:</h3>
      </div>
      <BriefTypeCardContainer>
        {projectBriefingTypes.map(({ label }, index: number) => (
          <BriefTypeCard
            key={index}
            selected={selected === index}
            onClick={() => setSelected(index)}
          >
            {label}
          </BriefTypeCard>
        ))}
      </BriefTypeCardContainer>
      <ProjectBriefingDescription>
        {selected !== undefined && selected > -1
          ? "Expanter Tips: " + projectBriefingDescription[selected].label
          : ""}
      </ProjectBriefingDescription>
      <div style={{ width: "100%", margin: "20px auto", textAlign: "center" }}>
        <Button
          textColor={colorList.white1}
          color={colorList.blue1}
          borderColor={colorList.blue1}
          paddingHorizontal={"2.5rem"}
          text={"Start"}
          disabled={selected === undefined}
          onClick={handleStartButton}
        ></Button>
      </div>
    </Container>
  );
}
