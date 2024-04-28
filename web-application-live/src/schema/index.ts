import * as Yup from "yup";

// const websiteReg =
//   /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

const websiteReg =
  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

export const emailSchema = Yup.string()
  .email("VALIDATION_ERRORS.EMAIL")
  .required("VALIDATION_ERRORS.REQUIRED");

export const passwordSchema = Yup.string()
  .required("VALIDATION_ERRORS.REQUIRED")
  .test("regex", "VALIDATION_ERRORS.PASSWORD", (val = "") => {
    let regExp = new RegExp(
      "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
    );
    return regExp.test(val);
  });
// .max(16, "VALIDATION_ERRORS.PASSWORD_MAX_LENGTH");

export const confirmPasswordSchema = (matchPwd: string) =>
  Yup.string().oneOf([matchPwd], "VALIDATION_ERRORS.CONFIRM_PWD");

export const nameSchema = Yup.string()
  .matches(/^[A-Za-z ]*$/, "VALIDATION_ERRORS.NAME")
  .max(40)
  .required("VALIDATION_ERRORS.REQUIRED");

export const brandSchema = Yup.string()
  .max(40)
  .required("VALIDATION_ERRORS.REQUIRED");

export const requiredSchema = Yup.string().required(
  "VALIDATION_ERRORS.REQUIRED"
);

export const requiredArraySchema = Yup.array()
  .min(1, "VALIDATION_ERRORS.REQUIRED")
  .required("VALIDATION_ERRORS.REQUIRED");

export const websiteSchema = Yup.string().matches(
  websiteReg,
  "VALIDATION_ERRORS.WEBSITE"
);

export const foundingYearSchema = Yup.string()
  .matches(/^[0-9]+$/, "VALIDATION_ERRORS.YEAR")
  .length(4, "VALIDATION_ERRORS.YEAR")
  .test(
    "test-compares entered year",
    "VALIDATION_ERRORS.ALLOWEDYEAR",
    function (value = "") {
      if (parseInt(value) > new Date().getFullYear()) return false;
      else return true;
    }
  );

export const globalPOSSchema = Yup.string().matches(
  /^[0-9]+$/,
  "VALIDATION_ERRORS.VALID_NUMBER"
);
