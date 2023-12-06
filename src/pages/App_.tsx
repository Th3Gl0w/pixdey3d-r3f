/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App_.css";
// import AnnotationPanel from "./components/AnnotationPanel";
import { useParams } from "react-router-dom";
import Scene from "../components/Scene";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import styled from "styled-components";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../database/supabaseClient";

import { Annotation } from "../types/type";
import * as ReactDOM from "react-dom";

// const fakeData: Annotation[] = [
//   {
//     id: 1,
//     username: "John Doe",
//     title: "Title",
//     content: "Sample Text",
//     user_id: "dwuhdwuhdwuhd",
//     status: "Not Solved",
//     position: {
//       x: 0.1337151093103914,
//       y: 0.2325045480127921,
//       z: 0.3800631330324405,
//     },
//     normal: {
//       x: 0.33036560595264364,
//       y: 0.10275760790941794,
//       z: 0.9382427406701728,
//     },
//   },
//   {
//     id: 2,
//     username: "John Doe",
//     title: "Title",
//     content: "Sample Text",
//     user_id: "dwuhdwuhdwuhd",
//     status: "Not Solved",
//     position: {
//       x: -0.05706563808500546,
//       y: -0.169604927825901,
//       z: 0.3988403043437364,
//     },
//     normal: {
//       x: -0.14113024359401696,
//       y: 0.05926227868409045,
//       z: 0.9882156832737794,
//     },
//   },
//   {
//     id: 3,
//     username: "John Doe",
//     title: "Title",
//     content: "Sample Text",
//     user_id: "dwuhdwuhdwuhd",
//     status: "Not Solved",
//     position: {
//       x: -0.23342921541224834,
//       y: 0.5095724698737661,
//       z: 0.32913819977926473,
//     },
//     normal: {
//       x: -0.5733490925547698,
//       y: 0.13238117175001393,
//       z: 0.8085456347249148,
//     },
//   },
//   {
//     id: 4,
//     username: "John Doe",
//     title: "Title",
//     content: "Sample Text",
//     user_id: "dwuhdwuhdwuhd",
//     status: "Not Solved",
//     position: {
//       x: -0.3090250058218962,
//       y: 0.11330948104950764,
//       z: 0.2579372102392086,
//     },
//     normal: {
//       x: -0.76427687576018,
//       y: 0.08996578934323021,
//       z: 0.6385820338265933,
//     },
//   },
//   {
//     id: 5,
//     username: "John Doe",
//     title: "Title",
//     content: "Sample Text",
//     user_id: "dwuhdwuhdwuhd",
//     status: "Not Solved",
//     position: {
//       x: -0.3514118351320769,
//       y: -0.45301158314032147,
//       z: 0.19642822454283845,
//     },
//     normal: {
//       x: -0.8724039094428353,
//       y: 0.02859634567263349,
//       z: 0.48794842740091743,
//     },
//   },
// ];

