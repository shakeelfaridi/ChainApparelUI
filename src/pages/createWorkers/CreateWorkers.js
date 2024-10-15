import { paramCase, capitalCase } from "change-case";
import React from "react";
import Page from "src/components/Page";
// router
import { useParams, useLocation } from "react-router-dom";
import UserCreate from "../management/UserCreate";
import { PATH_DASHBOARD } from "src/routes/paths";

// mui
import { Container } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import UserNewEditForm from "src/sections/@dashboard/user/UserNewEditForm";
import { useSelector } from "react-redux";

function CreateWorkers() {
  const { pathname } = useLocation();

  const { company, edit } = useParams();

  let iscustomer = pathname;
  const user = useSelector((state) => state.AuthUser.editUser);
  const currentUser = user;

  // const currentUser = _userList.find((user) => paramCase(user.name) === name);
  return (
    <>
      <div>
        <Page
          title={
            iscustomer === "/dashboard/create-new-manufacturer"
              ? "Create a new manufacturer"
              : iscustomer === "/dashboard/create-new-supplier"
              ? "Create a new Supplier "
              : iscustomer === "/dashboard/add-user"
              ? "Create a new Worker "
              : edit === "edit"
              ? `Edit ${company}`
              : ""
          }
        >
          <Container fluid>
            <HeaderBreadcrumbs
              heading={
                iscustomer === "/dashboard/create-new-manufacturer"
                  ? "Create a new manufacturer"
                  : iscustomer === "/dashboard/create-new-supplier"
                  ? "Create a new Supplier "
                  : iscustomer === "/dashboard/add-user"
                  ? "Create a new Worker "
                  : edit === "edit"
                  ? `Edit ${company}`
                  : ""
              }
              links={[
                { name: "Dashboard", href: PATH_DASHBOARD.root },

                {
                  name: edit === "edit" ? `Edit ` : "Create New User",
                },
              ]}
            />
            <UserNewEditForm
              iscustomer={iscustomer}
              currentUser={currentUser}
              isEdit={edit === "edit" ? true : false}
            />
          </Container>
        </Page>
      </div>
    </>
  );
}

export default CreateWorkers;
