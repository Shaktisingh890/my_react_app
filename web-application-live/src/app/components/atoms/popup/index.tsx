import React, { useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

interface IPopupProps {
  trigger?: JSX.Element | ((isOpen: boolean) => JSX.Element);
  children?: any;
  position?: any;
  on?: any;
  arrow?: boolean;
  mouseLeaveDelay?: number;
  mouseEnterDelay?: number;
  innerRef?: any;
  open?: boolean;
  modal?: boolean;
  onClose?: any;
  closeOnDocumentClick?: boolean;
  style?: any;

}

export default function PopUp(props: IPopupProps) {
  let {
    trigger,
    children,
    position = "bottom left",
    on,
    arrow = false,
    mouseLeaveDelay = 300,
    mouseEnterDelay = 0,
    innerRef,
    open,
    modal = false,
    onClose,
    closeOnDocumentClick = true,
    style,
  } = props;

  return (
    <Popup
      trigger={trigger}
      position={position}
      repositionOnResize={true}
      on={on}
      closeOnDocumentClick={closeOnDocumentClick}
      mouseLeaveDelay={mouseLeaveDelay}
      mouseEnterDelay={mouseEnterDelay}
      contentStyle={style || defaultStyle}
      arrow={arrow}
      ref={innerRef}
      open={open}
      modal={modal}
      onClose={onClose}
    >
      {children}
    </Popup>
  );
}

const defaultStyle = { padding: "0", border: "none" };
