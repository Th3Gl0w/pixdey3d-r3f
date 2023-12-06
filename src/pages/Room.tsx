/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropzone from "react-dropzone";
import { useModelStore } from "../store";
import { useHistory } from "react-router-dom";
import { supabase } from "../database/supabaseClient";
import { Session } from "@supabase/gotrue-js";
import "./Room.css";
import createsession_svg from "../assets/createsession.svg";
import startfromtemplates_svg from "../assets/startfromtemplate.svg";
import { ChangeEvent } from "react";

type TSession = {
  session: Session;
};
export default function Room({ session }: TSession) {
  const setRoomName = useModelStore((state) => state.setRoomName);
  const roomName = useModelStore((state) => state.roomName);
  const setSaveModel = useModelStore((state) => state.setSaveModel);
  const setSaveModelNameHooks = useModelStore(
    (state) => state.setSaveModelNameHooks
  );
  const setSaveFileXtenHooks = useModelStore(
    (state) => state.setSaveFileXtenHooks
  );
  const history = useHistory();

  const handleDrop = (acceptedFiles: any) => {
    acceptedFiles.map(async (file: any) => {
      console.log(file);
      const urrl = URL.createObjectURL(file);
      console.log(urrl);
      setSaveFileXtenHooks(file.name.split(".").pop());
      setSaveModelNameHooks(file.name.split(".").shift());
      setSaveModel(urrl);
      const fileId = `${Math.random()}`;
      const filePath = `${fileId.split(".").pop()}-${file.name}`;
      try {
        const { error: uploadError } = await supabase.storage
          .from("models")
          .upload(`public/${filePath}`, file);
        if (uploadError) {
          throw uploadError;
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        const { error } = await supabase.from("room").insert({
          owner_id: session.user.id,
          model_id: filePath,
          room_name: roomName,
        });
        if (error) {
          alert(error.message);
        }
      }
      history.push(`/room/${filePath}`);
    });
  };
  return (
    <>
      <div className="create-session-screen">
        <div className="create-session-container" dir="ltr">
          <div className="scroll-container-1">
            <div className="create-session-svg-container">
              <img
                src={createsession_svg}
                style={{ margin: "45px auto 34px auto" }}
              />
            </div>
            <div className="session-name-container">
              <div className="text-session-name">
                <div style={{ margin: "auto" }}>Session name</div>
              </div>
              <input
                value={roomName}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setRoomName(event.target.value)
                }
                className="input-session-name"
                placeholder="Type Session name"
              />
            </div>

            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({})}>
                  <input {...getInputProps()} />
                  <div className="file-upload-container">
                    <img
                      style={{ marginTop: "50px", height: "160px" }}
                      src="https://cdn.discordapp.com/attachments/1180928481366913076/1181012568710578237/fileformat.png?ex=657f82aa&is=656d0daa&hm=81d55668b8e45b611558481b63ef38e91652e491b4618ee048d762640dee8719&"
                    />
                    <div>Drag & Drop your 3D model here</div>
                    <div>
                      or{" "}
                      <p
                        style={{
                          fontWeight: "700",
                          textDecoration: "underline !important",
                          color: "revert",
                        }}
                      >
                        Click to Browse Files
                      </p>
                    </div>
                    <div style={{ fontSize: "16px", color: "#505050" }}>
                      Supported file formats : gltf, glb, obj
                    </div>
                  </div>
                </div>
              )}
            </Dropzone>

            <button className="button-create-session">Create session</button>
            <div className="create-session-scrolldown">
              <div>
                <svg
                  className="svg-scrolldown"
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  viewBox="0 0 36 36"
                >
                  <path d="M10.5 15l7.5 7.5 7.5-7.5z" />
                </svg>
              </div>
              <img src={startfromtemplates_svg} />
            </div>
          </div>
          <div className="scroll-container-2">
            <img src={startfromtemplates_svg} style={{ width: "500px" }} />
            <div className="template-container">
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />{" "}
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />
              <img
                className="template-item"
                src={
                  "https://img.animalplanet.co.kr/news/2020/05/20/700/al43zzl8j3o72bkbux29.jpg"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
