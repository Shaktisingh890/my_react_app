import { colorList } from "consts/color";
import styled from "styled-components";

interface IProps {
  isSender: boolean;
}

export const StyledContainer = styled.div`
  .hideDisplay {
    display: none;
  }

  .chat-card {
    background: ${colorList.white1};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 75.7vh;
    overflow: hidden;
    margin-right: 0.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 1.5rem;
  }

  .arrowLeftIcon {
    cursor: pointer;
    stroke: ${colorList.blue7};
    stroke-width: 1px;
  }

  .row-name {
    display: flex;
    flex-direction: column;
    max-width: 70%;

    & > *:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
  .show-underline {
    &:hover {
      text-decoration: underline;
    }
  }
  .tag {
    background: ${colorList.variant3};
    border-radius: 0.3125rem;
    padding: 0.3125rem 1rem;
    width: fit-content;
  }

  .border-divider {
    border-top: 1px solid ${colorList.variant2};
  }

  .paperclip {
    cursor: pointer;
    margin-right: 1rem;
  }

  .logo-container {
    background-color: white;
    border-radius: 50%;
    padding: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5.5rem;
    height: 5.5rem;
  }

  .small-logo-container {
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border: 1px solid ${colorList.variant3};
  }

  .row-start {
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 60%;
  }

  .column {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    & > *:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  }

  .dots-logo {
    cursor: pointer;
  }

  .button-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    padding: 0.5rem;

    & > *:not(:last-child) {
      margin-right: 1rem;
    }

    & > button {
      height: 2.8rem;
      width: 12rem;
    }

    .cloudArrowUpIcon {
      margin-left: 0.3rem;
      stroke: ${colorList.blue1};
      stroke-width: 0.8px;
    }
  }

  .chat-container {
    width: 100%;
    height: 100%;
    flex-direction: column;
    display: flex;
    align-items: space-between;
  }

  .chat-wrapper {
    height: 52vh;
    overflow-y: auto;
  }

  .text-wrapper {
    padding-right: 1.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
  }

  .sender-wrapper {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .receiver-wrapper {
    display: flex;
    width: 100%;
    justify-content: flex-start;
  }

  .text-area {
    width: 96%;
    box-sizing: border-box;
    height: 100%;
  }
`;

export const UserSmallLogo = styled.img`
  width: 2.8rem;
  height: 2.8rem;
  background-color: white;
  border-radius: 50%;
  object-fit: contain;
  border: 1px solid ${colorList.grey4};
`;

export const ChatWrapper = styled.div<IProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 1.5rem;
  max-width: 60%;
  width: 100%;
  justify-content: ${({ isSender }) => (isSender ? "flex-end" : "flex-start")};

  .sender {
    background-color: ${colorList.blue1};
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    margin: 0.625rem;

    white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    word-break: break-word;
    white-space: normal;
  }

  .receiver {
    background-color: ${colorList.grey5};
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    margin: 0.625rem;

    white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
    word-break: break-word;
    white-space: normal;
  }

  .media-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;

    & > *:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

export const StyledTextArea = styled.textarea`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  box-sizing: border-box;
  border-radius: 5px;
  outline: none;
  resize: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  width: 100%;
  color: ${colorList.grey2};
  background: ${colorList.white1};
  border: none;
  box-sizing: border-box;
  height: 100%;
`;
