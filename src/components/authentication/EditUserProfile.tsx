import { useEffect, useState } from "react";

import { getUserByUsername, updateUserDetails } from "../../server/services";
import Avatar from "../reusableComponents/avatar/Avatar";
import Button from "../reusableComponents/button/Button";
import { User } from "../../types/types";
import "./EditUserProfile.css";

type Errors = {
  unsupportedFile: boolean;
  nameTooLong: boolean;
  nameEmpty: boolean;
  usernameTooLong: boolean;
  usernameEmpty: boolean;
  usernameInvalid: boolean;
};

const EditUserProfile = ({
  onCancel,
  onSave,
  userData,
}: {
  onCancel?: () => void;
  onSave?: () => void;
  userData?: User;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEdited, setIsEdited] = useState(false);
  const [errors, setErrors] = useState<Errors | null>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, []);

  const isValid = (key: string, value: string) => {
    switch (key) {
      case "displayName":
        value.trim().length === 0
          ? setErrors((prev) => ({ ...prev, nameEmpty: true } as Errors))
          : setErrors((prev) => ({ ...prev, nameEmpty: false } as Errors));
        return value.trim().length !== 0;
      case "username":
        setErrors((prev) => ({ ...prev, usernameInvalid: false } as Errors));
        value.trim().length === 0
          ? setErrors((prev) => ({ ...prev, usernameEmpty: true } as Errors))
          : setErrors((prev) => ({ ...prev, usernameEmpty: false } as Errors));
        return value.trim().length !== 0;
      default:
        return true;
    }
  };

  const updateUser = (key: string, value: string | File | undefined) => {
    setIsEdited(true);
    if (key) {
      if (key === "username") {
        setUser(
          (prev) =>
            ({ ...prev, [key]: value?.toString().toLowerCase() } as User)
        );
      } else {
        setUser((prev) => ({ ...prev, [key]: value } as User));
      }
    }
    isValid(key, value as string);
  };

  const checkUsername = async (value: string) => {
    if (value.trim() && user?.username !== userData?.username) {
      const response = await getUserByUsername(value);
      response &&
        setErrors((prev) => ({ ...prev, usernameInvalid: true } as Errors));
      return response;
    }
    return user?.username !== userData?.username;
  };

  const saveUserData = async () => {
    if (user) {
      const res = await updateUserDetails(user?.uid, user);
      console.log("User data updated: ", res);
    }
  };

  const onSubmit = async () => {
    const anyError =
      errors && Object.values(errors).filter((value) => value).length > 0;
    if (isEdited && !anyError && onSave) {
      const isExists = await checkUsername(user?.username as string);
      if (isExists) {
        return;
      }
      await saveUserData();
      onSave();
      window.location.href = `/@${user?.username}`;
      setIsEdited(false);
    }
  };

  return (
    <div className="edit-user-profile-wrapper">
      <form>
        <h1 className="user-profile-header">Profile information</h1>
        <div className="user-profile-main">
          <div>
            <input
              type="file"
              accept="image/*"
              id="photo-file"
              className="hide"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                updateUser("photoURL", selectedFile);
              }}
            />
            <p className="photo-text">Photo</p>
            <div className="upload-photo-wrapper">
              <label htmlFor="photo-file" className="cursor-pointer">
                <Avatar imgSrc={user?.photoURL} width="80px" height="80px" />
              </label>
              <div>
                <div className="upload-photo-actions">
                  <label htmlFor="photo-file" className="update-label">
                    Update
                  </label>
                  <Button
                    type="text"
                    label="Remove"
                    style={{ color: "red" }}
                    onClick={() => updateUser("photoURL", "")}
                  />
                </div>
                <p className="upload-info">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels
                  per side.
                </p>
              </div>
            </div>
            {errors?.unsupportedFile && (
              <p className="text-danger text-sm mt-2">
                We don't accept this type of file
              </p>
            )}
          </div>
          <div>
            <div className="name-wrapper">
              <label htmlFor="change-display-name" className="name-label">
                Name*
              </label>
              <input
                type="text"
                id="change-display-name"
                className={`py-1 outline-none border-b ${
                  errors?.nameTooLong || errors?.nameEmpty
                    ? "border-red-700"
                    : "border-neutral-300 focus:border-grey"
                }`}
                maxLength={50}
                value={user?.displayName}
                onChange={(e) => updateUser("displayName", e.target.value)}
                required
              />
              <div className="name-info">
                <span
                  className={
                    errors?.nameTooLong || errors?.nameEmpty
                      ? "text-danger"
                      : "text-grey"
                  }
                >
                  {errors?.nameTooLong
                    ? "Name may only contain a maximum of 50 characters."
                    : errors?.nameEmpty
                    ? "Please enter your name."
                    : "Appears on your Profile page, as your byline, and in your responses."}
                </span>
                <span className="limit">
                  <span
                    className={
                      errors?.nameTooLong ? "text-danger" : "text-lighterblack"
                    }
                  >
                    {user?.displayName.length}
                  </span>
                  /50
                </span>
              </div>
            </div>
            <div className="name-wrapper">
              <label htmlFor="change-display-name" className="name-label">
                Username*
              </label>
              <input
                type="text"
                id="change-user-name"
                className={`py-1 outline-none border-b ${
                  errors?.nameTooLong || errors?.nameEmpty
                    ? "border-red-700"
                    : "border-neutral-300 focus:border-grey"
                }`}
                maxLength={30}
                value={user?.username}
                onChange={(e) => updateUser("username", e.target.value)}
                required
              />
              <div className="name-info">
                <span
                  className={
                    errors?.usernameTooLong ||
                    errors?.usernameEmpty ||
                    errors?.usernameInvalid
                      ? "text-danger"
                      : "text-grey"
                  }
                >
                  {errors?.usernameTooLong
                    ? "Username may only contain a maximum of 50 characters."
                    : errors?.usernameEmpty
                    ? "Please enter your username."
                    : errors?.usernameInvalid
                    ? "Username is already taken"
                    : "Appears on your Profile page, as your byline, and in your responses."}
                </span>
                <span className="limit">
                  <span
                    className={
                      errors?.usernameTooLong ? "text-danger" : "text-grey"
                    }
                  >
                    {user?.username?.length}
                  </span>
                  /30
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-actions">
          <Button label="Cancel" onClick={onCancel} />
          <Button
            label="Save"
            onClick={onSubmit}
            disabled={
              (errors &&
                Object.values(errors).filter((value) => value).length > 0) ||
              !isEdited
            }
            // loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;
