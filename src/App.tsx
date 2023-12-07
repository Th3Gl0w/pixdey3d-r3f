/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.css";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";

import App_ from "./pages/App_";
import { supabase } from "./database/supabaseClient";
import { Annotation } from "./types/type";
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Room from "./pages/Room";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage";
import "./pages/LoginPage.css";
import { ViewType } from "@supabase/auth-ui-shared";

//TODO :
// - pass the session object as child to app component
// - extract user.id from session object
// - set the realtime change table
// - create an annotation with the userId
// - query all annotations

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [annotationData, setAnnotationData] = useState<Annotation[]>([]);
  const [loginView, setLoginView] = useState<ViewType>("sign_in");
  const getAnnotation = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("annotation")
        .select(
          "id, title, content, position, normal, user_id, room_id, anno_id, username, status"
        )
        .order("id", { ascending: true });
      if (error) {
        throw error;
      }
      if (data) {
        setAnnotationData(data);
      }
    } catch (error: any) {
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    getAnnotation();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [getAnnotation]);

  return (
    <Suspense fallback="..loading">
      <Router>
        <Route exact path="/">
          <Layout session={session} setLoginViewFunc={setLoginView}>
            <Home />
          </Layout>
        </Route>
        <Route exact path="/create-3d-space">
          {!session ? (
            <Layout session={session} setLoginViewFunc={setLoginView}>
              <LoginPage loginView={loginView}>
                <Auth
                  supabaseClient={supabase}
                  view={loginView}
                  appearance={{
                    className: {
                      button: "login-button",
                      label: "login-input-fieldname",
                      input: "login-input",
                      container: "login-input-container",
                    },
                  }}
                  providers={[]}
                />
              </LoginPage>
            </Layout>
          ) : (
            <Layout session={session} setLoginViewFunc={setLoginView}>
              <Room session={session} />
            </Layout>
          )}
        </Route>
        <Route exact path="/user/:id">
          {!session ? (
            <Layout session={session} setLoginViewFunc={setLoginView}>
              <LoginPage loginView={loginView}>
                <Auth
                  supabaseClient={supabase}
                  view={loginView}
                  appearance={{
                    className: {
                      button: "login-button",
                      label: "login-input-fieldname",
                      input: "login-input",
                      container: "login-input-container",
                    },
                  }}
                  providers={[]}
                />
              </LoginPage>
            </Layout>
          ) : (
            <Layout session={session} setLoginViewFunc={setLoginView}>
              <UserPage session={session} />
            </Layout>
          )}
        </Route>
        <Route path="/room/:id">
          {!session ? (
            <Layout session={session} setLoginViewFunc={setLoginView}>
              <LoginPage loginView={loginView}>
                <Auth
                  supabaseClient={supabase}
                  view={loginView}
                  appearance={{
                    className: {
                      button: "login-button",
                      label: "login-input-fieldname",
                      input: "login-input",
                      container: "login-input-container",
                    },
                  }}
                  providers={[]}
                />
              </LoginPage>
            </Layout>
          ) : (
            <App_ session={session} annotationData={annotationData} />
          )}
        </Route>
      </Router>
    </Suspense>
  );
  // return <App_ session={session} annotationData={annotationData} />;
}
