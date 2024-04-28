import { ServerConstantKeys } from "apiCalls/dashboard";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import {
  createProjectApi,
  editProjectApi,
  getProjectData,
  IProjectFormFields,
} from "apiCalls/projectBriefing";
import { InputField } from "app/components/atoms/inputField";
import { Button } from "app/components/atoms/mybutton";
import {
  FontFamily,
  FontSize,
  FontWeight,
  Text,
} from "app/components/atoms/text";
import { TextArea } from "app/components/atoms/textArea";
import MultiSelect from "app/components/molecules/multiSelect";
import MultiSelectType2Component from "app/components/molecules/multiSelectType2Component";
import SingleSelectType2Component from "app/components/molecules/singleSelectType2Component";
import { colorList } from "consts/color";
import { privatePaths } from "consts/paths";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Notify from "utils/notification";
import { images } from "assets/images";
import { Container, Footer, Header, RowContainer } from "./style";
import { getFromLocalStorage } from "localStorage";
import { CheckboxButtons } from "app/components/molecules/checkboxButtons";
import { fileUploadApi, getUserProfileDetail } from "apiCalls/profile";
import { requiredArraySchema, requiredSchema } from "schema";
import { FileUpload } from "app/components/molecules/fileUpload";
import { IFileType } from "app/modules/profile/createProfile/brandForm";

