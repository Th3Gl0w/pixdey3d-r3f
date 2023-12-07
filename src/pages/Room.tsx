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
              <a href="/room/7923278312647395-01_Shoes.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182093459318906951/01_Shoes.png?ex=65837152&is=6570fc52&hm=6183de857fab92830387d57eca3a7882f8ae5fca1f3e52cb0aa858486e05dd1b&"
                  }
                />
              </a>
              <a href="/room/08860931423931873-03_Clock.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182094216655024208/02_Clock.png?ex=65837207&is=6570fd07&hm=9da9a8b012a0db079630da982fe1de0aeee39dde3796220c5663f96485c8b0cc&"
                  }
                />
              </a>
              <a href="/room/2954125685863136-03_can.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182094735503020062/03_can.png?ex=65837283&is=6570fd83&hm=f1598c926243daf5741dda54f4f904e927c77cdaa67ea309ec966d52f1604cda&"
                  }
                />
              </a>
              <a href="/room/6016229013372625-04_Globe.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182094735293296712/04_Globe.png?ex=65837283&is=6570fd83&hm=d1ddbb9ca3c5b25a317af87d7596e9017cde2d0239e58d887c9cf8370ae3283a&"
                  }
                />{" "}
              </a>
              <a href="/room/2435136727033076-05_Camera.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182094735041630288/05_Camera.png?ex=65837283&is=6570fd83&hm=1a8f30f3ca8b810fb6453bcb649f6df4d9d293d3d0a1421e344532937eb13499&"
                  }
                />
              </a>
              <a href="/room/014478852166890821-06_powerpuff.gltf">
                <img
                  className="template-item"
                  src={
                    "https://cdn.discordapp.com/attachments/338396901802115073/1182094734806765728/06_powerpuff.png?ex=65837283&is=6570fd83&hm=1aa9d50864ed1e27297c753b574481dc9b684d0aa60f0963ea29001091ae8842&"
                  }
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
