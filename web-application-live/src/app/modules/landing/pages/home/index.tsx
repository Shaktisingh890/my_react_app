import { Button } from "app/components/atoms/mybutton";
import { colorList } from "consts/color";
import { publicPaths } from "consts/paths";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { translations } from "locales/translations";
import { Link, useHistory } from "react-router-dom";

import { clearFromLocalStorage, setInLocalStorage } from "localStorage";

export default function Home(): ReactElement {
  let history = useHistory();

  const { t } = useTranslation();
  const setAuth = () => {
    localStorage.setItem("token", "expanter");
    // history.push("/dashboard");
  };


  const handleLogout = () => {
    return setInLocalStorage("accessToken", "")
  }

  return (
    <>
      This is Home Page
      <Button
        text={"Log In"}
        color={colorList.white1}
        textColor={colorList.pink1}
        borderColor={colorList.blue3}
      />
      <div>
        <Link to={publicPaths.about}>Go to About</Link>
      </div>
      <div>
        <Link to={publicPaths.investor}>Go to Investor</Link>
      </div>
      <div>
        <Link to={publicPaths.platform}>Go to Platform</Link>
      </div>
      {/* <div>
        <Link to={publicPaths.signup}>Go to Sign Up</Link>
      </div> */}
      <div>
        <Link to={publicPaths.login}>Go to login</Link>
      </div>
      <div>
        <Link to={publicPaths.home}>Go to Home</Link>
      </div>
      {/* <div>
        <Link to={publicPaths.signup}>Go to Sign up</Link>
      </div> */}
      <div>
        <Link to={publicPaths.changePwd}>Go to change password</Link>
      </div>
      <div>
        <Link to={publicPaths.forgotPwd}>Go to forgot password</Link>
      </div>
      <div>
        <Link to={publicPaths.thankYouPage}>Go to thankyou page</Link>
      </div>
      <Button text = {t(translations.LOGOUT.LOGOUT_BUTTON)}
      color={colorList.blue1} 
      textColor={colorList.white1}
       onClick={handleLogout} />

    </>
  );
}