export interface IProjectValidFields {
  name: boolean;
  briefType: boolean;
  brandOverview: boolean;
  wayOfOperation?: boolean;
  objective: boolean;
  industryExperience: boolean;
  segmentExperience: boolean;
  teamSize: boolean;
  experience: boolean;
  budgetTypes: boolean;
  retainerBased: boolean;
  projectBased: boolean;
  startingTimeline: boolean;
}
// {
//   "name": "string",
//   "hideBrandDetails": true,
//   "briefType": "managementConsulting",
//   "brandOverview": "string",
//   "projectOverview": "string",
//   "wayOfOperation": [
//     "directApproach"
//   ],
//   "objective": [
//     "string"
//   ],
//   "requirements": {
//     "industryExperience": [
//       "string"
//     ],
//     "segmentExperience": [
//       "luxury"
//     ],
//     "languageSpoken": [
//       "abkhaz"
//     ],
//     "teamSize": "none",
//     "experience": "none",
//     "chinaOfficeLocation": [
//       "hong kong"
//     ]
//   },
//   "budgetTypes": [
//     "retainerBased"
//   ],
//   "budget": {
//     "retainerBased": "notSure",
//     "projectBased": "notSure"
//   },
//   "startingTimeline": "notSure",
//   "isPublished": true,
//   "isPublic": true,
//   "docs": [
//     {
//       "fileType": "string",
//       "mimeType": "string",
//       "original": "string",
//       "thumbnail": "string",
//       "name": "string",
//       "_id": "string"
//     }
//   ],
//   "notes": "string",
//   "status": "string"
//}
export default function ProjectBriefingForm(): ReactElement {
  const { id, briefType }: any = useParams();

  const initialProjectState = {
    name: "",
    briefType,
    brandOverview: "",
    wayOfOperation: [],
    objective: [],
    requirements: {
      industryExperience: [],
      segmentExperience: [],
      languageSpoken: [],
      teamSize: "",
      experience: "",
      chinaOfficeLocation: [],
    },
    budgetTypes: [],
    budget: {
      retainerBased: "",
      projectBased: "",
    },
    startingTimeline: "",
    isPublished: false,
    hideBrandDetails: false,
    notes: "",
    docs: [],
  };

  const initialProjectValidState = {
    name: false,
    briefType: false,
    brandOverview: false,
    objective: false,
    industryExperience: false,
    segmentExperience: false,
    teamSize: false,
    experience: false,
    budgetTypes: false,
    retainerBased: true,
    projectBased: true,
    startingTimeline: false,
  };

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formFields, setFormFields] =
    useState<IProjectFormFields>(initialProjectState);
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState<string>("");
  const [validFields, setValidFields] = useState<IProjectValidFields>(
    initialProjectValidState
  );
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const [docsLoading, setDocsLoading] = useState<boolean>(false);

  const { t } = useTranslation();
  const history = useHistory();

  const brandInfo = [
    {
      label: t(translations.PROJECT_BRIEFING.HIDE_BRAND_INFO),
      value: "hideBrandDetails",
      selected: formFields.hideBrandDetails || false,
    },
  ];

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getProjectData(id)
        .then((resp: any) => {
          const formObj: any = {};
          for (const key in resp) {
            if (key in initialProjectState) {
              formObj[key] = resp[key];
            }
          }

          setFormFields(formObj);

          if (resp.docs.length > 0) {
            setUploadedFiles(resp.docs);
          }

          setLoading(false);
        })
        .catch((error) => {
          Notify({
            title: t(translations.ERROR_NOTIFY.PROJECT_DETAILS),
            message: error,
            type: "danger",
          });
          setFormFields(initialProjectState);
          setLoading(false);
        });
    } else {
      setIsEdit(false);
    }
  }, [id]);

  const getBrandName = async () => {
    try {
      const role = getFromLocalStorage("userRole");
      const resp = await getUserProfileDetail(role);
      setBrandName(resp.businessName);
    } catch {
      setBrandName("");
    }
  };

  useEffect(() => {
    getBrandName();
  }, []);

  const updateFormField = (key, value) => {
    const newFormField = { ...formFields };
    let objectToUpdate = newFormField;
    const keys = key.split(".");
    keys.forEach((element, index) => {
      if (index === keys.length - 1) {
        objectToUpdate[element] = value;
      } else {
        objectToUpdate = objectToUpdate[element];
      }
    });
    setFormFields(newFormField);
  };

  const handleValid = (label: string, valid: boolean) => {
    setValidFields((f) => ({
      ...f,
      [label]: valid,
    }));
  };

  const setValid = (key) => (value) => handleValid(key, value);

  const set = (key) => (value) => updateFormField(key, value);

  useEffect(() => {
    setDisableButton(Object.values(validFields).includes(false));
  }, [validFields]);

  useEffect(() => {
    setValidFields((f) => ({
      ...f,
      briefType: formFields.briefType?.length > 0,
    }));
  }, [formFields.briefType]);

  const createProject = async (isPublish) => {
    try {
      setLoading(true);
      let tempList: any = { ...formFields };
      tempList.docs = uploadedFiles;


      const response = isEdit
        ? await editProjectApi(id, tempList)
        : await createProjectApi(tempList);

      setLoading(false);
      if (isPublish !== true) {
        history.push(privatePaths.dashboardBreifing);

        isEdit
          ? Notify({
            title: t(translations.PROJECT_BRIEFING.SAVE_EDIT),
            message: "",
            type: "success",
          })
          : Notify({
            title: t(translations.PROJECT_BRIEFING.SAVE_CREATE),
            message: "",
            type: "success",
          });
      }

      return response;
    } catch (error) {
      Notify({
        title: t(translations.ERROR_NOTIFY.CREATE_PROJECT),
        message: error + "",
        type: "danger",
      });
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const handleCheckChange = (val) => {
    let tempFields = { ...formFields };
    tempFields.hideBrandDetails = val[0]?.selected;
    setFormFields(tempFields);
  };

  const handleObjectiveChange = (val) => {
    let tempArray: string[] = [];
    let tempFields = { ...formFields };
    tempArray.push(val);
    tempFields.objective = tempArray;
    setFormFields(tempFields);
  };

  const handleAdditionalInfoChange = async (value: File[]) => {
    setDocsLoading(true);
    Promise.all(
      Array.from(value).map((url) => fileUploadApi(url).then((e) => e))
    )
      .then((data) => {
        let tempFiles = [...uploadedFiles];
        data.map((i) => tempFiles.push(i));
        setUploadedFiles(tempFiles);
        setDocsLoading(false);
      })
      .catch((error) => {
        Notify({
          title: t(translations.ERROR_NOTIFY.FILE),
          message: error,
          type: "danger",
        });
        setDocsLoading(false);
      });
  };

  const handleFileDeletion = (value: IFileType) => {
    setUploadedFiles(
      uploadedFiles.filter((i: IFileType) => {
        if (value._id) {
          return i._id !== value._id;
        }
        return i.original !== value.original;
      })
    );
  };

  return (
    <Container>
      <Header>
        <div onClick={handleBackClick}>
          <Text
            family={FontFamily.Inter}
            size={FontSize.Small}
            weight={FontWeight.Medium}
            color={colorList.blue1}
          >
            <img src={images.arrowLeft} height="15px" width="15px" />
            {/* &lt; */}
            <span className="spacing">
              {t(translations.CREATE_PROFILE.BACK)}
            </span>
          </Text>
        </div>
      </Header>

      <div className="form-container">
        <Text
          family={FontFamily.Inter}
          weight={FontWeight.Medium}
          size={FontSize.ExtraRegular}
          styles={customStyles.text2}
        >
          {isEdit
            ? t(translations.PROJECT_BRIEFING.EDIT_PROJECT)
            : t(translations.PROJECT_BRIEFING.CREATE_NEW_PROJECT)}
        </Text>

        <InputField
          label={t(translations.PROJECT_BRIEFING.TITLE)}
          defaultValue={formFields.name}
          required
          subtitle={t(translations.PROJECT_BRIEFING.TITLE_DESCRIPTION)}
          handleInputChange={set("name")}
          schema={requiredSchema}
          handleValidationCheck={setValid("name")}
        />

        <InputField
          label={t(translations.PROJECT_BRIEFING.BRAND_NAME)}
          defaultValue={brandName}
          disabled
        />

        <div className="checkbox-container">

          <CheckboxButtons
            handleCheckChange={handleCheckChange}
            checkButtonList={brandInfo}
            labelColor={colorList.blue1}
            fontSize={FontSize.Small}
            subTitle={t(translations.PROJECT_BRIEFING.NOT_DISPLAY)}
          />

          <img src={images.detail} alt="pdf" className="pdfImage" />
        </div>

        <TextArea
          label={t(translations.PROJECT_BRIEFING.PROJECT_DESCRIPTION)}
          defaultValue={formFields.brandOverview}
          handleTextAreaChange={set("brandOverview")}
          schema={requiredSchema}
          required
          handleValidationCheck={setValid("brandOverview")}
        />

        <TextArea
          label={t(translations.PROJECT_BRIEFING.OBJECTIVE)}
          defaultValue={formFields.objective[0]}
          handleTextAreaChange={handleObjectiveChange}
          schema={requiredSchema}
          required
          handleValidationCheck={setValid("objective")}
        />
        <Text
          family={FontFamily.Inter}
          styles={customStyles.text1}
          weight={FontWeight.Medium}
        >
          {t(translations.PROJECT_BRIEFING.BUDGET_AND_TIMELINE)}
        </Text>

        <MultiSelectType2Component
          ServerConstantKey={ServerConstantKeys.budgetTypes}
          title={t(translations.PROJECT_BRIEFING.BUDGET_TYPES)}
          selected={formFields.budgetTypes}
          handleDropdownChange={set("budgetTypes")}
          schema={requiredArraySchema}
          required
          handleValidationCheck={setValid("budgetTypes")}
        />
        {formFields.budgetTypes.indexOf("projectBased") > -1 && (
          <SingleSelectType2Component
            ServerConstantKey={ServerConstantKeys.projectStartingFee_USD}
            title={t(translations.PROJECT_BRIEFING.PROJECT_BBASED_BUDGET)}
            selected={formFields.budget?.projectBased}
            handleDropdownChange={set("budget.projectBased")}
            schema={requiredSchema}
            required
            handleValidationCheck={setValid("projectBased")}
          />
        )}

        {formFields.budgetTypes.indexOf("retainerBased") > -1 && (
          <SingleSelectType2Component
            ServerConstantKey={ServerConstantKeys.projectStartingFee_USD}
            title={t(translations.PROJECT_BRIEFING.RETAINER_BASED_BUDGET)}
            selected={formFields.budget?.retainerBased}
            handleDropdownChange={set("budget.retainerBased")}
            schema={requiredSchema}
            required
            handleValidationCheck={setValid("retainerBased")}
          />
        )}

        <SingleSelectType2Component
          ServerConstantKey={ServerConstantKeys.startingTimeline}
          title={t(translations.PROJECT_BRIEFING.STARTING_TIMELINE)}
          selected={formFields.startingTimeline}
          handleDropdownChange={set("startingTimeline")}
          schema={requiredSchema}
          required
          handleValidationCheck={setValid("startingTimeline")}
        />

        <Text
          family={FontFamily.Inter}
          styles={customStyles.text1}
          weight={FontWeight.Medium}
        >
          {t(translations.PROJECT_BRIEFING.REQUIREMENTS)}
        </Text>
        <SingleSelectType2Component
          selected={formFields.requirements.teamSize}
          handleDropdownChange={set("requirements.teamSize")}
          ServerConstantKey={ServerConstantKeys.teamSizeRequirements}
          title={t(translations.PROJECT_BRIEFING.COMPANY_SIZE)}
          schema={requiredSchema}
          required
          handleValidationCheck={setValid("teamSize")}
        />
        <MultiSelectType2Component
          selected={formFields.requirements.industryExperience}
          handleDropdownChange={set("requirements.industryExperience")}
          ServerConstantKey={ServerConstantKeys.industryExperience}
          title={t(translations.PROJECT_BRIEFING.INDUSTRY_EXPERIENCE)}
          schema={requiredArraySchema}
          required
          handleValidationCheck={setValid("industryExperience")}
        />
        <MultiSelectType2Component
          selected={formFields.requirements.segmentExperience}
          handleDropdownChange={set("requirements.segmentExperience")}
          ServerConstantKey={ServerConstantKeys.segmentExperience}
          title={t(translations.PROJECT_BRIEFING.SEGMENT_EXPERIENCE)}
          schema={requiredArraySchema}
          required
          handleValidationCheck={setValid("segmentExperience")}
        />
        <SingleSelectType2Component
          ServerConstantKey={ServerConstantKeys.requiredExperience}
          title={t(translations.PROJECT_BRIEFING.REQUIRED_EXPERIENCE)}
          selected={formFields.requirements.experience}
          handleDropdownChange={set("requirements.experience")}
          schema={requiredSchema}
          required
          handleValidationCheck={setValid("experience")}
        />

        <RowContainer>
          <MultiSelect
             sort ={true}
            defaultValues={formFields.requirements.languageSpoken}
            label={t(translations.PROJECT_BRIEFING.LANGUAGE_SPOKEN)}
            useServerConstant={ServerConstantKeys.languageSpoken}
            handleDropdownChange={set("requirements.languageSpoken")}
          />
          <MultiSelect
          sort={true}
            defaultValues={formFields.requirements.chinaOfficeLocation}
            label={t(translations.PROJECT_BRIEFING.CHINNA_OFFICE_LOCATION)}
            useServerConstant={ServerConstantKeys.chinaCities}
            handleDropdownChange={set("requirements.chinaOfficeLocation")}
          />
        </RowContainer>

        <TextArea
          label={t(translations.PROJECT_BRIEFING.NOTES)}
          defaultValue={formFields.notes}
          handleTextAreaChange={set("notes")}
        />

        <FileUpload
          label={t(translations.FORM_LABELS.OTHER_FILES)}
          multiple
          uploadedFiles={uploadedFiles}
          handleFileDeletion={handleFileDeletion}
          loading={docsLoading}
          accept={customStyles.acceptType1}
          handleInputChange={(val: File[]) => handleAdditionalInfoChange(val)}
        />

        <Footer>
          <div>
            <Button
              textColor={colorList.white1}
              color={colorList.blue1}
              borderColor={colorList.blue1}
              paddingHorizontal={"2.5rem"}
              loading={loading}
              text={t(translations.BUTTONS.SAVE)}
              disabled={disableButton}
              onClick={createProject}
            />
          </div>
        </Footer>
      </div>
    </Container>
  );
}

export const customStyles = {
  text1: { margin: "3rem 0 2rem" },
  text2: { margin: "1.8rem 0" },
  acceptType1:
    "application/pdf,application/msword,'application/powerpoint', application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
