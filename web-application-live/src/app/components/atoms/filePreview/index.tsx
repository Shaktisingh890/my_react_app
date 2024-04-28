import React from "react";
import { images } from "assets/images";
import { StyledTag, AlignedTag, SpaceBetween, StyledText } from "./style";
import { FontFamily, FontSize, FontWeight } from "../text";
import { FileEarmarkText } from "@styled-icons/bootstrap";
import { colorList } from "consts/color";

function getImageType(mimeType) {
  if (mimeType.includes("image")) return "image";

  if (mimeType.includes("ppt")) return "ppt";

  if (mimeType.includes("pdf")) return "pdf";

  return "default";
}

function Thumbnail({ mimeType, original }) {
  const imageData = {
    image: original,
    pdf: images.pdf,
    ppt: images.ppt,
    default: "",
  };
  const pathUrl = imageData[getImageType(mimeType)];

  if (!pathUrl) return <FileEarmarkText color={colorList.darkGrey} size={22} />;

  return <img src={pathUrl} width="25" height="25" />;
}

export default function FilePreview(props: any) {
  const { docs, bgColor } = props;
  const handleFileOpen = (pathUrl: string) => {
    window.open(pathUrl, "_blank");
  };

  return (
    <AlignedTag>
      {docs.map((item, i) => {
        const label = item.name || "Document";
        return (
          <StyledTag
            onClick={() => handleFileOpen(item.original)}
            key={i}
            bgColor={bgColor}
          >
            <SpaceBetween>
              <StyledText
                family={FontFamily.Inter}
                weight={FontWeight.Medium}
                size={FontSize.ExtraSmall}
              >
                {label}
              </StyledText>
              <Thumbnail
                key={i}
                mimeType={item.mimeType}
                original={item.original}
              />
            </SpaceBetween>
          </StyledTag>
        );
      })}
    </AlignedTag>
  );
}
