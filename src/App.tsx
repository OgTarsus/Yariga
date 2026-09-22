import {
  Authenticated,
  AuthProvider,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  RefineSnackbarProvider,
  // ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { CredentialResponse } from "./interfaces/google";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
// import { Login, Home, agent, myProfile, propertyDetails, allProperties, createProperty, agentProfile, editProperty } from "./pages";
import { dataProvider } from "./providers/data";
import { parseJwt } from "./utils/parse-jwt";

import { Login } from "./pages/login";
import Home from "./pages/home";
import agent from './pages/agent'
import myProfile from "./pages/myProfile";
import propertyDetails from "./pages/propertyDetails";
import allProperties from "./pages/allProperties";
import createProperty from "./pages/createProperty";
import agentProfile from "./pages/agentProfile";
import editProperty from "./pages/editProperty";

import {ThemedLayout} from "./components/layout/index";
import {ThemedHeader} from './components/layout/header'
import {ThemedSider} from './components/layout/sider'
import {ThemedTitle} from './components/layout/title'

import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from "@mui/icons-material";



const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        );

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
                  {
                    name: "property",
                    list: "/property",
                    meta: {
                      icon: <VillaOutlined />,
                    }
                    // create: "/blog-posts/create",
                    // edit: "/blog-posts/edit/:id",
                    // show: "/blog-posts/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "agent",
                    list: "/agent",
                    meta: {
                      icon: <PeopleAltOutlined />,
                    }
                    // create: "/categories/create",
                    // edit: "/categories/edit/:id",
                    // show: "/categories/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "review",
                    list: "/review",
                    meta: {
                      icon: <StarOutlineRounded />,
                    }
                    // create: "/categories/create",
                    // edit: "/categories/edit/:id",
                    // show: "/categories/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "message",
                    list: "/message",
                    meta: {
                      icon: <ChatBubbleOutline />,
                    }
                    // create: "/categories/create",
                    // edit: "/categories/edit/:id",
                    // show: "/categories/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                  {
                    name: "my-profile",
                    meta: {
                      label: "My Profile",
                      icon: <AccountCircleOutlined />,
                    },
                    list: "/my-profile",
                    // create: "/categories/create",
                    // edit: "/categories/edit/:id",
                    // show: "/categories/show/:id",
                    // meta: {
                    //   canDelete: true,
                    // },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "WdtSFL-tDcrUA-jVc5sq",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayout Header={Header} Sider={ThemedSider} Title={ThemedTitle}>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<Home />}
                    />
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              {/* <DevtoolsPanel /> */}
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
