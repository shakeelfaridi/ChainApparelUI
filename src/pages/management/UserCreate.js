import { paramCase, capitalCase } from "change-case";
import { useParams, useLocation } from "react-router-dom";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// hooks
import useSettings from "../../hooks/useSettings";
// _mock_
import { _userList } from "../../_mock";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
// sections
import UserNewEditForm from "../../sections/@dashboard/user/UserNewEditForm";

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = "" } = useParams();

  const isEdit = pathname.includes("edit");

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <Page
      title={!isEdit ? "Create a new user" : "Edit user: " + capitalCase(name)}
    >
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Create a new user" : "Edit user"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "All Users", href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? "New " + " user" : "Edit: " + capitalCase(name) },
          ]}
        />
        <UserNewEditForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