type TSession = {
  session: Session;
  annotationData: Annotation[];
};
function App({ session, annotationData }: TSession) {
  const { id } = useParams<any>();

  const filteredAnoData = annotationData.filter((fileredData) =>
    fileredData.room_id !== id ? null : fileredData
  );
  const [annotationList, setAnnotationList] = useState<Annotation[]>(
    filteredAnoData ? filteredAnoData : []
  );
  const anoLength = annotationList?.length;
  const annonCount = useRef(
    annotationList && anoLength ? annotationList[anoLength - 1].anno_id : 0
  );
  const [modelUrl, setModelUrl] = useState("");
  // const fileXtenHooks = useModelStore((state) => state.fileXtenHooks);
  const downLoadObj = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from("models")
        .download(`public/${id}`);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      // console.log(data);
      setModelUrl(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Error downloading image: " + error.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      downLoadObj();
    }
    const channel = supabase
      .channel("realtime annotation")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "annotation",
        },
        (payload) => {
          const newAnnon = payload.new as Annotation;
          annonCount.current = payload.new.anno_id;
          setAnnotationList([...(annotationList as Annotation[]), newAnnon]);
          console.log(payload.new);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "annotation",
        },
        (payload) => {
          const updateAnnon = payload.new as Annotation;

          setAnnotationList((annotations: Annotation[]) =>
            annotations.map((anno: Annotation) =>
              anno.id === updateAnnon.id ? { ...updateAnnon } : { ...anno }
            )
          );
          console.log(payload.new);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "annotation",
        },
        (payload) => {
          const deleteAnnon = payload.old;

          setAnnotationList((annotations: Annotation[]) =>
            annotations.filter((anno: Annotation) => anno.id !== deleteAnnon.id)
          );
          annonCount.current =
            annotationList[annotationList.length - 1].anno_id;
          console.log(annotationList);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [annotationList, downLoadObj, id]);
  // useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime annotation")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "annotation",
  //       },
  //       (payload) => {
  //         console.log(payload);
  //       }
  //     )
  //     .subscribe();
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);
  // let clickedAnnon: HTMLDivElement, clickedAnnonContent: HTMLDivElement;

  // init();
  // animate();

  // function init() {

  // // document.addEventListener("keydown", lookatScene);

  // document.addEventListener("click", function handleClickOutsideAnnon(event) {
  //   // Clicked sth other than lastly clicked annotation
  //   if (clickedAnnon && !clickedAnnon.contains(event.target)) {
  //     clickedAnnonContent.style.display = "none";
  //   }
  //   // Call lookatScene() function to reset view as initial when clicked sth other than annotation
  //   const c1 = event.target?.parentNode.getAttribute("class");
  //   const c2 = event.target?.parentNode.parentNode.getAttribute("class");

  //   if (
  //     !(
  //       c1 == "annon_content" ||
  //       c1 == "annotation" ||
  //       c2 == "annon_content" ||
  //       c2 == "annotation"
  //     )
  //   ) {
  //     lookatScene();
  //   }
  // });
  // }

  // function toggleAnnotationVisibility(
  //   annon: HTMLDivElement,
  //   annon_content: HTMLDivElement
  // ) {
  //   // If exists, set last clicked annotation 'not visible'
  //   if (clickedAnnon) {
  //     clickedAnnonContent.style.display = "none";
  //   }

  //   clickedAnnon = annon;
  //   clickedAnnonContent = annon_content;
  //   annon_content.style.display = "grid";
  // }

  // function lookatAnnotation(annon: HTMLDivElement) {
  //   // Adjust camera view to create zoom effect on annotation
  //   // Tween Animation - Camera(Controls) Target
  //   const pos = annon.dataset.position?.split(" ");
  //   if (pos) {
  //     new TWEEN.Tween(controls.target)
  //       .to(
  //         {
  //           x: Number(pos[0]),
  //           y: Number(pos[1]),
  //           z: Number(pos[2]),
  //         },
  //         1000
  //       )
  //       .easing(TWEEN.Easing.Cubic.Out)
  //       .start();

  //     // Tween Animation - Camera position
  //     const oldPos = camera.position.clone();
  //     const newPos = new THREE.Vector3(
  //       Number(pos[0]) * 2,
  //       Number(pos[1]) * 2,
  //       Number(pos[2]) * 2
  //     );
  //     new TWEEN.Tween(oldPos)
  //       .to(newPos, 1000)
  //       .easing(TWEEN.Easing.Cubic.Out)
  //       .onUpdate(function () {
  //         camera.position.copy(oldPos);
  //       })
  //       .onComplete(function () {
  //         camera.position.copy(oldPos);
  //       })
  //       .start();
  //   }
  // }

  // function lookatScene() {
  //   // Resets camera and controls as initial view
  //   // Tween Animation - Camera(Controls) Target
  //   new TWEEN.Tween(controls.target)
  //     .to(
  //       {
  //         x: 0,
  //         y: 0,
  //         z: 0,
  //       },
  //       1000
  //     )
  //     .easing(TWEEN.Easing.Cubic.Out)
  //     .start();

  //   // Tween Animation - Camera position
  //   const oldPos = camera.position.clone();

  //   new TWEEN.Tween(oldPos)
  //     .to(camInitialPos, 1000)
  //     .easing(TWEEN.Easing.Cubic.Out)
  //     .onUpdate(function () {
  //       camera.position.copy(oldPos);
  //     })
  //     .onComplete(function () {
  //       camera.position.copy(oldPos);
  //     })
  //     .start();
  // }

  // function animate() {
  //   requestAnimationFrame(animate);
  //   TWEEN.update();
  //   controls.update();
  //   render();
  // }

  const deleteAnnotation = async (anno: Annotation) => {
    if (session.user.id === anno.user_id) {
      try {
        const { error } = await supabase
          .from("annotation")
          .delete()
          .eq("id", anno.id);
        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(error.message);
      }
    }
  };
  const updateAnnotation = async (
    event: FormEvent,
    selectedAnnotation: Annotation,
    {
      annotationTitle,
      annotationContent,
      annotationStatus,
    }: {
      annotationTitle: string;
      annotationContent: string;
      annotationStatus: "Not Solved" | "In Progress" | "Solved";
    }
  ) => {
    event.preventDefault();

    if (session.user.id === selectedAnnotation.user_id) {
      // console.log("DBL CLICKED !", annonCount);

      try {
        const { error } = await supabase
          .from("annotation")
          .update({
            title: annotationTitle,
            content: annotationContent,
            status: annotationStatus,
          })
          .eq("id", selectedAnnotation.id);
        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        // setAnnotationList((annotations: Annotation[]) =>
        //   annotations.map((anno: Annotation) =>
        //     anno.id === selectedAnnotation.id
        //       ? {
        //           ...selectedAnnotation,
        //           title: annotationTitle,
        //           content: annotationContent,
        //           status: annotationStatus,
        //         }
        //       : { ...anno }
        //   )
        // );
        setIsModified(false);
        setAnnotationContent("");
        setAnnotationTitle("");
        setAnnationStatus("Not Solved");
        dialogRef.current?.close();
      }
    }
  };

  const addAnnotation = async (
    event: FormEvent,
    annoParams: any,
    {
      annotationTitle,
      annotationContent,
      annotationStatus,
    }: {
      annotationTitle: string;
      annotationContent: string;
      annotationStatus: string;
    }
  ) => {
    event.preventDefault();
    const intersection =
      annoParams.intersections.length > 0 ? annoParams.intersections[0] : null;

    if (intersection && session) {
      // console.log("DBL CLICKED !", annonCount);
      annonCount.current = annonCount.current + 1;
      const newAnnon: Annotation = {
        username: session.user.email,
        title: annotationTitle,
        content: annotationContent,
        user_id: session.user.id,
        room_id: id,
        anno_id: annonCount.current,
        status: annotationStatus as "Not Solved" | "In Progress" | "Solved",
        position: {
          x: intersection.point.x,
          y: intersection.point.y,
          z: intersection.point.z,
        },
        normal: {
          x: intersection.normal?.normalize().x,
          y: intersection.normal?.normalize().y,
          z: intersection.normal?.normalize().z,
        },
      };

      try {
        const { error } = await supabase
          .from("annotation")
          .insert({ ...newAnnon });
        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setAnnotationContent("");
        setAnnotationTitle("");
        setAnnationStatus("Not Solved");
        dialogRef.current?.close();
      }
      // setAnnotationList([...(annotationList as Annotation[]), newAnnon]);
    }
  };

  // const [spherePos, setSpherePos] = useState<THREE.Vector3>(
  //   new THREE.Vector3(0, 0, 0)
  // );

  // function moveSphereCursor(e) {
  //   const intersection = e.intersections.length > 0 ? e.intersections[0] : null;
  //   if (intersection) {
  //     setSpherePos(intersection.point);
  //   }
  // }

  function Annotations() {
    const [anoNumClicked, setAnoNumClicked] = useState(false);
    const anoRef = useRef<number | undefined>(0);
    // console.log(anoRef.current);
    return (
      annotationList &&
      annotationList?.map((annon, index) => {
        // console.log(annon.room_id);
        return (
          <Fragment key={index}>
            {annon.room_id !== id ? null : (
              <div
                className="annotation"
                id={`annotation-${annon.anno_id}`}
                data-position={
                  annon.position.x.toString() +
                  " " +
                  annon.position.y.toString() +
                  " " +
                  annon.position.z.toString()
                }
                data-normal={
                  annon.normal?.x?.toString() +
                  " " +
                  annon.normal?.y?.toString() +
                  " " +
                  annon.normal?.z?.toString()
                }
                data-contentvisible="hidden"
              >
                <div
                  className="number"
                  onClick={() => {
                    anoRef.current = annon.anno_id;
                    setAnoNumClicked(!anoNumClicked);
                  }}
                >
                  {annon.anno_id}
                </div>
                <div
                  className="annon_content"
                  style={{
                    display:
                      anoNumClicked && annon.anno_id === anoRef.current
                        ? "none"
                        : "grid",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div style={{ float: "left" }}>{annon.status}</div>
                    <button style={{ float: "right" }}>Delete</button>
                    <button style={{ float: "right" }}>Edit</button>
                  </div>
                  <div style={{ fontWeight: "600", textAlign: "left" }}>
                    {annon.username}
                  </div>
                  {annon.content}
                </div>
              </div>
            )}
          </Fragment>
        );
      })
    );
  }

  // const camInitialPos = new THREE.Vector3(0, 2, 5);

  const cameraControlRef = useRef<CameraControls | null>(null);
  // cameraControlRef.current?.setPosition(0, 2, 5);

  const UpdateAnnotationPos = () => {
    const { camera } = useThree();

    useFrame(() => {
      annotationList?.map((annon) => {
        const vector = new THREE.Vector3(
          annon.position.x,
          annon.position.y,
          annon.position.z
        );
        const targetdiv = document.querySelector(
          `#annotation-${annon.anno_id}`
        ) as HTMLElement;

        vector.project(camera);

        const isBehind =
          camera.position.distanceTo(vector) >
          camera.position.distanceTo(scene.position);

        // // const rect = renderer.domElement.getBoundingClientRect();
        // const rect = canvasRef.current.getBoundingClientRect();
        const element = ReactDOM.findDOMNode(canvasRef.current) as HTMLElement;
        const rect = element?.getBoundingClientRect();

        vector.x =
          Math.round(((vector.x + 1) * (rect.right - rect.left)) / 2) +
          rect.left;
        vector.y = Math.round(
          ((1 - vector.y) * (rect.bottom - rect.top)) / 2 + rect.top
        );

        if (targetdiv) {
          targetdiv.style.top = `${vector.y}px`;
          targetdiv.style.left = `${vector.x}px`;
          targetdiv.style.opacity = isBehind ? "0.25" : "1";
        }
      });
    });

    return <></>;
  };
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation>();
  const [isModified, setIsModified] = useState(false);
  function AnnotationPanel() {
    return annotationList?.map((annon, index) => (
      <Fragment key={index}>
        <div
          id={`annotationpanel-${annon.anno_id}`}
          className="annonpanel_item"
        >
          <div style={{ display: "grid" }}>
            <div style={{ display: "block" }}>
              <div style={{ float: "left" }}>
                #{annon.anno_id} · {annon.status}
              </div>
              <button
                style={{ float: "right", color: "#fff" }}
                onClick={() => deleteAnnotation(annon as Annotation)}
              >
                Delete
              </button>
              <button
                style={{ float: "right", color: "#fff" }}
                onClick={() => {
                  setSelectedAnnotation(annon);
                  setIsModified(true);
                  setAnnotationContent(annon.content);
                  setAnnotationTitle(annon.title);
                  setAnnationStatus(annon.status);
                  dialogRef.current?.showModal();
                }}
              >
                Edit
              </button>
            </div>
            <div style={{ fontWeight: "600", textAlign: "left" }}>
              {annon.username}
            </div>
            {annon.content}
          </div>
        </div>
      </Fragment>
    ));
  }
  // function RedDotCursor() {
  //   const { viewport } = useThree();
  //   useFrame(({ pointer }) => {
  //     const x = (pointer.x * viewport.width) / 2;
  //     const y = (pointer.y * viewport.height) / 2;
  //     spherePos.current?.position.set(x, y, 0);
  //   });
  //   return (
  //     <mesh
  //       visible
  //       ref={spherePos}
  //       // position={spherePos}
  //     >
  //       <sphereGeometry args={[0.03, 16, 16]} />
  //       <meshStandardMaterial color="red" transparent />
  //     </mesh>
  //   );
  // }

  const canvasRef = useRef(null!);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // const spherePos = useRef<THREE.Mesh>(null);
  const [annotationTitle, setAnnotationTitle] = useState("");
  const [annoParams, setAnnoParams] = useState<unknown>();
  const [annotationContent, setAnnotationContent] = useState("");
  const [annotationStatus, setAnnationStatus] = useState<
    "Not Solved" | "In Progress" | "Solved"
  >("Not Solved");
  const { scene } = useLoader(
    GLTFLoader,
    modelUrl ? modelUrl : "/loading.gltf/"
  );

  console.log(isModified);
  if (!annotationList) return null;
  return (
    <>
      <Wrapper className="sometest">
        {/* <AnnotationPopup /> */}
        <dialog
          ref={dialogRef}
          className="bg-popup "
          style={{
            backgroundColor:
              annotationStatus === "In Progress"
                ? "#FFE9BD"
                : annotationStatus === "Solved"
                ? "#E6FFA5"
                : "#FFD4DF",
          }}
        >
          <p style={{ margin: 0, padding: 0 }}>
            {!isModified ? "" : "#" + selectedAnnotation?.anno_id}
          </p>
          <p>{session.user.email}</p>
          <form
            className="form-popup"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              if (isModified) {
                updateAnnotation(event, selectedAnnotation as Annotation, {
                  annotationTitle,
                  annotationContent,
                  annotationStatus,
                });
              } else {
                addAnnotation(event, annoParams as any, {
                  annotationTitle,
                  annotationContent,
                  annotationStatus,
                });
              }
            }}
          >
            <input
              className="input-popup"
              name="annotation_title"
              value={annotationTitle}
              placeholder="Annotation Title..."
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setAnnotationTitle(event.target.value)
              }
            />
            <textarea
              className="textarea-input"
              name="annotation_content"
              value={annotationContent}
              placeholder="Annotation Content..."
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                setAnnotationContent(event.target.value)
              }
            />
            <div className="actionbar-popup">
              <select
                className="select-input"
                value={annotationStatus}
                onChange={(event) =>
                  setAnnationStatus(
                    event.target.value as
                      | "Not Solved"
                      | "In Progress"
                      | "Solved"
                  )
                }
              >
                <option value="Not Solved">🔴 Not Solved</option>
                <option value="In Progress">🟠 In Progress</option>
                <option value="Solved">🟢 Solved</option>
              </select>
              <button
                className="close-popup"
                type="button"
                onClick={() => {
                  setIsModified(false);
                  setAnnotationContent("");
                  setAnnotationTitle("");
                  setAnnationStatus("Not Solved");
                  dialogRef.current?.close();
                }}
              >
                {" "}
                Close{" "}
              </button>
              <button type="submit" style={{ color: "#fff" }}>
                {isModified ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </dialog>
        {/* <button className="btn_resetview">Reset view</button> */}
        <div id="r">
          <div>Annotation Panel</div>
          <AnnotationPanel />
        </div>
        <div className="hello">
          <Annotations />
        </div>

        {/* <Suspense fallback={null}> */}
        <Canvas
          className="canvas"
          ref={canvasRef}
          camera={{ fov: 95, position: [2, 2, 5] }}
        >
          <Suspense fallback={null}>
            <CameraControls ref={cameraControlRef} />
            <Scene />
            {/* <OrbitControls
            makeDefault
            enableDamping={false}
            dampingFactor={0.6}
            enableZoom={true}
            maxDistance={6}
            minDistance={3}
            target={[0, 0, 0]}
          /> */}
            {/* <PerspectiveCamera
              makeDefault
              // position={camInitialPos}
              fov={45}
              aspect={window.innerWidth / window.innerHeight}
              near={1}
              far={10000}
            /> */}
            <primitive
              object={scene}
              onDoubleClick={(e: any) => {
                setAnnoParams(e);
                dialogRef.current?.showModal();
              }}
              // onPointerMove={(e: any) => moveSphereCursor(e)}
            />
            {/* <mesh visible position={spherePos}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="red" transparent />
          </mesh> */}
            {/* <RedDotCursor /> */}
            <UpdateAnnotationPos />
          </Suspense>
        </Canvas>
        {/* </Suspense> */}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  position: relative;
  background: #0e1217;
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  min-width: 100vw;
  canvas {
    height: 100vh;
    width: 100vw;
  }
  hero {
    position: absolute;
  }
`;

export default App;
