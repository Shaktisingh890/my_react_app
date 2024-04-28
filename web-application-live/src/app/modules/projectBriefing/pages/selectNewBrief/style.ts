import { Button } from "app/components/atoms/mybutton";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  background: #eff2fc;
  flex: 1;
  height: 80%;
  padding: 16px 32px;
  flex-direction: column;
  height: 90vh;
`;

interface IBriefTypeCardProps {
  selected: boolean;
}

export const BriefTypeCard = styled.div<IBriefTypeCardProps>`
  height: 125px;
  width: 200px;
  background: #fff;
  margin: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  border: ${(props: any) => (props.selected ? "1px solid blue" : "none")};
`;

export const ProjectBriefingDescription = styled.div`
  color: #2b353f;
`;

export const BriefTypeCardContainer = styled.div`
  align-content: flex-start;
  display: flex;
  flex: 1;
  overflow: scroll;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;
