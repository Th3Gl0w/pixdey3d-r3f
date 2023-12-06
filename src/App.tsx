/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.css";
import { useState, useEffect, useCallback } from "react";
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

//TODO :
// - pass the session object as child to app component
// - extract user.id from session object
// - set the realtime change table
// - create an annotation with the userId
// - query all annotations

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [annotationData, setAnnotationData] = useState<Annotation[]>([]);
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
    <Router>
      <Route exact path="/">
        <Layout session={session}>
          <Home />
        </Layout>
      </Route>
      <Route exact path="/create-3d-space">
        {!session ? (
          <Layout session={session}>
            <LoginPage>
              <Auth
                supabaseClient={supabase}
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
          <Layout session={session}>
            <Room session={session} />
          </Layout>
        )}
      </Route>
      <Route exact path="/user/:id">
        {!session ? (
          <Layout session={session}>
            <LoginPage>
              <Auth
                supabaseClient={supabase}
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
          <Layout session={session}>
            <UserPage session={session} />
          </Layout>
        )}
      </Route>
      <Route path="/room/:id">
        {!session ? (
          <Layout session={session}>
            <LoginPage>
              <Auth
                supabaseClient={supabase}
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
  );
  // return <App_ session={session} annotationData={annotationData} />;
}
