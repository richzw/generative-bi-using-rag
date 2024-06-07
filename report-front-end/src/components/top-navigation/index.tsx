import {
  ButtonDropdownProps,
  TopNavigation,
} from "@cloudscape-design/components";
import { Mode } from "@cloudscape-design/global-styles";
import { useEffect, useState } from "react";
import { Storage } from "../../common/helpers/storage";
import { Auth } from "aws-amplify";
import useOnFollow from "../../common/hooks/use-on-follow";
import { APP_LOGO, APP_RIGHT_LOGO, APP_TITLE, CHATBOT_NAME } from "../../common/constants";
import "./style.scss";

export default function CustomTopNavigation() {
  const onFollow = useOnFollow();
  const [userName, setUserName] = useState<string | null>(null);
  const [theme, setTheme] = useState<Mode>(Storage.getTheme());

  useEffect(() => {
    (async () => {
      const result = await Auth.currentUserInfo();

      if (!result || Object.keys(result).length === 0) {
        await Auth.signOut();
        return;
      }

      const userName = result?.attributes?.email;
      setUserName(userName);
    })();
  }, []);

  const onChangeThemeClick = () => {
    if (theme === Mode.Dark) {
      setTheme(Storage.applyTheme(Mode.Light));
    } else {
      setTheme(Storage.applyTheme(Mode.Dark));
    }
  };

  const onUserProfileClick = ({
    detail,
  }: {
    detail: ButtonDropdownProps.ItemClickDetails;
  }) => {
    if (detail.id === "signout") {
      Auth.signOut().then();
    }
  };

  return (
    <div
      style={{ zIndex: 1002, top: 0, left: 0, right: 0, position: "fixed" }}
      id="awsui-top-navigation"
    >
      {APP_RIGHT_LOGO && (<img className="logo" src={APP_RIGHT_LOGO} alt="logo"/>)}
      <TopNavigation
        identity={{
          href: "/",
          title: APP_TITLE,
          logo: {
            src: APP_LOGO,
            alt: { CHATBOT_NAME } + " Logo"
          },
        }}
        utilities={[
          {
            type: "button",
            text: theme === Mode.Dark ? "Light Mode" : "Dark Mode",
            onClick: onChangeThemeClick,
          },
          {
            type: "menu-dropdown",
            description: userName ?? "",
            iconName: "user-profile",
            onItemClick: onUserProfileClick,
            items: [
              {
                id: "signout",
                text: "Sign out",
              },
            ],
            onItemFollow: onFollow,
          },
          {
            type: "button",
          },
        ]}
      />
    </div>
  );
}
