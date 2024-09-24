import { FunctionComponent, SVGProps, useState } from "react";

import { useNavigate } from "react-router";

import SvgWrapper from "../reusableComponents/svgWrapper/SvgWrapper";
import GoogleG from "../../assets/images/MediumGoogleGLogo.svg";
import PopUp from "../reusableComponents/popup/PopUp";
import classes from "./Authentication.module.css";
import EditUserProfile from "./EditUserProfile";
import { User } from "../../types/types";
import {
  doSignInWithGoogle,
  doSignOut,
  doSignUpWithGoogle,
} from "../../server/auth";

const Authentication = ({
  isSignUp = false,
  onClose,
}: {
  isSignUp: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const [isSignUpPage, setIsSignUpPage] = useState(isSignUp);
  const [isAddNewUser, setIsAddNewUser] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const signInHandler = async () => {
    const response = await doSignInWithGoogle();
    if (response) {
      onClose();
      navigate("/");
    }
  };

  const signUpHandler = async () => {
    const response = await doSignUpWithGoogle();
    if (response.userExists) {
      onClose();
      navigate("/");
    } else {
      setUserData(response.user as User);
      console.log(response.user);
      setIsAddNewUser(true);
    }
  };

  const onSaveNewUser = () => {
    setIsAddNewUser(false);
    navigate("/");
  };

  const onCloseNewUser = async () => {
    await doSignOut();
    setIsAddNewUser(false);
    onClose();
  };

  return (
    <div className={classes.authenticationWrapper}>
      <h2 className={classes.header}>
        {isSignUpPage ? "Join Medium." : "Welcome back."}
      </h2>

      <div className={classes.main}>
        <div className={classes.loginWrapper}>
          <div className={classes.buttons}>
            {!isSignUpPage && (
              <button
                className={classes.googleSignButton}
                onClick={signInHandler}
              >
                <span>
                  <SvgWrapper
                    SvgComponent={
                      GoogleG as unknown as FunctionComponent<SVGProps<string>>
                    }
                    width={"24px"}
                  />{" "}
                  <span>Sign in with Google</span>
                  <div className="dummy3rd-element"></div>
                </span>
              </button>
            )}
            {isSignUpPage && (
              <button
                className={classes.googleSignButton}
                onClick={signUpHandler}
              >
                <span>
                  <SvgWrapper
                    SvgComponent={
                      GoogleG as unknown as FunctionComponent<SVGProps<string>>
                    }
                    width={"24px"}
                  />{" "}
                  <span>Sign up with Google</span>
                  <div className="dummy3rd-element"></div>
                </span>
              </button>
            )}
          </div>
        </div>
        <p>
          <span>
            {isSignUpPage ? "Already have an account? " : "No account? "}
          </span>
          <b
            className={classes.action}
            onClick={() => setIsSignUpPage((prev) => !prev)}
          >
            {isSignUpPage ? "Sign In" : "Create one"}
          </b>
        </p>
      </div>

      <p className={classes.footer}>
        Click “{isSignUpPage ? "Sign Up" : "Sign In"}” to agree to Medium’s{" "}
        <span className={classes.underlinePointer}>Terms of Service</span> and
        acknowledge that Medium’s{" "}
        <span className={classes.underlinePointer}>Privacy Policy</span> applies
        to you.
      </p>
      <PopUp isOpen={isAddNewUser} onClose={onCloseNewUser}>
        <EditUserProfile
          onCancel={onCloseNewUser}
          onSave={onSaveNewUser}
          userData={{ uid: userData?.uid } as User}
        />
      </PopUp>
    </div>
  );
};

export default Authentication;
