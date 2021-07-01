import * as Yup from "yup";

export const authFormInitialValues = {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      telephone: "",
      country: "Canada",
      registerAs: "",
    }

export  const RegSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    fullName: Yup.string().required("Required"),
    telephone: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    passwordConfirmation: Yup.string()
      .equals([Yup.ref("password")], "Password confirmation do not match")
      .required("Required"),
  });